const express=require("express");
const profileRouter= express.Router();
const {userAuth}=require("../middlewares/auth");
const User =require("../models/user");
const validator =require("validator");
const {validateEditRequest}=require("../utils/validateSignup");
const validatePassword= require("../models/user");
const bcrypt=require("bcrypt");

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
            throw new Error("Invalid Edit request")
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
        res.status(200).json(user);
    }catch(err){
        res.send("something went wrong"+ " "+err.message);
    }
})
//Add security ques for user in login and also keep it as an option to update password
profileRouter.patch("/profile/forgotPassword",async(req,res)=>{
    try{
        const { emailId, oldPassword, newPassword } = req.body;
        if (!emailId || !oldPassword || !newPassword) {
            return res.status(400).json({ error: "All fields are required." });
        }

        const loggedUser= await User.findOne({emailId:emailId});
        if(!loggedUser){
            return res.status(404).json({ error: "User not found" });
        }

        
        const isPasswordValid= await loggedUser.validatePassword(oldPassword)
            if(!isPasswordValid){
                return res.status(401).json({ error: "Invalid old password" });
            }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        loggedUser.password = hashedPassword;


         await loggedUser.save();

         return res.status(200).json({ message: "Password updated successfully." });

    }catch(err){
        console.error("Error updating password:", err.message);
        return res.status(500).json({ error: "Internal Server Error." });
    }
})



module.exports={profileRouter};