const { uploadDirect } = require("../utils/s3");
const { blockUser } = require("./Redis-Wrapper");

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

       
        const uploadFile = await uploadDirect(
            `${Date.now()}`,
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