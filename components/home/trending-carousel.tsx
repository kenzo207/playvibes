"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, PlayCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
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
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <section className="py-24 border-y border-white/5 bg-white/2 dark:bg-white/[0.02]">
        <div className="container-responsive flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </section>
    );
  }

  if (playlists.length === 0) return null;

  return (
    <section className="py-24 border-y border-white/5 bg-white/2 dark:bg-white/[0.02]">
      <div className="container-responsive">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold tracking-tight mb-2">Trending Now</h2>
            <p className="text-muted-foreground">Top playlists vibing with the community.</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("left")}
              className="rounded-full h-12 w-12 border-white/10 hover:bg-white/10"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("right")}
              className="rounded-full h-12 w-12 border-white/10 hover:bg-white/10"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {playlists.map((playlist) => {
            // Parse images if stored as JSON string or use array
            let imageUrl = "/placeholder-playlist.jpg";
            if (Array.isArray(playlist.images) && playlist.images.length > 0) {
              imageUrl = playlist.images[0].url;
            }

            return (
              <div
                key={playlist.id}
                className="min-w-[280px] md:min-w-[320px] snap-start group relative rounded-2xl overflow-hidden aspect-square cursor-pointer bg-white/5"
                onClick={() => router.push(`/browse?playlist=${playlist.id}`)}
              >
                <Image
                  src={imageUrl}
                  alt={playlist.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <PlayCircle className="w-16 h-16 text-white drop-shadow-lg scale-90 group-hover:scale-100 transition-transform" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">
                    {playlist.name}
                  </h3>
                  <p className="text-sm text-gray-300 font-medium">
                    {playlist.user?.name || "Unknown Creator"}
                  </p>
                  <div className="mt-3 inline-flex items-center text-xs font-bold text-spotify bg-black/50 backdrop-blur-md px-2 py-1 rounded-md border border-spotify/20">
                    {playlist.likesCount || 0} Likes
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
