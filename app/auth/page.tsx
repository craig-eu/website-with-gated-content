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
    const view = searchParams?.get('mode') === 'signup' ? 'sign_up' : 'sign_in'
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
                            {view === 'sign_up' ? 'Create an account' : 'Welcome back'}
                        </h2>
                        <p className="mt-2 text-center text-sm text-slate-600">
                            {view === 'sign_up' ? 'Sign up to access exclusive content' : 'Sign in to your account'}
                        </p>
                    </div>
                    <Auth
                        supabaseClient={supabase as any}
                        view={view}
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
                        redirectTo={typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : ''}
                    />
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
