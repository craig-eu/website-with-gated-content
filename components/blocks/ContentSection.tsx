import { TinaMarkdown } from 'tinacms/dist/rich-text';

interface ContentSectionProps {
    body: any;
}

export default function ContentSection({ body }: ContentSectionProps) {
    return (
        <section className="py-12 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="prose prose-lg prose-indigo mx-auto">
                    <TinaMarkdown content={body} />
                </div>
            </div>
        </section>
    );
}
