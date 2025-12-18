"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-vibe-purple/20 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-spotify/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 text-center max-w-5xl mx-auto space-y-8">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md animate-fade-in opacity-0"
          style={{ animationDelay: "0.2s" }}
        >
          <Sparkles className="w-4 h-4 text-vibe-purple" />
          <span className="text-sm font-medium text-gray-200">The social music experience</span>
        </div>

        <h1
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-none animate-slide-up opacity-0"
          style={{ animationDelay: "0.4s" }}
        >
          <span className="block text-white drop-shadow-2xl">Find the</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-vibe-purple via-white to-spotify animate-gradient-x">
            Vibe.
          </span>
        </h1>

        <p
          className="text-xl sm:text-2xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed animate-slide-up opacity-0"
          style={{ animationDelay: "0.6s" }}
        >
          Connect your Spotify. Share your taste. <br className="hidden sm:block" />
          Discover music that matches your energy.
        </p>

        <div
          className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-8 animate-slide-up opacity-0"
          style={{ animationDelay: "0.8s" }}
        >
          <Button
            asChild
            size="lg"
            className="h-14 px-8 rounded-full bg-white text-black hover:bg-gray-200 text-lg font-bold shadow-[0_0_20px_-5px_rgba(255,255,255,0.4)] hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.6)] transition-all duration-300 hover:scale-105"
          >
            <Link href="/browse">Discover Playlists</Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-14 px-8 rounded-full border-white/20 hover:bg-white/10 text-lg backdrop-blur-md transition-all duration-300"
          >
            <Link href="#how-it-works" className="group">
              How it works
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
        <div className="w-1 h-12 rounded-full bg-gradient-to-b from-white/0 via-white/50 to-white/0" />
      </div>
    </section>
  );
}
