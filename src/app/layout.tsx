import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { personalDetails } from "@/lib/portfolio-data";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://subhasish-portfolio.vercel.app"),
  title: `${personalDetails.name} | AI Engineer & Full-Stack Developer`,
  description: personalDetails.summary,
  keywords: [
    "Subhasish Kumar Sahu", "AI Engineer", "Full Stack Developer",
    "Portfolio", "FastAPI", "React", "Machine Learning", "RAG",
    "Reinforcement Learning", "Python",
  ],
  authors: [{ name: personalDetails.name, url: personalDetails.githubUrl }],
  creator: personalDetails.name,
  category: "technology",
  applicationName: "Subhasish Portfolio",
  alternates: { canonical: "/" },
  openGraph: {
    title: `${personalDetails.name} | AI Engineer & Full-Stack Developer`,
    description: personalDetails.summary,
    url: "/",
    siteName: "Subhasish Portfolio",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${personalDetails.name} | AI Engineer & Full-Stack Developer`,
    description: personalDetails.summary,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffe3" },
    { media: "(prefers-color-scheme: dark)",  color: "#030712" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[var(--background)] font-[family:var(--font-body)] text-[var(--foreground)] antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {/* max-w contains content; overflow-x clip is on html/body in globals.css */}
          <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}