const bcrypt = require('bcryptjs');
const User = require('../models/user-model');
const { generateToken } = require('../lib/util');
const {cloudinary} = require('../lib/cloudinary');


exports.signUp = async (req, res, next) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({
                message: "Please provide values for all the fields"
            })
        }


        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 Characters"
            });
        }

        const user = await User.findOne({
            email
        });

        if (user) {
            return res.status(400).json({
                message: "User already exists! Login with existing account"
            });
        }


        const salt = await bcrypt.genSalt(10);

        const hashedPass = await bcrypt.hash(password, salt);


        const newUser = new User({
            fullName,
            email,
            password: hashedPass,
        });

        if (newUser) {

            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,

            })


        } else {
            res.status(400).json({
                message: "Invalid User Data"
            })
        }

    } catch (error) {
        console.log("Error occured ", error.message);
    }
}

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        

        if (!user) {
            return res.status(400).json({
                message: "Invalid Credentials"
            })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if(!isPasswordCorrect){
            return res.status(400).json({
                message: "Invalid Credentials"
            })
        }
        
        generateToken(user._id,res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,

        })

    } catch (error) {
        console.log("Error occured ", error.message);
    }
}

exports.logout = (req, res, next) => {
    try {
        res.cookie("jwt","", {
            maxAge:0
        })
        res.status(200).json({
            message: "Logged Out Successfully!"
        })

    } catch (error) {
        console.log("Error occured ", error.message);
    }
}

exports.updateProfile = async (req,res,next)=>{
    try {
        const {profilePic }= req.body;
        
        const userId =req.user._id;

        if(!profilePic){
            return res.status(400).json({
                message: "Profile pic is required"
            });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);

        const updateUser = await User.findByIdAndUpdate(userId,{
            profilePic: uploadResponse.secure_url
        },{
            new: true
        })

        res.status(200).json(updateUser)

    } catch (error) {
        console.log("Error occured ", error.message);
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

exports.checkAuth = async (req,res,next)=>{
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error occured ", error.message);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}