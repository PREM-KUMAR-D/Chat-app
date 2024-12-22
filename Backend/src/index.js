const express = require("express");
const dotenv = require('dotenv');

const db = require('./lib/db');
const authRoutes = require('./routes/auth-routes');


const app = express();
dotenv.config();

const PORT = process.env.PORT;

app.use("/api/auth", authRoutes )



app.listen(PORT,()=>{
    console.log("Server started ... at port ", PORT);
    db.connectDB()
})