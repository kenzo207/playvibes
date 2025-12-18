"use client";

import { use, useEffect, useState } from "react";
import { PlaylistGrid } from "@/components/playlists/playlist-grid";
import { Navigation } from "@/components/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlaylistWithDetails } from "@/lib/types";
import { apiClient } from "@/lib/utils/api-client";
import { usePlayback } from "@/components/playback/playback-provider";
import { useToast } from "@/components/ui/use-toast";
import { useParams } from "next/navigation";

// Mock mapping of Id to Titles/Colors for demo
const VIBE_INFO: Record<string, { title: string; color: string; description: string }> = {
  chill: {
    title: "Chill Vibes",
    color: "from-blue-500",
    description: "Relax and unwind with these smooth tracks.",
  },
  workout: {
    title: "Workout Energy",
    color: "from-red-500",
    description: "Power through your limits.",
  },
  focus: { title: "Deep Focus", color: "from-yellow-500", description: "Stay in the zone." },
  night: {
    title: "Night Drive",
    color: "from-indigo-900",
    description: "Late night cruising aesthetics.",
  },
  morning: {
    title: "Morning Rise",
    color: "from-orange-400",
    description: "Start your day right.",
  },
  love: { title: "Romance", color: "from-pink-500", description: "Love is in the air." },
};

export default function VibePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const info = VIBE_INFO[id] || {
    title: "Vibe",
    color: "from-primary",
    description: "Explore the vibe.",
  };

  const [playlists, setPlaylists] = useState<PlaylistWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const { playPlaylist } = usePlayback();
  const { toast } = useToast();

  useEffect(() => {
    // In a real app, we would fetch by 'vibe' or tag.
    // For now, fetching general public playlists as a placeholder or search query.
    async function fetchVibePlaylists() {
      try {
        setLoading(true);
        // Using moods filter if supported or fallback to public lists
        const response = await apiClient.get<any>(`/api/playlists/public?moods=${id}&limit=20`);
        if (response.data) {
          setPlaylists(response.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchVibePlaylists();
  }, [id]);

  const handlePlay = async (playlistId: string) => {
    try {
      // Logic to play
      // ... existing play logic
      toast({ title: "Playing vibe..." });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div
        className={`absolute top-0 left-0 right-0 h-[50vh] bg-gradient-to-b ${info.color} to-transparent opacity-20 pointer-events-none`}
      />

      <Navigation />

      <main className="container-responsive py-12 relative z-10">
        <div className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center text-muted-foreground hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <div className="flex items-center gap-4 mb-4">
            <div className={`p-3 rounded-full bg-gradient-to-br ${info.color} to-white/10`}>
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
              {info.title}
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl">{info.description}</p>
        </div>

        <PlaylistGrid playlists={playlists} loading={loading} onPlaylistPlay={handlePlay} />
      </main>
    </div>
  );
}
