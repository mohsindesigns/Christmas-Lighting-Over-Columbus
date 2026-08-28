
import { BASE_URL } from "./constants";

interface SchemaOptions {
  title: string;
  description: string;
  slug: string;
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage" | "Service";
  faqs?: Array<{ question: string; answer: string }>;
  breadcrumbTitle?: string;
  isService?: boolean;
  image?: string;
}

export function generateSchema(options: SchemaOptions) {
  const { title, description, slug = "", type = "WebPage", faqs, breadcrumbTitle, isService, image } = options;
  const safeSlug = String(slug || "");
  const normalizedSlug = safeSlug.startsWith('/') ? safeSlug : `/${safeSlug}`;
  const pageUrl = `${BASE_URL}${normalizedSlug === '/' ? '' : normalizedSlug}`;

  // 1. Organization Schema
  const organizationSchema = {
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
    "name": "Christmas Lights Over Columbus",
    "url": BASE_URL,
    "logo": {
      "@type": "ImageObject",
      "url": `${BASE_URL}/images/logo.png`,
      "width": 512,
      "height": 512
    },
    "sameAs": [
      "https://www.facebook.com/lightsovercolumbus",
      "https://www.instagram.com/lightsovercolumbus"
    ]
  };

  // 2. LocalBusiness Schema
  const localBusinessSchema = {
    "@type": "LocalBusiness",
    "@id": `${BASE_URL}/#localbusiness`,
    "name": "Christmas Lights Over Columbus",
    "image": `${BASE_URL}/images/logo.png`,
    "telephone": "(614) 301-7100",
    "email": "info@lightsovercolumbus.com",
    "url": BASE_URL,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Columbus",
      "addressRegion": "OH",
      "postalCode": "43215",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 39.9612,
      "longitude": -82.9988
    },
    "areaServed": [
      { "@type": "City", "name": "Columbus" },
      { "@type": "City", "name": "Dublin" },
      { "@type": "City", "name": "Powell" },
      { "@type": "City", "name": "New Albany" },
      { "@type": "City", "name": "Upper Arlington" },
      { "@type": "City", "name": "Westerville" },
      { "@type": "City", "name": "Hilliard" },
      { "@type": "City", "name": "Worthington" },
      { "@type": "City", "name": "Gahanna" }
    ],
    "priceRange": "$$"
  };

  // 3. WebSite Schema
  const websiteSchema = {
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    "url": BASE_URL,
    "name": "Christmas Lights Over Columbus",
    "publisher": { "@id": `${BASE_URL}/#organization` }
  };

  // 4. BreadcrumbList Schema
  const pathSegments = safeSlug.split('/').filter(Boolean);
  const breadcrumbList = {
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}/#breadcrumb`,
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": BASE_URL
      },
      ...pathSegments.map((segment, index) => {
        const url = `${BASE_URL}/${pathSegments.slice(0, index + 1).join('/')}`;
        return {
          "@type": "ListItem",
          "position": index + 2,
          "name": index === pathSegments.length - 1 ? (breadcrumbTitle || title) : segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
          "item": url
        };
      })
    ]
  };

  // 5. WebPage / Service Schema
  const mainEntitySchema: any = {
    "@type": type,
    "@id": `${pageUrl}/#${type.toLowerCase()}`,
    "url": pageUrl,
    "name": title,
    "description": description,
    "isPartOf": { "@id": `${BASE_URL}/#website` },
    "breadcrumb": { "@id": `${pageUrl}/#breadcrumb` },
    "image": image ? {
      "@type": "ImageObject",
      "url": image
    } : undefined,
    "primaryImageOfPage": image ? {
      "@id": `${pageUrl}/#primaryimage`
    } : undefined
  };

  if (isService) {
    mainEntitySchema["provider"] = { "@id": `${BASE_URL}/#organization` };
  }

  const graph = [
    organizationSchema,
    localBusinessSchema,
    websiteSchema,
    breadcrumbList,
    mainEntitySchema
  ];

  if (image) {
    graph.push({
      "@type": "ImageObject",
      "@id": `${pageUrl}/#primaryimage`,
      "url": image,
      "contentUrl": image
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph
  };
}
