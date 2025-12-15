import { db } from "@/lib/db";
import { sharedPlaylists } from "@/lib/db/schema";
import { spotifyAPI } from "@/lib/spotify";
import { eq } from "drizzle-orm";

export async function syncPlaylistMetadata(
  playlistId: string,
  spotifyPlaylistId: string,
  accessToken: string,
  playlistName: string,
  playlistDescription: string | null
) {
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

      if (!tracksData || !tracksData.items || !Array.isArray(tracksData.items)) {
        console.warn("Invalid tracks data:", tracksData);
        return { success: false, error: "Invalid tracks data" };
      }

      // Extract genres from track artists (simplified approach)
      const artistIds = tracksData.items
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((item: any) => item?.track?.artists?.[0]?.id)
        .filter(Boolean)
        .slice(0, 10); // Limit to first 10 artists

      if (artistIds.length > 0) {
        const artistsResponse = await spotifyAPI.makeSpotifyRequest(
          `/artists?ids=${artistIds.join(",")}`,
          accessToken
        );

        if (artistsResponse.ok) {
          const artistsData = await artistsResponse.json();

          if (artistsData && artistsData.artists && Array.isArray(artistsData.artists)) {
            const allGenres = artistsData.artists
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .flatMap((artist: any) => artist?.genres || [])
              .filter(Boolean) as string[];

            // Get unique genres
            genres = [...new Set(allGenres)].slice(0, 5);
          } else {
            console.warn("Invalid artists data:", artistsData);
          }
        }
      }

      // Simple mood/activity inference based on playlist name and description
      const text = `${playlistName} ${playlistDescription || ""}`.toLowerCase();

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
      await db
        .update(sharedPlaylists)
        .set({
          genres,
          moods,
          activities,
          updatedAt: new Date(),
        })
        .where(eq(sharedPlaylists.id, playlistId));

      return { success: true, genres, moods, activities };
    }

    return { success: false, error: "Failed to fetch tracks" };
  } catch (syncError) {
    console.error("Auto-sync failed:", syncError);
    // We swallow the error here as this is a background/enhancement process
    // The main sharing functionality should not fail if sync fails
    return {
      success: false,
      error: syncError instanceof Error ? syncError.message : "Unknown error",
    };
  }
}
