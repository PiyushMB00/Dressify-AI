import mongoose from "mongoose"
const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("✅ MongoDB connected successfully");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error);
        console.log("⚠️  Running without database - data will not persist");    

        }
};
export default connectDb;


        