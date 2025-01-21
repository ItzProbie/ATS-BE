const {Redis} = require("ioredis");
require('dotenv').config();

const redis = new Redis({
    host : process.env.REDIS_HOST,
    port : process.env.REDIS_PORT,
    password : process.env.REDIS_PASS
});

redis.on("error" , ((err) => {
    console.log(err);
}))

redis.on("connect" ,() => console.log("Redis connection successfull"));

//middleware for limitReach
exports.s3UploadLimitMid = async(req , res , next) => {

    try{

        const userId = req.user._id;

        let uploadCnt = parseInt(await redis.get(`uploadCnt-${userId}`)) || 0;
        console.log(uploadCnt);

        if(!uploadCnt){
            await redis.setex(`uploadCnt-${userId}` , 5*60 ,1 );
        }

        else{

            if(uploadCnt > 4){
                return res.status(403).json({
                    success : false,
                    message : "Upload Limit Exceeded"
                });
            }
    
    
            await redis.incrby(`uploadCnt-${userId}`, 1);

        }

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success : false,
            message : "Rate Limiter Failed"
        });
    }
    next();

}

exports.s3UploadLimit = async(req , res) => {

    try{
        const userId = req.user.id;

        let uploadCnt = parseInt(await redis.get(`uploadCnt-${userId}`)) || 0;
        console.log(uploadCnt);

        if(!uploadCnt){
            await redis.setex(`uploadCnt-${userId}` , 5*60*60 ,1 );
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

        return res.status(200).json({
            success : true
        });
        
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success : false,
            message : "S3 upload limit failed, plz try again later"
        });
    }

}