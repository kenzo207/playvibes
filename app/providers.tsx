'use client'

import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'sonner'
import '@/app/globals.css' // Import globals to ensure styles are applied if needed

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            {children}
            <Toaster position="bottom-right" theme="dark" richColors closeButton />
        </SessionProvider>
    )
}
