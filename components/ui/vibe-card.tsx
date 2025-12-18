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

export function VibeCard({
  title,
  icon,
  color = "bg-vibe-purple",
  active,
  className,
  ...props
}: VibeCardProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-3xl p-6 transition-all duration-500 hover:scale-[1.02] cursor-pointer",
        "bg-white/5 dark:bg-white/5 border border-white/10 dark:border-white/5 backdrop-blur-md",
        "hover:shadow-[0_0_30px_-5px_var(--vibe-purple)] hover:border-vibe-purple/50",
        active && "border-vibe-purple shadow-[0_0_20px_-5px_var(--vibe-purple)]",
        className
      )}
      {...props}
    >
      {/* Background Gradient Effect */}
      <div
        className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br from-white/20 to-transparent",
          active && "opacity-20"
        )}
      />

      <div className="relative z-10 flex justify-between items-start">
        <div className="p-3 rounded-full bg-white/10 text-white backdrop-blur-sm group-hover:bg-vibe-purple group-hover:scale-110 transition-all duration-300">
          {icon}
        </div>

        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <div className="p-2 rounded-full bg-spotify text-black hover:scale-110 transition-transform">
            <Play size={16} fill="currentColor" />
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-8">
        <h3 className="text-xl font-bold text-white group-hover:text-vibe-purple transition-colors duration-300">
          {title}
        </h3>
        <p className="text-sm text-gray-400 mt-1 opacity-80 group-hover:opacity-100 transition-opacity">
          Tap to explore
        </p>
      </div>
    </div>
  );
}
