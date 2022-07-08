const jwt = require("jsonwebtoken");

const authorize = async (req,res,next) => {

    try{
        const token = await req.headers.authorization.split(" ")[1];

       const decoded = await jwt.verify(
             token,
            "SSSEECCRRREEETTTT"
        )
         
       const user = await decoded; 

       req.user = user;

       next();
    }
    catch(error){
         res.status(401).json({message:"Invalid Request!"})
         console.log(error)
    }
}

module.exports = authorize;