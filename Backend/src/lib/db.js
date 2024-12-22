const mongoose = require('mongoose');

exports.connectDB = async ()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);

        console.log(`MongoDB connected: ${conn.connection.host}`);


    } catch (error) {
        console.log("MongoDB Connection error ", error);
    }
}