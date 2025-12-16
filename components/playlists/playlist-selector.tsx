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
import { OptimizedImage } from "@/components/ui/optimized-image";
import { AnimatedCard } from "@/components/ui/animated-card";
import { Check, Import, Trash2, RefreshCw, Lock } from "lucide-react";

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {playlists.map((playlist) => {
            const isShared = sharedPlaylists.has(playlist.id);
            const isToggling = sharingStates[playlist.id];
            const isSyncing = syncingStates[playlist.id];
            const sharedData = sharedPlaylistsData.get(playlist.id);

            return (
              <AnimatedCard
                key={playlist.id}
                className="group relative flex flex-col overflow-hidden"
                hover="lift"
              >
                {/* Card Image */}
                <div className="relative aspect-square w-full overflow-hidden">
                  <OptimizedImage
                    src={playlist.imageUrl || ""}
                    alt={playlist.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    fallback={
                      <div className="w-full h-full bg-muted/30 flex items-center justify-center backdrop-blur-sm">
                        <span className="text-muted-foreground text-sm font-medium">No Image</span>
                      </div>
                    }
                  />

                  {/* Overlay for Owner status / Public status */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    {!playlist.isOwner && (
                      <span className="bg-black/40 backdrop-blur-md text-white text-xs font-medium px-3 py-1.5 rounded-full flex items-center border border-white/10">
                        <Lock className="w-3 h-3 mr-1.5" /> Not Owner
                      </span>
                    )}
                  </div>

                  {/* Imported Badge */}
                  {isShared && (
                    <div className="absolute top-3 right-3">
                      <span className="bg-primary/90 text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full flex items-center shadow-lg animate-in fade-in zoom-in duration-300 backdrop-blur-md border border-white/10">
                        <Check className="w-3 h-3 mr-1.5" /> Imported
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="flex flex-col flex-grow p-5 space-y-4">
                  <div className="space-y-1.5">
                    <h3
                      className="font-bold text-lg leading-tight line-clamp-1 group-hover:text-primary transition-colors"
                      title={playlist.name}
                    >
                      {playlist.name}
                    </h3>
                    {playlist.description ? (
                      <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5em] leading-relaxed">
                        {playlist.description}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground italic min-h-[2.5em] opacity-50">
                        No description
                      </p>
                    )}
                  </div>

                  <div className="flex items-center text-xs font-medium text-muted-foreground mt-auto pt-2">
                    <span className="bg-secondary/50 px-2.5 py-1 rounded-full text-foreground/80">
                      {playlist.trackCount} tracks
                    </span>
                    <span className="mx-2 opacity-50">•</span>
                    <span
                      className={playlist.isPublic ? "text-green-500" : "text-muted-foreground"}
                    >
                      {playlist.isPublic ? "Public" : "Private"}
                    </span>
                  </div>

                  {/* Sync Status */}
                  {isShared && sharedData?.updatedAt && (
                    <div className="text-xs text-muted-foreground flex items-center pt-1 bg-muted/30 p-2 rounded-lg">
                      <RefreshCw className="w-3 h-3 mr-2" />
                      Synced {formatLastSynced(sharedData.updatedAt)}
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="p-5 pt-0 mt-auto grid grid-cols-2 gap-3">
                  {playlist.isOwner ? (
                    <>
                      {isShared ? (
                        <>
                          <Button
                            variant="secondary"
                            className="w-full bg-secondary/80 hover:bg-destructive/10 hover:text-destructive transition-colors shadow-none border-0"
                            size="sm"
                            onClick={() => handleToggleShare(playlist)}
                            disabled={isToggling || isSyncing}
                          >
                            {isToggling ? "Removing..." : "Remove"}
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full border-primary/20 hover:bg-primary/5 hover:text-primary transition-colors"
                            size="sm"
                            onClick={() => handleSyncPlaylist(playlist.id)}
                            disabled={isToggling || isSyncing}
                          >
                            {isSyncing ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Sync"}
                          </Button>
                        </>
                      ) : (
                        <Button
                          className="w-full col-span-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg hover:shadow-primary/20 transition-all font-semibold h-10"
                          size="sm"
                          onClick={() => handleToggleShare(playlist)}
                          disabled={isToggling}
                        >
                          {isToggling ? (
                            <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                          ) : (
                            <Import className="w-4 h-4 mr-2" />
                          )}
                          {isToggling ? "Importing..." : "Import to PlayVibes"}
                        </Button>
                      )}
                    </>
                  ) : (
                    <Button
                      variant="ghost"
                      disabled
                      className="w-full col-span-2 text-muted-foreground opacity-50 bg-muted/50"
                    >
                      <Lock className="w-4 h-4 mr-2" /> Cannot Import
                    </Button>
                  )}
                </div>
              </AnimatedCard>
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
            <AlertDialogTitle>Remove from Profile?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the playlist from your public profile on PlayVibes. Actual playlist
              on Spotify will NOT be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmUnshare}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
