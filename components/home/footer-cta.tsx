"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export function FooterCTA() {
  return (
    <section className="py-32 px-4 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-vibe-purple/10 pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto space-y-8">
        <h2 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-6">
          Ready to Vibe?
        </h2>
        <p className="text-xl text-muted-foreground animate-pulse-slow">
          Join thousands of music lovers discovering their next favorite sound.
        </p>

        <div className="pt-8">
          <Button
            asChild
            size="lg"
            className="h-16 px-12 text-xl rounded-full bg-spotify hover:bg-spotify/90 text-white font-bold shadow-[0_0_40px_-10px_var(--spotify)] hover:shadow-[0_0_60px_-10px_var(--spotify)] transition-all duration-300 hover:scale-105"
          >
            <Link href="/browse">Start Listening Now</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
