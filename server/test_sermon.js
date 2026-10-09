const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const Sermon = require('./src/models/Sermon');

async function test() {
  console.log("Connecting...");
  await mongoose.connect(process.env.MONGODB_URI);
  try {
    console.log("Connected! Creating model...");
    const sermon = await Sermon.create({
      title: 'Test',
      speaker: 'Test'
    });
    console.log('Success:', sermon);
  } catch (err) {
    console.error('Validation Error Details:', err.errors);
    console.error('Error Message:', err.message);
  }
  process.exit();
}
test();
