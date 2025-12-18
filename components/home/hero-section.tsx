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

      <div className="relative z-10 text-center max-w-6xl mx-auto">
        {/* Floating Tag */}
        <div
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass border border-white/10 mb-12 animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-white/70">
            Social Music Experience
          </span>
        </div>

        {/* Main Heading */}
        <div className="space-y-4 mb-12">
          <h1
            className="text-7xl sm:text-8xl md:text-[10rem] font-black tracking-tighter leading-[0.85] animate-slide-up"
            style={{ animationDelay: "0.4s" }}
          >
            <span className="block text-white text-glow">FIND THE</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-spotify animate-gradient-x drop-shadow-[0_0_30px_rgba(139,92,246,0.3)]">
              VIBE.
            </span>
          </h1>

          <div
            className="h-1 w-24 bg-gradient-to-r from-primary to-spotify mx-auto rounded-full animate-scale-in"
            style={{ animationDelay: "0.6s" }}
          />
        </div>

        {/* Description */}
        <p
          className="text-lg sm:text-2xl text-white/50 max-w-2xl mx-auto font-body leading-relaxed mb-16 animate-slide-up"
          style={{ animationDelay: "0.7s" }}
        >
          Your Spotify, amplified. Connect with music enthusiasts,{" "}
          <br className="hidden sm:block" />
          curate shared spaces, and find your next obsession.
        </p>

        {/* CTA Section with Glass Wrap */}
        <div
          className="relative inline-flex flex-col sm:flex-row gap-6 p-2 rounded-[2.5rem] glass border-white/5 animate-slide-up shadow-2xl"
          style={{ animationDelay: "0.9s" }}
        >
          <Button
            asChild
            size="lg"
            className="h-16 px-10 rounded-full bg-white text-black hover:bg-white/90 text-lg font-bold shadow-xl hover:shadow-white/20 hover:scale-105 transition-all duration-500 group"
          >
            <Link href="/browse" className="flex items-center gap-2">
              Discover Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            size="lg"
            className="h-16 px-10 rounded-full text-white/80 hover:text-white hover:bg-white/5 text-lg font-semibold transition-all duration-500"
          >
            <Link href="#how-it-works">Learn More</Link>
          </Button>
        </div>
      </div>

      {/* Hero Interactive Element - Subtle Float */}
      <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-full max-w-4xl aspect-square bg-primary/10 rounded-full blur-[150px] animate-float-slow -z-10" />
    </section>
  );
}
