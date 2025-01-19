const mongoose = require("mongoose");

const atsResultSchema = new mongoose.Schema({

    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    suggestion : {
        type : String
    },
    jobDescription : {
        type : String
    },
    jobTile : {
        type : String
    },
    pdfName : {
        type : String ,
        required : true
    },
    createdAt : {
        type : Date,
        default : Date.now
    }

});

module.exports = mongoose.model("AtsResult" , atsResultSchema);