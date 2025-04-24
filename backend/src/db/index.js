import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI)
    console.log('🌟 Connected to MongoDB at',connectionInstance.connection.host)
  } catch (err) {
    console.log('Error Occured While Connecting to DataBase', err)
    process.exit(1)
  }
}

export default connectDB