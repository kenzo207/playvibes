"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth/client";
import { usePlayback } from "@/components/playback/playback-provider";

export function useSpotifyPlayer() {
  const { data: session } = useSession();
  const { initializePlayer, isInitialized, error, disconnect } = usePlayback();
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    const initPlayer = async () => {
      // Only initialize if we have a session and user, and player is not already initialized
      if (!session?.user || isInitialized || isInitializing) {
        return;
      }

      try {
        setIsInitializing(true);

        // Get a fresh access token for the user
        const response = await fetch("/api/auth/spotify/status");
        if (!response.ok) {
          throw new Error("Failed to get Spotify status");
        }

        const data = await response.json();
        if (!data.connected || !data.accessToken) {
          console.warn("Spotify not connected or no access token available");
          return;
        }

        await initializePlayer(data.accessToken);
      } catch (err) {
        console.error("Failed to initialize Spotify player:", err);
      } finally {
        setIsInitializing(false);
      }
    };

    initPlayer();

    // Cleanup on unmount or when session changes
    return () => {
      if (isInitialized) {
        disconnect();
      }
    };
  }, [session?.user, isInitialized, isInitializing, initializePlayer, disconnect]);

  return {
    isInitialized,
    isInitializing,
    error,
  };
}
