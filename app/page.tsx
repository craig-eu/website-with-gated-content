import client from '@/tina/__generated__/client';
import { Hero, Features, CTABanner, ContentSection } from '@/components/blocks';
import PageLayout from '@/components/page-layout';

// Block renderer component mapping - keys match Tina's __typename format
const components = {
    PageBlocksHero: Hero,
    PageBlocksFeatures: Features,
    PageBlocksCtaBanner: CTABanner,
    PageBlocksContent: ContentSection,
};

export default async function Home() {
    // Fetch the home page content from Tina
    const { data } = await client.queries.page({
        relativePath: 'home.mdx',
    });

    const page = data.page;

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
