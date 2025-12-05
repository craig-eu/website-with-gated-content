'use client';

import { useTina } from 'tinacms/dist/react';
import { Hero, Features, CTABanner, ContentSection, UserInfo } from '@/components/blocks';
import PageLayout from '@/components/page-layout';

// Block renderer component mapping
const components = {
    PageBlocksHero: Hero,
    PageBlocksFeatures: Features,
    PageBlocksCtaBanner: CTABanner,
    PageBlocksContent: ContentSection,
    PageBlocksUserInfo: UserInfo,
};

interface ClientPageProps {
    query: string;
    variables: {
        relativePath: string;
    };
    data: any;
}

export default function ClientPage({ query, variables, data }: ClientPageProps) {
    // Use Tina's hook to get live-editable data
    const { data: liveData } = useTina({
        query,
        variables,
        data,
    });

    const page = liveData.page;

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
