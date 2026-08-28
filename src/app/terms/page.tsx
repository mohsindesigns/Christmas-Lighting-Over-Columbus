// app/terms/page.tsx or src/app/terms/page.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Icon } from "../../config/icons";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-background overflow-hidden pt-32 pb-16">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(var(--primary)/0.08)_0%,_transparent_70%)]" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        </div>

        <div className="max-w-4xl mx-auto px-6 md:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-full border border-primary/10 mb-6">
              <Icon name="FileText" className="w-4 h-4 text-primary" />
              <span className="text-primary uppercase tracking-wider text-xs font-semibold">Legal</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-foreground mb-4">
              Terms & <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">Conditions</span>
            </h1>
            <p className="text-muted-foreground text-lg">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="relative pb-24">
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Introduction */}
            <div className="bg-card rounded-2xl border border-border p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Icon name="Info" className="w-5 h-5 text-primary" />
                1. Introduction
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Welcome to Christmas Lights Over Columbus. By accessing or using our website, services, or products, you agree to be bound by these Terms and Conditions.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Christmas Lights Over Columbus provides <span className="text-primary font-medium">professional residential and commercial holiday lighting design, installation, maintenance, takedown, and storage services</span>. These Terms apply to all our services and interactions.
              </p>
            </div>

            {/* Holiday Lighting Services */}
            <div className="bg-card rounded-2xl border border-border p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Icon name="Home" className="w-5 h-5 text-primary" />
                2. Lighting & Installation Services
              </h2>
              
              <h3 className="text-lg font-semibold text-foreground mt-4 mb-2">2.1 Service Estimates</h3>
              <ul className="space-y-2 text-muted-foreground mb-4">
                <li className="flex items-start gap-2">
                  <Icon name="Check" className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                  <span>All estimates are valid for 30 days from the date provided</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="Check" className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                  <span>Final pricing may vary based on actual layout or electrical requirements discovered on site</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="Check" className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                  <span>A written quote and scope of work will be provided before installation begins</span>
                </li>
              </ul>

              <h3 className="text-lg font-semibold text-foreground mt-4 mb-2">2.2 Payment Terms</h3>
              <ul className="space-y-2 text-muted-foreground mb-4">
                <li className="flex items-start gap-2">
                  <Icon name="Check" className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                  <span>A deposit or schedule reservation may be required before work commences</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="Check" className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                  <span>Final payment is due upon completion of installation</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="Check" className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                  <span>Accepted payment methods: Credit Card, Debit Card, Check, Electronic Transfer</span>
                </li>
              </ul>

              <h3 className="text-lg font-semibold text-foreground mt-4 mb-2">2.3 Maintenance & Season Support</h3>
              <ul className="space-y-2 text-muted-foreground mb-4">
                <li className="flex items-start gap-2">
                  <Icon name="Check" className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                  <span>Complimentary in-season bulb and timer maintenance is included with all full-service installations</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="Check" className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                  <span>Prompt response times for any weather-related outages or issues</span>
                </li>
              </ul>
            </div>

            {/* Intellectual Property */}
            <div className="bg-card rounded-2xl border border-border p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Icon name="Copyright" className="w-5 h-5 text-primary" />
                3. Intellectual Property
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                All content on this website, including but not limited to text, graphics, logos, images, and software, is the property of Christmas Lights Over Columbus and is protected by United States copyright and trademark laws. You may not reproduce, distribute, or create derivative works without our express written permission.
              </p>
            </div>

            {/* Limitation of Liability */}
            <div className="bg-card rounded-2xl border border-border p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Icon name="Shield" className="w-5 h-5 text-primary" />
                4. Limitation of Liability
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                To the fullest extent permitted by law, Christmas Lights Over Columbus shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our website or services. Our total liability shall not exceed the amount you paid to us.
              </p>
            </div>

            {/* Governing Law */}
            <div className="bg-card rounded-2xl border border-border p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Icon name="Globe" className="w-5 h-5 text-primary" />
                5. Governing Law
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of the State of Ohio and the United States. Any legal action arising out of these Terms shall be brought exclusively in the courts located in Franklin County, Ohio.
              </p>
            </div>

            {/* SMS Terms */}
            <div className="bg-gradient-to-r from-primary/5 via-card to-primary/5 rounded-2xl border border-primary/20 p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Icon name="MessageCircle" className="w-5 h-5 text-primary" />
                6. SMS/Text Messaging Terms
              </h2>
              <div className="space-y-3 text-muted-foreground text-sm">
                <p>By providing your phone number, you consent to receive SMS messages from Christmas Lights Over Columbus regarding:</p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <Icon name="Check" className="w-3 h-3 text-primary mt-1 flex-shrink-0" />
                    <span>Installation scheduling, service updates, and appointment reminders</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" className="w-3 h-3 text-primary mt-1 flex-shrink-0" />
                    <span>Takedown scheduling and annual renewal notifications</span>
                  </li>
                </ul>
                <p className="mt-3">Message frequency varies. Message and data rates may apply.</p>
                <p>Reply <span className="text-primary font-semibold">STOP</span> to opt out at any time. Reply <span className="text-primary font-semibold">HELP</span> for assistance.</p>
                <p className="text-xs text-muted-foreground/70 mt-2">Consent is not a condition of purchase for any products or services.</p>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-gradient-to-r from-primary/10 via-card to-primary/10 rounded-2xl border border-primary/30 p-6 md:p-8 text-center">
              <Icon name="Mail" className="w-10 h-10 text-primary mx-auto mb-4" />
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">Contact Us</h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions about these Terms & Conditions, please contact us:
              </p>
              <a 
                href="mailto:info@lightsovercolumbus.com" 
                className="inline-flex items-center gap-2 text-primary hover:underline font-semibold"
              >
                info@lightsovercolumbus.com
                <Icon name="ArrowRight" className="w-4 h-4" />
              </a>
            </div>

            {/* Footer */}
            <p className="text-center text-xs text-muted-foreground/60 pt-8">
              © {new Date().getFullYear()} Christmas Lights Over Columbus. All rights reserved.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
