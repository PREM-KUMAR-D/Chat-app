const express = require("express")
const authRoutes = require('./routes/auth-routes');

const app = express();


app.use("/api/auth", authRoutes )



app.listen(5001,()=>{
    console.log("Server started ...")
})