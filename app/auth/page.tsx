'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClient } from '@/lib/supabase/client'
import PageLayout from '@/components/page-layout'

function AuthContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [view, setView] = useState(searchParams?.get('mode') === 'signup' ? 'sign_up' : 'sign_in')
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const supabase = createClient()

    useEffect(() => {
        // Check for error parameters in the URL hash (Supabase returns errors in hash)
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const error = hashParams.get('error')
        const errorDescription = hashParams.get('error_description')

        if (error) {
            setErrorMessage(errorDescription || 'An error occurred during authentication')
        }
    }, [])

    useEffect(() => {
        let hasSeenPasswordRecovery = false

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            const isRecovery = window.location.hash.includes('type=recovery')

            // Track if we've seen PASSWORD_RECOVERY event in this session
            if (event === 'PASSWORD_RECOVERY') {
                hasSeenPasswordRecovery = true
            }

            // Check JWT for OTP amr claim (only relevant if we're in recovery context)
            let isRecoverySession = false
            if (session?.access_token && hasSeenPasswordRecovery) {
                try {
                    const base64Url = session.access_token.split('.')[1]
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
                    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
                        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                    }).join(''))
                    const payload = JSON.parse(jsonPayload)
                    // Supabase uses 'otp' method for password recovery links
                    isRecoverySession = payload.amr && payload.amr.some((m: { method: string }) => m.method === 'otp')
                } catch (e) {
                    console.error('Error parsing JWT:', e)
                }
            }

            if (event === 'PASSWORD_RECOVERY' || isRecovery || isRecoverySession) {
                router.push('/update-password')
            } else if (event === 'SIGNED_IN') {
                router.push('/dashboard')
            }
        })

        return () => subscription.unsubscribe()
    }, [router, supabase])

    const getRedirectUrl = () => {
        if (typeof window === 'undefined') return ''
        const next = searchParams?.get('next')
        const baseUrl = `${window.location.origin}/auth/callback`

        if (view === 'forgotten_password') {
            return `${baseUrl}?next=/update-password`
        }

        return next ? `${baseUrl}?next=${encodeURIComponent(next)}` : baseUrl
    }

    const getViewTitle = () => {
        switch (view) {
            case 'sign_up': return 'Create an account'
            case 'forgotten_password': return 'Reset your password'
            case 'magic_link': return 'Sign in with Magic Link'
            default: return 'Welcome back'
        }
    }

    const getViewDescription = () => {
        switch (view) {
            case 'sign_up': return 'Sign up to access exclusive content'
            case 'forgotten_password': return 'Enter your email to receive a reset link'
            case 'magic_link': return 'We\'ll send you a link to sign in'
            default: return 'Sign in to your account'
        }
    }

    return (
        <PageLayout>
            <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
                <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg border border-slate-100">
                    {errorMessage && (
                        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                            <div className="flex">
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">
                                        {errorMessage}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900">
                            {getViewTitle()}
                        </h2>
                        <p className="mt-2 text-center text-sm text-slate-600">
                            {getViewDescription()}
                        </p>
                    </div>
                    <Auth
                        supabaseClient={supabase as any}
                        view={view as any}
                        appearance={{
                            theme: ThemeSupa,
                            variables: {
                                default: {
                                    colors: {
                                        brand: '#4f46e5',
                                        brandAccent: '#4338ca',
                                    }
                                }
                            }
                        }}
                        providers={['google', 'github']}
                        magicLink={true}
                        showLinks={false}
                        redirectTo={getRedirectUrl()}
                    />

                    <div className="space-y-4 text-center text-sm mt-8">
                        {view === 'sign_in' && (
                            <div className="space-y-2">
                                <button
                                    onClick={() => setView('magic_link')}
                                    className="block w-full text-indigo-600 hover:text-indigo-500 hover:underline transition-colors duration-200"
                                >
                                    Sign in with Magic Link
                                </button>
                                <button
                                    onClick={() => setView('forgotten_password')}
                                    className="block w-full text-indigo-600 hover:text-indigo-500 hover:underline transition-colors duration-200"
                                >
                                    Forgot your password?
                                </button>
                                <div className="text-slate-600 pt-2 border-t border-slate-100">
                                    Don't have an account?{' '}
                                    <button
                                        onClick={() => setView('sign_up')}
                                        className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline transition-colors duration-200"
                                    >
                                        Sign up
                                    </button>
                                </div>
                            </div>
                        )}

                        {view === 'magic_link' && (
                            <div className="space-y-2">
                                <button
                                    onClick={() => setView('sign_in')}
                                    className="block w-full text-indigo-600 hover:text-indigo-500 hover:underline transition-colors duration-200"
                                >
                                    Sign in with Password
                                </button>
                                <div className="text-slate-600 pt-2 border-t border-slate-100">
                                    Don't have an account?{' '}
                                    <button
                                        onClick={() => setView('sign_up')}
                                        className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline transition-colors duration-200"
                                    >
                                        Sign up
                                    </button>
                                </div>
                            </div>
                        )}

                        {view === 'sign_up' && (
                            <div className="text-slate-600">
                                Already have an account?{' '}
                                <button
                                    onClick={() => setView('sign_in')}
                                    className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline transition-colors duration-200"
                                >
                                    Sign in
                                </button>
                            </div>
                        )}

                        {view === 'forgotten_password' && (
                            <button
                                onClick={() => setView('sign_in')}
                                className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline transition-colors duration-200"
                            >
                                Back to sign in
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </PageLayout>
    )
}

export default function AuthPage() {
    return (
        <Suspense fallback={
            <PageLayout>
                <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            </PageLayout>
        }>
            <AuthContent />
        </Suspense>
    )
}
