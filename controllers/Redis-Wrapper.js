const {Redis} = require("ioredis");
require('dotenv').config();

const redis = new Redis({
    host : process.env.REDIS_HOST,
    port : process.env.REDIS_PORT,
    password : process.env.REDIS_PASS
});

redis.on("error" , ((err) => {
    console.log(err);
    console.log("redis connection error")
}))

redis.on("connect" ,() => console.log("Redis connection successfull"));

//middleware for limitReach
exports.s3UploadLimitMid = async(req , res , next) => {

    try{
        console.log("s3uploadLimit");
        const userId = req.user.id;

        let uploadCnt = parseInt(await redis.get(`uploadCnt-${userId}`)) || 0;
        console.log(uploadCnt);

        if(!uploadCnt){
            await redis.setex(`uploadCnt-${userId}` , 5*60 ,1 );
            return res.status(200).json({
                success : true
            });
        }


        if(uploadCnt > 4){
            return res.status(403).json({
                success : false,
                message : "Upload Limit Exceeded"
            });
        }


        await redis.incrby(`uploadCnt-${userId}`, 1);

        
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success : false,
            message : "S3 upload limit failed, plz try again later"
        });
    }
    next()

}


exports.blockUser = async(userId) => {

    try{
        console.log("blockUser");
        if(!userId){
            console.log("User id not found")
            return; 
        }
    
        await redis.setex(`blockedUser-${userId}` , 35 , 1);    
        return 'true';

    }catch(err){
        consloe.log(err);
        return;
    }

}

exports.isUserBlockedMid = async(req , res , next) => {

    try{
        console.log("Hii");
        const isUserBlocked = await redis.exists(`blockedUser-${req.user.id}`);
        
        if(isUserBlocked){
            return res.status(429).json({
                success : false,
                message : "Please wait for your previous request to complete"
            });
        }

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success : false,
            message : "User id invalid"
        });
    }
    next();

}

exports.isResultReady = async(req , res) => {

    try{

        const results = await redis.get(`ats-results-${req.user.id}`);
        if(!results){
            return res.status(404).json({
                success : false
            });
        }

        await redis.del(`ats-results-${req.user.id}`);
        return res.status(200).json({
            success : true,
            results
        });

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success : false,
            message : "Error in checking results availability, plz try again later"
        });
    }

}

//endPointForModel
exports.post = async(req , res) => {

    try{

        const {mssg , userId} = req.body;

        if(!mssg || !userId){
            return res.status(400).json({
                success : false,
                message : "Missing Fields"
            });
        }

        console.log(mssg);

        await redis.setex(`ats-results-${userId}` , 120 , mssg);

        return res.status(200).json({
            success : true
        });

    }catch(err){
        return res.status(500).json({
            success : false,
            message : "Endpoint for model result upload failed"
        });
    }

}