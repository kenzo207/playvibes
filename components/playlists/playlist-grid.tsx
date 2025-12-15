"use client";

import { useState, useEffect } from "react";
import { PlaylistCard } from "./playlist-card";
import { PlaylistCardSkeleton } from "./playlist-card-skeleton";
import { Button } from "@/components/ui/button";
import { ResponsiveGrid } from "@/components/layout/responsive-grid";
import { PlaylistWithDetails, PlaylistFilters } from "@/lib/types";
import { Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { apiClient, getErrorMessage } from "@/lib/utils/api-client";

interface PlaylistGridProps {
  playlists?: PlaylistWithDetails[];
  filters?: PlaylistFilters;
  loading?: boolean;
  onPlaylistLike?: (playlistId: string) => void;
  onPlaylistSave?: (playlistId: string) => void;
  onPlaylistPlay?: (playlistId: string) => void;
  onPlaylistClick?: (playlistId: string) => void;
  onPlaylistUpdate?: (playlistId: string, updates: Partial<PlaylistWithDetails>) => void;
  onPlaylistRemove?: (playlistId: string) => void;
  showActions?: boolean;
  className?: string;
}

interface PaginatedResponse {
  data: PlaylistWithDetails[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function PlaylistGrid({
  playlists: externalPlaylists,
  filters,
  loading: externalLoading,
  onPlaylistLike,
  onPlaylistSave,
  onPlaylistPlay,
  onPlaylistClick,
  onPlaylistUpdate,
  onPlaylistRemove,
  showActions = true,
  className = "",
}: PlaylistGridProps) {
  const [internalPlaylists, setInternalPlaylists] = useState<PlaylistWithDetails[]>([]);
  const [internalLoading, setInternalLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const { toast } = useToast();

  // Use external playlists if provided, otherwise fetch internally
  const playlists = externalPlaylists || internalPlaylists;
  const loading = externalLoading !== undefined ? externalLoading : internalLoading;

  // Fetch playlists when filters change (only if not using external playlists)
  useEffect(() => {
    if (!externalPlaylists) {
      setInternalPlaylists([]);
      setPagination((prev) => ({ ...prev, page: 1 }));
      fetchPlaylists(1, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, externalPlaylists]);

  const fetchPlaylists = async (page: number = 1, reset: boolean = false) => {
    try {
      if (reset) {
        setInternalLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
      });

      // Add filters to params
      if (filters?.search) {
        params.append("q", filters.search);
      }
      if (filters?.genres && filters.genres.length > 0) {
        params.append("genres", filters.genres.join(","));
      }
      if (filters?.moods && filters.moods.length > 0) {
        params.append("moods", filters.moods.join(","));
      }
      if (filters?.activities && filters.activities.length > 0) {
        params.append("activities", filters.activities.join(","));
      }
      if (filters?.sortBy) {
        params.append("sortBy", filters.sortBy);
      }

      // Choose endpoint based on whether we have filters
      const endpoint =
        filters?.search ||
        filters?.genres?.length ||
        filters?.moods?.length ||
        filters?.activities?.length
          ? "/api/playlists/search"
          : "/api/playlists/public";

      const data: PaginatedResponse = await apiClient.get(`${endpoint}?${params}`);

      if (reset) {
        setInternalPlaylists(data.data);
      } else {
        setInternalPlaylists((prev) => [...prev, ...data.data]);
      }

      setPagination(data.pagination);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);

      if (reset) {
        toast({
          title: "Error loading playlists",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setInternalLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (pagination.page < pagination.totalPages && !loadingMore) {
      fetchPlaylists(pagination.page + 1, false);
    }
  };

  const handleLike = async (playlistId: string) => {
    try {
      const playlist = playlists.find((p) => p.id === playlistId);
      const method = playlist?.isLiked ? "DELETE" : "POST";

      const data =
        method === "DELETE"
          ? await apiClient.delete<{ isLiked: boolean; likesCount: number }>(
              `/api/playlists/${playlistId}/like`
            )
          : await apiClient.post<{ isLiked: boolean; likesCount: number }>(
              `/api/playlists/${playlistId}/like`
            );

      // Update local state
      if (!externalPlaylists) {
        setInternalPlaylists((prev) =>
          prev.map((playlist) => {
            if (playlist.id === playlistId) {
              return {
                ...playlist,
                isLiked: data.isLiked,
                likesCount: data.likesCount,
              };
            }
            return playlist;
          })
        );
      } else {
        // Notify parent component of the update
        onPlaylistUpdate?.(playlistId, {
          isLiked: data.isLiked,
          likesCount: data.likesCount,
        });
      }

      onPlaylistLike?.(playlistId);
    } catch (err) {
      toast({
        title: "Error",
        description: getErrorMessage(err),
        variant: "destructive",
      });
    }
  };

  const handleSave = async (playlistId: string) => {
    try {
      const playlist = playlists.find((p) => p.id === playlistId);
      const method = playlist?.isSaved ? "DELETE" : "POST";

      const data =
        method === "DELETE"
          ? await apiClient.delete<{ isSaved: boolean }>(`/api/playlists/${playlistId}/save`)
          : await apiClient.post<{ isSaved: boolean }>(`/api/playlists/${playlistId}/save`);

      // Update local state
      if (!externalPlaylists) {
        setInternalPlaylists((prev) =>
          prev.map((playlist) => {
            if (playlist.id === playlistId) {
              return {
                ...playlist,
                isSaved: data.isSaved,
              };
            }
            return playlist;
          })
        );
      } else {
        // For saved playlists page, remove the playlist if it's unsaved
        if (!data.isSaved) {
          onPlaylistRemove?.(playlistId);
        } else {
          onPlaylistUpdate?.(playlistId, { isSaved: data.isSaved });
        }
      }

      onPlaylistSave?.(playlistId);
    } catch (err) {
      toast({
        title: "Error",
        description: getErrorMessage(err),
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className={className}>
        <ResponsiveGrid minItemWidth="280px" gap="md">
          {[...Array(12)].map((_, i) => (
            <PlaylistCardSkeleton key={i} />
          ))}
        </ResponsiveGrid>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-semibold mb-2">Failed to load playlists</h3>
        <p className="text-muted-foreground mb-4 text-center max-w-md">{error}</p>
        <Button onClick={() => fetchPlaylists(1, true)} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  if (playlists.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
        <p className="text-muted-foreground mb-4">No playlists found</p>
        <p className="text-sm text-muted-foreground mb-6">
          {filters?.search ||
          filters?.genres?.length ||
          filters?.moods?.length ||
          filters?.activities?.length
            ? "Try adjusting your search or filters"
            : "Be the first to share a playlist!"}
        </p>

        {/* CTAs for empty state */}
        {!(
          filters?.search ||
          filters?.genres?.length ||
          filters?.moods?.length ||
          filters?.activities?.length
        ) && (
          <Button asChild>
            <a href="/manage">Manage Playlists</a>
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Results info */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          Showing {playlists.length} of {pagination.total} playlists
        </p>
      </div>

      {/* Grid */}
      <ResponsiveGrid minItemWidth="280px" gap="md">
        {playlists.map((playlist, index) => (
          <PlaylistCard
            key={playlist.id}
            playlist={playlist}
            onLike={handleLike}
            onSave={handleSave}
            onPlay={onPlaylistPlay}
            onClick={onPlaylistClick}
            showActions={showActions}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 0.05}s` }}
          />
        ))}
      </ResponsiveGrid>

      {/* Infinite Scroll Sentinel - only show for internal playlists */}
      {!externalPlaylists && pagination.page < pagination.totalPages && (
        <div
          ref={(node) => {
            if (node && !loadingMore) {
              // Create intersection observer for infinite scroll
              const observer = new IntersectionObserver(
                (entries) => {
                  if (entries[0].isIntersecting && !loadingMore) {
                    handleLoadMore();
                  }
                },
                { rootMargin: "200px" }
              );
              observer.observe(node);
              return () => observer.disconnect();
            }
          }}
          className="flex justify-center mt-8 py-4"
        >
          {loadingMore && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading more playlists...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
