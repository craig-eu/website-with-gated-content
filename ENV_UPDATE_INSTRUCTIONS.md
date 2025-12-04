# Next.js Migration - Environment Variables Update

Your environment variables need to be updated for Next.js.

## Required Changes

1. Rename your `.env` file variables from `VITE_*` to `NEXT_PUBLIC_*`:

**Old (Vite):**
```
VITE_SUPABASE_URL=your_url_here
VITE_SUPABASE_ANON_KEY=your_key_here
```

**New (Next.js):**
```
NEXT_PUBLIC_SUPABASE_URL=your_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
```

2. Create a `.env.local` file (this is the Next.js convention for local environment variables) with your Supabase credentials.

The `.env.example` file has been updated with the new variable names.
