import mongoose from "mongoose";

const connectDB = async () => {
    try {
        console.log('connecting to mongodb...');
        const connect = await mongoose.connect(`${process.env.MONGO_URI}`);
        console.log('mongodb connected');
    } catch (error) {   
        console.log("Error connecting mongodb..", error);
    }
}

export default connectDB;