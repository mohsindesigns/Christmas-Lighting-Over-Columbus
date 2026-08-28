// app/privacy/page.tsx or src/app/privacy/page.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Icon } from "../../config/icons";

export default function PrivacyPolicyPage() {
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
              <Icon name="Shield" className="w-4 h-4 text-primary" />
              <span className="text-primary uppercase tracking-wider text-xs font-semibold">Legal</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-foreground mb-4">
              Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">Policy</span>
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
                <Icon name="Lock" className="w-5 h-5 text-primary" />
                Our Commitment to Privacy
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Christmas Lights Over Columbus takes the security and privacy of your personal information extremely seriously. We will not trade, sell, or rent your personally identifiable information. For an overview of our privacy practices, please read below.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We are strongly devoted to defending the privacy of your personal information. We have established this Privacy Policy to inform you of the type of personal information we may collect throughout your visit to our Website, why we collect your information, what we use your personal information for, when we may provide your personal information, and how you can control your personal information.
              </p>
            </div>

            {/* Acceptance of Terms */}
            <div className="bg-card rounded-2xl border border-border p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">Acceptance of This Policy</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                By visiting our Website, you are complying with the practices expressed in our Privacy Policy. If you do not concur with the terms of this Privacy Policy, please do not use the Website. We may, from time to time, revise this privacy policy, and the date of the last revision will be available at the bottom of this page.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                By using the Services, you are acknowledging and accepting this Privacy Policy. Your continued use of the Services after changes have been posted to the Privacy Policy will constitute your acceptance of such changes.
              </p>
              <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-xl">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-primary">Questions?</span> If you have any inquiries about this Privacy Policy, please contact us at{' '}
                  <a href="mailto:info@lightsovercolumbus.com" className="text-primary hover:underline">info@lightsovercolumbus.com</a>
                </p>
              </div>
            </div>

            {/* Information Collection */}
            <div className="bg-card rounded-2xl border border-border p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">What Information Is Collected and Stored?</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Christmas Lights Over Columbus adheres to the highest standards of ethical practices in all of our processes and is devoted to protecting the privacy of all users of our Website. Our privacy policy is straightforward: Except as revealed below, we don't sell, barter, deliver or rent your personal information to any organization or individual outside of Christmas Lights Over Columbus.
              </p>
              
              <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Personal Information</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We accumulate and store information that you enter into this Website or that you supply through our Customer Service Department. For instance, when you submit a quote request or contact us, we accumulate and store information that you supply: name, address, email address, telephone number, and project requirements.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                This information is used to make available the lighting services and estimates that you have requested and to supply customer service.
              </p>

              <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Anonymous Information</h3>
              <p className="text-muted-foreground leading-relaxed">
                During your use of the Website, we may collect certain information that does not recognize you independently ("Anonymous Information") to monitor site performance and improve user experience.
              </p>
            </div>

            {/* Cookies */}
            <div className="bg-card rounded-2xl border border-border p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">Use of Cookies</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We in no way apply or install spyware on your computer. We may use standard browser cookies to improve your browsing experience and remember preferences.
              </p>
            </div>

            {/* SMS Disclosure */}
            <div className="bg-gradient-to-r from-primary/5 via-card to-primary/5 rounded-2xl border border-primary/20 p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Icon name="MessageCircle" className="w-5 h-5 text-primary" />
                SMS Disclosure
              </h2>
              <div className="space-y-3 text-muted-foreground">
                <p>Consent is not a condition of purchase. Message frequency varies. Message & data rates may apply.</p>
                <p>You can opt out at any time by replying STOP or reply HELP for more info.</p>
                <p>By clicking "Submit," I agree with Christmas Lights Over Columbus Terms of Service.</p>
                <p className="text-sm">Reply STOP to stop receiving messages from us. Reply HELP for more information.</p>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-gradient-to-r from-primary/10 via-card to-primary/10 rounded-2xl border border-primary/30 p-6 md:p-8 text-center">
              <Icon name="Mail" className="w-10 h-10 text-primary mx-auto mb-4" />
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">Have More Questions?</h2>
              <p className="text-muted-foreground mb-4">
                Questions regarding this Privacy Policy should be directed to our Customer Service.
              </p>
              <a 
                href="mailto:info@lightsovercolumbus.com" 
                className="inline-flex items-center gap-2 text-primary hover:underline font-semibold"
              >
                info@lightsovercolumbus.com
                <Icon name="ArrowRight" className="w-4 h-4" />
              </a>
            </div>

            {/* Footer Note */}
            <p className="text-center text-xs text-muted-foreground/60 pt-8">
              © {new Date().getFullYear()} Christmas Lights Over Columbus. All rights reserved.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
