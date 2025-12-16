"use client";

import { useState, useEffect, lazy, Suspense, useCallback } from "react";
import { FloatingSearchFilters } from "@/components/playlists/floating-search-filters";
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
      <main id="main-content" className="container-responsive py-8 sm:py-12 relative z-10">
        {/* Welcome Banner */}
        {showWelcome && session?.user && (
          <div className="mb-8">
            <WelcomeBanner userName={session.user.name || "there"} isFirstVisit={isFirstVisit} />
          </div>
        )}

        {/* Hero Section */}
        <div className="text-center mb-12 animate-slide-up">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black mb-6 tracking-tight">
            <span className="block text-foreground/90">Find Your</span>
            <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient-x bg-200%">
              Next Favorite Vibe
            </span>
          </h1>
          <p className="text-xl text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Explore curated collections from the community. Playlists for every mood, moment, and
            memory.
          </p>
        </div>

        {/* Floating Filters */}
        <div className="sticky top-4 z-40 mb-12" id="filters-container">
          <ErrorBoundary>
            <FloatingSearchFilters
              onFiltersChange={handleFiltersChange}
              className="animate-scale-in"
            />
          </ErrorBoundary>
        </div>

        {/* Playlist Grid */}
        <div className="relative min-h-[400px]">
          <ErrorBoundary>
            <PlaylistGrid
              filters={filters}
              onPlaylistPlay={handlePlaylistPlay}
              onPlaylistClick={handlePlaylistClick}
              className="animate-fade-in"
            />
          </ErrorBoundary>
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
