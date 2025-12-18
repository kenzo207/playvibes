import * as React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'primary' | 'accent' | 'outline'
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
    ({ className, variant = 'default', ...props }, ref) => {
        const variants = {
            default: 'bg-white/10 text-white/80',
            primary: 'bg-primary-600/20 text-primary-400 border border-primary-600/30',
            accent: 'bg-accent-500/20 text-accent-400 border border-accent-500/30',
            outline: 'border border-white/20 text-white/80',
        }

        return (
            <div
                ref={ref}
                className={cn(
                    'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors',
                    variants[variant],
                    className
                )}
                {...props}
            />
        )
    }
)

Badge.displayName = 'Badge'

export { Badge }
