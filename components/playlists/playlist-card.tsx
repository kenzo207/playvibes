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
        "overflow-hidden animate-fade-in cursor-pointer glass-card border-white/5 hover:border-primary/30 transition-all duration-500",
        className
      )}
      style={style}
      onClick={handleCardClick}
      role="article"
      aria-label={`Playlist: ${playlist.name} by ${playlist.user.name || "Unknown"}`}
    >
      {/* Playlist Image */}
      <div className="relative aspect-square group overflow-hidden bg-black/40">
        <OptimizedImage
          src={playlist.imageUrl || ""}
          alt={playlist.name}
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-100"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          fallback={
            <div className="w-full h-full bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center">
              <div className="text-white/20 text-center">
                <Play className="w-12 h-12 mx-auto mb-2 opacity-20" />
                <span className="text-[10px] uppercase tracking-widest font-bold">No Cover</span>
              </div>
            </div>
          }
        />

        {/* Luminous Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

        {/* Play button overlay */}
        {onPlay && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-90 group-hover:scale-100">
            <Button
              size="icon"
              className="bg-primary text-white shadow-[0_0_30px_rgba(139,92,246,0.6)] min-w-[56px] min-h-[56px] w-14 h-14 rounded-full border border-white/20"
              onClick={(e) => {
                e.stopPropagation();
                handlePlay();
              }}
              aria-label="Play playlist"
            >
              <Play className="w-7 h-7 fill-current" aria-hidden="true" />
            </Button>
          </div>
        )}
      </div>

      {/* Playlist Info */}
      <div className="p-6 space-y-4">
        <div>
          <h3
            className="font-black text-xl tracking-tight line-clamp-1 mb-1 group-hover:text-primary transition-colors duration-300"
            id={`playlist-title-${playlist.id}`}
          >
            {playlist.name}
          </h3>
          <div className="flex items-center text-[10px] font-bold uppercase tracking-[0.15em] text-white/40 space-x-2">
            <span className="text-primary">{playlist.trackCount} tracks</span>
            <span className="opacity-20">•</span>
            <span>by {playlist.user.name || "Vibe Curator"}</span>
          </div>
        </div>

        {playlist.description && (
          <p className="text-sm text-white/50 line-clamp-2 leading-relaxed font-body">
            {playlist.description}
          </p>
        )}

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
                    className="inline-block px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold bg-primary/10 text-primary rounded-full border border-primary/10"
                  >
                    {genre}
                  </span>
                ))}
              {playlist.moods &&
                playlist.moods.slice(0, 2).map((mood) => (
                  <span
                    key={mood}
                    className="inline-block px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold bg-secondary/50 text-secondary-foreground rounded-full border border-secondary/10"
                  >
                    {mood}
                  </span>
                ))}
              {playlist.activities &&
                playlist.activities.slice(0, 1).map((activity) => (
                  <span
                    key={activity}
                    className="inline-block px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold bg-accent text-accent-foreground rounded-full border border-accent/10"
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
