const { S3Client, GetObjectCommand , PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
require('dotenv').config();

const s3 = new S3Client({
    region : "ap-south-1",
    credentials : {
        accessKeyId : process.env.AWS_ACCESSKEYID,
        secretAccessKey : process.env.AWS_SECRETACCESSKEYID
    }
});

//make sure to do FE validation , so only pdf files can br uploaded
//also delete the presignedurl or use a flag if the upload operation is complete
exports.putObject = async(filename , contentType) => {

    try{

        const command =  new PutObjectCommand({
            Bucket: 'probie-global-bucket',
            Key: `/uploads/user-uploads/${filename}`,
            ContentType: contentType
        });
    
        const url = await getSignedUrl(s3 , command , {expiresIn: 5*60});
        // console.log(url);
        
        return url;

    }catch(err){
        console.log(err);
        throw new Error("Failed to generate presigned put url");
    }

}

exports.getObject = async(key) => {
    try{

        const command = new GetObjectCommand({
            Bucket: 'probie-global-bucket',
            Key: `/uploads/user-uploads/${key}`
        });

        const url = await getSignedUrl(s3 , command , {expiresIn : 2*60*60});

        return url;

    }catch(err){
        console.log(err);
        throw new Error("Failed to generate presigned get url");
    }
}