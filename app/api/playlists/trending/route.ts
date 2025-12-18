import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sharedPlaylists, users } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10");

    const trendingPlaylists = await db
      .select({
        id: sharedPlaylists.id,
        spotifyPlaylistId: sharedPlaylists.spotifyPlaylistId,
        name: sharedPlaylists.name,
        description: sharedPlaylists.description,
        images: sharedPlaylists.images,
        likesCount: sharedPlaylists.likesCount,
        commentsCount: sharedPlaylists.commentsCount,
        createdAt: sharedPlaylists.createdAt,
        user: {
          id: users.id,
          name: users.name,
          image: users.image,
        },
      })
      .from(sharedPlaylists)
      .innerJoin(users, eq(sharedPlaylists.userId, users.id))
      .orderBy(desc(sharedPlaylists.likesCount))
      .limit(limit);

    return NextResponse.json(trendingPlaylists);
  } catch (error) {
    console.error("Error fetching trending playlists:", error);
    return NextResponse.json({ error: "Failed to fetch trending playlists" }, { status: 500 });
  }
}
