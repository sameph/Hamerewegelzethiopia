const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Course = require('./src/models/Course');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lms')
    .then(async () => {
        const courses = await Course.find({}, { title: 1, price: 1 });
        console.log('Courses:', JSON.stringify(courses, null, 2));
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
