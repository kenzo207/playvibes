import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
import { AuthProvider } from "@/components/auth/auth-provider";
import { PlaybackProvider } from "@/components/playback/playback-provider";
import { GlobalPlayer } from "@/components/playback/global-player";
import { ToastProvider } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/components/error-boundary";
import { GlobalErrorInitializer } from "@/components/global-error-initializer";
import { SWRProvider } from "@/components/providers/swr-provider";
import { Navbar } from "@/components/layout/navbar";

export const metadata: Metadata = {
  title: "PlayVibes - Share Your Music",
  description: "A social platform for sharing and discovering Spotify playlists",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${inter.variable} antialiased selection:bg-primary/30 relative min-h-screen overflow-x-hidden font-outfit`}
      >
        {/* Global Dynamic Background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 mesh-gradient opacity-15"></div>
          <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px]"></div>
        </div>

        {/* Skip to main content link for keyboard navigation */}
        <a href="#main-content" className="skip-to-main">
          Skip to main content
        </a>
        <GlobalErrorInitializer />
        <ErrorBoundary>
          <SWRProvider>
            <ToastProvider>
              <AuthProvider>
                <PlaybackProvider>
                  <Navbar />
                  {children}
                  <GlobalPlayer />
                </PlaybackProvider>
              </AuthProvider>
              <Toaster />
            </ToastProvider>
          </SWRProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
