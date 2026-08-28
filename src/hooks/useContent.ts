import { useContentContext } from "../context/ContentContext";
import { cleanMojibake } from "../lib/utils";

function sanitizeEncoding(obj: any): any {
  if (!obj) return obj;
  if (typeof obj === 'string') {
    return cleanMojibake(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeEncoding(item));
  }
  if (typeof obj === 'object') {
    const res: any = {};
    for (const key in obj) {
      res[key] = sanitizeEncoding(obj[key]);
    }
    return res;
  }
  return obj;
}

function proxyAllUrls(obj: any): any {
  if (!obj) return obj;
  if (typeof obj === 'string') {
    if (obj.includes("https://res.cloudinary.com/dytytwyp6/image/upload/")) {
      return obj.replace(/https:\/\/res\.cloudinary\.com\/dytytwyp6\/image\/upload\//g, "/cdn-images/");
    }
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => proxyAllUrls(item));
  }
  if (typeof obj === 'object') {
    const res: any = {};
    for (const key in obj) {
      res[key] = proxyAllUrls(obj[key]);
    }
    return res;
  }
  return obj;
}

export const useContent = () => {
    const rawData = useContentContext();
    const completeData = sanitizeEncoding(proxyAllUrls(rawData));

    // Deep fallback helper to prevent undefined.property crashes
    const getSafe = (data: any, key: string, fallback: any = {}) => {
        return data?.[key] || fallback;
    };

    const footer = getSafe(completeData, 'footer');
    const footerServices = getSafe(footer, 'services', { title: "Our Services", materials: { title: "Premium Materials", items: [] } });
    const footerContact = getSafe(footer, 'contact', { title: "Contact Us", email: "", phone: "", address: "", emergency: "", areas: "" });
    const footerCompany = getSafe(footer, 'company', { name: "Christmas Lights Over Columbus", tagline: "Professional Holiday Lighting in Columbus, OH", description: "", logo: "/images/logo.png" });
    const footerBottom = getSafe(footer, 'bottom', { copyright: "© 2026 Christmas Lights Over Columbus", rights: "All Rights Reserved", tagline: "", links: [] });
    const footerMarquee = getSafe(footer, 'marquee', { texts: [], speed: 30, repeats: 8 });
    const footerCertifications = getSafe(footer, 'certifications', []);

    return {
        navbar: getSafe(completeData, 'navbar', { menu: [], logo: "", cta: { text: "Get Quote", href: "/contact-us" } }),
        hero: getSafe(completeData, 'hero', { headlines: [], description: "", buttons: [], stats: [], images: [] }),
        about: getSafe(completeData, 'about'),
        services: (() => {
            const s = getSafe(completeData, 'services', { services: [] });
            // Normalize: if it's already an array, wrap it in the expected object structure
            return Array.isArray(s) ? { services: s } : s;
        })(),
        leadership: getSafe(completeData, 'leadership', {
            section: { badge: "", headline: "", description: "" },
            ceo: { name: "", title: "", image: { src: "" }, badges: { top: "", bottom: "" }, quotes: [], description: "", socials: [] }
        }),
        serviceAreas: getSafe(completeData, 'serviceAreas', {
            badge: "SERVICE AREAS",
            title: "Areas We Are Serving",
            subtitle: "Custom lighting installed by professionals.",
            mapImage: "/images/realmap.jpeg",
            vehicleImage: "/images/car2.png",
            steps: [
                {
                    number: "01",
                    title: "Multiple Locations",
                    description: "With strategically located stores across the region, we deliver premium service right at your doorstep—fast, reliable, and professional.",
                    icon: "FaMapMarkerAlt",
                    color: "#EF4444",
                    features: ["4+ store locations", "Local service teams", "Fast response times"]
                },
                {
                    number: "02",
                    title: "24/7 Availability",
                    description: "Our dedicated team is available around the clock to handle your Christmas lighting needs, ensuring timely service whenever you need it.",
                    icon: "FaClock",
                    color: "#F59E0B",
                    features: ["Always available", "Emergency services", "Flexible scheduling"]
                },
                {
                    number: "03",
                    title: "Fast Response",
                    description: "We pride ourselves on quick response times with an average of 30 minutes from inquiry to on-site assessment for your lighting project.",
                    icon: "FaCar",
                    color: "#10B981",
                    features: ["30min avg response", "Quick assessments", "Rapid installation"]
                }
            ]
        }),
        portfolio: (() => {
            const p = getSafe(completeData, 'portfolio', {});
            const ws = getSafe(completeData, 'workShowcase', {});
            const selectedProjects = Array.isArray(p.projects) ? p.projects : [];

            const merged = {
                ...p,
                ...ws,
                badge: ws.badge || p.section?.badge || "OUR WORK",
                title: {
                    prefix: ws.title?.prefix || p.section?.prefix || p.section?.headlinePrefix || "EXPERIENCE THE MAGIC",
                    main: ws.title?.main || ws.title?.headline || p.section?.headline || p.section?.title || "PORTFOLIO"
                },
                description: ws.description || p.section?.description || "Browse our recent holiday lighting displays and permanent architectural lighting installations across Columbus.",
                cta: ws.cta || p.button?.text || "View Full Gallery",
                ctaLink: ws.ctaLink || p.button?.link || "/gallery",
                images: Array.isArray(ws.images) && ws.images.length > 0
                    ? ws.images
                    : (Array.isArray(p.images) && p.images.length > 0 ? p.images : selectedProjects.map((proj: any) => proj.image || proj.src || proj.overviewImage || "").filter(Boolean)),
                projects: selectedProjects
            };

            return merged;
        })(),
        workShowcase: (() => {
            const p = getSafe(completeData, 'portfolio', {});
            const ws = getSafe(completeData, 'workShowcase', {});
            const selectedProjects = Array.isArray(p.projects) ? p.projects : [];

            return {
                badge: ws.badge || p.section?.badge || "OUR WORK",
                title: {
                    prefix: ws.title?.prefix || p.section?.prefix || p.section?.headlinePrefix || "EXPERIENCE THE MAGIC",
                    main: ws.title?.main || ws.title?.headline || p.section?.headline || p.section?.title || "PORTFOLIO"
                },
                description: ws.description || p.section?.description || "Browse our recent holiday lighting displays and permanent architectural lighting installations across Columbus.",
                cta: ws.cta || p.button?.text || "View Full Gallery",
                ctaLink: ws.ctaLink || p.button?.link || "/gallery",
                images: Array.isArray(ws.images) && ws.images.length > 0
                    ? ws.images
                    : (Array.isArray(p.images) && p.images.length > 0 ? p.images : selectedProjects.map((proj: any) => proj.image || proj.src || proj.overviewImage || "").filter(Boolean)),
                projects: selectedProjects
            };
        })(),
        testimonials: (() => {
            const raw = getSafe(completeData, 'testimonials', {});
            const badge = raw.badge || raw.section?.badge || "CLIENT SUCCESS STORIES";
            const titleLine1 = raw.title?.line1 || raw.section?.headlinePrefix || "Transforming Columbus Homes";
            const titleLine2 = raw.title?.line2 || raw.section?.headlineHighlight || raw.section?.headline || "One Holiday at a Time";
            const subtitle = raw.subtitle || raw.section?.description || "Read what your neighbors in New Albany, Dublin, and Bexley have to say about our premium Christmas lighting services.";
            const rawItems = Array.isArray(raw.items) && raw.items.length > 0
                ? raw.items
                : (Array.isArray(raw.testimonials) && raw.testimonials.length > 0 ? raw.testimonials : []);

            return {
                ...raw,
                badge,
                title: {
                    line1: titleLine1,
                    line2: titleLine2
                },
                subtitle,
                items: rawItems
            };
        })(),
        whyChooseUs: getSafe(completeData, 'whyChooseUs', {
            section: { badge: "", headline: "", description: "" },
            features: [],
            stats: [],
            cta: { badge: "", title: "", description: "", trustBadges: [], buttons: [] }
        }),
        howWeWork: getSafe(completeData, 'howWeWork', completeData?.whyChooseUs || {
            badge: "Simple 3-Step Process",
            title: "Working With Us Couldn't Be Easier",
            subtitle: "From your initial free quote to final takedown in January, we make holiday lighting completely stress-free.",
            steps: []
        }),
        faq: (() => {
            const raw = getSafe(completeData, 'faq', {});
            const title = raw.title || raw.section?.headline || raw.section?.title || "Questions & Answers";
            const subtitle = raw.subtitle || raw.section?.description || "Got questions about our Columbus holiday lighting services? We have all the answers.";
            const rawItems = Array.isArray(raw.items) && raw.items.length > 0
                ? raw.items
                : (Array.isArray(raw.faqs) && raw.faqs.length > 0 ? raw.faqs : []);

            return {
                ...raw,
                title,
                subtitle,
                items: rawItems
            };
        })(),
        quote: getSafe(completeData, 'quote', {
            section: { badge: "Get A Fast Quote", headline: "Get Your Fast Quote", description: "We are so excited to light up your property 🙂" },
            badge: "Get A Fast Quote",
            title: "Get Your Fast Quote",
            subtitle: "We are so excited to light up your property 🙂",
            benefits: [
                { text: "Custom Lighting Design & Layout" },
                { text: "Commercial-Grade LED Lights & Custom Wiring" },
                { text: "Professional Installation & Heavy-Duty Clips" },
                { text: "Proactive In-Season Maintenance (24h Guarantee)" },
                { text: "Timely Takedown in January" },
                { text: "Safe Climate-Controlled Storage Included" }
            ],
            contactInfo: {
                phone: "(614) 301-7100",
                email: "Info@lightsovercolumbus.com"
            }
        }),
        quoteForm: (() => {
            const raw = getSafe(completeData, 'quoteForm', getSafe(completeData, 'quote', {}));
            return {
                ...raw,
                badge: raw.badge || raw.section?.badge || "Get A Fast Quote",
                title: raw.title || raw.headline || raw.section?.headline || raw.section?.title || "Get Your Fast Quote",
                subtitle: raw.subtitle || raw.description || raw.section?.description || "We are so excited to light up your property 🙂",
                benefits: Array.isArray(raw.benefits) && raw.benefits.length > 0 ? raw.benefits : [
                    { text: "Custom Lighting Design & Layout" },
                    { text: "Commercial-Grade LED Lights & Custom Wiring" },
                    { text: "Professional Installation & Heavy-Duty Clips" },
                    { text: "Proactive In-Season Maintenance (24h Guarantee)" },
                    { text: "Timely Takedown in January" },
                    { text: "Safe Climate-Controlled Storage Included" }
                ],
                contactInfo: raw.contactInfo || {
                    phone: "(614) 301-7100",
                    email: "Info@lightsovercolumbus.com"
                }
            };
        })(),
        footer: {
            ...footer,
            services: footerServices,
            contact: footerContact,
            company: footerCompany,
            bottom: footerBottom,
            marquee: footerMarquee,
            certifications: footerCertifications,
            newsletter: getSafe(footer, 'newsletter', { placeholder: "Enter your email", buttonText: "Subscribe" })
        },
        team: getSafe(completeData, 'team', {
            section: { badge: "", headline: "", description: "" },
            members: []
        }),
        careers: getSafe(completeData, 'careers', {
            section: { badge: "", headline: "", description: "" },
            roles: [],
            success: { title: "", description: "" },
            labels: { name: "", email: "", role: "", summary: "" }
        }),
        aboutPage: {
            ...(completeData?.aboutPage || {}),
            // Root-level overrides for dynamic pages
            ...(completeData?.hero ? { hero: completeData.hero } : {}),
            ...(completeData?.mission ? { mission: completeData.mission } : {}),
            ...(completeData?.story ? { story: completeData.story } : {}),
            ...(completeData?.values ? { values: completeData.values } : {}),
            ...(completeData?.capabilities ? { capabilities: completeData.capabilities } : {}),
            ...(completeData?.stats ? { stats: completeData.stats } : {}),
            ...(completeData?.ctaBanner ? { ctaBanner: completeData.ctaBanner } : {}),
            ...(completeData?.recognition ? { recognition: completeData.recognition } : {}),
        },
        images: getSafe(completeData, 'images', {}),
        loader: getSafe(completeData, 'loader', { company: { name: "Christmas Lights Over Columbus", tagline: "Professional Holiday Lighting" }, phases: { simpleDark: 200, roofDraw: 300, logoText: 400, ready: 100 } }),
        quickQuote: getSafe(completeData, 'quickQuote', {
            title: "",
            description: "",
            buttonText: ""
        }),
        hours: getSafe(completeData, 'hours'),
        contactPage: getSafe(completeData, 'contactPage', {
            header: { badge: "", headline: "", description: "" },
            formFields: [],
            info: {},
            social: {}
        }),
        galleryPage: getSafe(completeData, 'galleryPage', {
            header: { badge: "", title: "", description: "" }
        }),
        brandStore: getSafe(completeData, 'brandStore', {
            section: { badge: "", headline: "", description: "" },
            items: []
        }),
        serviceDetailPage: getSafe(completeData, 'serviceDetailPage'),
        settings: completeData?.settings || { siteTitle: "Christmas Lights Over Columbus", siteTemplate: "%s | Christmas Lights Over Columbus", favicon: "/images/logo.png" },
        faqPage: getSafe(completeData, 'faqPage'),
        blogSection: getSafe(completeData, 'blogSection', {
            title: "Latest from the Blog",
            subtitle: "Insights & News",
            description: "Stay updated with the latest trends, tips, and news from holiday lighting and decor.",
            selectedPosts: []
        }),
        allBlogs: Array.isArray(completeData?.allBlogs) ? completeData.allBlogs : [],
        ...(completeData || {}),
    };
};
