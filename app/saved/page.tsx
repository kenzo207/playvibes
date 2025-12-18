"use client";

import { useEffect, useState } from "react";
import { PlaylistGrid } from "@/components/playlists/playlist-grid";
import { PlaylistCardSkeleton } from "@/components/playlists/playlist-card-skeleton";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { usePlayback } from "@/components/playback/playback-provider";
import { useSpotifyPlayer } from "@/hooks/use-spotify-player";
import { useToast } from "@/components/ui/use-toast";
import { apiClient, getErrorMessage } from "@/lib/utils/api-client";
import type { PlaylistWithDetails, PaginatedResponse } from "@/lib/types";
import { Bookmark, AlertCircle, Music } from "lucide-react";
import Link from "next/link";
import { ErrorBoundary } from "@/components/error-boundary";
import { ErrorMessage } from "@/components/ui/error-message";

export default function SavedPlaylistsPage() {
  const [playlists, setPlaylists] = useState<PlaylistWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { playPlaylist, isInitialized } = usePlayback();
  const { toast } = useToast();

  // Initialize the Spotify player
  useSpotifyPlayer();

  const fetchSavedPlaylists = async (pageNum: number = 1, append: boolean = false) => {
    try {
      if (!append) {
        setLoading(true);
      }

      const data: PaginatedResponse<PlaylistWithDetails> = await apiClient.get(
        `/api/playlists/saved?page=${pageNum}&limit=20`
      );

      if (append) {
        setPlaylists((prev) => [...prev, ...data.data]);
      } else {
        setPlaylists(data.data);
      }

      setHasMore(pageNum < data.pagination.totalPages);
      setError(null);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);

      toast({
        title: "Error loading saved playlists",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedPlaylists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchSavedPlaylists(nextPage, true);
  };

  const handlePlaylistUpdate = (playlistId: string, updates: Partial<PlaylistWithDetails>) => {
    setPlaylists((prev) =>
      prev.map((playlist) => (playlist.id === playlistId ? { ...playlist, ...updates } : playlist))
    );
  };

  const handlePlaylistRemove = (playlistId: string) => {
    setPlaylists((prev) => prev.filter((playlist) => playlist.id !== playlistId));

    toast({
      title: "Playlist removed",
      description: "Playlist removed from your saved collection",
      variant: "success",
      duration: 2000,
    });
  };

  const handlePlaylistPlay = async (playlistId: string) => {
    if (!isInitialized) {
      toast({
        title: "Player not ready",
        description: "Spotify player is still initializing. Please try again in a moment.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Get the playlist details to find the Spotify playlist ID
      const playlist = await apiClient.get<PlaylistWithDetails>(`/api/playlists/${playlistId}`);
      const spotifyPlaylistId = playlist.spotifyPlaylistId;

      if (!spotifyPlaylistId) {
        throw new Error("Spotify playlist ID not found");
      }

      // Convert Spotify playlist ID to URI format
      const playlistUri = `spotify:playlist:${spotifyPlaylistId}`;
      await playPlaylist(playlistUri);
    } catch (error) {
      toast({
        title: "Playback failed",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background relative">
        <div className="fixed inset-0 -z-10 mesh-gradient opacity-10"></div>

        <Navigation />
        <main id="main-content" className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-4 bg-primary/10 rounded-2xl ring-1 ring-primary/20 shadow-[0_0_15px_-5px_var(--color-primary)]">
                <Bookmark className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground">Saved Playlists</h1>
                <p className="text-muted-foreground mt-1">
                  Your collection of saved playlists from the community
                </p>
              </div>
            </div>

            {!loading && playlists.length > 0 && (
              <div className="mt-4 p-4 bg-card border rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{playlists.length}</span> playlist
                  {playlists.length !== 1 ? "s" : ""} saved
                </p>
              </div>
            )}
          </div>

          {/* Error State */}
          {error && !loading && (
            <ErrorMessage
              title="Failed to load saved playlists"
              message={error}
              onRetry={() => fetchSavedPlaylists()}
              type="error"
            />
          )}

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <PlaylistCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {playlists.length === 0 && !loading && !error && (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="bg-muted/50 rounded-full p-6 mb-6">
                <Music className="w-16 h-16 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-2">
                No saved playlists yet
              </h3>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                Start exploring and save playlists you love to build your personal collection. Saved
                playlists will appear here for easy access.
              </p>
              <Link href="/browse">
                <Button size="lg" className="gap-2">
                  <Bookmark className="w-4 h-4" />
                  Browse Playlists
                </Button>
              </Link>
            </div>
          )}

          {/* Playlist Grid */}
          {!loading && playlists.length > 0 && (
            <ErrorBoundary>
              <PlaylistGrid
                playlists={playlists}
                loading={false}
                onPlaylistUpdate={handlePlaylistUpdate}
                onPlaylistRemove={handlePlaylistRemove}
                onPlaylistPlay={handlePlaylistPlay}
                showActions={true}
              />
            </ErrorBoundary>
          )}

          {/* Load More Button */}
          {hasMore && playlists.length > 0 && !loading && (
            <div className="flex justify-center mt-8">
              <Button
                onClick={handleLoadMore}
                variant="outline"
                size="lg"
                className="min-w-[200px]"
              >
                Load More
              </Button>
            </div>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}
