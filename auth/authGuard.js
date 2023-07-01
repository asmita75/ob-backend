const jwt = require("jsonwebtoken");
const authGuard= (req,res,next) =>{

    const authHeader= req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({error:"Authorization Failed"});
    }

    const token = authHeader.split(" ")[1];

    if(!token){
        return res.status(401).json({error:"No header token found"});
    }

    // if token is present

    try{
        const decodeUser=jwt.verify(token,process.env.JWT_SECRET);
        req.User=decodeUser;
        next();

    }catch(error){
        console.log(error);
        res.json({error:"Invalid Token"});
    }

};
module.exports=authGuard;