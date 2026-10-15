const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Load models
const Course = require('./src/models/Course');
const Lesson = require('./src/models/Lesson');
const User = require('./src/models/User');

// Connect to DB
mongoose.connect(process.env.MONGODB_URI);

// Sample Data derived from frontend courseData.ts
const coursesData = [
  {
    title: "Biblical Foundations",
    category: "Theology",
    description: "A core course on biblical interpretation, doctrine, and foundational theology for ministry.",
    outcomes: [
      "Understand core biblical themes",
      "Apply interpretation frameworks",
      "Connect doctrine with practical ministry",
    ],
    difficulty: "Beginner",
    duration: "8 weeks",
    isPopular: true,
    thumbnail: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Church History",
    category: "History",
    description: "Explore major periods of church history and their impact on modern Christian life.",
    outcomes: ["Map key historical periods", "Identify influential leaders", "Interpret doctrinal developments"],
    difficulty: "Intermediate",
    duration: "7 weeks",
    thumbnail: "https://images.unsplash.com/photo-1455885666463-9a42f5f48c5f?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Pastoral Care",
    category: "Ministry",
    description: "Develop counseling, visitation, and pastoral response skills for local church ministry.",
    outcomes: ["Strengthen care ministry", "Lead crisis response", "Practice biblical counseling"],
    difficulty: "Intermediate",
    duration: "6 weeks",
    thumbnail: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Ministry Leadership",
    category: "Leadership",
    description: "Build leadership habits, team communication, and decision-making for ministry contexts.",
    outcomes: ["Lead teams effectively", "Create ministry plans", "Resolve conflict biblically"],
    difficulty: "Advanced",
    duration: "9 weeks",
    isPopular: true,
    thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
  }
];

const lessonsData = {
    "Biblical Foundations": [
      { title: "Introduction to Scripture", type: "video", duration: "14 min", content: "Intro content", order: 1, resources: ["Slides", "Reading PDF"] },
      { title: "Context and Canon", type: "reading", duration: "20 min", content: "Canon content", order: 2, resources: ["Workbook"] },
      { title: "Old Testament Survey", type: "video", duration: "18 min", content: "OT content", order: 3, resources: ["Lecture Notes"] }
    ],
    "Church History": [
      { title: "Early Church Era", type: "video", duration: "13 min", content: "Early church content", order: 1, resources: ["Timeline PDF"] },
      { title: "Reformation Movement", type: "document", duration: "17 min", content: "Reformation content", order: 2, resources: ["Discussion Guide"] }
    ]
};

// Import into DB
const importData = async () => {
  try {
    // Check for admin user
    let admin = await User.findOne({ role: 'admin' });
    if (!admin) {
        admin = await User.create({
            username: 'Admin User',
            email: 'admin@example.com',
            password: 'password123',
            role: 'admin'
        });
    }

    await Course.deleteMany();
    await Lesson.deleteMany();

    for (const courseInfo of coursesData) {
        const course = await Course.create({
            ...courseInfo,
            instructor: admin._id
        });

        const lessons = lessonsData[courseInfo.title];
        if (lessons) {
            for (const lessonInfo of lessons) {
                await Lesson.create({
                    ...lessonInfo,
                    course: course._id
                });
            }
        }
    }

    console.log('Data Imported...');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await Course.deleteMany();
    await Lesson.deleteMany();
    await User.deleteMany({ email: 'admin@example.com' });
    console.log('Data Destroyed...');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
