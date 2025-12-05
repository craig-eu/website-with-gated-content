import { redirect } from 'next/navigation';
import client from '@/tina/__generated__/client';
import { Hero, Features, CTABanner, ContentSection } from '@/components/blocks';
import PageLayout from '@/components/page-layout';
import { createClient } from '@/lib/supabase/server';

// Block renderer component mapping - keys match Tina's __typename format
const components = {
    PageBlocksHero: Hero,
    PageBlocksFeatures: Features,
    PageBlocksCtaBanner: CTABanner,
    PageBlocksContent: ContentSection,
};

interface PageProps {
    params: {
        slug: string;
    };
}

export default async function DynamicPage({ params }: PageProps) {
    const { slug } = params;

    // Fetch the page content from Tina
    const { data } = await client.queries.page({
        relativePath: `${slug}.mdx`,
    });

    const page = data.page;

    // Check if authentication is required
    if (page.requiresAuth) {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        // Redirect to auth if not logged in
        if (!user) {
            redirect('/auth');
        }
    }

    return (
        <PageLayout>
            <div className="flex flex-col">
                {/* Render blocks dynamically */}
                {page.blocks?.map((block: any, index: number) => {
                    const Component = components[block.__typename as keyof typeof components];
                    if (!Component) return null;

                    return <Component key={index} {...block} />;
                })}
            </div>
        </PageLayout>
    );
}

// Generate static params for all pages
export async function generateStaticParams() {
    const pagesListData = await client.queries.pageConnection();
    const pages = pagesListData.data.pageConnection.edges || [];

    return pages
        .map((page: any) => ({
            slug: page?.node?._sys.filename,
        }))
        .filter((page: any) => page.slug !== 'home'); // Exclude home page since it's handled by app/page.tsx
}
