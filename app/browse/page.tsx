'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { SpotlightCard } from '@/components/ui/spotlight-card'
import { Search, Music2, Heart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface Playlist {
    id: number
    name: string
    description: string | null
    image_url: string | null
    track_count: number
    user_display_name: string
    user_image_url: string | null
    likes_count: number
}

export default function BrowsePage() {
    const [playlists, setPlaylists] = useState<Playlist[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        loadPlaylists()
    }, [])

    const loadPlaylists = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/playlists/public')
            const data = await res.json()
            setPlaylists(data.playlists || [])
        } catch (error) {
            console.error('Error loading playlists:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredPlaylists = playlists.filter(playlist =>
        playlist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        playlist.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        playlist.user_display_name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-12 space-y-4 text-center">
                    <Skeleton className="h-16 w-3/4 mx-auto" />
                    <Skeleton className="h-6 w-1/2 mx-auto" />
                    <Skeleton className="h-14 w-full max-w-xl mx-auto mt-8 rounded-2xl" />
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="space-y-4">
                            <Skeleton className="w-full aspect-square rounded-xl" />
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="relative min-h-screen">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-primary-900/20 rounded-full blur-[120px] pointer-events-none" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="mb-12 text-center max-w-2xl mx-auto space-y-6 animate-fade-in">
                    <h1 className="text-4xl md:text-6xl font-display font-medium mb-4">
                        Découvrez les <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">Meilleures Playlists</span>
                    </h1>
                    <p className="text-slate-400 text-lg">
                        Explorez des milliers de playlists créées par la communauté
                    </p>

                    {/* Search */}
                    <div className="relative max-w-xl mx-auto mt-8 group">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                            <Input
                                type="text"
                                placeholder="Rechercher une playlist, un artiste, un genre..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 bg-dark-900/80 border-white/10 h-14 rounded-2xl focus:ring-primary-500/50 shadow-lg shadow-black/20"
                            />
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-8 flex items-center justify-between">
                    <p className="text-slate-400 text-sm font-medium px-3 py-1 bg-white/5 rounded-full border border-white/5">
                        {filteredPlaylists.length} playlist{filteredPlaylists.length > 1 ? 's' : ''} trouvée{filteredPlaylists.length > 1 ? 's' : ''}
                    </p>
                </div>

                {/* Playlists Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    {filteredPlaylists.map((playlist) => (
                        <Link key={playlist.id} href={`/playlist/${playlist.id}`} className="block h-full relative z-0">
                            <SpotlightCard className="h-full group hover:-translate-y-1 transition-all duration-300">
                                <div className="p-4 h-full flex flex-col">
                                    <div className="relative aspect-square mb-4 overflow-hidden rounded-xl bg-dark-800 shadow-md">
                                        {playlist.image_url ? (
                                            <Image
                                                src={playlist.image_url}
                                                alt={playlist.name}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-dark-800 to-dark-700 flex items-center justify-center">
                                                <Music2 className="w-16 h-16 text-white/20" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center transform scale-50 group-hover:scale-100 transition-transform duration-300">
                                                <Music2 className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2 flex-1">
                                        <h3 className="font-display font-bold text-lg leading-tight line-clamp-1 group-hover:text-primary-400 transition-colors">
                                            {playlist.name}
                                        </h3>

                                        {playlist.description && (
                                            <p className="text-xs text-slate-500 line-clamp-2 h-8">
                                                {playlist.description}
                                            </p>
                                        )}
                                    </div>

                                    <div className="pt-2 mt-auto flex items-center justify-between border-t border-white/5">
                                        <div className="flex items-center space-x-2">
                                            {playlist.user_image_url ? (
                                                <img
                                                    src={playlist.user_image_url}
                                                    alt={playlist.user_display_name}
                                                    className="w-5 h-5 rounded-full border border-white/10"
                                                />
                                            ) : (
                                                <div className="w-5 h-5 rounded-full bg-primary-500/20 flex items-center justify-center">
                                                    <span className="text-[10px] font-bold text-primary-400">
                                                        {playlist.user_display_name.charAt(0)}
                                                    </span>
                                                </div>
                                            )}
                                            <span className="text-xs text-slate-400 line-clamp-1 max-w-[80px]">
                                                {playlist.user_display_name}
                                            </span>
                                        </div>

                                        <div className="flex items-center space-x-3 text-xs text-slate-500">
                                            <div className="flex items-center space-x-1">
                                                <Music2 className="w-3 h-3" />
                                                <span>{playlist.track_count}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SpotlightCard>
                        </Link>
                    ))}
                </div>

                {filteredPlaylists.length === 0 && (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Music2 className="w-8 h-8 text-white/20" />
                        </div>
                        <h3 className="text-xl font-display font-medium mb-2">Aucune playlist trouvée</h3>
                        <p className="text-slate-400">
                            {searchQuery
                                ? 'Essayez avec d\'autres mots-clés'
                                : 'Soyez le premier à publier une playlist !'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
