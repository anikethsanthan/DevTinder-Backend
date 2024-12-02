const express=require("express");
const profileRouter= express.Router();
const {userAuth}=require("../middlewares/auth");
const User =require("../models/user");
const validator =require("validator");

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

profileRouter.patch("/profile/edit/:userId",async(req,res)=>{
    const userId= req.params?.userId;
    const data= req.body;
    try{
        const allowedUpdates=["firstName","lastName","password","gender","about","skills","photoUrl"];
        const isUpdateAllowed= Object.keys(data).every((k)=> allowedUpdates.includes(k));

        if(!isUpdateAllowed){
            throw new Error("Updation of this field is not allowed")
        }
        if(data.skills && data.skills.length > 10){
            throw new Error("You can only add upto 10 skills")
        }
        if(data.photoUrl && !validator.isURL(data.photoUrl)){
            throw new Error ("Enter a valid photo URL")
        }

        await User.findByIdAndUpdate(userId, data ,{runValidators:true});
        res.send("User updated succesfully");
    }catch(err){
        res.send("something went wrong"+ " "+err.message);
    }
})



module.exports={profileRouter};