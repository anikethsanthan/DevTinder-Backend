const express=require("express");
const profileRouter= express.Router();
const {userAuth}=require("../middlewares/auth");
const User =require("../models/user");
const validator =require("validator");
const {validateEditRequest}=require("../utils/validateSignup")

profileRouter.get("/profile/view",userAuth, async(req,res)=>{
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

profileRouter.patch("/profile/edit",userAuth,async(req,res)=>{
    
 

    try{
        if(!validateEditRequest(req)){
            throw new Error("Invalid Edit reques")
        }
        const user= req.user;
 
        Object.keys(req.body).forEach((key)=>(user[key]=req.body[key ]))
       
        const data= req.body;
        if(data.skills && data.skills.length > 10){
            throw new Error("You can only add upto 10 skills")
        }
        if(data.photoUrl && !validator.isURL(data.photoUrl)){
            throw new Error ('Enter a valid photo URL')
        }

        await user.save();
        res.send( user.firstName+' your profile  updated succesfully');
    }catch(err){
        res.send("something went wrong"+ " "+err.message);
    }
})



module.exports={profileRouter};