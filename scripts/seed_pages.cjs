const { MongoClient } = require('mongodb');
const dns = require('dns');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
    // ignore
}

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'cloc_cms';

async function seedPages() {
    if (!uri) {
        console.error("MONGODB_URI not found in .env.local");
        return;
    }

    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('pages');

        const pages = [
            {
                slug: 'home',
                title: 'Home Page',
                template: 'home',
                status: 'published',
                metadata: {
                    title: 'Christmas Lights Over Columbus | Premier Holiday Lighting',
                    description: 'Professional holiday and permanent lighting design, installation, maintenance, and storage in Columbus, Ohio.'
                },
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                slug: 'about',
                title: 'About Us',
                template: 'about',
                status: 'published',
                metadata: {
                    title: 'About Us | Christmas Lights Over Columbus',
                    description: 'Learn about our history, mission, and commitment to lighting up Columbus holidays.'
                },
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                slug: 'services',
                title: 'Our Services',
                template: 'services',
                status: 'published',
                metadata: {
                    title: 'Holiday Lighting Services | Christmas Lights Over Columbus',
                    description: 'Explore our residential, commercial, permanent, and landscape holiday lighting services.'
                },
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                slug: 'about/team',
                title: 'Meet The Team',
                template: 'team',
                status: 'published',
                metadata: {
                    title: 'Our Team | Christmas Lights Over Columbus',
                    description: 'Meet the professionals behind Christmas Lights Over Columbus.'
                },
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                slug: 'about/careers',
                title: 'Join Our Team',
                template: 'careers',
                status: 'published',
                metadata: {
                    title: 'Careers | Christmas Lights Over Columbus',
                    description: 'Explore career opportunities with Christmas Lights Over Columbus.'
                },
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                slug: 'reviews',
                title: 'Customer Reviews',
                template: 'reviews',
                status: 'published',
                metadata: {
                    title: 'Reviews | Christmas Lights Over Columbus',
                    description: 'Read what Central Ohio homeowners and business owners have to say about us.'
                },
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                slug: 'faq',
                title: 'Frequently Asked Questions',
                template: 'faq',
                status: 'published',
                metadata: {
                    title: 'FAQ | Christmas Lights Over Columbus',
                    description: 'Find answers to common questions about our lighting installation, maintenance, and storage.'
                },
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                slug: 'gallery',
                title: 'Project Gallery',
                template: 'gallery',
                status: 'published',
                metadata: {
                    title: 'Lighting Gallery | Christmas Lights Over Columbus',
                    description: 'View our portfolio of completed holiday and permanent lighting installations in Columbus, OH.'
                },
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                slug: 'contact-us',
                title: 'Contact Us',
                template: 'contact',
                status: 'published',
                metadata: {
                    title: 'Contact Us | Christmas Lights Over Columbus',
                    description: 'Get in touch with us for a free holiday lighting design estimate.'
                },
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        for (const page of pages) {
            await collection.updateOne(
                { slug: page.slug },
                { $set: page },
                { upsert: true }
            );
        }

        console.log(`Successfully seeded ${pages.length} pages into "${dbName}.pages"`);

    } catch (err) {
        console.error("Error seeding pages:", err);
    } finally {
        await client.close();
    }
}

seedPages();
