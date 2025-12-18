"use client";

import { PlaylistSelector } from "@/components/playlists/playlist-selector";
import { AuthGuard } from "@/components/auth/auth-guard";
import { ErrorBoundary } from "@/components/error-boundary";

export default function ManagePage() {
  return (
    <AuthGuard>
      <main id="main-content" className="container mx-auto px-4 py-8 relative">
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-vibe-purple/10 rounded-full blur-[100px]" />
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 text-center sm:text-left relative">
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl opacity-50 animate-pulse-slow" />
            <h1 className="text-4xl sm:text-5xl font-black mb-3 tracking-tight relative z-10">
              Creator <span className="text-primary">Studio</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl relative z-10">
              Curate, sync, and share your sonic identity. Your playlists are your canvas.
            </p>
          </div>

          <ErrorBoundary>
            <PlaylistSelector
              onPlaylistToggle={(playlistId, isShared) => {
                console.log(`Playlist ${playlistId} is now ${isShared ? "shared" : "unshared"}`);
              }}
            />
          </ErrorBoundary>
        </div>
      </main>
    </AuthGuard>
  );
}
