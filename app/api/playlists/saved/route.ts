import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  savedPlaylists,
  sharedPlaylists,
  users,
  playlistLikes,
  playlistComments,
} from "@/lib/db/schema";
import { eq, desc, count, sql } from "drizzle-orm";
import type { PlaylistWithDetails } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    // Get saved playlists with details
    const savedPlaylistsQuery = db
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
        savedAt: savedPlaylists.createdAt,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
          emailVerified: users.emailVerified,
          image: users.image,
          spotifyId: users.spotifyId,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        },
        likesCount: count(playlistLikes.userId),
        commentsCount: count(playlistComments.id),
      })
      .from(savedPlaylists)
      .innerJoin(sharedPlaylists, eq(savedPlaylists.playlistId, sharedPlaylists.id))
      .innerJoin(users, eq(sharedPlaylists.userId, users.id))
      .leftJoin(playlistLikes, eq(playlistLikes.playlistId, sharedPlaylists.id))
      .leftJoin(playlistComments, eq(playlistComments.playlistId, sharedPlaylists.id))
      .where(eq(savedPlaylists.userId, session.user.id))
      .groupBy(sharedPlaylists.id, savedPlaylists.createdAt, users.id)
      .orderBy(desc(savedPlaylists.createdAt))
      .limit(limit)
      .offset(offset);

    const results = await savedPlaylistsQuery;

    // Check which playlists the current user has liked and saved
    const playlistIds = results.map((p: { id: string }) => p.id);

    const userLikes =
      playlistIds.length > 0
        ? await db
            .select({ playlistId: playlistLikes.playlistId })
            .from(playlistLikes)
            .where(
              sql`${playlistLikes.playlistId} = ANY(${playlistIds}) AND ${playlistLikes.userId} = ${session.user.id}`
            )
        : [];

    const userLikesSet = new Set(userLikes.map((like: { playlistId: string }) => like.playlistId));

    // Transform results to include user interaction status
    const playlistsWithDetails: PlaylistWithDetails[] = results.map((result) => ({
      id: result.id,
      spotifyPlaylistId: result.spotifyPlaylistId,
      userId: result.userId,
      name: result.name,
      description: result.description,
      imageUrl: result.imageUrl,
      trackCount: result.trackCount,
      genres: result.genres || [],
      moods: result.moods || [],
      activities: result.activities || [],
      isPublic: result.isPublic,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      user: result.user,
      likesCount: result.likesCount,
      commentsCount: result.commentsCount,
      isLiked: userLikesSet.has(result.id),
      isSaved: true, // All results are saved by definition
    }));

    // Get total count for pagination
    const totalCountResult = await db
      .select({ count: count() })
      .from(savedPlaylists)
      .where(eq(savedPlaylists.userId, session.user.id));

    const total = totalCountResult[0]?.count || 0;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      data: playlistsWithDetails,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching saved playlists:", error);
    return NextResponse.json({ error: "Failed to fetch saved playlists" }, { status: 500 });
  }
}
