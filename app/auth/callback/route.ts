import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const type = searchParams.get('type')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    try {
      const supabase = await createClient()
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (!error) {
        const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
        const forwardedProto = request.headers.get('x-forwarded-proto') || 'https'

        // Handle password recovery flow
        let redirectUrl = next
        if (type === 'recovery') {
          redirectUrl = '/update-password'
        } else if (next === '/admin') {
          // If returning to TinaCMS, redirect to dashboard page within TinaCMS
          redirectUrl = '/admin#/~/dashboard'
        }

        if (forwardedHost) {
          return NextResponse.redirect(`${forwardedProto}://${forwardedHost}${redirectUrl}`)
        } else {
          return NextResponse.redirect(`${origin}${redirectUrl}`)
        }
      }
    } catch (err) {
      console.error('Auth Callback Error:', err)
      // Fall through to error redirect
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
