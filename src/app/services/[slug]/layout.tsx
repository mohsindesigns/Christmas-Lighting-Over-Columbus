import type { Metadata } from "next";
import connectToDatabase from "@/lib/mongodb";
import SiteContent from "@/models/Content";
import { BASE_URL } from "@/lib/constants";

// ─────────────────────────────────────────────
// Per-page SEO map for Holiday Lighting Services
// ─────────────────────────────────────────────
const seoMap: Record<
  string,
  {
    title: string;
    description: string;
    keywords: string[];
    faqJsonLd: object;
    serviceJsonLd: object;
  }
> = {
  "residential-holiday-lighting": {
    title: "Residential Holiday Lighting Installation Columbus OH | Christmas Lights Over Columbus",
    description: "Professional residential Christmas light installation in Columbus, OH. Custom-fit commercial grade C9 LEDs, complete design, maintenance, takedown, and storage included. Call (614) 301-7100.",
    keywords: [
      "residential Christmas light installation Columbus OH",
      "holiday lighting installation Columbus",
      "house roofline Christmas lights",
      "professional holiday lighting installer Ohio",
      "Christmas light takedown and storage Columbus",
    ],
    serviceJsonLd: {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Residential Holiday Lighting Installation",
      provider: {
        "@type": "LocalBusiness",
        name: "Christmas Lights Over Columbus",
        telephone: "(614) 301-7100",
        url: BASE_URL,
      },
      description: "Custom residential Christmas and holiday light design, installation, maintenance, takedown, and climate-controlled storage in Columbus, OH.",
      url: `${BASE_URL}/services/residential-holiday-lighting`,
      image: `${BASE_URL}/images/logo.png`,
    },
    faqJsonLd: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "When does Christmas light installation start in Columbus?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We begin installing residential holiday lights as early as October so your home is ready to shine as soon as the season arrives. Maintenance and timers are set automatically.",
          },
        },
        {
          "@type": "Question",
          name: "Do you take down and store the Christmas lights after the holidays?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, full takedown, labeling, and climate-controlled storage are included in our complete full-service packages.",
          },
        },
      ],
    },
  },
  "commercial-holiday-lighting": {
    title: "Commercial Holiday Lighting Columbus OH | Businesses & Municipalities",
    description: "Make your business stand out this holiday season with custom commercial holiday lighting displays in Columbus, OH. Certified installers, 100% insured.",
    keywords: [
      "commercial holiday lighting Columbus OH",
      "commercial Christmas light installation",
      "business Christmas displays Columbus",
      "shopping center holiday lighting Ohio",
    ],
    serviceJsonLd: {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Commercial Holiday Lighting Installation",
      provider: {
        "@type": "LocalBusiness",
        name: "Christmas Lights Over Columbus",
        telephone: "(614) 301-7100",
        url: BASE_URL,
      },
      description: "Custom commercial holiday lighting for businesses, shopping centers, restaurants, and municipalities in Columbus, OH.",
      url: `${BASE_URL}/services/commercial-holiday-lighting`,
      image: `${BASE_URL}/images/logo.png`,
    },
    faqJsonLd: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Are your commercial lighting installers insured?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, Christmas Lights Over Columbus is fully insured and all technicians are OSHA compliant and certified for commercial exterior installations.",
          },
        },
      ],
    },
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const staticSeo = seoMap[slug];

  let title = staticSeo?.title || "Holiday Lighting Services | Christmas Lights Over Columbus";
  let description =
    staticSeo?.description ||
    "Professional holiday and Christmas lighting design, installation, maintenance, and storage in Columbus, OH.";
  let keywords = staticSeo?.keywords || [
    "Christmas light installation Columbus",
    "holiday lighting Columbus OH",
    "professional lighting installation",
  ];

  try {
    await connectToDatabase();
    const content = (await SiteContent.findOne({
      key: "complete_data",
    }).lean()) as any;
    const services = content?.data?.services?.services || [];
    const dbService = services.find((s: any) => s.slug === slug);
    if (dbService) {
      if (dbService.seo?.metaTitle) title = dbService.seo.metaTitle;
      else if (dbService.title) title = `${dbService.title} | Christmas Lights Over Columbus`;
      if (dbService.seo?.metaDescription) description = dbService.seo.metaDescription;
      else if (dbService.description) description = dbService.description;
    }
  } catch (e) {
    console.error("Failed to load service SEO metadata", e);
  }

  const pageUrl = `${BASE_URL}/services/${slug}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: "Christmas Lights Over Columbus",
      type: "website",
      images: [
        {
          url: `${BASE_URL}/images/logo.png`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${BASE_URL}/images/logo.png`],
      site: "@LightsOverColumbus",
      creator: "@LightsOverColumbus",
    },
  };
}

export default function ServiceDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

export { seoMap };
