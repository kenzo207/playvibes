"use client";

import { usePlayback } from "./playback-provider";
import { PlayerControls } from "./player-controls";
import { ProgressBar } from "./progress-bar";
import { VolumeControl } from "./volume-control";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export function GlobalPlayer() {
  const { playbackState, togglePlay, previousTrack, nextTrack, seek, setVolume } = usePlayback();

  const [isMinimized, setIsMinimized] = useState(false);

  // Don't show the player if there's no current track or if not ready
  if (!playbackState.currentTrack || !playbackState.isReady) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-3xl bg-black/60 dark:bg-black/80 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-50 animate-slide-up ring-1 ring-white/5 supports-[backdrop-filter]:bg-black/50">
      <div className="container-responsive py-3 sm:py-3">
        {/* Minimize/Expand Button - Minimum 44x44px touch target */}
        <div className="absolute top-2 right-2 sm:right-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(!isMinimized)}
            className="min-w-[44px] min-h-[44px] w-11 h-11 p-0 hover:bg-muted"
            aria-label={isMinimized ? "Expand player" : "Minimize player"}
          >
            {isMinimized ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </Button>
        </div>

        {/* Minimized View */}
        {isMinimized ? (
          <div className="flex items-center justify-between pr-14">
            {/* Track info */}
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              {playbackState.currentTrack.album.images[0] && (
                <img
                  src={playbackState.currentTrack.album.images[0].url}
                  alt={playbackState.currentTrack.album.name}
                  className="w-12 h-12 rounded-md shadow-sm flex-shrink-0"
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">
                  {playbackState.currentTrack.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {playbackState.currentTrack.artists.map((artist) => artist.name).join(", ")}
                </p>
              </div>
            </div>

            {/* Quick controls */}
            <div className="flex-shrink-0">
              <PlayerControls
                isPlaying={playbackState.isPlaying}
                onPlayPause={togglePlay}
                onPrevious={previousTrack}
                onNext={nextTrack}
                canSkipPrev={!playbackState.disallows?.skipping_prev}
                canSkipNext={!playbackState.disallows?.skipping_next}
              />
            </div>
          </div>
        ) : (
          <>
            {/* Mobile Layout */}
            <div className="block sm:hidden">
              <div className="flex items-center justify-between mb-3 pr-14">
                {/* Track info */}
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  {playbackState.currentTrack.album.images[0] && (
                    <img
                      src={playbackState.currentTrack.album.images[0].url}
                      alt={playbackState.currentTrack.album.name}
                      className="w-12 h-12 rounded-md shadow-sm flex-shrink-0"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {playbackState.currentTrack.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {playbackState.currentTrack.artists.map((artist) => artist.name).join(", ")}
                    </p>
                  </div>
                </div>

                {/* Mobile controls */}
                <div className="flex-shrink-0">
                  <PlayerControls
                    isPlaying={playbackState.isPlaying}
                    onPlayPause={togglePlay}
                    onPrevious={previousTrack}
                    onNext={nextTrack}
                    canSkipPrev={!playbackState.disallows?.skipping_prev}
                    canSkipNext={!playbackState.disallows?.skipping_next}
                  />
                </div>
              </div>

              {/* Mobile Progress bar */}
              <div className="mt-2">
                <ProgressBar
                  position={playbackState.position}
                  duration={playbackState.duration}
                  onSeek={seek}
                  disabled={playbackState.disallows?.seeking || !playbackState.isReady}
                />
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:flex items-center justify-between pr-14">
              {/* Track info */}
              <div className="flex items-center space-x-3 flex-1 min-w-0 max-w-xs lg:max-w-sm">
                {playbackState.currentTrack.album.images[0] && (
                  <img
                    src={playbackState.currentTrack.album.images[0].url}
                    alt={playbackState.currentTrack.album.name}
                    className="w-12 h-12 rounded-md shadow-sm"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">
                    {playbackState.currentTrack.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {playbackState.currentTrack.artists.map((artist) => artist.name).join(", ")}
                  </p>
                </div>
              </div>

              {/* Playback controls */}
              <div className="flex-1 max-w-md">
                <PlayerControls
                  isPlaying={playbackState.isPlaying}
                  onPlayPause={togglePlay}
                  onPrevious={previousTrack}
                  onNext={nextTrack}
                  canSkipPrev={!playbackState.disallows?.skipping_prev}
                  canSkipNext={!playbackState.disallows?.skipping_next}
                />
              </div>

              {/* Volume and additional controls */}
              <div className="flex items-center space-x-3 flex-1 justify-end max-w-xs">
                {/* Premium status indicator */}
                {!playbackState.hasSpotifyPremium && (
                  <div className="hidden lg:block text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400 rounded-full px-3 py-1">
                    Free (30s preview)
                  </div>
                )}

                {/* Volume control */}
                <div className="hidden md:block">
                  <VolumeControl
                    volume={playbackState.volume}
                    onVolumeChange={setVolume}
                    disabled={!playbackState.isReady}
                  />
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-2 hidden sm:block">
              <ProgressBar
                position={playbackState.position}
                duration={playbackState.duration}
                onSeek={seek}
                disabled={playbackState.disallows?.seeking || !playbackState.isReady}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
