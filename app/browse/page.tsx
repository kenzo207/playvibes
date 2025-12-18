'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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
            <div className="min-h-screen flex items-center justify-center">
                <div className="spinner w-12 h-12" />
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <div className="mb-12">
                <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                    Découvrez les <span className="gradient-text">meilleures playlists</span>
                </h1>
                <p className="text-xl text-white/60 mb-8">
                    Explorez des milliers de playlists créées par la communauté
                </p>

                {/* Search */}
                <div className="relative max-w-2xl">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <Input
                        type="text"
                        placeholder="Rechercher une playlist, un artiste, un genre..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12"
                    />
                </div>
            </div>

            {/* Results Count */}
            <div className="mb-6">
                <p className="text-white/60">
                    {filteredPlaylists.length} playlist{filteredPlaylists.length > 1 ? 's' : ''} trouvée{filteredPlaylists.length > 1 ? 's' : ''}
                </p>
            </div>

            {/* Playlists Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPlaylists.map((playlist) => (
                    <Link key={playlist.id} href={`/playlist/${playlist.id}`}>
                        <Card className="playlist-card h-full">
                            <div className="relative aspect-square mb-4 overflow-hidden rounded-xl">
                                {playlist.image_url ? (
                                    <Image
                                        src={playlist.image_url}
                                        alt={playlist.name}
                                        fill
                                        className="playlist-card-image object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-primary flex items-center justify-center">
                                        <Music2 className="w-16 h-16 text-white/50" />
                                    </div>
                                )}
                            </div>

                            <h3 className="font-display font-bold text-lg mb-2 line-clamp-1">
                                {playlist.name}
                            </h3>

                            {playlist.description && (
                                <p className="text-sm text-white/60 mb-3 line-clamp-2">
                                    {playlist.description}
                                </p>
                            )}

                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center space-x-2">
                                    {playlist.user_image_url ? (
                                        <img
                                            src={playlist.user_image_url}
                                            alt={playlist.user_display_name}
                                            className="w-6 h-6 rounded-full"
                                        />
                                    ) : (
                                        <div className="w-6 h-6 rounded-full bg-gradient-primary" />
                                    )}
                                    <span className="text-white/60 line-clamp-1">
                                        {playlist.user_display_name}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                                <span className="text-xs text-white/40">
                                    {playlist.track_count} tracks
                                </span>
                                <div className="flex items-center space-x-1 text-white/40">
                                    <Heart className="w-4 h-4" />
                                    <span className="text-xs">{playlist.likes_count}</span>
                                </div>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>

            {filteredPlaylists.length === 0 && (
                <div className="text-center py-20">
                    <Music2 className="w-16 h-16 mx-auto mb-4 text-white/20" />
                    <h3 className="text-xl font-bold mb-2">Aucune playlist trouvée</h3>
                    <p className="text-white/60">
                        {searchQuery
                            ? 'Essayez avec d\'autres mots-clés'
                            : 'Soyez le premier à publier une playlist !'}
                    </p>
                </div>
            )}
        </div>
    )
}
