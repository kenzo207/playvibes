import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { spotifyAPI } from "@/lib/spotify";
import { db } from "@/lib/db";
import { sharedPlaylists } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";

import { apiRateLimit, getIdentifier } from "@/lib/rate-limit";
import { playlistSchema, safeValidateData } from "@/lib/validation/schemas";
import { syncPlaylistMetadata } from "@/lib/services/playlist-sync";

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
        console.log("Updating existing playlist:", existingSharedPlaylist[0].id);
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

        if (!updated || !updated[0]) {
          console.error("Update returned empty result!", updated);
          return NextResponse.json({ error: "Failed to update" }, { status: 500 });
        }

        return NextResponse.json({
          message: "Playlist updated successfully",
          playlist: updated[0],
        });
      } else {
        console.log("Creating new shared playlist for:", spotifyPlaylistId);
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

        if (!newSharedPlaylist || !newSharedPlaylist[0]) {
          console.error("Insert returned empty result!", newSharedPlaylist);
          return NextResponse.json({ error: "Failed to insert" }, { status: 500 });
        }

        console.log("Created shared playlist ID:", newSharedPlaylist[0].id);

        // AUTO-SYNC: Populate metadata immediately
        const syncResult = await syncPlaylistMetadata(
          newSharedPlaylist[0].id,
          spotifyPlaylistId,
          accessToken,
          spotifyPlaylist.name,
          spotifyPlaylist.description
        );

        console.log("Sync result:", syncResult);

        let finalPlaylist = newSharedPlaylist[0];
        if (syncResult.success && syncResult.genres && syncResult.moods && syncResult.activities) {
          finalPlaylist = {
            ...finalPlaylist,
            genres: syncResult.genres,
            moods: syncResult.moods,
            activities: syncResult.activities,
            updatedAt: new Date(),
          };
        }

        return NextResponse.json({
          message: syncResult.success
            ? "Playlist shared and synced successfully"
            : "Playlist shared successfully",
          playlist: finalPlaylist,
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
