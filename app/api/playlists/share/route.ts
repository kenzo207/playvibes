import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { spotifyAPI } from "@/lib/spotify";
import { db } from "@/lib/db";
import { sharedPlaylists } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";

import { apiRateLimit, getIdentifier } from "@/lib/rate-limit";
import { playlistSchema, safeValidateData } from "@/lib/validation/schemas";

export async function POST(request: NextRequest) {
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

    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await request.json();

    // Validate input
    const validation = safeValidateData(playlistSchema, body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { spotifyPlaylistId, isPublic } = validation.data;

    // Get valid access token
    const accessToken = await spotifyAPI.getValidAccessToken(session.user.id);
    if (!accessToken) {
      return NextResponse.json({ error: "Spotify connection required" }, { status: 401 });
    }

    // Fetch playlist details from Spotify to ensure it exists and user has access
    const response = await spotifyAPI.makeSpotifyRequest(
      `/playlists/${spotifyPlaylistId}`,
      accessToken
    );

    if (!response.ok) {
      return NextResponse.json({ error: "Playlist not found or access denied" }, { status: 404 });
    }

    const spotifyPlaylist = await response.json();

    // Check if playlist is already shared
    const existingSharedPlaylist = await db
      .select()
      .from(sharedPlaylists)
      .where(
        and(
          eq(sharedPlaylists.spotifyPlaylistId, spotifyPlaylistId),
          eq(sharedPlaylists.userId, session.user.id)
        )
      )
      .limit(1);

    if (isPublic) {
      // Share the playlist
      if (existingSharedPlaylist.length > 0) {
        // Update existing shared playlist
        const updated = await db
          .update(sharedPlaylists)
          .set({
            isPublic: true,
            name: spotifyPlaylist.name,
            description: spotifyPlaylist.description,
            imageUrl: spotifyPlaylist.images?.[0]?.url,
            trackCount: spotifyPlaylist.tracks.total,
            updatedAt: new Date(),
          })
          .where(eq(sharedPlaylists.id, existingSharedPlaylist[0].id))
          .returning();

        return NextResponse.json({
          message: "Playlist updated successfully",
          playlist: updated[0],
        });
      } else {
        // Create new shared playlist
        const newSharedPlaylist = await db
          .insert(sharedPlaylists)
          .values({
            id: nanoid(),
            spotifyPlaylistId,
            userId: session.user.id,
            name: spotifyPlaylist.name,
            description: spotifyPlaylist.description,
            imageUrl: spotifyPlaylist.images?.[0]?.url,
            trackCount: spotifyPlaylist.tracks.total,
            genres: [], // Will be populated below
            moods: [],
            activities: [],
            isPublic: true,
          })
          .returning();

        // AUTO-SYNC: Populate metadata immediately
        try {
          // Fetch playlist tracks to analyze genres/moods (simplified approach)
          const tracksResponse = await spotifyAPI.makeSpotifyRequest(
            `/playlists/${spotifyPlaylistId}/tracks?limit=50`,
            accessToken
          );

          let genres: string[] = [];
          const moods: string[] = [];
          const activities: string[] = [];

          if (tracksResponse.ok) {
            const tracksData = await tracksResponse.json();

            // Extract genres from track artists (simplified approach)
            const artistIds = tracksData.items
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .map((item: any) => item.track?.artists?.[0]?.id)
              .filter(Boolean)
              .slice(0, 10); // Limit to first 10 artists

            if (artistIds.length > 0) {
              const artistsResponse = await spotifyAPI.makeSpotifyRequest(
                `/artists?ids=${artistIds.join(",")}`,
                accessToken
              );

              if (artistsResponse.ok) {
                const artistsData = await artistsResponse.json();
                const allGenres = artistsData.artists
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  .flatMap((artist: any) => artist.genres || [])
                  .filter(Boolean) as string[];

                // Get unique genres
                genres = [...new Set(allGenres)].slice(0, 5);
              }
            }

            // Simple mood/activity inference based on playlist name and description
            const text =
              `${spotifyPlaylist.name} ${spotifyPlaylist.description || ""}`.toLowerCase();

            // Basic mood detection
            if (text.includes("chill") || text.includes("relax")) moods.push("chill");
            if (text.includes("happy") || text.includes("upbeat")) moods.push("happy");
            if (text.includes("sad") || text.includes("melancholy")) moods.push("sad");
            if (text.includes("energetic") || text.includes("pump")) moods.push("energetic");

            // Basic activity detection
            if (text.includes("workout") || text.includes("gym")) activities.push("workout");
            if (text.includes("study") || text.includes("focus")) activities.push("study");
            if (text.includes("party") || text.includes("dance")) activities.push("party");
            if (text.includes("sleep") || text.includes("night")) activities.push("sleep");
            if (text.includes("drive") || text.includes("road")) activities.push("driving");

            // Update the newly created playlist with metadata
            const finalPlaylist = await db
              .update(sharedPlaylists)
              .set({
                genres,
                moods,
                activities,
                updatedAt: new Date(),
              })
              .where(eq(sharedPlaylists.id, newSharedPlaylist[0].id))
              .returning();

            return NextResponse.json({
              message: "Playlist shared and synced successfully",
              playlist: finalPlaylist[0],
            });
          }
        } catch (syncError) {
          console.error("Auto-sync failed:", syncError);
          // Return the playlist anyway, even if sync failed
        }

        return NextResponse.json({
          message: "Playlist shared successfully",
          playlist: newSharedPlaylist[0],
        });
      }
    } else {
      // Unshare the playlist
      if (existingSharedPlaylist.length > 0) {
        await db
          .update(sharedPlaylists)
          .set({
            isPublic: false,
            updatedAt: new Date(),
          })
          .where(eq(sharedPlaylists.id, existingSharedPlaylist[0].id));

        return NextResponse.json({
          message: "Playlist unshared successfully",
        });
      } else {
        return NextResponse.json({
          message: "Playlist was not shared",
        });
      }
    }
  } catch (error) {
    console.error("Error sharing/unsharing playlist:", error);
    return NextResponse.json(
      { error: "Failed to update playlist sharing status" },
      { status: 500 }
    );
  }
}
