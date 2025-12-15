import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  sharedPlaylists,
  users,
  playlistLikes,
  playlistComments,
  savedPlaylists,
} from "@/lib/db/schema";
import { eq, desc, asc, count, sql, ilike, and, or, inArray } from "drizzle-orm";
import { auth } from "@/lib/auth";

import { apiRateLimit, getIdentifier } from "@/lib/rate-limit";
import { searchParamsSchema, safeValidateData } from "@/lib/validation/schemas";
import { sanitizeText, sanitizeArray } from "@/lib/sanitize";

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const identifier = getIdentifier(request);
    const { success } = await apiRateLimit.limit(identifier);

    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);

    // Validate search params
    const validation = safeValidateData(searchParamsSchema, {
      q: searchParams.get("q") || undefined,
      genres: searchParams.get("genres") || undefined,
      moods: searchParams.get("moods") || undefined,
      activities: searchParams.get("activities") || undefined,
      page: searchParams.get("page") || undefined,
      limit: searchParams.get("limit") || undefined,
      sortBy: searchParams.get("sortBy") || undefined,
    });

    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const params = validation.data;
    const page = params.page ? parseInt(params.page) : 1;
    const limit = params.limit || 20;
    const offset = (page - 1) * limit;
    const sortBy = params.sortBy || "newest";

    // Search and filter parameters
    const searchQuery = params.q ? sanitizeText(params.q) : undefined;

    // Parse comma-separated filter values
    const genres = params.genres
      ? sanitizeArray(params.genres.split(",").map((g) => g.trim()))
      : [];
    const moods = params.moods ? sanitizeArray(params.moods.split(",").map((m) => m.trim())) : [];
    const activities = params.activities
      ? sanitizeArray(params.activities.split(",").map((a) => a.trim()))
      : [];

    // Get current user session to check likes/saves
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    // Build where conditions
    const whereConditions = [eq(sharedPlaylists.isPublic, true)];

    // Add search condition (search in name and description)
    if (searchQuery) {
      whereConditions.push(
        or(
          ilike(sharedPlaylists.name, `%${searchQuery}%`),
          ilike(sharedPlaylists.description, `%${searchQuery}%`)
        )!
      );
    }

    // Add genre filter
    if (genres.length > 0) {
      whereConditions.push(sql`${sharedPlaylists.genres} && ${genres}`);
    }

    // Add mood filter
    if (moods.length > 0) {
      whereConditions.push(sql`${sharedPlaylists.moods} && ${moods}`);
    }

    // Add activity filter
    if (activities.length > 0) {
      whereConditions.push(sql`${sharedPlaylists.activities} && ${activities}`);
    }

    // Determine order by clause based on sortBy parameter
    let orderByClause;
    if (sortBy === "most_liked") {
      orderByClause = desc(sql<number>`COUNT(DISTINCT ${playlistLikes.playlistId})`);
    } else if (sortBy === "most_saved") {
      orderByClause = desc(sql<number>`COUNT(DISTINCT ${savedPlaylists.playlistId})`);
    } else if (sortBy === "oldest") {
      orderByClause = asc(sharedPlaylists.createdAt);
    } else {
      // Default: newest
      orderByClause = desc(sharedPlaylists.createdAt);
    }

    // Build the main query
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

    const searchQuery_db = queryBuilder
      .where(and(...whereConditions))
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

    const playlists = await searchQuery_db;

    // Get total count for pagination with same filters
    const totalCountResult = await db
      .select({ count: count() })
      .from(sharedPlaylists)
      .where(and(...whereConditions));

    const totalCount = totalCountResult[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    // If user is authenticated, check which playlists they've liked/saved
    let playlistsWithUserActions = playlists;
    if (session?.user && playlists.length > 0) {
      const playlistIds = playlists.map((p) => p.id);

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

      const likedPlaylistIds = new Set(userLikes.map((like) => like.playlistId));
      const savedPlaylistIds = new Set(userSaves.map((save) => save.playlistId));

      playlistsWithUserActions = playlists.map((playlist) => ({
        ...playlist,
        isLiked: likedPlaylistIds.has(playlist.id),
        isSaved: savedPlaylistIds.has(playlist.id),
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
      filters: {
        search: searchQuery,
        genres,
        moods,
        activities,
      },
    });
  } catch (error) {
    console.error("Error searching playlists:", error);
    return NextResponse.json({ error: "Failed to search playlists" }, { status: 500 });
  }
}
