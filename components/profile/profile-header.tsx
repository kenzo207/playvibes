"use client";

import { UserProfileResponse } from "@/lib/types";
import { Avatar } from "@/components/ui/avatar";
import { Music, Heart, Bookmark } from "lucide-react";

interface ProfileHeaderProps {
  profile: UserProfileResponse;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const { user, stats } = profile;

  return (
    <div className="relative mb-20">
      {/* Immersive Background Banner */}
      <div className="absolute inset-0 h-48 sm:h-64 rounded-3xl overflow-hidden bg-gradient-to-r from-primary/20 via-purple-500/10 to-pink-500/10 animate-gradient-xy">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-30 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative pt-24 sm:pt-32 px-4 sm:px-8">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 max-w-5xl mx-auto">
          {/* Floating Avatar */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-br from-primary to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-500" />
            <div className="relative">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || "User"}
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-[6px] border-background shadow-2xl object-cover"
                />
              ) : (
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-[6px] border-background shadow-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                  <span className="text-white text-4xl sm:text-5xl font-bold">
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
              )}
            </div>
            {/* Status Indicator (Optional) */}
            <div className="absolute bottom-4 right-4 w-6 h-6 bg-green-500 border-4 border-background rounded-full" />
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left mb-4 md:mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight mb-2">
              {user.name || "Anonymous User"}
            </h1>
            {user.email && (
              <p className="text-lg text-muted-foreground font-medium">{user.email}</p>
            )}
          </div>

          {/* Glass Stats Cards */}
          <div className="flex gap-3 mb-4 md:mb-8">
            {/* Stats would go here, maybe as small glass pills or moved below */}
          </div>
        </div>

        {/* Floating Stats Consoles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-5xl mx-auto mt-8 sm:mt-12">
          <div className="group bg-card/50 backdrop-blur-md border border-white/10 p-4 rounded-2xl hover:bg-card/80 transition-all duration-300 hover:scale-[1.02] shadow-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Music className="w-6 h-6" />
              </div>
              <div>
                <p className="text-3xl font-bold">{stats.sharedPlaylistsCount}</p>
                <p className="text-sm text-muted-foreground font-medium">Shared Playlists</p>
              </div>
            </div>
          </div>

          <div className="group bg-card/50 backdrop-blur-md border border-white/10 p-4 rounded-2xl hover:bg-card/80 transition-all duration-300 hover:scale-[1.02] shadow-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-red-500/10 text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <p className="text-3xl font-bold">{stats.totalLikesReceived}</p>
                <p className="text-sm text-muted-foreground font-medium">Likes Received</p>
              </div>
            </div>
          </div>

          <div className="group bg-card/50 backdrop-blur-md border border-white/10 p-4 rounded-2xl hover:bg-card/80 transition-all duration-300 hover:scale-[1.02] shadow-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <Bookmark className="w-6 h-6" />
              </div>
              <div>
                <p className="text-3xl font-bold">{stats.totalSavesReceived}</p>
                <p className="text-sm text-muted-foreground font-medium">Saves Received</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
