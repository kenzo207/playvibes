"use client";

import { useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Data
const TRENDING_PLAYLISTS = [
  {
    id: 1,
    title: "Late Night Lo-Fi",
    creator: "CosmicBeats",
    image:
      "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=600&auto=format&fit=crop",
    likes: "12k",
  },
  {
    id: 2,
    title: "Gym Hardstyle",
    creator: "PumpItUp",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop",
    likes: "8.5k",
  },
  {
    id: 3,
    title: "Focus Flow",
    creator: "StudyWithMe",
    image:
      "https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=600&auto=format&fit=crop",
    likes: "22k",
  },
  {
    id: 4,
    title: "Summer 2024",
    creator: "SunChaser",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop",
    likes: "5k",
  },
  {
    id: 5,
    title: "Indie Discoveries",
    creator: "IndieHead",
    image:
      "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=600&auto=format&fit=crop",
    likes: "15k",
  },
];

export function TrendingCarousel() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

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
          {TRENDING_PLAYLISTS.map((playlist) => (
            <div
              key={playlist.id}
              className="min-w-[280px] md:min-w-[320px] snap-start group relative rounded-2xl overflow-hidden aspect-square cursor-pointer"
            >
              <Image
                src={playlist.image}
                alt={playlist.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <PlayCircle className="w-16 h-16 text-white drop-shadow-lg scale-90 group-hover:scale-100 transition-transform" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">{playlist.title}</h3>
                <p className="text-sm text-gray-300 font-medium">{playlist.creator}</p>
                <div className="mt-3 inline-flex items-center text-xs font-bold text-spotify bg-black/50 backdrop-blur-md px-2 py-1 rounded-md border border-spotify/20">
                  {playlist.likes} Likes
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
