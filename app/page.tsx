'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Music2, Sparkles, Users, Heart, TrendingUp, Zap, ArrowRight, Play } from 'lucide-react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Image from 'next/image'

export default function HomePage() {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === 'authenticated') {
            router.push('/dashboard')
        }
    }, [status, router])

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-500/10 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent-500/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
                <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary-600/5 to-transparent blur-3xl opacity-50" />
            </div>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center max-w-4xl mx-auto space-y-8 animate-fade-in">
                    <div className="inline-flex items-center space-x-2 glass px-4 py-2 rounded-full border border-primary-500/20 shadow-lg shadow-primary-500/10 mb-4 animate-slide-up">
                        <Sparkles className="w-4 h-4 text-primary-400" />
                        <span className="text-sm font-medium text-white/90">La nouvelle ère du partage musical</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-display font-medium tracking-tight leading-tight animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        Partagez vos <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 animate-gradient-x bg-[length:200%_auto]">
                            Vibes Musicales
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        Connectez votre compte Spotify, publiez vos meilleures playlists et rejoignez une communauté de passionnés.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={() => signIn('spotify')}
                            className="group relative min-w-[200px]"
                        >
                            <span className="relative z-10 flex items-center">
                                <Music2 className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                                Connect with Spotify
                            </span>
                            <div className="absolute inset-0 bg-white/20 blur opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Button>
                        <Button
                            variant="secondary"
                            size="lg"
                            onClick={() => router.push('/browse')}
                            className="min-w-[200px] group"
                        >
                            <span className="flex items-center">
                                Explorer
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Button>
                    </div>
                </div>

                {/* Hero Stats/Visuals */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                    <Card className="glass relative overflow-hidden group hover:border-primary-500/30 transition-all">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Users className="w-24 h-24" />
                        </div>
                        <h3 className="text-4xl font-display font-bold text-white mb-1">10K+</h3>
                        <p className="text-slate-400">Créateurs actifs</p>
                    </Card>
                    <Card className="glass relative overflow-hidden group hover:border-accent-500/30 transition-all">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Music2 className="w-24 h-24" />
                        </div>
                        <h3 className="text-4xl font-display font-bold text-white mb-1">50K+</h3>
                        <p className="text-slate-400">Playlists partagées</p>
                    </Card>
                    <Card className="glass relative overflow-hidden group hover:border-primary-500/30 transition-all">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Heart className="w-24 h-24" />
                        </div>
                        <h3 className="text-4xl font-display font-bold text-white mb-1">500K+</h3>
                        <p className="text-slate-400">Likes & Favoris</p>
                    </Card>
                </div>
            </section>

            {/* Features Grid (Bento Style) */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-16">
                    L'expérience <span className="text-primary-400">Ultime</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 grid-rows-[auto_auto]">
                    {/* Large Card - Synchronization */}
                    <Card className="md:col-span-2 glass p-8 md:p-12 relative overflow-hidden group hover:shadow-cyan-500/10">
                        <div className="absolute top-1/2 right-[-10%] w-[300px] h-[300px] bg-gradient-radial from-primary-500/20 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 text-primary-400 border border-white/10 group-hover:scale-110 transition-transform duration-500">
                                <Zap className="w-8 h-8" />
                            </div>
                            <h3 className="text-3xl font-display font-bold mb-4">Synchro Instantanée</h3>
                            <p className="text-lg text-slate-300 max-w-md">
                                Vos playlists sont automatiquement synchronisées avec Spotify.
                                Sauvegardez une playlist sur PlayVibes, elle apparaît instantanément dans votre bibliothèque.
                            </p>
                        </div>
                    </Card>

                    {/* Tall Card - Discovery */}
                    <Card className="md:row-span-2 glass p-8 relative overflow-hidden group hover:shadow-accent-500/10">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-accent-900/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10 h-full flex flex-col">
                            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 text-accent-400 border border-white/10 group-hover:rotate-12 transition-transform duration-500">
                                <Sparkles className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-display font-bold mb-4">Découverte Intelligente</h3>
                            <p className="text-slate-300 mb-8 flex-1">
                                Notre algorithme met en avant les pépites musicales qui correspondent à vos goûts.
                            </p>
                            <div className="space-y-3">
                                {[1, 2, 3].map((_, i) => (
                                    <div key={i} className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 border border-white/5">
                                        <div className="w-10 h-10 rounded bg-white/10 animate-pulse" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-2 w-20 bg-white/10 rounded" />
                                            <div className="h-2 w-12 bg-white/10 rounded" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    {/* Medium Card - Community */}
                    <Card className="glass p-8 relative overflow-hidden group">
                        <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 text-white border border-white/10 group-hover:translate-x-2 transition-transform">
                            <TrendingUp className="w-7 h-7" />
                        </div>
                        <h3 className="text-2xl font-display font-bold mb-3">Top Charts</h3>
                        <p className="text-slate-300">
                            Découvrez les playlists les plus tendances de la semaine.
                        </p>
                    </Card>

                    {/* Medium Card - Share */}
                    <Card className="glass p-8 relative overflow-hidden group">
                        <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 text-green-400 border border-white/10 group-hover:scale-110 transition-transform">
                            <Play className="w-7 h-7 fill-current" />
                        </div>
                        <h3 className="text-2xl font-display font-bold mb-3">Lecteur Intégré</h3>
                        <p className="text-slate-300">
                            Écoutez des extraits directement depuis la plateforme.
                        </p>
                    </Card>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <Card className="relative overflow-hidden p-12 text-center border-primary-500/30">
                        <div className="absolute inset-0 bg-gradient-aurora opacity-10" />
                        <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary-500/20 rounded-full blur-[80px]" />
                        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-accent-500/20 rounded-full blur-[80px]" />

                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
                                Prêt à monter le volume ?
                            </h2>
                            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
                                Rejoignez PlayVibes aujourd'hui et transformez votre expérience Spotify.
                            </p>
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={() => signIn('spotify')}
                                className="min-w-[200px] shadow-2xl shadow-primary-500/20"
                            >
                                Commencer maintenant
                            </Button>
                        </div>
                    </Card>
                </div>
            </section>
        </div>
    )
}
