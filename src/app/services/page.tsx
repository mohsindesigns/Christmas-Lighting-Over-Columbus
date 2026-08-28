import { Metadata } from "next";
export const revalidate = 60;
import connectToDatabase from "@/lib/mongodb";
import SiteContent from "@/models/Content";
import PageModel from "@/models/Page";
import ServicesTemplate from "@/components/templates/ServicesTemplate";
import { BASE_URL } from "@/lib/constants";

export async function generateMetadata(): Promise<Metadata> {
  await connectToDatabase();
  const page = await PageModel.findOne({ slug: "services", status: "published" }).lean() as any;
  const seo = page?.seo || {};

  return {
    title: seo.metaTitle || "Christmas Lighting Services | Christmas Lights Over Columbus",
    description: seo.metaDescription || "Professional holiday lighting installation, maintenance, takedown, and storage for Central Ohio homes and businesses.",
    alternates: {
      canonical: seo.canonicalUrl || `${BASE_URL}/services`,
    }
  };
}

export default async function ServicesPage() {
  await connectToDatabase();
  const content = await SiteContent.findOne({ key: "complete_data" }).lean() as any;
  const page = await PageModel.findOne({ slug: "services" }).lean() as any;

  const pageData = {
    content: {
      ...(content?.data || {}),
      servicesPage: page?.content?.servicesPage || content?.data?.servicesPage || content?.data?.services || {}
    }
  };

  return <ServicesTemplate pageData={pageData} />;
}
