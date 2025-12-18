"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, X, Music2, LogOut, User, Compass, Library, Disc } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { href: "/browse", label: "Browse", icon: Compass },
    { href: "/manage", label: "My Vibe", icon: Disc },
    { href: "/saved", label: "Saved", icon: Library },
  ];

  return (
    <>
      <header
        className={cn(
          "fixed top-4 left-0 right-0 z-50 transition-all duration-300 mx-auto px-4",
          scrolled ? "max-w-5xl" : "max-w-7xl"
        )}
      >
        <nav
          className={cn(
            "rounded-full border transition-all duration-300 px-4 sm:px-6 h-14 flex items-center justify-between",
            "bg-background/60 dark:bg-black/20 backdrop-blur-md border-white/5 shadow-md"
          )}
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group transition-opacity hover:opacity-80"
          >
            <div className="bg-primary/20 p-2 rounded-xl group-hover:scale-110 transition-transform">
              <Music2 className="h-5 w-5 text-primary" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">PlayVibes</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {session?.user &&
              navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "relative px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 group",
                      active
                        ? "text-white bg-white/10 shadow-[0_0_15px_-5px_var(--vibe-purple)] border border-white/10"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-4 h-4 transition-colors",
                        active ? "text-vibe-purple" : "text-gray-400 group-hover:text-vibe-purple"
                      )}
                    />
                    {link.label}
                    {active && (
                      <span className="absolute inset-x-0 -bottom-[19px] h-[2px] bg-gradient-to-r from-transparent via-vibe-purple to-transparent opacity-50 blur-[1px]"></span>
                    )}
                  </Link>
                );
              })}
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-2">
            {session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full hover:bg-muted/50 transition-colors p-0"
                  >
                    <Avatar className="h-9 w-9 border-2 border-background shadow-sm">
                      <AvatarImage
                        src={session.user.image || ""}
                        alt={session.user.name || "User"}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {session.user.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 glass-card border-none mt-2"
                  align="end"
                  forceMount
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{session.user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session.user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border/50" />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer focus:bg-primary/10">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                    onClick={() => signOut()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button asChild variant="ghost" className="rounded-full hover:bg-muted/50">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild className="rounded-full shadow-md hover:shadow-lg transition-all">
                  <Link href="/register">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-foreground hover:bg-muted/50 rounded-full transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm animate-fade-in md:hidden pt-24 px-4">
          <div className="bg-card/50 border border-border/50 rounded-2xl p-4 shadow-xl glass-card animate-slide-up space-y-4">
            {session?.user && (
              <div className="space-y-2">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium",
                        active
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "hover:bg-muted/50 text-foreground"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="w-5 h-5" />
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            )}

            <div className="pt-2 border-t border-border/50">
              {session?.user ? (
                <Button
                  variant="ghost"
                  className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl px-4 py-3 h-auto"
                  onClick={() => {
                    signOut();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Log out
                </Button>
              ) : (
                <div className="grid gap-2">
                  <Button asChild variant="outline" className="w-full rounded-xl h-12">
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      Sign In
                    </Link>
                  </Button>
                  <Button asChild className="w-full rounded-xl h-12 shadow-lg">
                    <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                      Sign Up
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
