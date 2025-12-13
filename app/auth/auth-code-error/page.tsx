'use client'

import PageLayout from '@/components/page-layout'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function ErrorContent() {
    const searchParams = useSearchParams()
    const error = searchParams.get('error')
    const code = searchParams.get('code')

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
            <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg border border-slate-100 text-center">
                <div>
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">
                        Authentication Error
                    </h2>
                    <p className="mt-2 text-sm text-slate-600">
                        {code ? `Error Code: ${code}` : 'There was a problem signing you in.'}
                    </p>
                    {error && (
                        <p className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                            {error}
                        </p>
                    )}
                </div>
                <div className="mt-6">
                    <Link
                        href="/auth"
                        className="group relative flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Return to Sign In
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default function AuthCodeError() {
    return (
        <PageLayout>
            <Suspense fallback={<div>Loading...</div>}>
                <ErrorContent />
            </Suspense>
        </PageLayout>
    )
}
