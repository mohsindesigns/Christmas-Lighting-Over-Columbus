"use client";

import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import ChristmasLightingSection from "@/components/ChristmasLightingSection";
import Services from "@/components/Services";


const Portfolio = dynamic(() => import("@/components/Portfolio"));
const VanMapSection = dynamic(() => import("@/components/VanMapSection"), { ssr: false });
const BrandStore = dynamic(() => import("@/components/BrandStore"), { ssr: false });
const Testimonials = dynamic(() => import("@/components/Testimonials"), { ssr: false });
const HowWeWork = dynamic(() => import("@/components/HowWeWork"), { ssr: false });
const QAForm = dynamic(() => import("@/components/QAForm"), { ssr: false });
const FAQ = dynamic(() => import("@/components/FAQ"), { ssr: false });
const BlogSection = dynamic(() => import("@/components/sections/BlogSection"), { ssr: false });

import { useContent } from "@/hooks/useContent";
import PageInlineFaqs from "@/components/PageInlineFaqs";

export default function HomeTemplate({ pageData, params }: { pageData?: any, params?: any }) {
  const { allBlogs, blogSection } = useContent();
  return (
    <div className="relative">
      <Hero />
      <section id="christmas-lighting">
        <ChristmasLightingSection />
      </section>
      <section id="services">
        <Services />
      </section>
      <section id="about">
        <HowWeWork />
      </section>
      <section id="portfolio">
        <Portfolio />
      </section>
      <section id="service-areas">
        <VanMapSection />
      </section>

      <Testimonials />

      <section id="faq">
        <FAQ />
      </section>

      <section id="contact">
        <QAForm />
      </section>


      <BlogSection
        title={pageData?.content?.blogSection?.title || blogSection?.title}
        subtitle={pageData?.content?.blogSection?.subtitle || blogSection?.subtitle}
        description={pageData?.content?.blogSection?.description || blogSection?.description}
        posts={allBlogs.filter((p: any) => (pageData?.content?.blogSection?.selectedPosts || []).includes(p._id))}
      />

    </div>
  );
}

