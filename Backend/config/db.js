import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/saferoute', {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database Error] MongoDB connection failed: ${error.message}`);
    console.warn(`[Database Notice] Ensure MongoDB is running locally at mongodb://127.0.0.1:27017 or set a valid MONGO_URI in Backend/.env (e.g. MongoDB Atlas).`);
  }
};

export default connectDB;

