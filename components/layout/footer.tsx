import Link from 'next/link'
import { Music2, Github, Twitter } from 'lucide-react'

export function Footer() {
    return (
        <footer className="border-t border-white/10 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                                <Music2 className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-display font-bold gradient-text">
                                PlayVibes
                            </span>
                        </div>
                        <p className="text-white/60 text-sm max-w-md">
                            Découvrez, partagez et vibrez avec les meilleures playlists Spotify.
                            Connectez-vous avec une communauté passionnée de musique.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Plateforme</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/browse" className="text-white/60 hover:text-white text-sm transition-colors">
                                    Découvrir
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard" className="text-white/60 hover:text-white text-sm transition-colors">
                                    Dashboard
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Communauté</h3>
                        <div className="flex space-x-4">
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white/60 hover:text-white transition-colors"
                            >
                                <Github className="w-5 h-5" />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white/60 hover:text-white transition-colors"
                            >
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/40 text-sm">
                    <p>© {new Date().getFullYear()} PlayVibes. Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    )
}
