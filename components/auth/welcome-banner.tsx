"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WelcomeBannerProps {
  userName: string;
  isFirstVisit: boolean;
}

export function WelcomeBanner({ userName, isFirstVisit }: WelcomeBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Show banner on mount
    const timer = setTimeout(() => setIsVisible(true), 100);

    // Show onboarding tooltip for first-time visitors after a short delay
    if (isFirstVisit) {
      const tooltipTimer = setTimeout(() => {
        setShowTooltip(true);
      }, 1000);

      return () => {
        clearTimeout(timer);
        clearTimeout(tooltipTimer);
      };
    }

    return () => clearTimeout(timer);
  }, [isFirstVisit]);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  const handleTooltipDismiss = () => {
    setShowTooltip(false);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Welcome Banner */}
      <div className="mb-6 animate-slide-down">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 border border-primary/20 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent" />
          <div className="relative p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Welcome back, {userName}! 🎵</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {isFirstVisit
                    ? "Ready to discover amazing playlists from the community?"
                    : "Discover new playlists and share your favorites"}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDismiss}
              className="h-8 w-8 rounded-full hover:bg-primary/10"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Dismiss</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Onboarding Tooltip for First-Time Visitors */}
      {isFirstVisit && showTooltip && (
        <div className="mb-6 animate-fade-in">
          <div className="relative rounded-xl bg-background border border-primary/30 shadow-lg p-5">
            <div className="absolute -top-2 left-8 h-4 w-4 rotate-45 bg-background border-l border-t border-primary/30" />
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    1
                  </span>
                  Quick Tour
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>
                      <strong className="text-foreground">Browse:</strong> Discover playlists shared
                      by the community
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>
                      <strong className="text-foreground">Like & Save:</strong> Show appreciation
                      and save your favorites
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>
                      <strong className="text-foreground">Manage:</strong> Share your own playlists
                      with the world
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>
                      <strong className="text-foreground">Play:</strong> Listen to playlists
                      directly in the app
                    </span>
                  </li>
                </ul>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleTooltipDismiss}
                className="h-8 w-8 rounded-full hover:bg-muted flex-shrink-0"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Dismiss tooltip</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
