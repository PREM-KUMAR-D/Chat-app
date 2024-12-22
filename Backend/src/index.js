const express = require("express");
const dotenv = require('dotenv');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');


const db = require('./lib/db');
const authRoutes = require('./routes/auth-routes');
const messageRoutes = require('./routes/message-routes');

dotenv.config();

const PORT = process.env.PORT;

const app = express();

app.use(bodyParser.json());

app.use(cookieParser());



app.use("/api/auth", authRoutes );
app.use("/api/message", messageRoutes );






app.listen(PORT,()=>{
    console.log("Server started ... at port ", PORT);
    db.connectDB()
})