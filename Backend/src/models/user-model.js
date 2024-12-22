const monogoose = require('mongoose');

const userSchema =  new monogoose.Schema(
    {
        email: {
            type: String ,
            required: true,
            unique: true,
        },
        fullName : {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required : true,
            minLength: 6,
        },
        profilePic: {
            type: String,
            default : "",
        }

    },{
        timestamps: true
    }
)

const User = monogoose.model("User", userSchema);

module.exports = User;
