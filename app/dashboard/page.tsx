'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { SpotlightCard } from '@/components/ui/spotlight-card'
import { Music2, RefreshCw, Check, X } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'

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
            toast.success("Synchronisation terminée !", {
                description: "Vos playlists Spotify sont à jour."
            })
        } catch (error) {
            console.error('Error syncing playlists:', error)
            toast.error("Échec de la synchronisation", {
                description: "Vérifiez votre connexion et réessayez."
            })
        } finally {
            setLoading(false)
        }
    }

    const handlePublish = async (playlist: SpotifyPlaylist) => {
        try {
            const res = await fetch('/api/playlists', {
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
            if (res.ok) {
                // Update local state
                setPlaylists(prev =>
                    prev.map(p =>
                        p.id === playlist.id ? { ...p, isPublished: true } : p
                    )
                )
                toast.success(`La playlist "${playlist.name}" a été publiée avec succès !`, {
                    description: "Elle est maintenant visible par toute la communauté.",
                    duration: 4000,
                })
            } else {
                toast.error("Erreur lors de la publication", {
                    description: "Veuillez réessayer plus tard."
                })
            }
        } catch (error) {
            console.error('Error publishing playlist:', error)
            toast.error("Une erreur est survenue")
        }
    }

    const handleUnpublish = async (playlist: SpotifyPlaylist) => {
        try {
            const res = await fetch(`/api/playlists/${playlist.id}`, {
                method: 'DELETE',
            })
            if (res.ok) {
                // Update local state
                setPlaylists(prev =>
                    prev.map(p =>
                        p.id === playlist.id ? { ...p, isPublished: false } : p
                    )
                )
                toast.info(`La playlist "${playlist.name}" a été retirée`, {
                    description: "Elle n'est plus visible dans la section Découvrir."
                })
            }
        } catch (error) {
            console.error('Error unpublishing playlist:', error)
            toast.error("Erreur lors du retrait de la playlist")
        }
    }

    const handleSync = async () => {
        setSyncing(true)
        await loadPlaylists()
        setSyncing(false)
    }

    if (status === 'loading' || loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-12 space-y-4">
                    <Skeleton className="h-12 w-64" />
                    <Skeleton className="h-6 w-96" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-32 rounded-2xl" />
                        ))}
                    </div>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="space-y-4">
                            <Skeleton className="h-aspect-square w-full rounded-xl aspect-square" />
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
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary-900/20 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent-900/20 rounded-full blur-[100px] pointer-events-none" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="mb-12 animate-fade-in">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-display font-medium mb-3">
                                Mon <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">Dashboard</span>
                            </h1>
                            <p className="text-slate-400 text-lg">
                                Gérez vos playlists Spotify et publiez-les sur PlayVibes
                            </p>
                        </div>
                        <Button
                            variant="secondary"
                            onClick={handleSync}
                            isLoading={syncing}
                            className="bg-white/5 border border-white/10 hover:bg-white/10 shadow-lg shadow-black/20"
                        >
                            <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                            Synchroniser Spotify
                        </Button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="glass p-6 group hover:border-primary-500/30 transition-colors">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-primary-500/10 rounded-xl text-primary-400 group-hover:scale-110 transition-transform">
                                    <Music2 className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-medium px-2 py-1 rounded-full bg-white/5 border border-white/5 text-white/60">Total</span>
                            </div>
                            <div className="text-4xl font-display font-bold text-white mb-1 group-hover:text-primary-400 transition-colors">
                                {playlists.length}
                            </div>
                            <div className="text-sm text-slate-400">Playlists Spotify</div>
                        </Card>

                        <Card className="glass p-6 group hover:border-green-500/30 transition-colors">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-green-500/10 rounded-xl text-green-400 group-hover:scale-110 transition-transform">
                                    <Check className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-medium px-2 py-1 rounded-full bg-white/5 border border-white/5 text-white/60">En ligne</span>
                            </div>
                            <div className="text-4xl font-display font-bold text-white mb-1 group-hover:text-green-400 transition-colors">
                                {playlists.filter(p => p.isPublished).length}
                            </div>
                            <div className="text-sm text-slate-400">Playlists Publiées</div>
                        </Card>

                        <Card className="glass p-6 group hover:border-accent-500/30 transition-colors">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-accent-500/10 rounded-xl text-accent-400 group-hover:scale-110 transition-transform">
                                    <Music2 className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-medium px-2 py-1 rounded-full bg-white/5 border border-white/5 text-white/60">Contenu</span>
                            </div>
                            <div className="text-4xl font-display font-bold text-white mb-1 group-hover:text-accent-400 transition-colors">
                                {playlists.reduce((acc, p) => acc + p.tracks.total, 0)}
                            </div>
                            <div className="text-sm text-slate-400">Tracks Total</div>
                        </Card>
                    </div>
                </div>

                {/* Playlists Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    {playlists.map((playlist) => (
                        <SpotlightCard key={playlist.id} className="group hover:-translate-y-1 transition-all duration-300">
                            <div className="p-6 h-full flex flex-col">
                                <div className="relative aspect-square mb-5 overflow-hidden rounded-xl bg-dark-800 shadow-md">
                                    {playlist.images?.[0]?.url ? (
                                        <Image
                                            src={playlist.images[0].url}
                                            alt={playlist.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-dark-800 to-dark-700 flex items-center justify-center">
                                            <Music2 className="w-16 h-16 text-white/20" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    {playlist.isPublished && (
                                        <div className="absolute top-3 right-3">
                                            <Badge variant="success" className="bg-green-500/20 text-green-400 border-green-500/20 backdrop-blur-md shadow-lg shadow-black/20">
                                                <Check className="w-3 h-3 mr-1" />
                                                Publié
                                            </Badge>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3 flex-1">
                                    <div>
                                        <h3 className="font-display font-bold text-xl mb-1 line-clamp-1 group-hover:text-primary-400 transition-colors">
                                            {playlist.name}
                                        </h3>
                                        <p className="text-sm text-slate-400 line-clamp-2 min-h-[2.5rem]">
                                            {playlist.description || 'Aucune description'}
                                        </p>
                                    </div>
                                    <div className="text-xs font-medium text-slate-500 flex items-center space-x-2">
                                        <span className="px-2 py-1 rounded bg-white/5 border border-white/5">
                                            {playlist.tracks.total} tracks
                                        </span>
                                    </div>
                                </div>

                                <div className="pt-4 mt-auto">
                                    {playlist.isPublished ? (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleUnpublish(playlist)}
                                            className="w-full border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/40 relative z-10"
                                        >
                                            <X className="w-4 h-4 mr-2" />
                                            Retirer
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={() => handlePublish(playlist)}
                                            className="w-full shadow-lg shadow-primary-900/20 relative z-10"
                                        >
                                            <Check className="w-4 h-4 mr-2" />
                                            Publier
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </SpotlightCard>
                    ))}
                </div>

                {playlists.length === 0 && !loading && (
                    <div className="text-center py-20 px-4">
                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-slow">
                            <Music2 className="w-10 h-10 text-white/20" />
                        </div>
                        <h3 className="text-2xl font-display font-medium mb-3">Aucune playlist trouvée</h3>
                        <p className="text-slate-400 mb-8 max-w-md mx-auto">
                            Créez des playlists sur Spotify pour qu'elles apparaissent ici.
                        </p>
                        <Button variant="secondary" onClick={handleSync}>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Réessayer
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
