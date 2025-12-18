'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Music2, Sparkles, Users, Heart, TrendingUp, Zap } from 'lucide-react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function HomePage() {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === 'authenticated') {
            router.push('/dashboard')
        }
    }, [status, router])

    return (
        <div className="relative">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-primary-600/20 rounded-full blur-3xl animate-pulse-slow" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-primary opacity-10 rounded-full blur-3xl animate-float" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="animate-fade-in">
                        <div className="inline-flex items-center space-x-2 glass px-4 py-2 rounded-full mb-8">
                            <Sparkles className="w-4 h-4 text-primary-400" />
                            <span className="text-sm text-white/80">Découvrez la musique autrement</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 animate-slide-up">
                            Partagez vos{' '}
                            <span className="gradient-text">vibes musicales</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-white/60 mb-12 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            Découvrez, partagez et sauvegardez les meilleures playlists Spotify.
                            Connectez-vous avec une communauté passionnée de musique.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={() => signIn('spotify')}
                                className="group"
                            >
                                <Music2 className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                                Connect with Spotify
                            </Button>
                            <Button
                                variant="secondary"
                                size="lg"
                                onClick={() => router.push('/browse')}
                            >
                                Explorer les playlists
                            </Button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto">
                        {[
                            { icon: Users, label: 'Créateurs', value: '10K+' },
                            { icon: Music2, label: 'Playlists', value: '50K+' },
                            { icon: Heart, label: 'Likes', value: '500K+' },
                        ].map((stat, i) => (
                            <div key={i} className="text-center animate-scale-in" style={{ animationDelay: `${0.3 + i * 0.1}s` }}>
                                <stat.icon className="w-8 h-8 mx-auto mb-2 text-primary-400" />
                                <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                                <div className="text-sm text-white/60">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
                            Pourquoi <span className="gradient-text">PlayVibes</span> ?
                        </h2>
                        <p className="text-xl text-white/60 max-w-2xl mx-auto">
                            Une plateforme pensée pour les passionnés de musique
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Sparkles,
                                title: 'Découverte Infinie',
                                description: 'Explorez des milliers de playlists créées par une communauté passionnée de musique.',
                            },
                            {
                                icon: Zap,
                                title: 'Synchronisation Spotify',
                                description: 'Sauvegardez instantanément vos playlists préférées directement dans votre compte Spotify.',
                            },
                            {
                                icon: TrendingUp,
                                title: 'Partagez vos Vibes',
                                description: 'Publiez vos playlists et inspirez des milliers d\'auditeurs à travers le monde.',
                            },
                        ].map((feature, i) => (
                            <Card key={i} className="group hover:scale-105 transition-transform duration-300">
                                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform">
                                    <feature.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-display font-bold mb-2">{feature.title}</h3>
                                <p className="text-white/60">{feature.description}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <Card className="text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-primary opacity-10" />
                        <div className="relative z-10 py-12">
                            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                                Prêt à partager vos vibes ?
                            </h2>
                            <p className="text-lg text-white/60 mb-8 max-w-2xl mx-auto">
                                Rejoignez la communauté PlayVibes et commencez à découvrir de nouvelles playlists dès maintenant.
                            </p>
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={() => signIn('spotify')}
                            >
                                <Music2 className="w-5 h-5 mr-2" />
                                Commencer gratuitement
                            </Button>
                        </div>
                    </Card>
                </div>
            </section>
        </div>
    )
}
