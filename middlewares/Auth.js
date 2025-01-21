const jwt = require("jsonwebtoken");
require("dotenv").config();
const multer = require("multer");

const User = require("../models/User");

exports.auth = async(req,res,next) => {
    try{

        const token = req.body.token   ||
                      (req.header("Authorization") && req.header("Authorization").replace("Bearer ", ""));
        
        if(!token){
            return res.status(401).json({
                success : false,
                mesage : "Auth Failed"
            });
        }

        try{
            
            const decode = jwt.verify(token , process.env.JWT_SECRET);
            req.user = decode;
            
        }catch(err){
            return res.status(401).json({
                success :false,
                message : "token is invalid"
            });
        }
        next();

    }catch(err){
        console.log(err);
        return res.status(401).json({
            success :false,
            message : "Something went wrong while validating the token, plz try again later",
            error : err.mesage
        });
    }
};


exports.upload = multer({
  storage: multer.memoryStorage(), // Store files in memory
  limits: { fileSize: 5 * 1024 * 1024 }, // 6 MB file size limit
  fileFilter: (req, file, cb) => {
    console.log('Processing file:', file);
    if (file.mimetype === "application/pdf") {
      cb(null, true); // Accept the file
    } else {
      cb(new Error("Only PDF files are allowed!")); // Reject other file types
    }
  },
});
