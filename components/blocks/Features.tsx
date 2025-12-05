import * as LucideIcons from 'lucide-react';

interface FeatureItem {
    icon: string;
    title: string;
    description: string;
}

interface FeaturesProps {
    eyebrow?: string;
    heading?: string;
    subheading?: string;
    items?: FeatureItem[];
}

export default function Features({
    eyebrow,
    heading,
    subheading,
    items = [],
}: FeaturesProps) {
    return (
        <section className="py-12 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:text-center">
                    {eyebrow && (
                        <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
                            {eyebrow}
                        </h2>
                    )}
                    {heading && (
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                            {heading}
                        </p>
                    )}
                    {subheading && (
                        <p className="mt-4 max-w-2xl text-xl text-slate-500 lg:mx-auto">
                            {subheading}
                        </p>
                    )}
                </div>

                <div className="mt-10">
                    <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
                        {items.map((item, index) => {
                            // Dynamically get the icon component from lucide-react
                            const IconComponent = (LucideIcons as any)[item.icon] || LucideIcons.HelpCircle;

                            return (
                                <div key={index} className="relative">
                                    <dt>
                                        <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                            <IconComponent className="h-6 w-6" aria-hidden="true" />
                                        </div>
                                        <p className="ml-16 text-lg leading-6 font-medium text-slate-900">
                                            {item.title}
                                        </p>
                                    </dt>
                                    <dd className="mt-2 ml-16 text-base text-slate-500">
                                        {item.description}
                                    </dd>
                                </div>
                            );
                        })}
                    </dl>
                </div>
            </div>
        </section>
    );
}
