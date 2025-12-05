'use client';

import dynamic from 'next/dynamic';

const TinaAdmin = dynamic(() => import('./admin-client'), { ssr: false });

export default function AdminPage() {
    return <TinaAdmin />;
}
