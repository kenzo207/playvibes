"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { PlaylistFilters } from "@/lib/types";
import { Search, X, ChevronDown, Sparkles } from "lucide-react";
import { useDebounce } from "@/lib/utils/performance";
import { cn } from "@/lib/utils";

interface FloatingSearchFiltersProps {
  onFiltersChange: (filters: PlaylistFilters) => void;
  className?: string;
}

const GENRE_OPTIONS = [
  "Pop",
  "Rock",
  "Hip Hop",
  "Electronic",
  "Jazz",
  "Classical",
  "Country",
  "R&B",
  "Indie",
  "Alternative",
  "Folk",
  "Reggae",
  "Blues",
  "Funk",
  "Soul",
];

const MOOD_OPTIONS = [
  "Happy",
  "Sad",
  "Energetic",
  "Chill",
  "Romantic",
  "Angry",
  "Peaceful",
  "Nostalgic",
  "Uplifting",
  "Melancholic",
  "Dreamy",
  "Intense",
  "Relaxed",
];

const ACTIVITY_OPTIONS = [
  "Workout",
  "Study",
  "Party",
  "Sleep",
  "Driving",
  "Cooking",
  "Reading",
  "Walking",
  "Running",
  "Meditation",
  "Work",
  "Travel",
  "Dancing",
  "Gaming",
];

type SortOption = "most_liked" | "most_saved" | "newest" | "oldest";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "most_liked", label: "Most Liked" },
  { value: "most_saved", label: "Most Saved" },
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
];

export function FloatingSearchFilters({
  onFiltersChange,
  className = "",
}: FloatingSearchFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [isScrolled, setIsScrolled] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Helper to map UI tags back to categories
  const getCategory = (tag: string) => {
    if (GENRE_OPTIONS.includes(tag)) return "genres";
    if (MOOD_OPTIONS.includes(tag)) return "moods";
    if (ACTIVITY_OPTIONS.includes(tag)) return "activities";
    return null;
  };

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    const genres = activeFilters.filter((f) => getCategory(f) === "genres");
    const moods = activeFilters.filter((f) => getCategory(f) === "moods");
    const activities = activeFilters.filter((f) => getCategory(f) === "activities");

    onFiltersChange({
      search: debouncedSearchQuery || undefined,
      genres: genres.length > 0 ? genres : undefined,
      moods: moods.length > 0 ? moods : undefined,
      activities: activities.length > 0 ? activities : undefined,
      sortBy,
    });
  }, [debouncedSearchQuery, activeFilters, sortBy, onFiltersChange]);

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  // Combine relevant "Top" tags for the quick picker
  const QUICK_TAGS = [
    ...GENRE_OPTIONS.slice(0, 8),
    ...MOOD_OPTIONS.slice(0, 5),
    ...ACTIVITY_OPTIONS.slice(0, 4),
  ];

  return (
    <div className={cn("w-full space-y-6", className)}>
      {/* Search Bar - Hero Style */}
      <div className="relative group max-w-3xl mx-auto">
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
        <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 shadow-lg rounded-full flex items-center p-2 transition-all focus-within:ring-2 focus-within:ring-primary/50 focus-within:scale-[1.01] hover:bg-black/50">
          <div className="pl-4 pr-3 text-muted-foreground">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Search for vibes, genres, or playlists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none focus:outline-none text-base placeholder:text-muted-foreground/50 h-10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="p-2 hover:bg-white/10 rounded-full text-muted-foreground transition-colors mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <div className="hidden sm:block border-l border-white/10 mx-2 h-6" />
          <div className="hidden sm:flex items-center pr-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-transparent border-none focus:outline-none text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-background text-foreground">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Horizontal Filter Scroll */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex gap-3 overflow-x-auto pb-4 pt-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide mask-fade"
        >
          {QUICK_TAGS.map((tag) => {
            const isActive = activeFilters.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleFilter(tag)}
                className={cn(
                  "flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border backdrop-blur-md",
                  isActive
                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25 scale-105"
                    : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-muted-foreground hover:text-foreground"
                )}
              >
                {tag}
              </button>
            );
          })}
        </div>
        {/* Gradient Fade Edges */}
        <div className="absolute top-0 right-0 bottom-4 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none sm:hidden" />
        <div className="absolute top-0 left-0 bottom-4 w-12 bg-gradient-to-r from-background to-transparent pointer-events-none sm:hidden" />
      </div>
    </div>
  );
}
