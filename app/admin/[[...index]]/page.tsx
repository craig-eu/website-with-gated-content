'use client';

import config from '@/tina/config';
import { TinaAdmin } from 'tinacms';

export default function AdminPage() {
    return <TinaAdmin config={config} />;
}
