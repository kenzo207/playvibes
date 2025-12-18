"use client";

import { VibeCard } from "@/components/ui/vibe-card";
import { Coffee, Dumbbell, Moon, Sun, Zap, Heart } from "lucide-react";

const VIBES = [
  {
    id: "chill",
    title: "Chill",
    icon: <Coffee className="w-6 h-6" />,
    color: "bg-blue-500",
  },
  {
    id: "workout",
    title: "Workout",
    icon: <Dumbbell className="w-6 h-6" />,
    color: "bg-red-500",
  },
  {
    id: "focus",
    title: "Focus",
    icon: <Zap className="w-6 h-6" />,
    color: "bg-yellow-500",
  },
  {
    id: "night",
    title: "Night Drive",
    icon: <Moon className="w-6 h-6" />,
    color: "bg-indigo-500",
  },
  {
    id: "morning",
    title: "Morning",
    icon: <Sun className="w-6 h-6" />,
    color: "bg-orange-500",
  },
  {
    id: "love",
    title: "Romance",
    icon: <Heart className="w-6 h-6" />,
    color: "bg-pink-500",
  },
];

export function VibeGrid() {
  return (
    <section className="py-24 px-4 sm:px-6 container-responsive">
      <div className="flex flex-col items-center mb-16 space-y-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
          Explore by <span className="text-vibe-purple">Vibe</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl text-lg">
          Whatever you're feeling, there's a playlist for it. Dive into curated collections.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {VIBES.map((vibe) => (
          <VibeCard key={vibe.id} title={vibe.title} icon={vibe.icon} className="h-64" />
        ))}
      </div>
    </section>
  );
}
