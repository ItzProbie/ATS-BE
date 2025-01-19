const User = require("../models/User");
const otpGenerator = require("otp-generator");
const OTP = require("../models/OTP");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = async(req , res) => {

    try{

        const {
            name , email , password , otp
        } = req.body;

        if(!name || !email || !password || !otp){
            return res.status(400).json({
                success : false,
                message : "Missing or incomplete fields"
            });
        }

        if(password.length < 8){
            return res.status(400),json({
                success : false,
                message : "Password length must be atleast 8"
            });
        }

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success : false,
                message : "User already registered , please login"
            });
        }

        const otpDB = await OTP.find({email}).sort({createdAt : -1}).limit(1);
        if(otpDB.length === 0){
            return res.status(400).json({
                success : false,
                message : "Invalid OTP"
            });
        }
        else if(otp !== otpDB[0].otp){

            return res.status(400).json({
                success : false,
                mssg : "Invalid OTP"
            });

        }

        const hashedPassword = await bcrypt.hash(password , 10);

        const user = await User.create({
            name , email ,
            password: hashedPassword 
        });

        return res.status(200).json({
            success : true
        });


    }catch(err){
        console.log(err);
        return res.status(500).json({
            success : false,
            error : err.message,
            mssg : "Cant signup, plz try again later"
        });

    }

}

exports.sendOtp = async(req , res) => {

    try{

        const {email} = req.body;

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success : false,
                message : "User already registered , please login"
            });
        }

        var otp = otpGenerator.generate(6 , {
            upperCaseAlphabets : false,
            lowerCaseAlphabets : false,
            specialChars : false
        });

        let result = await OTP.findOne({otp});
        while(result){
            otp = otpGenerator.generate({
                upperCaseAlphabets : false,
                lowerCaseAlphabets : false,
                specialChars : false
            });
            result = await OTP.findOne({otp});
        }

        await OTP.create({
            email ,
            otp
        })

        return res.status(200).json({
            success : true,
            message : "OTP sent successfully",
        });

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success : false,
            error : err.message,
            mssg : "Cant send otp, plz try again later"
        });

    }

}

exports.login = async(req, res) => {

    try{

        const {email,password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                success : false,
                message : "Missing login credentials"
            });
        }

        const user = await User.findOne({email});

        if(!user){
            return res.status(404).json({
                success : false,
                message : "User not found, please singup first"
            });
        }

        if(await bcrypt.compare(password , user.password)){

            const payload = {
                email: user.email,
                id: user._id
            };

            const token = jwt.sign(payload , process.env.JWT_SECRET , {
                expiresIn: "2h"
            });

            user.password = null;

            return res.status(200).json({
                success : true,
                token,
                user
            });

        }

        else{

            return res.status(403).json({
                success : false,
                message : "Password is incorrect"
            });

        }

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success : false,
            error : err.message,
            mssg : "Cant login, plz try again later"
        });
    }

}