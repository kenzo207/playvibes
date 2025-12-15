"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/auth/auth-guard";
import { signInWithSpotify, useSession } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  // Redirect to /browse if user is already logged in
  useEffect(() => {
    if (session?.user) {
      router.push("/browse");
    }
  }, [session, isPending, router]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-3xl space-y-8 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
            Share your vibe with the world.
          </h1>

          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Connect your Spotify, curate your best playlists, and discover new music from the
            community. Simple, social, music.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <AuthGuard fallback={<SignInButton />}>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="h-12 px-8 text-base font-medium">
                  <a href="/browse">Start Browsing</a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-12 px-8 text-base font-medium"
                >
                  <a href="/manage">Manage Playlists</a>
                </Button>
              </div>
            </AuthGuard>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-24 max-w-5xl w-full px-4">
          <FeatureItem
            title="Connect"
            description="Link your Spotify account securely. We only access what's necessary."
          />
          <FeatureItem
            title="Curate"
            description="Select and share your favorite playlists on your public profile."
          />
          <FeatureItem
            title="Discover"
            description="Explore what others are listening to and find your next favorite jam."
          />
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        <p>© {new Date().getFullYear()} PlayVibes. Built for music lovers.</p>
      </footer>
    </div>
  );
}

function FeatureItem({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center space-y-3">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

function SignInButton() {
  const handleSignIn = async () => {
    try {
      await signInWithSpotify();
    } catch (error) {
      console.error("Error signing in:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      alert(`Error signing in: ${errorMessage}`);
    }
  };

  return (
    <Button
      onClick={handleSignIn}
      size="lg"
      className="h-12 px-8 text-base font-medium bg-[#1DB954] hover:bg-[#1ed760] text-white"
    >
      <svg className="w-5 h-5 mr-2.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
      </svg>
      Sign in with Spotify
    </Button>
  );
}
