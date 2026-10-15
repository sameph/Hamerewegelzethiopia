const mongoose = require('mongoose');
const dotenv = require('dotenv');
const LiveEvent = require('./src/models/LiveEvent');
const User = require('./src/models/User');
const Course = require('./src/models/Course');

dotenv.config();

const seedLiveEvents = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lms');
        console.log('Connected to MongoDB');

        // Get an instructor
        const instructor = await User.findOne({ role: 'instructor' });
        if (!instructor) {
            console.error('No instructor found to assign events to');
            process.exit(1);
        }

        // Get a course
        const course = await Course.findOne({ instructor: instructor._id });
        
        // Create 2 events for today
        const now = new Date();
        const event1 = new LiveEvent({
            title: 'Biblical Hermeneutics Live',
            description: 'A deep dive into textual interpretation.',
            type: 'Live',
            startTime: new Date(now.setHours(9, 0, 0, 0)),
            endTime: new Date(now.setHours(11, 0, 0, 0)),
            instructor: instructor._id,
            course: course ? course._id : null,
            meetingLink: 'https://zoom.us/j/123456789',
            status: 'upcoming'
        });

        const event2 = new LiveEvent({
            title: 'Pastoral Counseling Webinar',
            description: 'Discussion on community support techniques.',
            type: 'Online',
            startTime: new Date(now.setHours(14, 0, 0, 0)),
            endTime: new Date(now.setHours(15, 30, 0, 0)),
            instructor: instructor._id,
            course: course ? course._id : null,
            meetingLink: 'https://meet.google.com/abc-defg-hij',
            status: 'upcoming'
        });

        await LiveEvent.deleteMany({}); // Clear existing
        await LiveEvent.create([event1, event2]);

        console.log('Seed data created successfully');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedLiveEvents();
