'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LogOut } from 'lucide-react'
import type { Session } from '@supabase/supabase-js'

// Wrapper component that detects iframe context (TinaCMS visual editing) and navigates parent window
// forceBreakout: set to true for auth links that need to break out of TinaCMS
function NavLink({ href, className, children, forceBreakout = false }: {
    href: string;
    className?: string;
    children: React.ReactNode;
    forceBreakout?: boolean;
}) {
    const [isInIframe, setIsInIframe] = useState(false)

    useEffect(() => {
        // Check if we're inside an iframe (TinaCMS visual editing mode)
        setIsInIframe(window.self !== window.top)
    }, [])

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (isInIframe && forceBreakout) {
            // We're in TinaCMS iframe and need to break out for auth
            e.preventDefault()
            e.stopPropagation()
            // Use window.top to navigate the parent window out of TinaCMS
            // Append ?next=/admin#/~/dashboard so we return to dashboard in TinaCMS after login
            if (window.top) {
                const returnUrl = href.includes('?') ? `${href}&next=/admin` : `${href}?next=/admin`
                window.top.location.href = returnUrl
            }
        }
    }

    if (isInIframe && forceBreakout) {
        // Use anchor tag with onClick handler for auth links in iframe context
        return <a href={href} className={className} onClick={handleClick}>{children}</a>
    }

    // Use Next.js Link for normal navigation (better performance)
    return <Link href={href} className={className}>{children}</Link>
}

export default function Header() {
    const [session, setSession] = useState<Session | null>(null)
    const router = useRouter()
    const pathname = usePathname()
    const supabase = createClient()

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setSession(session)

            // Redirect to update-password page if this is a password recovery
            if (event === 'PASSWORD_RECOVERY') {
                router.push('/update-password')
            }
        })

        return () => subscription.unsubscribe()
    }, [router, supabase])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/')
    }

    return (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex-shrink-0 flex items-center">
                        <NavLink href="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                            DemoApp
                        </NavLink>
                    </div>
                    <nav className="flex space-x-8">
                        <NavLink href="/" className="text-slate-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                            Home
                        </NavLink>
                        {session && (
                            <NavLink href="/dashboard" className="text-slate-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Dashboard
                            </NavLink>
                        )}
                    </nav>
                    <div className="flex items-center space-x-4">
                        {session ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-slate-500 hidden sm:inline-block">
                                    {session.user.email}
                                </span>
                                <button
                                    onClick={handleSignOut}
                                    type="button"
                                    className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    <LogOut className="-ml-1 mr-2 h-5 w-5 text-slate-500" aria-hidden="true" />
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <>
                                <NavLink href="/auth" className="text-slate-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors" forceBreakout={true}>
                                    Sign In
                                </NavLink>
                                <NavLink href="/auth?mode=signup" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors shadow-sm hover:shadow-md" forceBreakout={true}>
                                    Sign Up
                                </NavLink>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}
