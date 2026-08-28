import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import SiteLayout from "@/components/SiteLayout";
import connectToDatabase from "@/lib/mongodb";
import SiteContent from "@/models/Content";
import { BASE_URL } from "@/lib/constants";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});


export async function generateMetadata(): Promise<Metadata> {
  let settings: any = {
    siteTitle: "",
    siteTemplate: "%s",
    favicon: "",
    siteDescription: "",
    siteKeywords: []
  };

  try {
    await connectToDatabase();
    const content = await SiteContent.findOne({ key: 'complete_data' });
    if (content?.data?.settings) settings = content.data.settings;
  } catch (e) {
    console.error("Failed to fetch settings for metadata", e);
  }

  return {
    metadataBase: new URL(BASE_URL),
    icons: {
      icon: settings.favicon || `${BASE_URL}/images/logo.png`,
      apple: settings.favicon || `${BASE_URL}/images/logo.png`,
    },
    title: {
      default: settings.siteTitle || "Christmas Lights Over Columbus",
      template: settings.siteTemplate || "%s | Christmas Lights Over Columbus",
    },
    description: settings.siteDescription || "Professional Christmas & Holiday Light Installation in Columbus, OH.",
    keywords: settings.siteKeywords || ["Christmas Lights Over Columbus", "Holiday Lighting Columbus OH", "Christmas light installation Columbus"],
    authors: [{ name: "Christmas Lights Over Columbus", url: BASE_URL }],
    creator: "Christmas Lights Over Columbus",
    publisher: "Christmas Lights Over Columbus",

    // ── Robots & Canonical ──
    robots: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
    alternates: {
      canonical: BASE_URL,
    },

    // ── Open Graph (Facebook, LinkedIn) ──
    openGraph: {
      type: "website",
      locale: "en_US",
      url: BASE_URL,
      siteName: "Christmas Lights Over Columbus",
      title: settings.siteTitle || "Christmas Lights Over Columbus",
      description: settings.siteDescription || "Professional Christmas & Holiday Light Installation in Columbus, OH.",
      images: [
        {
          url: settings.favicon || `${BASE_URL}/images/logo.png`,
          width: 1200,
          height: 630,
          alt: "Christmas Lights Over Columbus",
          type: "image/png",
        },
      ],
    },

    // ── Twitter Cards ──
    twitter: {
      card: "summary_large_image",
      title: settings.siteTitle || "Christmas Lights Over Columbus",
      description: settings.siteDescription || "Professional Christmas & Holiday Light Installation in Columbus, OH.",
      images: [settings.favicon || `${BASE_URL}/images/logo.png`],
      creator: "@LightsOverColumbus",
      site: "@LightsOverColumbus",
    },

    other: {
      "format-detection": "telephone=no",
    },
  };
}

import { ContentProvider } from "@/context/ContentContext";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // ── Fetch CMS-managed tracking scripts from MongoDB ──
  interface SiteScript { id: string; name: string; location: string; code: string; active: boolean; }
  let siteScripts: SiteScript[] = [];
  try {
    await connectToDatabase();
    const doc = await SiteContent.findOne({ key: 'site_scripts_v2' });
    if (Array.isArray(doc?.data)) siteScripts = doc.data;
  } catch (e) {
    // Non-fatal — site renders fine without CMS scripts
  }
  const activeScripts = siteScripts.filter((s) => s.active);
  const headScripts = activeScripts.filter((s) => s.location === 'head');
  const bodyStartScripts = activeScripts.filter((s) => s.location === 'body_start');
  const bodyEndScripts = activeScripts.filter((s) => s.location === 'body_end');

  // ── Fetch Global Content & Blogs for the Provider ──
  let initialGlobalData = null;
  let initialBlogs = [];
  try {
    const [globalContent, blogPosts] = await Promise.all([
      SiteContent.findOne({ key: 'complete_data' }),
      import('@/models/Post').then(m => m.default.find({ status: 'published', isTrashed: { $ne: true } }).sort({ date: -1 }).limit(10).lean())
    ]);

    if (globalContent?.data) initialGlobalData = globalContent.data;
    if (blogPosts) initialBlogs = JSON.parse(JSON.stringify(blogPosts));
  } catch (e) {
    console.error("Failed to fetch initial data for provider", e);
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Site-wide schemas removed - handled dynamically by pages/services */}
        {/* Preconnect to external origins for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        {/* ── CMS-managed <head> scripts ── */}
        {headScripts.map((s) => (
          <script
            key={s.id}
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: s.code.replace(/<script[^>]*>|<\/script>/gi, '').trim() }}
          />
        ))}
      </head>
      <body className={`${spaceGrotesk.variable} ${dmSans.variable} antialiased`}>
        {/* ── CMS-managed body_start scripts ── */}
        {bodyStartScripts.map((s) => (
          <div key={s.id} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: s.code }} />
        ))}
        <ContentProvider initialData={initialGlobalData} initialBlogs={initialBlogs}>
          <Providers>
            <div className="relative min-h-screen flex flex-col">
              {/* Common background grid for all pages */}
              <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `
                      linear-gradient(to right, #2563eb 1px, transparent 1px),
                      linear-gradient(to bottom, #2563eb 1px, transparent 1px)
                    `,
                    backgroundSize: '80px 80px',
                  }}
                />
              </div>

              <SiteLayout>{children}</SiteLayout>
            </div>
          </Providers>
        </ContentProvider>

        {/* ── CMS-managed body_end scripts ── */}
        {bodyEndScripts.map((s) => (
          <div key={s.id} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: s.code }} />
        ))}
      </body>
    </html>
  );
}
