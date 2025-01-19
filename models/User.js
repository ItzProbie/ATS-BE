const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique: true
    },
    password : {
        type : String,
        required : true,
    },
    atsResults : [
        {
            atsResult : {
                type : mongoose.Schema.Types.ObjectId,
                ref : "AtsResult",
                required : true
            },
            jobTitle : {type : String},
            ats_score_relative : {type : Number , required : true},
            ats_score_nonRelative : {type : Number},
            createdAt : {type : Date , default : Date.now},
        }
    ],
    resetPasswordToken : {
        type : String
    },
    resetpasswordExpire : {
        type : Date
    }

} , {timestamps : true});

module.exports = mongoose.model("user" , userSchema);