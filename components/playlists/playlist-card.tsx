"use client";

import { useState } from "react";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { Button } from "@/components/ui/button";
import { AnimatedCard } from "@/components/ui/animated-card";
import { PlaylistWithDetails } from "@/lib/types";
import { MessageCircle, Play } from "lucide-react";
import { LikeButton } from "./like-button";
import { SaveButton } from "./save-button";
import { CommentSection } from "./comment-section";
import { cn } from "@/lib/utils";

interface PlaylistCardProps {
  playlist: PlaylistWithDetails;
  showActions?: boolean;
  showComments?: boolean;
  currentUserId?: string;
  onLike?: (playlistId: string) => void;
  onSave?: (playlistId: string) => void;
  style?: React.CSSProperties;
  onPlay?: (playlistId: string) => void;
  onClick?: (playlistId: string) => void;
  className?: string;
}

export function PlaylistCard({
  playlist,
  showActions = true,
  showComments = false,
  currentUserId,
  onLike,
  onSave,
  onPlay,
  onClick,
  className = "",
  style,
}: PlaylistCardProps) {
  const [localPlaylist, setLocalPlaylist] = useState(playlist);

  const handleLikeChange = (isLiked: boolean, likesCount: number) => {
    setLocalPlaylist((prev) => ({
      ...prev,
      isLiked,
      likesCount,
    }));
    if (onLike) {
      onLike(playlist.id);
    }
  };

  const handleSaveChange = (isSaved: boolean) => {
    setLocalPlaylist((prev) => ({
      ...prev,
      isSaved,
    }));
    if (onSave) {
      onSave(playlist.id);
    }
  };

  const handlePlay = () => {
    if (onPlay) {
      onPlay(playlist.id);
    }
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(playlist.id);
    }
  };

  return (
    <AnimatedCard
      hover="lift"
      className={cn(
        "overflow-hidden animate-fade-in cursor-pointer glass-card border-white/5 dark:border-white/5",
        className
      )}
      style={style}
      onClick={handleCardClick}
      role="article"
      aria-label={`Playlist: ${playlist.name} by ${playlist.user.name || "Unknown"}`}
    >
      {/* Playlist Image */}
      <div className="relative aspect-square group overflow-hidden bg-muted">
        <OptimizedImage
          src={playlist.imageUrl || ""}
          alt={playlist.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          fallback={
            <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
              <div className="text-muted-foreground text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-muted-foreground/20 rounded-full flex items-center justify-center">
                  <Play className="w-6 h-6" />
                </div>
                <span className="text-sm">No Image</span>
              </div>
            </div>
          }
        />

        {/* Play button overlay - Minimum 44x44px touch target */}
        {onPlay && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <Button
              size="icon"
              className="transform scale-90 group-hover:scale-100 bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl min-w-[48px] min-h-[48px] w-12 h-12 rounded-full border border-white/10"
              onClick={(e) => {
                e.stopPropagation();
                handlePlay();
              }}
              aria-label="Play playlist"
            >
              <Play className="w-6 h-6 fill-current" aria-hidden="true" />
            </Button>
          </div>
        )}
      </div>

      {/* Playlist Info */}
      <div className="p-4 space-y-3">
        <div>
          <h3
            className="font-semibold text-base sm:text-lg line-clamp-1 mb-1 group-hover:text-primary transition-colors"
            id={`playlist-title-${playlist.id}`}
          >
            {playlist.name}
          </h3>
          {playlist.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2 leading-relaxed">
              {playlist.description}
            </p>
          )}
          <div className="flex items-center text-xs text-muted-foreground space-x-2">
            <span className="font-medium">{playlist.trackCount} tracks</span>
            <span>•</span>
            <span>by {playlist.user.name || "Unknown"}</span>
          </div>
        </div>

        {/* Tags */}
        {((playlist.genres && playlist.genres.length > 0) ||
          (playlist.moods && playlist.moods.length > 0) ||
          (playlist.activities && playlist.activities.length > 0)) && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {playlist.genres &&
                playlist.genres.slice(0, 2).map((genre) => (
                  <span
                    key={genre}
                    className="inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold bg-primary/10 text-primary rounded-sm"
                  >
                    {genre}
                  </span>
                ))}
              {playlist.moods &&
                playlist.moods.slice(0, 2).map((mood) => (
                  <span
                    key={mood}
                    className="inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold bg-secondary text-secondary-foreground rounded-sm"
                  >
                    {mood}
                  </span>
                ))}
              {playlist.activities &&
                playlist.activities.slice(0, 1).map((activity) => (
                  <span
                    key={activity}
                    className="inline-block px-2 py-1 text-xs bg-accent text-accent-foreground rounded-full"
                  >
                    {activity}
                  </span>
                ))}
            </div>
          </div>
        )}

        {/* Actions - Minimum 44x44px touch targets */}
        {showActions && (
          <div
            className="flex items-center justify-between min-h-[44px] pt-1 border-t border-border/50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center space-x-3">
              <LikeButton
                playlistId={localPlaylist.id}
                initialLikesCount={localPlaylist.likesCount}
                initialIsLiked={localPlaylist.isLiked || false}
                onLikeChange={handleLikeChange}
              />

              <div
                className="flex items-center space-x-1"
                aria-label={`${localPlaylist.commentsCount} comments`}
              >
                <MessageCircle className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                <span className="text-xs text-muted-foreground font-medium">
                  {localPlaylist.commentsCount}
                </span>
              </div>
            </div>

            {onSave && (
              <SaveButton
                playlistId={localPlaylist.id}
                initialIsSaved={localPlaylist.isSaved || false}
                onSaveChange={handleSaveChange}
              />
            )}
          </div>
        )}

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 pt-4 border-t border-border">
            <CommentSection playlistId={localPlaylist.id} currentUserId={currentUserId} />
          </div>
        )}
      </div>
    </AnimatedCard>
  );
}
