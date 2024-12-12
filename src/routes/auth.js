const express = require("express");
const {validateSignup} =require("../utils/validateSignup");
const bcrypt=require("bcrypt");
const User =require("../models/user");
const getJWT=require("../models/user.js");
const validatePassword= require("../models/user")


const authRouter= express.Router();
    authRouter.post("/signup",async (req,res)=>{  
    try{
        validateSignup(req);
        const {firstName, lastName, emailId, password}=req.body;
    
        const passwordHash=await bcrypt.hash(password,10);
        const user= new User({
            firstName,
            lastName,
            emailId,
            password:passwordHash
        })
        await user.save();
        res.send("User added succesfully");
    }catch(err){
        res.status(400).send("ERROR :"+" "+err.message);
    }
       
    })

    authRouter.post("/login", async(req,res)=>{
        try{
            const {emailId,password}=req.body;
    
            const user= await User.findOne({emailId:emailId});
            if(!user){
                throw new Error("Invalid Credentials")
            }
            const token= await user.getJWT()
            if(!token){
                throw new Error ("Invalid token")
            }
            const isPasswordValid= await user.validatePassword(password)
            if(!isPasswordValid){
                throw new Error("Invalid Credentials")
            }else{
                res.cookie("token",token)
                res.send(user)
            }
           
            
    
        }catch(err){
            res.status(400).send("Error:"+ " "+err.message); 
        }
    })

    authRouter.post("/logout",async(req,res)=>{
        res.cookie("token",null,{
            expires:new Date(Date.now())
        })
        res.send("Logged Out");
    })
module.exports= {authRouter};