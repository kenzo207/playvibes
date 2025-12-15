"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Image from "next/image";

interface SpotifyPlaylist {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  trackCount: number;
  isPublic: boolean;
  isOwner: boolean;
  owner: {
    id: string;
    displayName: string;
  };
}

interface SharedPlaylistData {
  id: string;
  spotifyPlaylistId: string;
  name: string;
  description?: string;
  imageUrl?: string;
  trackCount: number;
  genres?: string[];
  moods?: string[];
  activities?: string[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PlaylistSelectorProps {
  onPlaylistToggle?: (playlistId: string, isShared: boolean) => void;
  className?: string;
}

export function PlaylistSelector({ onPlaylistToggle, className }: PlaylistSelectorProps) {
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [sharedPlaylists, setSharedPlaylists] = useState<Set<string>>(new Set());
  const [sharedPlaylistsData, setSharedPlaylistsData] = useState<Map<string, SharedPlaylistData>>(
    new Map()
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sharingStates, setSharingStates] = useState<Record<string, boolean>>({});
  const [syncingStates, setSyncingStates] = useState<Record<string, boolean>>({});
  const [confirmUnshareId, setConfirmUnshareId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchUserPlaylists();
    fetchSharedPlaylists();
  }, []);

  const fetchUserPlaylists = async () => {
    try {
      const response = await fetch("/api/playlists/user");
      if (!response.ok) {
        throw new Error("Failed to fetch playlists");
      }
      const data = await response.json();
      setPlaylists(data.playlists || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load playlists");
    } finally {
      setLoading(false);
    }
  };

  const fetchSharedPlaylists = async () => {
    try {
      const response = await fetch("/api/playlists/shared");
      if (response.ok) {
        const data = await response.json();
        const playlistsMap = new Map<string, SharedPlaylistData>();
        data.playlists.forEach((p: SharedPlaylistData) => {
          playlistsMap.set(p.spotifyPlaylistId, p);
        });
        setSharedPlaylistsData(playlistsMap);
        setSharedPlaylists(
          new Set(data.playlists.map((p: SharedPlaylistData) => p.spotifyPlaylistId))
        );
      }
    } catch (err) {
      console.error("Failed to fetch shared playlists:", err);
    }
  };

  const handleToggleShare = async (playlist: SpotifyPlaylist) => {
    const isCurrentlyShared = sharedPlaylists.has(playlist.id);
    const newSharingState = !isCurrentlyShared;

    // If making private, show confirmation dialog
    if (isCurrentlyShared) {
      setConfirmUnshareId(playlist.id);
      return;
    }

    // Optimistic update for sharing
    setSharedPlaylists((prev) => {
      const newSet = new Set(prev);
      newSet.add(playlist.id);
      return newSet;
    });

    setSharingStates((prev) => ({ ...prev, [playlist.id]: true }));

    try {
      const response = await fetch("/api/playlists/share", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          spotifyPlaylistId: playlist.id,
          isPublic: newSharingState,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update sharing status");
      }

      // Refresh shared playlists to get updated data
      await fetchSharedPlaylists();

      toast({
        title: "Success",
        description: `Playlist "${playlist.name}" is now shared publicly.`,
        variant: "success",
      });

      onPlaylistToggle?.(playlist.id, newSharingState);
    } catch (err) {
      // Rollback optimistic update
      setSharedPlaylists((prev) => {
        const newSet = new Set(prev);
        newSet.delete(playlist.id);
        return newSet;
      });

      const errorMessage = err instanceof Error ? err.message : "Failed to update playlist";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSharingStates((prev) => ({ ...prev, [playlist.id]: false }));
    }
  };

  const confirmUnshare = async () => {
    if (!confirmUnshareId) return;

    const playlist = playlists.find((p) => p.id === confirmUnshareId);
    if (!playlist) return;

    // Optimistic update for unsharing
    setSharedPlaylists((prev) => {
      const newSet = new Set(prev);
      newSet.delete(confirmUnshareId);
      return newSet;
    });

    setSharingStates((prev) => ({ ...prev, [confirmUnshareId]: true }));

    try {
      const response = await fetch("/api/playlists/share", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          spotifyPlaylistId: confirmUnshareId,
          isPublic: false,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update sharing status");
      }

      // Refresh shared playlists
      await fetchSharedPlaylists();

      toast({
        title: "Success",
        description: `Playlist "${playlist.name}" is now private.`,
        variant: "success",
      });

      onPlaylistToggle?.(confirmUnshareId, false);
    } catch (err) {
      // Rollback optimistic update
      setSharedPlaylists((prev) => {
        const newSet = new Set(prev);
        newSet.add(confirmUnshareId);
        return newSet;
      });

      const errorMessage = err instanceof Error ? err.message : "Failed to update playlist";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSharingStates((prev) => ({ ...prev, [confirmUnshareId]: false }));
      setConfirmUnshareId(null);
    }
  };

  const handleSyncPlaylist = async (spotifyPlaylistId: string) => {
    const playlist = playlists.find((p) => p.id === spotifyPlaylistId);
    const playlistName = playlist?.name || "Playlist";

    setSyncingStates((prev) => ({ ...prev, [spotifyPlaylistId]: true }));

    try {
      const sharedPlaylistData = sharedPlaylistsData.get(spotifyPlaylistId);

      if (!sharedPlaylistData) {
        throw new Error("Playlist is not shared");
      }

      const response = await fetch("/api/playlists/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ playlistId: sharedPlaylistData.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to sync playlist");
      }

      // Refresh both user playlists and shared playlists to get updated data
      await Promise.all([fetchUserPlaylists(), fetchSharedPlaylists()]);

      toast({
        title: "Sync successful",
        description: `"${playlistName}" has been synchronized with Spotify.`,
        variant: "success",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to sync playlist";
      toast({
        title: "Sync failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSyncingStates((prev) => ({ ...prev, [spotifyPlaylistId]: false }));
    }
  };

  const formatLastSynced = (updatedAt: string) => {
    const date = new Date(updatedAt);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading your playlists...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <Button
            onClick={() => {
              setError(null);
              setLoading(true);
              fetchUserPlaylists();
            }}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (playlists.length === 0) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="text-center py-8">
          <p className="text-gray-600">
            No playlists found. Create some playlists in Spotify first!
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`space-y-4 ${className}`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Your Playlists</h2>
            <p className="text-gray-600">
              Choose which playlists to share. Only owned playlists can be shared.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setLoading(true);
              fetchUserPlaylists();
            }}
            disabled={loading}
          >
            Refresh from Spotify
          </Button>
        </div>

        <div className="grid gap-4">
          {playlists.map((playlist) => {
            const isShared = sharedPlaylists.has(playlist.id);
            const isToggling = sharingStates[playlist.id];
            const isSyncing = syncingStates[playlist.id];
            const sharedData = sharedPlaylistsData.get(playlist.id);

            return (
              <div
                key={playlist.id}
                className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink-0">
                  {playlist.imageUrl ? (
                    <Image
                      src={playlist.imageUrl}
                      alt={playlist.name}
                      width={64}
                      height={64}
                      className="rounded-md"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No Image</span>
                    </div>
                  )}
                </div>

                <div className="flex-grow min-w-0">
                  <h3 className="font-semibold truncate">{playlist.name}</h3>
                  {playlist.description && (
                    <p className="text-sm text-gray-600 truncate">{playlist.description}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    {playlist.trackCount} tracks • {playlist.isPublic ? "Public" : "Private"}
                    {!playlist.isOwner && ` • by ${playlist.owner.displayName}`}
                  </p>
                  {isShared && sharedData?.updatedAt && (
                    <p className="text-xs text-gray-400 mt-1">
                      Last synced: {formatLastSynced(sharedData.updatedAt)}
                    </p>
                  )}
                </div>

                <div className="flex-shrink-0 flex items-center gap-2">
                  {playlist.isOwner ? (
                    <>
                      <Button
                        variant={isShared ? "destructive" : "default"}
                        size="sm"
                        onClick={() => handleToggleShare(playlist)}
                        disabled={isToggling || isSyncing}
                      >
                        {isToggling ? (
                          <span className="flex items-center gap-2">
                            <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></span>
                            {isShared ? "Unsharing..." : "Sharing..."}
                          </span>
                        ) : (
                          <>{isShared ? "Unshare" : "Share"}</>
                        )}
                      </Button>
                      {isShared && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSyncPlaylist(playlist.id)}
                          disabled={isToggling || isSyncing}
                        >
                          {isSyncing ? (
                            <span className="flex items-center gap-2">
                              <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-900"></span>
                              Syncing...
                            </span>
                          ) : (
                            "Sync"
                          )}
                        </Button>
                      )}
                    </>
                  ) : (
                    <span className="text-xs text-gray-500 px-3 py-1 bg-gray-100 rounded">
                      Not Owner
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Confirmation dialog for unsharing */}
      <AlertDialog
        open={confirmUnshareId !== null}
        onOpenChange={(open) => !open && setConfirmUnshareId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Make playlist private?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the playlist from public view. All likes, comments, and saves will be
              preserved if you share it again later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmUnshare}>Make Private</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
