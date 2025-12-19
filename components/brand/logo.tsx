export default function Logo({ className = "w-8 h-8", withText = true }: { className?: string, withText?: boolean }) {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <svg
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
            >
                <path
                    d="M20 50C20 33.4315 33.4315 20 50 20C66.5685 20 80 33.4315 80 50"
                    stroke="url(#paint0_linear)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    className="animate-pulse-slow"
                />
                <path
                    d="M35 50C35 41.7157 41.7157 35 50 35C58.2843 35 65 41.7157 65 50"
                    stroke="url(#paint1_linear)"
                    strokeWidth="8"
                    strokeLinecap="round"
                />
                <path
                    d="M50 50L50 80"
                    stroke="url(#paint2_linear)"
                    strokeWidth="12"
                    strokeLinecap="round"
                />
                <circle cx="50" cy="50" r="10" fill="url(#paint3_linear)" />
                <defs>
                    <linearGradient id="paint0_linear" x1="20" y1="50" x2="80" y2="50" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#06b6d4" />
                        <stop offset="1" stopColor="#8b5cf6" />
                    </linearGradient>
                    <linearGradient id="paint1_linear" x1="35" y1="50" x2="65" y2="50" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#22d3ee" />
                        <stop offset="1" stopColor="#a78bfa" />
                    </linearGradient>
                    <linearGradient id="paint2_linear" x1="50" y1="50" x2="50" y2="80" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#8b5cf6" />
                        <stop offset="1" stopColor="#d946ef" />
                    </linearGradient>
                    <linearGradient id="paint3_linear" x1="40" y1="50" x2="60" y2="50" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#ffffff" />
                        <stop offset="1" stopColor="#e2e8f0" />
                    </linearGradient>
                </defs>
            </svg>
            {withText && (
                <span className="text-xl font-display font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                    PlayVibes
                </span>
            )}
        </div>
    )
}
