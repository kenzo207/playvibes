"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Play } from "lucide-react";

interface VibeCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  icon?: React.ReactNode;
  color?: string;
  active?: boolean;
}

export function VibeCard({ title, icon, active, className, ...props }: VibeCardProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-[2.5rem] p-8 transition-all duration-700 hover:scale-[1.03] cursor-pointer",
        "glass-card border-white/5 backdrop-blur-2xl",
        "hover:shadow-[0_20px_40px_-15px_rgba(139,92,246,0.2)] hover:border-primary/40",
        active && "border-primary/50 shadow-[0_0_30px_-5px_oklch(0.6_0.25_290/0.4)]",
        className
      )}
      {...props}
    >
      {/* Dynamic Background Shine */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br from-primary/10 via-transparent to-spotify/5 pointer-events-none" />

      <div className="relative z-10 flex justify-between items-start">
        <div className="p-4 rounded-3xl bg-white/5 text-white backdrop-blur-xl border border-white/10 group-hover:bg-primary group-hover:text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl">
          {icon}
        </div>

        <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
          <div className="p-3 rounded-full bg-primary text-white shadow-[0_0_20px_rgba(139,92,246,0.5)] hover:scale-110 active:scale-95 transition-all">
            <Play size={20} fill="currentColor" />
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-12 space-y-2">
        <h3 className="text-2xl font-black text-white tracking-tight group-hover:text-primary transition-colors duration-500">
          {title}
        </h3>
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-white/40 group-hover:text-white/60 transition-all duration-500">
          Explore Vibe
        </p>
      </div>

      {/* Decorative Glow */}
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </div>
  );
}
