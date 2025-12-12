"use client";

import { useSession } from "@/lib/auth/client";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  requireSpotify?: boolean;
}

export function AuthGuard({ children, fallback, requireSpotify = false }: AuthGuardProps) {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!session?.user) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Authentication Required</h2>
        <p className="text-gray-600 text-center max-w-md">
          You need to be signed in to access this feature. Please sign in to continue.
        </p>
        <SignInButton />
      </div>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (requireSpotify && !(session.user as any).spotifyId) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Spotify Connection Required</h2>
        <p className="text-gray-600 text-center max-w-md">
          This feature requires a connected Spotify account. Please connect your Spotify account to
          continue.
        </p>
        <div className="mt-4">{/* SpotifyConnectButton will be imported when needed */}</div>
      </div>
    );
  }

  return <>{children}</>;
}

function SignInButton() {
  const handleSignIn = async () => {
    try {
      const { signIn } = await import("@/lib/auth/client");
      await signIn.social({
        provider: "spotify",
        callbackURL: "/browse",
      });
    } catch (error) {
      console.error("Error signing in:", error);
      alert(`Login Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <Button onClick={handleSignIn} className="bg-[#1DB954] hover:bg-[#1ed760]">
      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
      </svg>
      Sign in with Spotify
    </Button>
  );
}
