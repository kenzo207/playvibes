'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Music2, Heart, Download, Clock, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface Track {
    name: string
    artists: { name: string }[]
    duration_ms: number
    album: { images: { url: string }[] }
}

interface Playlist {
    id: number
    spotify_playlist_id: string
    name: string
    description: string | null
    image_url: string | null
    track_count: number
    user_display_name: string
    user_image_url: string | null
    likes_count: number
    is_liked: boolean
}

export default function PlaylistDetailPage() {
    const params = useParams()
    const router = useRouter()
    const { data: session } = useSession()
    const [playlist, setPlaylist] = useState<Playlist | null>(null)
    const [tracks, setTracks] = useState<Track[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [liking, setLiking] = useState(false)

    useEffect(() => {
        loadPlaylist()
    }, [params.id])

    const loadPlaylist = async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/playlists/${params.id}`)
            const data = await res.json()
            setPlaylist(data.playlist)
            setTracks(data.tracks || [])
        } catch (error) {
            console.error('Error loading playlist:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSaveToSpotify = async () => {
        if (!session) {
            router.push('/')
            return
        }

        setSaving(true)
        try {
            await fetch(`/api/playlists/${params.id}/save`, {
                method: 'POST',
            })
            alert('Playlist sauvegardée dans Spotify !')
        } catch (error) {
            console.error('Error saving playlist:', error)
            alert('Erreur lors de la sauvegarde')
        } finally {
            setSaving(false)
        }
    }

    const handleLike = async () => {
        if (!session) {
            router.push('/')
            return
        }

        setLiking(true)
        try {
            await fetch(`/api/playlists/${params.id}/like`, {
                method: 'POST',
            })
            setPlaylist(prev => prev ? {
                ...prev,
                is_liked: !prev.is_liked,
                likes_count: prev.is_liked ? prev.likes_count - 1 : prev.likes_count + 1,
            } : null)
        } catch (error) {
            console.error('Error liking playlist:', error)
        } finally {
            setLiking(false)
        }
    }

    const formatDuration = (ms: number) => {
        const minutes = Math.floor(ms / 60000)
        const seconds = Math.floor((ms % 60000) / 1000)
        return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="spinner w-12 h-12" />
            </div>
        )
    }

    if (!playlist) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Music2 className="w-16 h-16 mx-auto mb-4 text-white/20" />
                    <h2 className="text-2xl font-bold mb-2">Playlist non trouvée</h2>
                    <Button variant="primary" onClick={() => router.push('/browse')}>
                        Retour à la découverte
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <div className="grid md:grid-cols-[300px_1fr] gap-8 mb-12">
                {/* Playlist Image */}
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl shadow-primary-600/20">
                    {playlist.image_url ? (
                        <Image
                            src={playlist.image_url}
                            alt={playlist.name}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-primary flex items-center justify-center">
                            <Music2 className="w-24 h-24 text-white/50" />
                        </div>
                    )}
                </div>

                {/* Playlist Info */}
                <div className="flex flex-col justify-center">
                    <Badge variant="primary" className="w-fit mb-4">Playlist</Badge>

                    <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                        {playlist.name}
                    </h1>

                    {playlist.description && (
                        <p className="text-lg text-white/60 mb-6">
                            {playlist.description}
                        </p>
                    )}

                    <div className="flex items-center space-x-4 mb-6">
                        <Link href={`/profile/${playlist.id}`} className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                            {playlist.user_image_url ? (
                                <img
                                    src={playlist.user_image_url}
                                    alt={playlist.user_display_name}
                                    className="w-8 h-8 rounded-full"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-gradient-primary" />
                            )}
                            <span className="font-medium">{playlist.user_display_name}</span>
                        </Link>
                        <span className="text-white/40">•</span>
                        <span className="text-white/60">{playlist.track_count} tracks</span>
                        <span className="text-white/40">•</span>
                        <div className="flex items-center space-x-1 text-white/60">
                            <Heart className="w-4 h-4" />
                            <span>{playlist.likes_count}</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={handleSaveToSpotify}
                            isLoading={saving}
                        >
                            <Download className="w-5 h-5 mr-2" />
                            Sauvegarder dans Spotify
                        </Button>
                        <Button
                            variant={playlist.is_liked ? 'secondary' : 'outline'}
                            size="lg"
                            onClick={handleLike}
                            isLoading={liking}
                        >
                            <Heart className={`w-5 h-5 mr-2 ${playlist.is_liked ? 'fill-current' : ''}`} />
                            {playlist.is_liked ? 'Aimé' : 'Aimer'}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Tracks List */}
            <Card>
                <h2 className="text-2xl font-display font-bold mb-6">Tracks</h2>
                <div className="space-y-2">
                    {tracks.map((track, index) => (
                        <div
                            key={index}
                            className="flex items-center space-x-4 p-3 rounded-lg hover:bg-white/5 transition-colors group"
                        >
                            <div className="w-8 text-center text-white/40 group-hover:text-white/60">
                                {index + 1}
                            </div>
                            <div className="w-12 h-12 relative rounded overflow-hidden flex-shrink-0">
                                {track.album.images[0] ? (
                                    <Image
                                        src={track.album.images[0].url}
                                        alt={track.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-white/5 flex items-center justify-center">
                                        <Music2 className="w-6 h-6 text-white/20" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="font-medium truncate">{track.name}</div>
                                <div className="text-sm text-white/60 truncate">
                                    {track.artists.map(a => a.name).join(', ')}
                                </div>
                            </div>
                            <div className="text-sm text-white/40 flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>{formatDuration(track.duration_ms)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    )
}
