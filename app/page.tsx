"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth/client";
import { HeroSection } from "@/components/home/hero-section";
import { VibeGrid } from "@/components/home/vibe-grid";
import { TrendingCarousel } from "@/components/home/trending-carousel";
import { FooterCTA } from "@/components/home/footer-cta";

export default function Home() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  // Redirect to /browse if user is already logged in
  useEffect(() => {
    if (session?.user) {
      router.push("/browse");
    }
  }, [session, isPending, router]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <main className="flex flex-col">
        {/* Dynamic Background Mesh Effect is handled in globals.css/layout.tsx */}

        {/* HERO SECTION */}
        <HeroSection />

        {/* VIBE GRID */}
        <div id="vibe-grid">
          <VibeGrid />
        </div>

        {/* TRENDING PLAYLISTS */}
        <div id="trending">
          <TrendingCarousel />
        </div>

        {/* FOOTER CTA */}
        <FooterCTA />
      </main>
    </div>
  );
}
