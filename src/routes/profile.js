const express=require("express");
const profileRouter= express.Router();
const {userAuth}=require("../middlewares/auth");

profileRouter.get("/profile",userAuth, async(req,res)=>{
    try{
       const user=req.user;
       if(!user){
        throw new Error("Invalid token");
       }
        res.send(user)

    }catch(err){
        throw new Error("Error"+ err.message)
    }
})


module.exports={profileRouter};