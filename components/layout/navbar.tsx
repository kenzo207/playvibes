'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Music2, Compass, LayoutDashboard, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSession, signIn, signOut } from 'next-auth/react'

export function Navbar() {
    const pathname = usePathname()
    const { data: session, status } = useSession()

    const navigation = [
        { name: 'Découvrir', href: '/browse', icon: Compass },
        ...(session ? [
            { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        ] : []),
    ]

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 group">
                        <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Music2 className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-display font-bold gradient-text">
                            PlayVibes
                        </span>
                    </Link>

                    {/* Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navigation.map((item) => {
                            const Icon = item.icon
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        'px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2',
                                        isActive
                                            ? 'bg-white/10 text-white'
                                            : 'text-white/60 hover:text-white hover:bg-white/5'
                                    )}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{item.name}</span>
                                </Link>
                            )
                        })}
                    </div>

                    {/* Auth Button */}
                    <div>
                        {status === 'loading' ? (
                            <div className="w-32 h-10 glass rounded-xl animate-pulse" />
                        ) : session ? (
                            <div className="flex items-center space-x-3">
                                {session.user?.image && (
                                    <img
                                        src={session.user.image}
                                        alt={session.user.name || 'User'}
                                        className="w-9 h-9 rounded-full border-2 border-primary-600"
                                    />
                                )}
                                {session.user?.name && (
                                    <div className="hidden md:block text-right mr-2">
                                        <div className="text-sm font-medium text-white">
                                            {session.user.name}
                                        </div>
                                        <div className="text-xs text-white/60">Connecté</div>
                                    </div>
                                )}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => signOut()}
                                >
                                    Déconnexion
                                </Button>
                            </div>
                        ) : (
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => signIn('spotify')}
                            >
                                <Music2 className="w-4 h-4 mr-2" />
                                Connect with Spotify
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

function cn(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}
