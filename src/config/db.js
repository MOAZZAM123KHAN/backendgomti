const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  const conn = await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  isConnected = true;
  console.log('✅ MongoDB connected:', conn.connection.name);
};

module.exports = connectDB;
