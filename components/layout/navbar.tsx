'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Compass, LayoutDashboard, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSession, signIn, signOut } from 'next-auth/react'
import Logo from '@/components/brand/logo'

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
        <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 rounded-2xl glass border border-white/10 shadow-xl shadow-black/20 backdrop-blur-md transition-all duration-300">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 group">
                        <Logo className="w-10 h-10 group-hover:scale-105 transition-transform duration-300" />
                    </Link>

                    {/* Navigation */}
                    <div className="hidden md:flex items-center space-x-1 bg-white/5 rounded-full p-1 border border-white/5">
                        {navigation.map((item) => {
                            const Icon = item.icon
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        'px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center space-x-2',
                                        isActive
                                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25'
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
                            <div className="w-32 h-10 glass rounded-full animate-pulse" />
                        ) : session ? (
                            <div className="flex items-center space-x-3">
                                {session.user?.image && (
                                    <div className="relative group cursor-pointer">
                                        <div className="absolute inset-0 bg-gradient-brand rounded-full blur opacity-0 group-hover:opacity-50 transition-opacity" />
                                        <img
                                            src={session.user.image}
                                            alt={session.user.name || 'User'}
                                            className="relative w-9 h-9 rounded-full border-2 border-white/10 group-hover:border-primary-500 transition-colors"
                                        />
                                    </div>
                                )}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => signOut()}
                                    className="rounded-full hover:bg-red-500/10 hover:text-red-400"
                                >
                                    Déconnexion
                                </Button>
                            </div>
                        ) : (
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => signIn('spotify')}
                                className="rounded-full"
                            >
                                <span>Connexion</span>
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
