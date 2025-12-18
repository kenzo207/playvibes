"use client";

import { useState, useEffect, useCallback } from "react";
import { PlaylistWithDetails, PaginatedResponse } from "@/lib/types";
import { PlaylistGrid } from "@/components/playlists/playlist-grid";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProfilePlaylistsProps {
  userId: string;
  isOwnProfile: boolean;
  onPlaylistPlay?: (playlistId: string) => void;
}

export function ProfilePlaylists({ userId, isOwnProfile, onPlaylistPlay }: ProfilePlaylistsProps) {
  const [playlists, setPlaylists] = useState<PlaylistWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  const fetchPlaylists = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/users/${userId}/playlists?page=${page}&limit=12`);

      if (!response.ok) {
        throw new Error("Failed to fetch playlists");
      }

      const data: PaginatedResponse<PlaylistWithDetails> = await response.json();
      setPlaylists(data.data);
      setPagination(data.pagination);
    } catch (err) {
      console.error("Error fetching playlists:", err);
      setError("Failed to load playlists");
    } finally {
      setIsLoading(false);
    }
  }, [userId, page]);

  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < pagination.totalPages) {
      setPage(page + 1);
    }
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={fetchPlaylists} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">
          {isOwnProfile ? "My Shared Playlists" : "Shared Playlists"}
        </h2>
        {pagination.total > 0 && (
          <p className="text-sm text-muted-foreground">
            {pagination.total} {pagination.total === 1 ? "playlist" : "playlists"}
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-muted rounded-lg mb-3" />
              <div className="h-4 bg-muted rounded w-3/4 mb-2" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : playlists.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <Music className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg text-muted-foreground mb-2">
            {isOwnProfile
              ? "You haven't shared any playlists yet"
              : "This user hasn't shared any playlists yet"}
          </p>
          {isOwnProfile && (
            <Button asChild className="mt-4">
              <a href="/manage">Share Your First Playlist</a>
            </Button>
          )}
        </div>
      ) : (
        <>
          <PlaylistGrid playlists={playlists} onPlaylistPlay={onPlaylistPlay} />

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <Button
                onClick={handlePreviousPage}
                disabled={page === 1}
                variant="outline"
                size="sm"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>

              <span className="text-sm text-muted-foreground">
                Page {page} of {pagination.totalPages}
              </span>

              <Button
                onClick={handleNextPage}
                disabled={page === pagination.totalPages}
                variant="outline"
                size="sm"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Import Music icon
import { Music } from "lucide-react";
