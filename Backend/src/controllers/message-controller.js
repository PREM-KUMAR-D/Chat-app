const { default: Message } = require("../models/message-model");
const User = require("../models/user-model");
const cloundinary = require('../lib/cloudinary');

exports.getUserForSideBar = async (req,res,next)=>{
    try {
        const loggedInUserId = req.user._id;

        const filteredUsers = await User.find({
            _id: {
                $ne: loggedInUserId,
            }
        }).select("-password");

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("Error in get side bars", error.message);
        res.status(500).json({
            message: "Internal Server Error"
        })

    }


}

exports.getMessages = async (req,res,next)=>{
    try {
        const {id: userToChatId} = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or:[
                {
                    senderId: myId, recieverId: userToChatId
                },
                {
                    senderId: userToChatId, recieverId: myId
                }
            ]
        })

        res.status(200).json(messages);
        
    } catch (error) {
        console.log("Error in get side bars", error.message);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}


exports.sendMessage = async (req,res,next)=>{
    try {
        const {text , image} = req.body;
        const {id: recieverId} = req.params;
        const senderId = req.user._id;

        let imageUrl ;
        if(image){
            const uploadResponse = await cloundinary.uploader.upload(image);
            imageUrl  = uploadResponse.secure_url;
        }
        
        const newMessage = new Message({
            senderId,
            recieverId,
            text,
            image: imageUrl,
        })

        await newMessage.save();

        res.status(201).json(newMessage);

    } catch (error) {
        console.log("Error in get side bars", error.message);
        res.status(500).json({
            message: "Internal Server Error"
        })       
    }
}