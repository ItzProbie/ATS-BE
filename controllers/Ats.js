const { uploadDirect, getObject } = require("../utils/s3");
const { blockUser } = require("./Redis-Wrapper");
const {Queue} = require("bullmq");
require("dotenv").config();

const connection = {
    host : process.env.REDIS_HOST,
    port : process.env.REDIS_PORT,
    password : process.env.REDIS_PASS
}

const mssgQueue = new Queue('Task-Queue' , {
    connection
});

exports.findATS = async(req , res) => {

    try{

        const {jobDescription , jobTitle} = req.body;
        const file = req.file;
        console.log(file);

        if(!file){
            return res.status(400).json({
                success : false,
                message : "Missing File"
            });
        }

        const uploadFileName = `${Date.now()}`;
        const uploadFile = await uploadDirect(
            uploadFileName,
            file.buffer,
            'application/pdf'
        )

        console.log(uploadFile);

        //now send it to the model but before that 
        //enter this userID's entry in cache to map the results with the model

        const ok = await blockUser(req.user.id);        

        if(ok !== 'true'){
            throw new Error("Something went wrong while blocking the user");
        }

        const preSignedGetUrl = await getObject(uploadFileName);
        const trial = await mssgQueue.add('Trial Model Task' , {
            url : preSignedGetUrl,
            name: uploadFileName
        })

        console.log("ake Trial : " , trial);

        return res.status(200).json({
            success : true,
        });    

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success : false,
            message : "Something went wrong while finding ATS, plz try again later"
        });
    }




}