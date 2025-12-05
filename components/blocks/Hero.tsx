import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
    headline: string;
    subheadline?: string;
    primaryButton?: {
        text?: string;
        url?: string;
    };
    secondaryButton?: {
        text?: string;
        url?: string;
    };
    backgroundImage?: string;
}

export default function Hero({
    headline,
    subheadline,
    primaryButton,
    secondaryButton,
    backgroundImage,
}: HeroProps) {
    return (
        <section className="relative bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                    <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                        <div className="sm:text-center lg:text-left">
                            <h1 className="text-4xl tracking-tight font-extrabold text-slate-900 sm:text-5xl md:text-6xl">
                                <span className="block xl:inline">{headline}</span>
                            </h1>
                            {subheadline && (
                                <p className="mt-3 text-base text-slate-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                    {subheadline}
                                </p>
                            )}
                            <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                {primaryButton?.text && primaryButton?.url && (
                                    <div className="rounded-md shadow">
                                        <Link
                                            href={primaryButton.url}
                                            className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg transition-all hover:scale-105"
                                        >
                                            {primaryButton.text}
                                        </Link>
                                    </div>
                                )}
                                {secondaryButton?.text && secondaryButton?.url && (
                                    <div className={primaryButton?.text ? "mt-3 sm:mt-0 sm:ml-3" : ""}>
                                        <Link
                                            href={secondaryButton.url}
                                            className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg transition-all"
                                        >
                                            {secondaryButton.text}
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
            {backgroundImage && (
                <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
                    <img
                        className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
                        src={backgroundImage}
                        alt="Hero background"
                    />
                </div>
            )}
        </section>
    );
}
