import { syncPlaylistMetadata } from "@/lib/services/playlist-sync";
import { db } from "@/lib/db";
import { spotifyAPI } from "@/lib/spotify";

// Mock dependencies
jest.mock("@/lib/db", () => ({
  db: {
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
  },
}));

jest.mock("@/lib/spotify", () => ({
  spotifyAPI: {
    makeSpotifyRequest: jest.fn(),
  },
}));

describe("syncPlaylistMetadata", () => {
  const mockPlaylistId = "test-playlist-id";
  const mockSpotifyId = "spotify-id";
  const mockToken = "token";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully sync metadata when Spotify returns data", async () => {
    // Mock Tracks Response
    (spotifyAPI.makeSpotifyRequest as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        items: [
          { track: { artists: [{ id: "artist1" }] } },
          { track: { artists: [{ id: "artist2" }] } },
        ],
      }),
    });

    // Mock Artists Response
    (spotifyAPI.makeSpotifyRequest as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        artists: [
          { id: "artist1", genres: ["pop", "rock"] },
          { id: "artist2", genres: ["indie"] },
        ],
      }),
    });

    const result = await syncPlaylistMetadata(
      mockPlaylistId,
      mockSpotifyId,
      mockToken,
      "My Chill Workout Playlist",
      "Songs for gym"
    );

    expect(result.success).toBe(true);
    expect(result.genres).toEqual(expect.arrayContaining(["pop", "rock", "indie"]));
    expect(result.moods).toContain("chill");
    expect(result.activities).toContain("workout");

    // Verify DB update was called
    expect(db.update).toHaveBeenCalled();
  });

  it("should return success even if Spotify request fails (graceful degradation)", async () => {
    // Mock Tracks Response Failure
    (spotifyAPI.makeSpotifyRequest as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

    const result = await syncPlaylistMetadata(
      mockPlaylistId,
      mockSpotifyId,
      mockToken,
      "Playlist",
      "Description"
    );

    // Should return false success but contain error info, OR we might decide it returns success:false but the function shouldn't throw.
    // Looking at implementation: it returns { success: false, error: ... }
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();

    // DB update should NOT have been called
    expect(db.update).not.toHaveBeenCalled();
  });
});
