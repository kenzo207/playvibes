"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/auth/auth-guard";
import { signInWithSpotify, useSession } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Music, Heart, Globe } from "lucide-react";

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
    <div className="min-h-screen bg-background overflow-hidden selection:bg-primary/20">
      {/* Dynamic Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      </div>

      {/* Hero Section */}
      <main className="container-responsive pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-32 lg:pb-28">
        <div className="text-center max-w-4xl mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-8 animate-fade-in backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
            Now in Beta
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black tracking-tight mb-8 animate-slide-up">
            <span className="block text-foreground mb-2">Share Your</span>
            <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient-x bg-300%">
              Vibe With The World
            </span>
          </h1>

          <p
            className="mt-6 text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            Connect your Spotify, curate your best playlists, and let the community discover your
            musical taste.
          </p>

          <div
            className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <AuthGuard
              fallback={
                <div className="w-full sm:w-auto">
                  <SignInButton />
                  <p className="mt-4 text-sm text-muted-foreground">
                    No credit card required • Free forever
                  </p>
                </div>
              }
            >
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Button
                  asChild
                  size="lg"
                  className="h-14 px-8 text-lg rounded-full shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:scale-105"
                >
                  <a href="/browse">Start Browsing</a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-14 px-8 text-lg rounded-full border-2 hover:bg-secondary/50 transition-all duration-300"
                >
                  <a href="/manage">Manage Playlists</a>
                </Button>
              </div>
            </AuthGuard>
          </div>
        </div>

        {/* Feature Cards / How it works */}
        <div className="mt-24 sm:mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          <FeatureCard
            icon={<Music className="w-8 h-8 text-purple-500" />}
            title="Connect Spotify"
            description="Link your account securely. We only access your public playlists and basic profile info."
            delay="0.3s"
          />
          <FeatureCard
            icon={<Heart className="w-8 h-8 text-pink-500" />}
            title="Share & Curate"
            description="Select which playlists to feature on your profile. Add tags and descriptions to help others find them."
            delay="0.4s"
          />
          <FeatureCard
            icon={<Globe className="w-8 h-8 text-blue-500" />}
            title="Discover Community"
            description="Explore what others are listening to. Find hidden gems and new genres from real people."
            delay="0.5s"
          />
        </div>
      </main>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: string;
}

function FeatureCard({ icon, title, description, delay }: FeatureCardProps) {
  return (
    <div
      className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/5 animate-fade-in backdrop-blur-md"
      style={{ animationDelay: delay }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
      <div className="relative z-10">
        <div className="mb-6 inline-flex p-4 rounded-2xl bg-background/50 ring-1 ring-white/10 shadow-sm group-hover:scale-110 transition-transform duration-500">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
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
      className="h-14 px-8 text-lg rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-white shadow-lg hover:shadow-[#1DB954]/25 transition-all duration-300 hover:scale-105 w-full sm:w-auto"
    >
      <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
      </svg>
      Sign in with Spotify
    </Button>
  );
}
