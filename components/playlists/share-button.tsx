"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Check, Facebook, Twitter, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ShareButtonProps {
  playlistId: string;
  playlistName: string;
  className?: string;
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
  showLabel?: boolean;
}

export function ShareButton({
  playlistId,
  playlistName,
  className,
  variant = "ghost",
  size = "sm",
  showLabel = false,
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const getPlaylistUrl = () => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/browse?playlist=${playlistId}`;
  };

  const handleCopyLink = async () => {
    const url = getPlaylistUrl();

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);

      toast({
        title: "Link copied!",
        description: "Playlist link has been copied to clipboard.",
        variant: "success",
        duration: 2000,
      });

      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Failed to copy",
        description: "Could not copy link to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleShareFacebook = () => {
    const url = getPlaylistUrl();
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, "_blank", "width=600,height=400");
  };

  const handleShareTwitter = () => {
    const url = getPlaylistUrl();
    const text = `Check out this playlist: ${playlistName}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, "_blank", "width=600,height=400");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={cn("flex items-center gap-2 min-h-[44px]", className)}
          aria-label="Share playlist"
        >
          {copied ? <Check className="h-5 w-5 text-green-500" /> : <Share2 className="h-5 w-5" />}
          {showLabel && <span className="text-sm font-medium">Share</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem
          onClick={handleCopyLink}
          className="cursor-pointer min-h-[44px] text-base"
        >
          <Link2 className="mr-2 h-5 w-5" />
          <span>Copy link</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleShareFacebook}
          className="cursor-pointer min-h-[44px] text-base"
        >
          <Facebook className="mr-2 h-5 w-5" />
          <span>Share on Facebook</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleShareTwitter}
          className="cursor-pointer min-h-[44px] text-base"
        >
          <Twitter className="mr-2 h-5 w-5" />
          <span>Share on Twitter</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
