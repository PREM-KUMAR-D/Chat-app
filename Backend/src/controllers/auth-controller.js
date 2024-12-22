const bcrypt = require('bcryptjs');
const User = require('../models/user-model');
const { generateToken } = require('../lib/util');


exports.signUp = async (req, res, next) => {
    try {
        const {fullName , email, password} = req.body;

        if(!fullName || !email || !password){
            return res.status(400).json({
                message: "Please provide values for all the fields"
            })
        }


        if(password.length < 6){
            return res.status(400).json({
                message: "Password must be at least 6 Characters"
            });
        }

        const user = await User.findOne({
            email
        });

        if(user){
            return res.status(400).json({
                message: "User already exists! Login with existing account"
            });
        }
        

        const salt = await bcrypt.genSalt(10);

        const hashedPass = await bcrypt.hash(password,salt);
        

        const newUser = new User({
            fullName,
            email,
            password: hashedPass,
        });

        if(newUser){

            generateToken(newUser._id,res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,

            })


        }else{
            res.status(400).json({
                message: "Invalid User Data"
            })
        }

    } catch (error) {
        console.log("Error occured ", error.message);
    }
}

exports.login =  (req, res, next) => {
    return res.status(200).send("working lol...")
}

exports.logout =  (req, res, next) => {
    return res.status(200).send("working lol...")
}