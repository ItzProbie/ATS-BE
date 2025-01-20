
exports.findATS = async(req , res) => {

    try{

        const {fileName , jobDescription , jobTitle} = req.query;
        console.log(fileName);

        if(!fileName){
            return res.status(400).json({
                success : false,
                message : "Missing File"
            });
        }

        return res.status(200).json({
            success : true,
            message : "simulate the model, establish workers & queue, ratelimit this endPoint"
        });

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success : false,
            message : "Something went wrong whil finding ATS, plz try again later"
        });
    }

}