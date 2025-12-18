"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 py-32">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-vibe-purple/20 rounded-full blur-[120px] animate-glow-pulse" />
        <div
          className="absolute bottom-[20%] right-[20%] w-[500px] h-[500px] bg-spotify/20 rounded-full blur-[120px] animate-glow-pulse"
          style={{ animationDelay: "-2s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[800px] bg-gradient-radial from-primary/5 to-transparent pointer-events-none" />
      </div>

      <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
        {/* Floating Tag */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/5 mb-8 animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/50">
            Social Music Experience
          </span>
        </div>

        {/* Main Heading */}
        <div className="mb-12">
          <h1
            className="text-6xl sm:text-8xl md:text-[9rem] font-black tracking-tighter leading-[0.85] animate-slide-up"
            style={{ animationDelay: "0.4s" }}
          >
            <span className="block text-white drop-shadow-lg">FIND THE</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-spotify drop-shadow-[0_0_40px_rgba(139,92,246,0.2)]">
              VIBE.
            </span>
          </h1>
        </div>

        {/* Description */}
        <p
          className="text-lg sm:text-2xl text-white/70 max-w-2xl mx-auto font-body leading-relaxed mb-16 animate-slide-up"
          style={{ animationDelay: "0.6s" }}
        >
          Your Spotify, amplified. Connect with music enthusiasts,{" "}
          <br className="hidden sm:block" />
          curate shared spaces, and find your next obsession.
        </p>

        {/* CTA Section */}
        <div
          className="relative inline-flex flex-col sm:flex-row gap-4 p-1.5 rounded-full glass border-white/5 animate-slide-up shadow-xl"
          style={{ animationDelay: "0.8s" }}
        >
          <Button
            asChild
            size="lg"
            className="h-12 md:h-14 px-8 rounded-full bg-white text-black hover:bg-white/90 text-base md:text-lg font-bold transition-all duration-300"
          >
            <Link href="/login" className="flex items-center gap-2">
              Discover Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            size="lg"
            className="h-12 md:h-14 px-8 rounded-full text-white/70 hover:text-white hover:bg-white/5 text-base md:text-lg font-semibold transition-all duration-300"
          >
            <Link href="/browse">Learn More</Link>
          </Button>
        </div>
      </div>

      {/* Hero Interactive Element - Subtle Float */}
      <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-full max-w-4xl aspect-square bg-primary/10 rounded-full blur-[150px] animate-float-slow -z-10" />
    </section>
  );
}
