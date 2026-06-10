import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export async function connectDB() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        throw new Error("MONGODB_URI is not defined in .env!");
    }

    await mongoose.connect(uri);
    console.log("MongoDB connected successfully!");

    mongoose.connection.on('disconnected', () => {
        console.warn("MongoDB disconnected.");
    })
}

export async function disconnectDB() {
    await mongoose.disconnect();
    console.log("MongoDB disconnected successfully!");
}

