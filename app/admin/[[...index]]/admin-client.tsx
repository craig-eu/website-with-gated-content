'use client';

import { TinaAdmin } from 'tinacms';
import config from '@/tina/config';

export default function AdminClient() {
    return <TinaAdmin config={config} />;
}
