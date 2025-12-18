'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Music2, RefreshCw, Check, X } from 'lucide-react'
import Image from 'next/image'

interface SpotifyPlaylist {
    id: string
    name: string
    description: string
    images: { url: string }[]
    tracks: { total: number }
    isPublished?: boolean
}

export default function DashboardPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([])
    const [loading, setLoading] = useState(true)
    const [syncing, setSyncing] = useState(false)

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/')
        }
    }, [status, router])

    useEffect(() => {
        if (session?.accessToken) {
            loadPlaylists()
        }
    }, [session])

    const loadPlaylists = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/playlists/spotify')
            const data = await res.json()
            setPlaylists(data.playlists || [])
        } catch (error) {
            console.error('Error loading playlists:', error)
        } finally {
            setLoading(false)
        }
    }

    const handlePublish = async (playlist: SpotifyPlaylist) => {
        try {
            await fetch('/api/playlists', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    spotify_playlist_id: playlist.id,
                    name: playlist.name,
                    description: playlist.description,
                    image_url: playlist.images?.[0]?.url || null,
                    track_count: playlist.tracks.total,
                }),
            })

            setPlaylists(prev =>
                prev.map(p => p.id === playlist.id ? { ...p, isPublished: true } : p)
            )
        } catch (error) {
            console.error('Error publishing playlist:', error)
        }
    }

    const handleUnpublish = async (playlist: SpotifyPlaylist) => {
        try {
            await fetch(`/api/playlists/${playlist.id}`, {
                method: 'DELETE',
            })

            setPlaylists(prev =>
                prev.map(p => p.id === playlist.id ? { ...p, isPublished: false } : p)
            )
        } catch (error) {
            console.error('Error unpublishing playlist:', error)
        }
    }

    const handleSync = async () => {
        setSyncing(true)
        await loadPlaylists()
        setSyncing(false)
    }

    if (status === 'loading' || loading) {
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
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-4xl font-display font-bold mb-2">
                            Mon <span className="gradient-text">Dashboard</span>
                        </h1>
                        <p className="text-white/60">
                            Gérez vos playlists Spotify et publiez-les sur PlayVibes
                        </p>
                    </div>
                    <Button
                        variant="secondary"
                        onClick={handleSync}
                        isLoading={syncing}
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                        Synchroniser
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-8">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-3xl font-bold gradient-text mb-1">
                                {playlists.length}
                            </div>
                            <div className="text-sm text-white/60">Playlists Spotify</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-3xl font-bold gradient-text mb-1">
                                {playlists.filter(p => p.isPublished).length}
                            </div>
                            <div className="text-sm text-white/60">Publiées</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-3xl font-bold gradient-text mb-1">
                                {playlists.reduce((acc, p) => acc + p.tracks.total, 0)}
                            </div>
                            <div className="text-sm text-white/60">Tracks Total</div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Playlists Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {playlists.map((playlist) => (
                    <Card key={playlist.id} className="group">
                        <div className="relative aspect-square mb-4 overflow-hidden rounded-xl">
                            {playlist.images[0]?.url ? (
                                <Image
                                    src={playlist.images[0].url}
                                    alt={playlist.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-primary flex items-center justify-center">
                                    <Music2 className="w-16 h-16 text-white/50" />
                                </div>
                            )}
                            {playlist.isPublished && (
                                <div className="absolute top-2 right-2">
                                    <Badge variant="primary">
                                        <Check className="w-3 h-3 mr-1" />
                                        Publié
                                    </Badge>
                                </div>
                            )}
                        </div>

                        <h3 className="font-display font-bold text-lg mb-2 line-clamp-1">
                            {playlist.name}
                        </h3>
                        <p className="text-sm text-white/60 mb-4 line-clamp-2">
                            {playlist.description || 'Aucune description'}
                        </p>
                        <div className="text-sm text-white/40 mb-4">
                            {playlist.tracks.total} tracks
                        </div>

                        {playlist.isPublished ? (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUnpublish(playlist)}
                                className="w-full"
                            >
                                <X className="w-4 h-4 mr-2" />
                                Retirer
                            </Button>
                        ) : (
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handlePublish(playlist)}
                                className="w-full"
                            >
                                <Check className="w-4 h-4 mr-2" />
                                Publier
                            </Button>
                        )}
                    </Card>
                ))}
            </div>

            {playlists.length === 0 && !loading && (
                <div className="text-center py-20">
                    <Music2 className="w-16 h-16 mx-auto mb-4 text-white/20" />
                    <h3 className="text-xl font-bold mb-2">Aucune playlist trouvée</h3>
                    <p className="text-white/60 mb-6">
                        Créez des playlists sur Spotify et revenez ici pour les publier
                    </p>
                    <Button variant="secondary" onClick={handleSync}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Réessayer
                    </Button>
                </div>
            )}
        </div>
    )
}
