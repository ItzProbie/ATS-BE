const { putObject , getObject } = require("../utils/s3");

exports.upload = async(req , res) => {

    try{

        const {mediaType , mediaSize} = req.query;

        if(!mediaType || !mediaSize){
            return res.status(400).json({
                success : false,
                message : "Missing Fields"
            });
        }

        const sizeInBytes = parseInt(mediaSize, 10);
        if (isNaN(sizeInBytes)) {
            return res.status(400).json({
                success: false,
                message: "Invalid mediaSize: must be a numeric value",
            });
        }

        if(mediaType !== 'pdf' || sizeInBytes > 5 * 1024 * 1024){
            return res.status(403).json({
                success : false,
                message : "Invalid Media Meta Data"
            });
        }


        const presignedUploadUrl = await putObject(
            `${Date.now()}`,
            mediaType
        );

        return res.status(200).json({
            success : true,
            presignedUploadUrl
        });

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success : false,
            message : "Cant generate presigned uploadUrl, plz try again later"
        });
    }

}

exports.download = async(req , res) => {
    try{

        const {key} = req.query;

        if(!key){
            return res.status(400).json({
                success : false,
                message : "Incomplete fields"
            });
        }

        const preSignedGetUrl = await getObject(key);

        return res.status(200).json({
            success : true,
            preSignedGetUrl
        });

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Error while generaating getUrl, plz try again later"
        });
    }
}