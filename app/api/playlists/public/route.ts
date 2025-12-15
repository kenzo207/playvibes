import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  sharedPlaylists,
  users,
  playlistLikes,
  playlistComments,
  savedPlaylists,
} from "@/lib/db/schema";
import { eq, desc, asc, count, sql, inArray, and } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;
    const sortBy = searchParams.get("sortBy") || "newest";

    // Get current user session to check likes/saves
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    // Determine order by clause based on sortBy parameter
    let orderByClause;
    if (sortBy === "most_liked") {
      orderByClause = desc(sql<number>`COUNT(DISTINCT ${playlistLikes.playlistId})`);
    } else if (sortBy === "most_saved") {
      // For most_saved, we'll need to join with savedPlaylists and count
      orderByClause = desc(sql<number>`COUNT(DISTINCT ${savedPlaylists.playlistId})`);
    } else if (sortBy === "oldest") {
      orderByClause = asc(sharedPlaylists.createdAt);
    } else {
      // Default: newest
      orderByClause = desc(sharedPlaylists.createdAt);
    }

    // Base query for public playlists with user info and counts
    let queryBuilder = db
      .select({
        id: sharedPlaylists.id,
        spotifyPlaylistId: sharedPlaylists.spotifyPlaylistId,
        userId: sharedPlaylists.userId,
        name: sharedPlaylists.name,
        description: sharedPlaylists.description,
        imageUrl: sharedPlaylists.imageUrl,
        trackCount: sharedPlaylists.trackCount,
        genres: sharedPlaylists.genres,
        moods: sharedPlaylists.moods,
        activities: sharedPlaylists.activities,
        isPublic: sharedPlaylists.isPublic,
        createdAt: sharedPlaylists.createdAt,
        updatedAt: sharedPlaylists.updatedAt,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
          emailVerified: users.emailVerified,
          image: users.image,
        },
        likesCount: sql<number>`COUNT(DISTINCT ${playlistLikes.playlistId})`,
        commentsCount: sql<number>`COUNT(DISTINCT ${playlistComments.id})`,
      })
      .from(sharedPlaylists)
      .leftJoin(users, eq(sharedPlaylists.userId, users.id))
      .leftJoin(playlistLikes, eq(sharedPlaylists.id, playlistLikes.playlistId))
      .leftJoin(playlistComments, eq(sharedPlaylists.id, playlistComments.playlistId));

    // Add savedPlaylists join only if sorting by most_saved
    if (sortBy === "most_saved") {
      queryBuilder = queryBuilder.leftJoin(
        savedPlaylists,
        eq(sharedPlaylists.id, savedPlaylists.playlistId)
      );
    }

    const publicPlaylistsQuery = queryBuilder
      .where(eq(sharedPlaylists.isPublic, true))
      .groupBy(
        sharedPlaylists.id,
        sharedPlaylists.spotifyPlaylistId,
        sharedPlaylists.userId,
        sharedPlaylists.name,
        sharedPlaylists.description,
        sharedPlaylists.imageUrl,
        sharedPlaylists.trackCount,
        sharedPlaylists.genres,
        sharedPlaylists.moods,
        sharedPlaylists.activities,
        sharedPlaylists.isPublic,
        sharedPlaylists.createdAt,
        sharedPlaylists.updatedAt,
        users.id,
        users.name,
        users.image
      )
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);

    const playlists = await publicPlaylistsQuery;

    // Get total count for pagination
    const totalCountResult = await db
      .select({ count: count() })
      .from(sharedPlaylists)
      .where(eq(sharedPlaylists.isPublic, true));

    const totalCount = totalCountResult[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    // If user is authenticated, check which playlists they've liked/saved
    let playlistsWithUserActions = playlists;
    if (session?.user && playlists.length > 0) {
      const playlistIds = playlists.map((p: { id: string }) => p.id);

      // Get user's likes for these playlists
      // Get user's likes for these playlists
      const userLikes = await db
        .select({ playlistId: playlistLikes.playlistId })
        .from(playlistLikes)
        .where(
          and(
            inArray(playlistLikes.playlistId, playlistIds),
            eq(playlistLikes.userId, session.user.id)
          )
        );

      // Get user's saves for these playlists
      const userSaves = await db
        .select({ playlistId: savedPlaylists.playlistId })
        .from(savedPlaylists)
        .where(
          and(
            inArray(savedPlaylists.playlistId, playlistIds),
            eq(savedPlaylists.userId, session.user.id)
          )
        );

      const likedPlaylistIds = new Set(
        userLikes.map((like: { playlistId: string }) => like.playlistId)
      );
      const savedPlaylistIds = new Set(
        userSaves.map((save: { playlistId: string }) => save.playlistId)
      );

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      playlistsWithUserActions = playlists.map((playlist: any) => ({
        ...playlist,
        isLiked: likedPlaylistIds.has(playlist.id),
        isSaved: savedPlaylistIds.has(playlist.id),
      }));
    } else {
      // Return playlists as is if no user or no playlists found
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      playlistsWithUserActions = playlists.map((playlist: any) => ({
        ...playlist,
        isLiked: false,
        isSaved: false,
      }));
    }

    return NextResponse.json({
      data: playlistsWithUserActions,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching public playlists:", error);
    return NextResponse.json({ error: "Failed to fetch public playlists" }, { status: 500 });
  }
}
