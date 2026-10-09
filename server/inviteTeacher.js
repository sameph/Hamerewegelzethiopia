const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');

// Load env vars
dotenv.config();

// Connect to database
mongoose.connect(process.env.MONGODB_URI);

const inviteTeacher = async () => {
    try {
        const username = process.argv[2];
        const email = process.argv[3];
        const password = process.argv[4];

        if (!username || !email || !password) {
            console.log('Usage: node inviteTeacher.js <username> <email> <password>');
            process.exit(1);
        }

        const teacher = await User.create({
            username,
            email,
            password,
            role: 'instructor'
        });

        console.log(`Teacher account created: ${teacher.username} (${teacher.email})`);
        process.exit(0);
    } catch (err) {
        console.error('Error creating teacher:', err.message);
        process.exit(1);
    }
};

inviteTeacher();
