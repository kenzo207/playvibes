"use client";

import { useEffect, useState } from "react";
import { X, Play, Share2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { LikeButton } from "./like-button";
import { SaveButton } from "./save-button";
import { CommentSection } from "./comment-section";
import { TrackList } from "./track-list";
import { PlaylistWithDetails, SpotifyTrack } from "@/lib/types";
import { apiClient, getErrorMessage } from "@/lib/utils/api-client";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

interface PlaylistDetailModalProps {
  playlistId: string;
  isOpen: boolean;
  onClose: () => void;
  currentUserId?: string;
  onPlay?: (playlistId: string) => void;
  onTrackPlay?: (trackUri: string, trackIndex: number) => void;
  currentTrackId?: string;
  isPlaying?: boolean;
}

export function PlaylistDetailModal({
  playlistId,
  isOpen,
  onClose,
  currentUserId,
  onPlay,
  onTrackPlay,
  currentTrackId,
  isPlaying = false,
}: PlaylistDetailModalProps) {
  const [playlist, setPlaylist] = useState<PlaylistWithDetails | null>(null);
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [isLoadingPlaylist, setIsLoadingPlaylist] = useState(false);
  const [isLoadingTracks, setIsLoadingTracks] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch playlist details
  useEffect(() => {
    if (!isOpen || !playlistId) return;

    const fetchPlaylist = async () => {
      setIsLoadingPlaylist(true);
      setError(null);
      try {
        const data = await apiClient.get<PlaylistWithDetails>(`/api/playlists/${playlistId}`);
        setPlaylist(data);
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        setError(errorMessage);
        toast({
          title: "Error loading playlist",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsLoadingPlaylist(false);
      }
    };

    fetchPlaylist();
  }, [isOpen, playlistId, toast]);

  // Fetch tracks
  useEffect(() => {
    if (!isOpen || !playlistId || !playlist) return;

    const fetchTracks = async () => {
      setIsLoadingTracks(true);
      try {
        const data = await apiClient.get<{
          tracks: SpotifyTrack[];
          totalTracks: number;
        }>(`/api/playlists/${playlistId}/tracks`);
        setTracks(data.tracks);
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        toast({
          title: "Error loading tracks",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsLoadingTracks(false);
      }
    };

    fetchTracks();
  }, [isOpen, playlistId, playlist, toast]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleShare = async () => {
    try {
      const url = `${window.location.origin}/browse?playlist=${playlistId}`;
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied!",
        description: "Playlist link copied to clipboard",
        variant: "success",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      });
    }
  };

  const handlePlay = () => {
    if (onPlay && playlist) {
      onPlay(playlist.id);
    }
  };

  const handleLikeChange = (isLiked: boolean, likesCount: number) => {
    if (playlist) {
      setPlaylist({
        ...playlist,
        isLiked,
        likesCount,
      });
    }
  };

  const handleSaveChange = (isSaved: boolean) => {
    if (playlist) {
      setPlaylist({
        ...playlist,
        isSaved,
      });
    }
  };

  const formatDuration = (totalMs: number) => {
    const totalMinutes = Math.floor(totalMs / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0) {
      return `${hours} hr ${minutes} min`;
    }
    return `${minutes} min`;
  };

  const getTotalDuration = () => {
    return tracks.reduce((total, track) => total + track.duration_ms, 0);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="playlist-modal-title"
    >
      <div
        className="min-h-screen w-full flex items-start justify-center md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="w-full max-w-5xl bg-background md:rounded-lg shadow-2xl md:border border-border min-h-screen md:min-h-0"
          role="document"
        >
          {/* Close button - Minimum 44x44px touch target */}
          <div className="sticky top-0 z-10 flex justify-end p-3 md:p-4 bg-background/95 backdrop-blur-sm border-b border-border">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full min-w-[44px] min-h-[44px] w-11 h-11"
              aria-label="Close playlist details"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {isLoadingPlaylist ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 px-4">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={onClose}>Close</Button>
            </div>
          ) : playlist ? (
            <div className="p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8 pb-24 md:pb-8">
              {/* Playlist Header */}
              <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                {/* Cover Image */}
                <div className="relative w-full md:w-64 aspect-square flex-shrink-0 rounded-lg overflow-hidden shadow-lg">
                  <OptimizedImage
                    src={playlist.imageUrl || ""}
                    alt={playlist.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 256px"
                    fallback={
                      <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                        <Play className="w-16 h-16 text-muted-foreground" />
                      </div>
                    }
                  />
                </div>

                {/* Playlist Info */}
                <div className="flex-1 space-y-3 md:space-y-4">
                  <div>
                    <h1
                      id="playlist-modal-title"
                      className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2"
                    >
                      {playlist.name}
                    </h1>
                    {playlist.description && (
                      <p className="text-muted-foreground leading-relaxed">
                        {playlist.description}
                      </p>
                    )}
                  </div>

                  {/* Creator */}
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Created by</span>
                    <Link
                      href={`/profile?userId=${playlist.userId}`}
                      className="font-medium hover:underline"
                    >
                      {playlist.user.name || "Unknown"}
                    </Link>
                  </div>

                  {/* Stats */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span>{playlist.trackCount} tracks</span>
                    {tracks.length > 0 && (
                      <>
                        <span>•</span>
                        <span>{formatDuration(getTotalDuration())}</span>
                      </>
                    )}
                    <span>•</span>
                    <span>{playlist.likesCount} likes</span>
                    <span>•</span>
                    <span>{playlist.commentsCount} comments</span>
                  </div>

                  {/* Tags */}
                  {((playlist.genres && playlist.genres.length > 0) ||
                    (playlist.moods && playlist.moods.length > 0) ||
                    (playlist.activities && playlist.activities.length > 0)) && (
                    <div className="flex flex-wrap gap-2">
                      {playlist.genres?.map((genre) => (
                        <span
                          key={genre}
                          className="px-3 py-1 text-xs bg-primary/10 text-primary rounded-full"
                        >
                          {genre}
                        </span>
                      ))}
                      {playlist.moods?.map((mood) => (
                        <span
                          key={mood}
                          className="px-3 py-1 text-xs bg-secondary/80 text-secondary-foreground rounded-full"
                        >
                          {mood}
                        </span>
                      ))}
                      {playlist.activities?.map((activity) => (
                        <span
                          key={activity}
                          className="px-3 py-1 text-xs bg-accent text-accent-foreground rounded-full"
                        >
                          {activity}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons - Minimum 44x44px touch targets */}
                  <div className="flex flex-wrap items-center gap-2 md:gap-3 pt-2">
                    {onPlay && (
                      <Button size="lg" onClick={handlePlay} className="gap-2 min-h-[44px] px-6">
                        <Play className="h-5 w-5" />
                        Play
                      </Button>
                    )}

                    <div className="min-h-[44px] flex items-center">
                      <LikeButton
                        playlistId={playlist.id}
                        initialLikesCount={playlist.likesCount}
                        initialIsLiked={playlist.isLiked || false}
                        onLikeChange={handleLikeChange}
                      />
                    </div>

                    <div className="min-h-[44px] flex items-center">
                      <SaveButton
                        playlistId={playlist.id}
                        initialIsSaved={playlist.isSaved || false}
                        onSaveChange={handleSaveChange}
                        showLabel
                      />
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleShare}
                      className="gap-2 min-h-[44px] px-4"
                    >
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>

              {/* Track List */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Tracks</h2>
                {isLoadingTracks ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <TrackList
                    tracks={tracks}
                    onTrackPlay={onTrackPlay}
                    currentTrackId={currentTrackId}
                    isPlaying={isPlaying}
                  />
                )}
              </div>

              {/* Comments Section */}
              <div className="space-y-4 border-t border-border pt-8">
                <h2 className="text-2xl font-bold">Comments</h2>
                <CommentSection playlistId={playlist.id} currentUserId={currentUserId} />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
