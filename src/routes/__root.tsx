import {
  Outlet,
  Link,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { FloatingNav } from "@/components/nav/FloatingNav";
import { CustomCursor } from "@/components/effects/CustomCursor";
import { AmbientOrbs } from "@/components/effects/AmbientOrbs";
import { ScrollRail } from "@/components/effects/ScrollRail";
import { CommandPalette } from "@/components/effects/CommandPalette";
import { EasterEggTerminal } from "@/components/effects/EasterEggTerminal";
import { PageTransition } from "@/components/effects/PageTransition";

function NotFoundComponent() {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <AmbientOrbs />
      <div className="glass max-w-md rounded-3xl px-10 py-12 text-center">
        <h1 className="font-display text-7xl font-bold tracking-tighter text-gradient-rim">
          404
        </h1>
        <h2 className="mt-4 font-display text-xl font-semibold uppercase tracking-[0.2em] text-foreground/90">
          Signal lost
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          This coordinate doesn't exist in the system.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-full border border-[oklch(0.88_0.18_200/0.4)] bg-[oklch(0.88_0.18_200/0.1)] px-5 py-2 text-xs font-medium uppercase tracking-[0.2em] text-foreground transition-all hover:bg-[oklch(0.88_0.18_200/0.2)]"
        >
          Return home
        </Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Subhasish — Full-Stack AI Engineer" },
      {
        name: "description",
        content:
          "Subhasish — Data Science at Masai School. Full-Stack AI Engineer building intelligent systems with Next.js, AWS, and RAG pipelines.",
      },
      { name: "author", content: "Subhasish" },
      { property: "og:title", content: "Subhasish — Full-Stack AI Engineer" },
      {
        property: "og:description",
        content:
          "Building intelligent systems for a smarter world. Data Science · ML · RAG · AWS · Next.js.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&family=Cormorant+Garamond:ital,wght@1,300;1,400;0,500&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground antialiased">
      <AmbientOrbs />
      <CustomCursor />
      <ScrollRail />
      <CommandPalette />
      <EasterEggTerminal />
      <PageTransition />
      <main className="relative z-10">
        <Outlet />
      </main>
      <FloatingNav />
    </div>
  );
}
