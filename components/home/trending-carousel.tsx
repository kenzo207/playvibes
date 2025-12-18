"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, PlayCircle, Loader2 } from "lucide-react";
import { PlaylistWithDetails } from "@/lib/types";
import { useRouter } from "next/navigation";

export function TrendingCarousel() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [playlists, setPlaylists] = useState<PlaylistWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchTrending() {
      try {
        const res = await fetch("/api/playlists/trending?limit=10");
        if (res.ok) {
          const data = await res.json();
          setPlaylists(data);
        }
      } catch (error) {
        console.error("Failed to fetch trending playlists", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTrending();
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <section className="py-24 bg-black/20">
        <div className="container-responsive flex justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (playlists.length === 0) return null;

  return (
    <section className="py-32 relative overflow-hidden">
      <div className="container-responsive relative z-10">
        <div className="flex items-end justify-between mb-16 px-2">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-bold tracking-widest uppercase text-primary">
                Live Charts
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-white">
              TRENDING <span className="text-primary italic">NOW</span>
            </h2>
            <p className="text-white/40 font-body text-lg max-w-xl leading-relaxed">
              Handpicked vibes that are currently dominating the PlayVibes community.
            </p>
          </div>
          <div className="flex gap-4 mb-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("left")}
              className="rounded-full h-14 w-14 border-white/5 bg-white/5 hover:bg-white/10 hover:scale-110 active:scale-95 transition-all backdrop-blur-xl"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("right")}
              className="rounded-full h-14 w-14 border-white/5 bg-white/5 hover:bg-white/10 hover:scale-110 active:scale-95 transition-all backdrop-blur-xl"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </Button>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex gap-8 overflow-x-auto pb-16 snap-x snap-mandatory hide-scrollbar px-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {playlists.map((playlist) => {
            const imageUrl = playlist.imageUrl || "/placeholder-playlist.jpg";

            return (
              <div
                key={playlist.id}
                className="min-w-[320px] md:min-w-[400px] snap-start group relative rounded-[2.5rem] overflow-hidden aspect-[4/5] cursor-pointer glass-card border-white/5 transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(139,92,246,0.25)]"
                onClick={() => router.push(`/browse?playlist=${playlist.id}`)}
              >
                {/* Background Image with Parallax-like effect */}
                <Image
                  src={imageUrl}
                  alt={playlist.name}
                  fill
                  sizes="(max-width: 768px) 320px, 400px"
                  className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                />

                {/* Immersive Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-700" />
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                {/* Play Button Center */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 transform scale-75 group-hover:scale-100">
                  <div className="w-24 h-24 rounded-full bg-primary/20 backdrop-blur-2xl flex items-center justify-center border border-primary/30 shadow-[0_0_50px_rgba(139,92,246,0.4)]">
                    <PlayCircle className="w-14 h-14 text-primary fill-primary/10" />
                  </div>
                </div>

                {/* Content Details */}
                <div className="absolute bottom-0 left-0 right-0 p-10 translate-y-6 group-hover:translate-y-0 transition-all duration-700 ease-out">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-3xl font-black text-white tracking-tighter line-clamp-2 leading-tight group-hover:text-primary transition-colors duration-500">
                        {playlist.name}
                      </h3>
                      <p className="text-xs font-bold tracking-[0.3em] uppercase text-white/40">
                        By {playlist.user?.name || "Premium Taste"}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black tracking-widest text-spotify">
                        <span className="w-2 h-2 rounded-full bg-spotify animate-pulse shadow-[0_0_10px_rgba(30,215,96,0.5)]" />
                        {playlist.likesCount || 0} LIKES
                      </div>
                      <div className="text-xs font-bold text-white/30 tracking-widest group-hover:text-white/60 transition-colors">
                        EXPLORE VIBE
                      </div>
                    </div>
                  </div>
                </div>

                {/* Outer Luminous Border */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/20 transition-all duration-700 rounded-[2.5rem] pointer-events-none" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Decorative Orbs */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[150px] -translate-x-1/2 -z-10" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-spotify/5 rounded-full blur-[180px] translate-x-1/4 -z-10" />
    </section>
  );
}
