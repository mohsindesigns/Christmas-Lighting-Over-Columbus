const dns = require('dns');
try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'cloc_cms';

if (!MONGODB_URI) {
    console.error("MONGODB_URI not found in .env.local");
    process.exit(1);
}

// Inline schemas for script execution
const RoleSchema = new mongoose.Schema({
    name: String,
    permissions: mongoose.Schema.Types.Mixed,
    isCustom: { type: Boolean, default: false }
});

const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    role: mongoose.Schema.Types.ObjectId,
    status: { type: String, default: 'active' },
    lastLogin: Date
});

const SiteContentSchema = new mongoose.Schema({
    key: { type: String, unique: true },
    data: mongoose.Schema.Types.Mixed,
    lastUpdated: { type: Date, default: Date.now }
});

const Role = mongoose.models.Role || mongoose.model('Role', RoleSchema);
const User = mongoose.models.User || mongoose.model('User', UserSchema);
const SiteContent = mongoose.models.SiteContent || mongoose.model('SiteContent', SiteContentSchema);

async function initialize() {
    try {
        console.log(`Connecting to MongoDB cluster... DB: ${dbName}`);
        await mongoose.connect(MONGODB_URI, { dbName });
        console.log("Connected successfully!");

        // 1. Seed Roles
        const rolesData = [
            {
                name: 'Admin',
                isCustom: false,
                permissions: {
                    pages: { create: true, read: true, update: true, delete: true, publish: true },
                    media: { create: true, read: true, update: true, delete: true },
                    seo: { read: true, update: true },
                    blog: { create: true, read: true, update: true, delete: true, publish: true },
                    submissions: { read: true, delete: true },
                    settings: { read: true, update: true },
                    users: { read: true, create: true, update: true, delete: true },
                    logs: { read: true }
                }
            },
            {
                name: 'Editor',
                isCustom: false,
                permissions: {
                    pages: { create: true, read: true, update: true, delete: false, publish: true },
                    media: { create: true, read: true, update: true, delete: true },
                    seo: { read: true, update: true },
                    blog: { create: true, read: true, update: true, delete: false, publish: true },
                    submissions: { read: true, delete: false },
                    settings: { read: false, update: false },
                    users: { read: false, create: false, update: false, delete: false },
                    logs: { read: false }
                }
            }
        ];

        for (const r of rolesData) {
            await Role.updateOne({ name: r.name }, { $set: r }, { upsert: true });
        }
        console.log("Roles verified/created.");

        // 2. Seed Admin User
        const adminRole = await Role.findOne({ name: 'Admin' });
        const adminUsername = process.env.ADMIN_USERNAME || 'admin';
        const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@CLOC2026!';
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        await User.updateOne(
            { username: adminUsername },
            {
                $set: {
                    username: adminUsername,
                    email: process.env.SMTP_USER || 'admin@lightsovercolumbus.com',
                    password: hashedPassword,
                    role: adminRole._id,
                    status: 'active'
                }
            },
            { upsert: true }
        );
        console.log(`Admin user created/updated: ${adminUsername}`);

        // 3. Initialize Site Content
        const defaultContent = {
            settings: {
                siteTitle: "Luminous Holiday Lighting",
                siteTemplate: "%s | Luminous Holiday Lighting",
                favicon: "/images/mainlogo.png",
                phone: "(614) 301-7100",
                email: "Info@lightsovercolumbus.com"
            },
            navbar: {
                logo: "/images/mainlogo.png",
                siteTitle: "Luminous Holiday",
                ctaText: "Call Now (614) 301-7100",
                ctaLink: "tel:+16143017100",
                phone: "(614) 301-7100",
                email: "Info@lightsovercolumbus.com",
                companyLinks: []
            },
            footer: {
                company: {
                    name: "Luminous Holiday",
                    tagline: "Professional Holiday & Architectural Lighting",
                    description: "Bringing magical holiday lights and permanent architectural lighting to homes and businesses across the greater area.",
                    logo: "/images/mainlogo.png"
                },
                contact: {
                    title: "Get in Touch",
                    phone: "(614) 301-7100",
                    hours: "Mon - Sun: 8:00 AM - 8:00 PM",
                    email: "Info@lightsovercolumbus.com",
                    support: "24/7 Customer Support",
                    address: "Columbus, OH"
                },
                certifications: "Licensed, Bonded & Insured • Certified Lighting Specialists • 100% Satisfaction Guaranteed",
                social: [
                    { key: "fb", platform: "Facebook", icon: "FaFacebookF", href: "https://facebook.com" },
                    { key: "ig", platform: "Instagram", icon: "FaInstagram", href: "https://instagram.com" },
                    { key: "tw", platform: "Twitter", icon: "FaTwitter", href: "https://twitter.com" },
                    { key: "pin", platform: "Pinterest", icon: "BsPinterest", href: "https://pinterest.com" },
                    { key: "tik", platform: "TikTok", icon: "SiTiktok", href: "https://tiktok.com" }
                ],
                bottom: {
                    copyright: "© 2026 Luminous Holiday",
                    rights: "All Rights Reserved",
                    tagline: "Illuminating Every Celebration",
                    links: [
                        { label: "Privacy", href: "/privacy" },
                        { label: "Terms", href: "/terms" }
                    ]
                }
            },
            services: {
                services: [
                    {
                        title: "Residential Lighting",
                        slug: "residential-lighting",
                        icon: "Home",
                        shortDescription: "Custom holiday and accent lighting designed specifically for your home.",
                        description: "<p>Custom residential holiday lighting tailored to your home architecture.</p>",
                        status: "published"
                    },
                    {
                        title: "Commercial Lighting",
                        slug: "commercial-lighting",
                        icon: "Building",
                        shortDescription: "Attract customers and spread holiday cheer with eye-catching commercial displays.",
                        description: "<p>Commercial grade exterior lighting for storefronts, offices, and plazas.</p>",
                        status: "published"
                    },
                    {
                        title: "Permanent Lighting",
                        slug: "permanent-lighting",
                        icon: "Sparkles",
                        shortDescription: "Year-round architectural smart lighting hidden under the eaves for all occasions.",
                        description: "<p>Year-round RGB smart lighting seamlessly integrated into your home trim.</p>",
                        status: "published"
                    }
                ]
            }
        };

        const existingContent = await SiteContent.findOne({ key: 'complete_data' });
        if (!existingContent) {
            await SiteContent.create({
                key: 'complete_data',
                data: defaultContent,
                lastUpdated: new Date()
            });
            console.log("Initialized default site_contents in cloc_cms.");
        } else {
            console.log("Site contents already present.");
        }

        console.log("Database setup completed successfully!");

    } catch (err) {
        console.error("Initialization error:", err);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
    }
}

initialize();
