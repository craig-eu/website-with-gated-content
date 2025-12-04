'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Lock, Unlock } from 'lucide-react'
import PageLayout from '@/components/page-layout'
import type { Session } from '@supabase/supabase-js'
import Link from 'next/link'

export default function Dashboard() {
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        setMounted(true);
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, [supabase]);

    if (!mounted) {
        return null;
    }

    if (loading) {
        return (
            <PageLayout>
                <div className="flex justify-center items-center min-h-[50vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            </PageLayout>
        )
    }

    if (!session) {
        return (
            <PageLayout>
                <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
                        <div className="flex justify-center">
                            <div className="flex-shrink-0">
                                <Lock className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-yellow-700">
                                    This content is locked. Please <Link href="/auth" className="font-medium underline hover:text-yellow-600">sign in</Link> to view.
                                </p>
                            </div>
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900">Restricted Access</h2>
                    <p className="mt-4 text-lg text-slate-500">You need to be logged in to view the dashboard content.</p>
                </div>
            </PageLayout>
        )
    }

    return (
        <PageLayout>
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="md:flex md:items-center md:justify-between mb-8">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-2xl font-bold leading-7 text-slate-900 sm:text-3xl sm:truncate">
                            Dashboard
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Welcome back, {session.user.email}
                        </p>
                    </div>
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-slate-200">
                    <div className="px-4 py-5 sm:px-6 bg-indigo-50 border-b border-indigo-100">
                        <h3 className="text-lg leading-6 font-medium text-indigo-900 flex items-center">
                            <Unlock className="h-5 w-5 mr-2" />
                            Premium Content Unlocked
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-indigo-700">
                            Exclusive resources for registered users.
                        </p>
                    </div>
                    <div className="border-t border-slate-200 px-4 py-5 sm:p-0">
                        <dl className="sm:divide-y sm:divide-slate-200">
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-slate-500">User ID</dt>
                                <dd className="mt-1 text-sm text-slate-900 sm:mt-0 sm:col-span-2">{session.user.id}</dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-slate-500">Last Sign In</dt>
                                <dd className="mt-1 text-sm text-slate-900 sm:mt-0 sm:col-span-2">{new Date(session.user.last_sign_in_at || '').toLocaleString()}</dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-slate-500">Secret Data</dt>
                                <dd className="mt-1 text-sm text-slate-900 sm:mt-0 sm:col-span-2">
                                    This is some super secret data that only you can see because you are logged in.
                                    <br />
                                    <span className="font-mono bg-slate-100 px-2 py-1 rounded mt-2 inline-block">
                                        API_KEY: xxxx-xxxx-xxxx-xxxx
                                    </span>
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </PageLayout>
    )
}
