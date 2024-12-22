const jwt=require("jsonwebtoken");
const User=require("../models/user")

const userAuth=async(req,res,next)=>{
 try {  const cookies= req.cookies;

    const {token}=cookies;
    if(!token){
        return res.status(401).json({ error: "Unauthorized: No token provided, Please login to continue !" });
    }

    const decodedObj= await jwt.verify(token, "DEV@Tinder$790")

    const {_id}=decodedObj;

    const user= await User.findById(_id);
    if(!user){
        return res.status(401).json({ error: "Unauthorized: User not found!!!" });
        
    }

    req.user=user;
    next();
}
catch(err){
    return res.status(401).json({ error: "Authentication failed: " + err.message });
    }
}

module.exports={userAuth};