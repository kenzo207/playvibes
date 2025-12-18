"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { spotifyPlaybackService } from "@/lib/spotify/playback";
import { PlaybackState } from "@/lib/types";

interface PlaylistPlayerProps {
  accessToken: string;
  playlistUri?: string;
  onError?: (error: string) => void;
}

export function PlaylistPlayer({ accessToken, playlistUri, onError }: PlaylistPlayerProps) {
  const [playbackState, setPlaybackState] = useState<PlaybackState>({
    isPlaying: false,
    isPaused: true,
    currentTrack: null,
    position: 0,
    duration: 0,
    volume: 0.5,
    deviceId: null,
    isReady: false,
    hasSpotifyPremium: false,
  });
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize the player
  useEffect(() => {
    let mounted = true;

    const initializePlayer = async () => {
      try {
        // Wait for SDK to be ready
        const waitForSDK = () => {
          return new Promise<void>((resolve) => {
            if (window.Spotify) {
              resolve();
            } else {
              spotifyPlaybackService.on("sdk-ready", resolve);
            }
          });
        };

        await waitForSDK();

        if (!mounted) return;

        const success = await spotifyPlaybackService.initializePlayer(accessToken);
        if (success && mounted) {
          setIsInitialized(true);
        }
      } catch (err) {
        if (mounted) {
          const errorMessage = err instanceof Error ? err.message : "Failed to initialize player";
          setError(errorMessage);
          onError?.(errorMessage);
        }
      }
    };

    initializePlayer();

    return () => {
      mounted = false;
    };
  }, [accessToken, onError]);

  // Set up event listeners
  useEffect(() => {
    const handleReady = (data: { deviceId: string; hasSpotifyPremium: boolean }) => {
      setPlaybackState((prev) => ({
        ...prev,
        deviceId: data.deviceId,
        isReady: true,
        hasSpotifyPremium: data.hasSpotifyPremium,
      }));
    };

    const handleStateChange = (state: PlaybackState) => {
      setPlaybackState(state);
    };

    const handleError = (error: { type: string; message: string }) => {
      const errorMessage = `${error.type}: ${error.message}`;
      setError(errorMessage);
      onError?.(errorMessage);
    };

    spotifyPlaybackService.on("ready", handleReady);
    spotifyPlaybackService.on("state-changed", handleStateChange);
    spotifyPlaybackService.on("error", handleError);

    return () => {
      spotifyPlaybackService.off("ready", handleReady);
      spotifyPlaybackService.off("state-changed", handleStateChange);
      spotifyPlaybackService.off("error", handleError);
    };
  }, [onError]);

  const handlePlayPause = useCallback(async () => {
    try {
      if (!playbackState.isReady) return;

      if (playlistUri && !playbackState.currentTrack) {
        // Start playing the playlist
        await spotifyPlaybackService.playPlaylist(playlistUri);
      } else {
        // Toggle play/pause
        await spotifyPlaybackService.togglePlay();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Playback error";
      setError(errorMessage);
      onError?.(errorMessage);
    }
  }, [playbackState.isReady, playbackState.currentTrack, playlistUri, onError]);

  const handlePrevious = useCallback(async () => {
    try {
      await spotifyPlaybackService.previousTrack();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to skip to previous track";
      setError(errorMessage);
      onError?.(errorMessage);
    }
  }, [onError]);

  const handleNext = useCallback(async () => {
    try {
      await spotifyPlaybackService.nextTrack();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to skip to next track";
      setError(errorMessage);
      onError?.(errorMessage);
    }
  }, [onError]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800 text-sm">
          {playbackState.hasSpotifyPremium === false
            ? "Spotify Premium is required for full playback. Free users can only preview tracks."
            : error}
        </p>
      </div>
    );
  }

  if (!isInitialized || !playbackState.isReady) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-gray-600 text-sm">Initializing Spotify player...</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      {/* Current track info */}
      {playbackState.currentTrack && (
        <div className="flex items-center space-x-3 mb-4">
          {playbackState.currentTrack.album.images[0] && (
            <Image
              src={playbackState.currentTrack.album.images[0].url}
              alt={playbackState.currentTrack.album.name}
              width={48}
              height={48}
              className="rounded shadow-sm"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {playbackState.currentTrack.name}
            </p>
            <p className="text-sm text-gray-500 truncate">
              {playbackState.currentTrack.artists.map((artist) => artist.name).join(", ")}
            </p>
          </div>
        </div>
      )}

      {/* Playback controls */}
      <div className="flex items-center justify-center space-x-4 mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevious}
          disabled={!playbackState.currentTrack}
        >
          <SkipBack className="w-4 h-4" />
        </Button>

        <Button
          onClick={handlePlayPause}
          disabled={!playbackState.isReady}
          className="w-12 h-12 rounded-full"
        >
          {playbackState.isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={!playbackState.currentTrack}
        >
          <SkipForward className="w-4 h-4" />
        </Button>
      </div>

      {/* Progress bar */}
      {playbackState.currentTrack && (
        <div className="space-y-2">
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div
              className="bg-green-500 h-1 rounded-full transition-all duration-1000"
              style={{
                width: `${(playbackState.position / playbackState.duration) * 100}%`,
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>{formatTime(playbackState.position)}</span>
            <span>{formatTime(playbackState.duration)}</span>
          </div>
        </div>
      )}

      {/* Premium status indicator */}
      {!playbackState.hasSpotifyPremium && (
        <div className="mt-3 text-xs text-amber-600 bg-amber-50 rounded p-2">
          <div className="flex items-center space-x-1">
            <Volume2 className="w-3 h-3" />
            <span>Free account: 30-second previews only</span>
          </div>
        </div>
      )}
    </div>
  );
}
