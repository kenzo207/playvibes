"use client";

import { signInWithSpotify } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Music2 } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden mesh-gradient">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full animate-glow-pulse pointer-events-none" />

      <div className="z-10 w-full max-w-md px-6 animate-slide-up">
        <div className="glass-card p-10 rounded-[2.5rem] border-white/10 flex flex-col items-center text-center">
          {/* Logo */}
          <Link href="/" className="mb-8 flex flex-col items-center group">
            <div className="bg-primary/20 p-4 rounded-3xl mb-4 group-hover:scale-110 transition-transform">
              <Music2 className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">PlayVibes</h1>
          </Link>

          <h2 className="text-2xl font-bold mb-4">Welcome back</h2>
          <p className="text-muted-foreground mb-10 text-balance">
            Connect your Spotify account to start curating your vibes.
          </p>

          <Button
            size="lg"
            className="w-full h-14 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-white font-bold text-lg shadow-xl shadow-spotify/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            onClick={() => signInWithSpotify()}
          >
            <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
            Sign in with Spotify
          </Button>

          <p className="mt-8 text-sm text-muted-foreground">
            By signing in, you agree to our Terms of Service.
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
