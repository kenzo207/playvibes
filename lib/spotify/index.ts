import { db } from "@/lib/db";
import { accounts } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { SpotifyApiError } from "./error";

export interface SpotifyTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export class SpotifyAPI {
  private baseURL = "https://api.spotify.com/v1";

  async refreshAccessToken(refreshToken: string): Promise<SpotifyTokens | null> {
    try {
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          ).toString("base64")}`,
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new SpotifyApiError(
          errorData.error_description || `Failed to refresh token: ${response.statusText}`,
          response.status,
          errorData
        );
      }

      const data = await response.json();

      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token || refreshToken, // Spotify may not return a new refresh token
        expiresAt: Date.now() + data.expires_in * 1000,
      };
    } catch (error) {
      if (error instanceof SpotifyApiError) {
        console.error("Spotify API error refreshing token:", error.message);
        return null;
      }
      console.error("Error refreshing Spotify token:", error);
      return null;
    }
  }

  async getValidAccessToken(userId: string): Promise<string | null> {
    try {
      // Get the user's Spotify account
      const account = await db
        .select()
        .from(accounts)
        .where(and(eq(accounts.userId, userId), eq(accounts.providerId, "spotify")))
        .limit(1);

      if (!account.length || !account[0].accessToken) {
        return null;
      }

      const accountData = account[0];
      const now = Date.now();

      // Check if token is still valid (with 5 minute buffer)
      if (accountData.expiresAt && accountData.expiresAt.getTime() > now + 5 * 60 * 1000) {
        return accountData.accessToken;
      }

      // Token is expired or about to expire, refresh it
      if (!accountData.refreshToken) {
        return null;
      }

      const newTokens = await this.refreshAccessToken(accountData.refreshToken);
      if (!newTokens) {
        return null;
      }

      // Update the database with new tokens
      await db
        .update(accounts)
        .set({
          accessToken: newTokens.accessToken,
          refreshToken: newTokens.refreshToken,
          expiresAt: new Date(newTokens.expiresAt),
        })
        .where(eq(accounts.id, accountData.id));

      return newTokens.accessToken;
    } catch (error) {
      console.error("Error getting valid access token:", error);
      return null;
    }
  }

  async makeSpotifyRequest(
    endpoint: string,
    accessToken: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new SpotifyApiError(
        errorData.error?.message || `Spotify API error: ${response.statusText}`,
        response.status,
        errorData
      );
    }

    return response;
  }

  async getCurrentUser(accessToken: string) {
    const response = await this.makeSpotifyRequest("/me", accessToken);
    return response.json();
  }

  async getUserPlaylists(accessToken: string, limit = 50, offset = 0) {
    const response = await this.makeSpotifyRequest(
      `/me/playlists?limit=${limit}&offset=${offset}`,
      accessToken
    );
    return response.json();
  }
}

export const spotifyAPI = new SpotifyAPI();
