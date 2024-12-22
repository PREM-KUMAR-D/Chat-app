const jwt = require('jsonwebtoken')
const User = require('../models/user-model');


exports.protectRoute = async (req,res,next)=>{

    try {
        const token = req.cookies.jwt;

        if(!token){
            return res.status(401).json({
                message:'Unauthorized - No token provided'
            });
        }

        const decoded = jwt.verify(token,process.env.JWT_TOKEN);

        if(!decoded){
            return res.status(401).json({
                message:'Unauthorized - Invalid Token'
            });
        }

        const user = await User.findById(decoded.userId).select("-password");

        if(!user){
            return res.status(404).json({
                message:'User Not Found'
            });
        }

        req.user = user;

        next();


    } catch (error) {
        console.log("Error occured ", error.message);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }


}