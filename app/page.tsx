import client from '@/tina/__generated__/client';
import ClientPage from './client-page';

export default async function Home() {
    const variables = { relativePath: 'home.mdx' };

    // Fetch the home page content from Tina
    const { data, query, variables: vars } = await client.queries.page(variables);

    return <ClientPage data={data} query={query} variables={vars} />;
}
