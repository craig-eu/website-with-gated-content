import { redirect } from 'next/navigation';
import client from '@/tina/__generated__/client';
import ClientPage from './client-page';
import { createClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Redirect to auth if not logged in
    if (!user) {
        redirect('/auth');
    }

    const variables = { relativePath: 'dashboard.mdx' };

    // Fetch the dashboard page content from Tina
    const { data, query, variables: vars } = await client.queries.page(variables);

    return <ClientPage data={data} query={query} variables={vars} />;
}
