"use client";

import { useState, useEffect, lazy, Suspense, useCallback } from "react";
import { SearchFilters } from "@/components/playlists/search-filters";
import { PlaylistGrid } from "@/components/playlists/playlist-grid";
import { PlaylistFilters } from "@/lib/types";
import { usePlayback } from "@/components/playback/playback-provider";
import { useSpotifyPlayer } from "@/hooks/use-spotify-player";
import { WelcomeBanner } from "@/components/auth/welcome-banner";
import { useSession } from "@/lib/auth/client";
import { ErrorBoundary } from "@/components/error-boundary";
import { Loader2 } from "lucide-react";

// Lazy load the heavy modal component
const PlaylistDetailModal = lazy(() =>
  import("@/components/playlists/playlist-detail-modal").then((mod) => ({
    default: mod.PlaylistDetailModal,
  }))
);

const FIRST_VISIT_KEY = "playvibes_first_visit";

export default function BrowsePage() {
  const [filters, setFilters] = useState<PlaylistFilters>({});
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const { data: session } = useSession();
  const { playPlaylist, playTrack, isInitialized, playbackState } = usePlayback();

  // Initialize the Spotify player
  useSpotifyPlayer();

  // Check for first visit
  useEffect(() => {
    if (session?.user) {
      const hasVisited = localStorage.getItem(FIRST_VISIT_KEY);

      if (!hasVisited) {
        setIsFirstVisit(true);
        setShowWelcome(true);
        localStorage.setItem(FIRST_VISIT_KEY, "true");
      } else {
        setIsFirstVisit(false);
        setShowWelcome(true);
      }
    }
  }, [session]);

  const handleFiltersChange = useCallback((newFilters: PlaylistFilters) => {
    setFilters(newFilters);
  }, []);

  const handlePlaylistClick = (playlistId: string) => {
    setSelectedPlaylistId(playlistId);
  };

  const handleCloseModal = () => {
    setSelectedPlaylistId(null);
  };

  const handlePlaylistPlay = async (playlistId: string) => {
    if (!isInitialized) {
      console.warn("Spotify player not initialized");
      return;
    }

    try {
      // Get the playlist details to find the Spotify playlist ID
      const response = await fetch(`/api/playlists/${playlistId}`);
      if (!response.ok) {
        throw new Error("Failed to get playlist details");
      }

      const playlist = await response.json();
      const spotifyPlaylistId = playlist.spotifyPlaylistId;

      if (!spotifyPlaylistId) {
        throw new Error("Spotify playlist ID not found");
      }

      // Convert Spotify playlist ID to URI format
      const playlistUri = `spotify:playlist:${spotifyPlaylistId}`;
      await playPlaylist(playlistUri);
    } catch (error) {
      console.error("Failed to play playlist:", error);
    }
  };

  const handleTrackPlay = async (trackUri: string) => {
    if (!isInitialized) {
      console.warn("Spotify player not initialized");
      return;
    }

    try {
      await playTrack(trackUri);
    } catch (error) {
      console.error("Failed to play track:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <main id="main-content" className="container-responsive py-6 sm:py-8">
        {/* Welcome Banner */}
        {showWelcome && session?.user && (
          <WelcomeBanner userName={session.user.name || "there"} isFirstVisit={isFirstVisit} />
        )}

        <div className="mb-6 sm:mb-8 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Discover Playlists
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Browse and discover playlists shared by the community
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="lg:sticky lg:top-24">
              <ErrorBoundary>
                <SearchFilters onFiltersChange={handleFiltersChange} />
              </ErrorBoundary>
            </div>
          </div>

          {/* Playlist Grid */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <ErrorBoundary>
              <PlaylistGrid
                filters={filters}
                onPlaylistPlay={handlePlaylistPlay}
                onPlaylistClick={handlePlaylistClick}
              />
            </ErrorBoundary>
          </div>
        </div>
      </main>

      {/* Playlist Detail Modal - Lazy Loaded */}
      {selectedPlaylistId && (
        <ErrorBoundary>
          <Suspense
            fallback={
              <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            }
          >
            <PlaylistDetailModal
              playlistId={selectedPlaylistId}
              isOpen={!!selectedPlaylistId}
              onClose={handleCloseModal}
              currentUserId={session?.user?.id}
              onPlay={handlePlaylistPlay}
              onTrackPlay={handleTrackPlay}
              currentTrackId={playbackState.currentTrack?.id}
              isPlaying={playbackState.isPlaying}
            />
          </Suspense>
        </ErrorBoundary>
      )}
    </div>
  );
}
