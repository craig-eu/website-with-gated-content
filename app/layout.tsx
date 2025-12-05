import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "DemoApp - Premium Content Platform",
    description: "Access exclusive resources, tutorials, and tools with secure authentication.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased" suppressHydrationWarning>
                {children}
            </body>
        </html>
    );
}
