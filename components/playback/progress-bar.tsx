"use client";

import { useState, useRef, useMemo } from "react";
import { throttle } from "@/lib/utils/performance";

interface ProgressBarProps {
  position: number;
  duration: number;
  onSeek: (position: number) => void;
  disabled?: boolean;
}

export function ProgressBar({ position, duration, onSeek, disabled = false }: ProgressBarProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [hoverPosition, setHoverPosition] = useState<number | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Throttle seek updates to 100ms to reduce API calls during dragging
  const throttledSeek = useMemo(
    () =>
      throttle((...args: unknown[]) => {
        const newPosition = args[0] as number;
        onSeek(newPosition);
      }, 100),
    [onSeek]
  );

  const handleSeek = (clientX: number) => {
    if (!progressRef.current || disabled) return;

    const rect = progressRef.current.getBoundingClientRect();
    const clickX = clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(1, clickX / width));
    const newPosition = percentage * duration;

    throttledSeek(newPosition);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    setIsDragging(true);
    handleSeek(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const hoverX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(1, hoverX / width));
    const hoverPos = percentage * duration;
    setHoverPosition(hoverPos);

    if (isDragging) {
      handleSeek(e.clientX);
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      handleSeek(e.clientX);
      setIsDragging(false);
    }
  };

  const handleMouseLeave = () => {
    setHoverPosition(null);
    setIsDragging(false);
  };

  const progressPercentage = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <div className="w-full">
      <div
        ref={progressRef}
        className={`relative w-full bg-muted rounded-full h-1 ${
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:h-1.5"
        } transition-all duration-200 group`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        role="slider"
        aria-label="Playback progress"
        aria-valuenow={position}
        aria-valuemin={0}
        aria-valuemax={duration}
        aria-valuetext={`${formatTime(position)} of ${formatTime(duration)}`}
        tabIndex={disabled ? -1 : 0}
      >
        {/* Progress fill */}
        <div
          className="bg-primary h-full rounded-full transition-all shadow-sm"
          style={{
            width: `${progressPercentage}%`,
            transitionDuration: isDragging ? "0ms" : "1000ms",
          }}
        />

        {/* Hover indicator */}
        {hoverPosition !== null && !disabled && (
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            style={{
              left: `${(hoverPosition / duration) * 100}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
        )}

        {/* Dragging indicator */}
        {!disabled && (
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            style={{
              left: `${progressPercentage}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
        )}
      </div>

      {/* Time display */}
      <div className="flex justify-between items-center mt-1 text-xs text-muted-foreground">
        <span>{formatTime(position)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}
