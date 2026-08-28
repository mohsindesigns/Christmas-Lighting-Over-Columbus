const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dns = require('dns');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
    // ignore
}

const MONGODB_URI = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'cloc_cms';

if (!MONGODB_URI) {
    console.error("MONGODB_URI not found in .env.local");
    process.exit(1);
}

const RoleSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    permissions: mongoose.Schema.Types.Mixed,
    isCustom: { type: Boolean, default: false }
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    lastLogin: { type: Date }
}, { timestamps: true });

const Role = mongoose.models.Role || mongoose.model('Role', RoleSchema);
const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function seedAdmin() {
    try {
        console.log(`Connecting to MongoDB (${dbName})...`);
        await mongoose.connect(MONGODB_URI, { dbName });
        console.log("Connected successfully to MongoDB!");

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
            },
            {
                name: 'SEO Manager',
                isCustom: false,
                permissions: {
                    pages: { create: false, read: true, update: false, delete: false, publish: false },
                    media: { create: false, read: true, update: false, delete: false },
                    seo: { read: true, update: true },
                    blog: { create: false, read: true, update: true, delete: false, publish: false },
                    submissions: { read: false, delete: false },
                    settings: { read: false, update: false },
                    users: { read: false, create: false, update: false, delete: false },
                    logs: { read: false }
                }
            },
            {
                name: 'Writer',
                isCustom: false,
                permissions: {
                    pages: { create: true, read: true, update: true, delete: false, publish: false },
                    media: { create: true, read: true, update: false, delete: false },
                    seo: { read: true, update: false },
                    blog: { create: true, read: true, update: true, delete: false, publish: false },
                    submissions: { read: false, delete: false },
                    settings: { read: false, update: false },
                    users: { read: false, create: false, update: false, delete: false },
                    logs: { read: false }
                }
            }
        ];

        for (const r of rolesData) {
            await Role.updateOne({ name: r.name }, { $set: r }, { upsert: true });
        }
        console.log("Roles seeded / verified.");

        const adminRole = await Role.findOne({ name: 'Admin' });

        // 2. Seed Admin Users
        const usersToSeed = [
            {
                username: 'admin',
                email: 'admin@lightsovercolumbus.com',
                password: 'Password123!',
                role: adminRole._id,
                status: 'active'
            },
            {
                username: process.env.ADMIN_USERNAME || 'clocadmin',
                email: 'admin@lightsovercolumbus.com',
                password: process.env.ADMIN_PASSWORD || 'LightsOverColumbus2025!',
                role: adminRole._id,
                status: 'active'
            }
        ];

        for (const u of usersToSeed) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(u.password, salt);

            await User.updateOne(
                { username: u.username },
                {
                    $set: {
                        username: u.username,
                        email: u.email,
                        password: hashedPassword,
                        role: u.role,
                        status: u.status
                    }
                },
                { upsert: true }
            );
            console.log(`Seeded Admin: Username "${u.username}", Password: "${u.password}"`);
        }

        console.log("\nAll admin users and roles successfully seeded into database!");
    } catch (error) {
        console.error("Error during admin seeding:", error);
    } finally {
        await mongoose.connection.close();
        console.log("Connection closed.");
    }
}

seedAdmin();
