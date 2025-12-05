import Link from 'next/link';

interface CTABannerProps {
    headline: string;
    description?: string;
    button?: {
        text: string;
        url: string;
    };
    variant?: 'primary' | 'secondary' | 'dark';
}

export default function CTABanner({
    headline,
    description,
    button,
    variant = 'primary',
}: CTABannerProps) {
    const variants = {
        primary: {
            section: 'bg-indigo-600',
            headline: 'text-white',
            description: 'text-indigo-100',
            button: 'bg-white text-indigo-600 hover:bg-indigo-50',
        },
        secondary: {
            section: 'bg-slate-100',
            headline: 'text-slate-900',
            description: 'text-slate-600',
            button: 'bg-indigo-600 text-white hover:bg-indigo-700',
        },
        dark: {
            section: 'bg-slate-900',
            headline: 'text-white',
            description: 'text-slate-300',
            button: 'bg-indigo-500 text-white hover:bg-indigo-600',
        },
    };

    const styles = variants[variant];

    return (
        <section className={`${styles.section} py-16`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className={`text-3xl font-extrabold tracking-tight sm:text-4xl ${styles.headline}`}>
                    {headline}
                </h2>
                {description && (
                    <p className={`mt-4 text-lg ${styles.description}`}>
                        {description}
                    </p>
                )}
                {button && (
                    <div className="mt-8">
                        <Link
                            href={button.url}
                            className={`inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md ${styles.button} transition-all hover:scale-105`}
                        >
                            {button.text}
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}
