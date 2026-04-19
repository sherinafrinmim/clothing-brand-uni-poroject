require('dotenv').config();
const { User } = require('./src/models');
const { connectDB } = require('./src/config/db');
const bcrypt = require('bcryptjs');

async function createAdmin() {
    try {
        await connectDB();
        
        // Check if admin already exists
        const adminEmail = 'admin@example.com';
        const existingAdmin = await User.findOne({ where: { email: adminEmail } });
        
        if (existingAdmin) {
            console.log("Admin user already exists! Email: admin@example.com, Password is the one you set.");
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash('admin123', 10);
        
        await User.create({
            name: 'Super Admin',
            email: adminEmail,
            password: 'admin123', // Model hook should hash this if hooks exist, but if not we should check.
            role: 'ADMIN'
        });

        console.log("Admin created successfully!");
        console.log("Email: admin@example.com");
        console.log("Password: admin123");
        process.exit(0);

    } catch (err) {
        console.error("Failed to create admin:", err);
        process.exit(1);
    }
}

createAdmin();
