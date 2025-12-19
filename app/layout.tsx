import './globals.css'
import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Providers } from './providers'

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
})

const spaceGrotesk = Space_Grotesk({
    subsets: ['latin'],
    variable: '--font-space-grotesk',
})

export const metadata: Metadata = {
    title: 'PlayVibes - Discover & Share Music Playlists',
    description: 'Découvrez, partagez et vibrez avec les meilleures playlists Spotify. Connectez-vous avec une communauté passionnée de musique.',
    keywords: ['music', 'playlists', 'spotify', 'discover', 'share'],
    authors: [{ name: 'PlayVibes' }],
    openGraph: {
        title: 'PlayVibes - Discover & Share Music Playlists',
        description: 'Découvrez, partagez et vibrez avec les meilleures playlists Spotify.',
        url: process.env.NEXT_PUBLIC_APP_URL,
        siteName: 'PlayVibes',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
            },
        ],
        locale: 'fr_FR',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'PlayVibes - Discover & Share Music Playlists',
        description: 'Découvrez, partagez et vibrez avec les meilleures playlists Spotify.',
        images: ['/og-image.png'],
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="fr" className="dark">
            <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
                <Providers>
                    <div className="min-h-screen flex flex-col">
                        <Navbar />
                        <main className="flex-1 pt-16">
                            {children}
                        </main>
                        <Footer />
                    </div>
                </Providers>
            </body>
        </html>
    )
}
