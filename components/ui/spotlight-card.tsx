'use client'

import React, { useRef, useState } from 'react'
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'
import { cn } from '@/lib/utils'

export const SpotlightCard = ({
    children,
    className = '',
    spotlightColor = 'rgba(6, 182, 212, 0.15)', // Electric Cyan default
}: {
    children: React.ReactNode
    className?: string
    spotlightColor?: string
}) => {
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect()
        mouseX.set(clientX - left)
        mouseY.set(clientY - top)
    }

    return (
        <div
            className={cn(
                'group relative border border-white/5 bg-dark-900/40 overflow-hidden rounded-2xl',
                className
            )}
            onMouseMove={onMouseMove}
        >
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              ${spotlightColor},
              transparent 80%
            )
          `,
                }}
            />

            <div className="relative h-full">{children}</div>
        </div>
    )
}
