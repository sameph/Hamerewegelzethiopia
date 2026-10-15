const mongoose = require('mongoose');
const dotenv = require('dotenv');
const LiveEvent = require('./src/models/LiveEvent');

dotenv.config();

const testFetch = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lms');
        
        const events = await LiveEvent.find({});
        console.log(`Found ${events.length} events`);
        
        const today = new Date();
        today.setHours(0,0,0,0);
        const tom = new Date(today);
        tom.setDate(tom.getDate() + 1);
        
        const todayEvents = await LiveEvent.find({
            startTime: { $gte: today, $lt: tom }
        });
        console.log(`Found ${todayEvents.length} events for today`);
        
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

testFetch();
