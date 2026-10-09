const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');

// Load env vars
dotenv.config();

// Connect to database
mongoose.connect(process.env.MONGODB_URI);

const createAdmin = async () => {
    try {
        const username = process.argv[2];
        const email = process.argv[3];
        const password = process.argv[4];

        if (!username || !email || !password) {
            console.log('Usage: node createAdmin.js <username> <email> <password>');
            process.exit(1);
        }

        const admin = await User.create({
            username,
            email,
            password,
            role: 'admin'
        });

        console.log(`Admin user created: ${admin.username} (${admin.email})`);
        process.exit(0);
    } catch (err) {
        console.error('Error creating admin:', err.message);
        process.exit(1);
    }
};

createAdmin();
