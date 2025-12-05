'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Unlock } from 'lucide-react';
import type { Session } from '@supabase/supabase-js';

interface UserInfoProps {
    heading?: string;
    subheading?: string;
}

export default function UserInfo({ heading, subheading }: UserInfoProps) {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, [supabase]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!session) {
        return null; // Should be handled by page auth check, but good as backup
    }

    return (
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
                        {heading || 'Premium Content Unlocked'}
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-indigo-700">
                        {subheading || 'Exclusive resources for registered users.'}
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
    );
}
