import Navbar from "@/components/navbar";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export const metadata = {
    metadataBase: new URL(defaultUrl),
    title: "BasketFi",
    description: "Create your own Token Basket.",
    openGraph: {
        title: "BasketFi",
        description: "Create your own Token Basket.",
        url: defaultUrl,
        siteName: "BasketFi",
        images: [
            {
                url: `${defaultUrl}/opengraph-image.png`, // Replace with your OG image URL
                width: 1200,
                height: 630,
                alt: "BasketFi Preview",
            },
        ],
        locale: "en_US",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="en"
            className={GeistSans.className}
            suppressHydrationWarning
        >
            <body className="bg-background text-foreground">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    disableTransitionOnChange
                >
                    <main className="min-h-screen flex flex-col">
                        <div className="flex-1 w-full flex flex-col">
                            <Navbar />
                            <div className="flex flex-col gap-20 max-w-5xl p-5 mx-auto">
                                {children}
                            </div>
                            <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
                                <p>Made with hopes and dreams</p>
                            </footer>
                        </div>
                    </main>
                </ThemeProvider>
            </body>
        </html>
    );
}
