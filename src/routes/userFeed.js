const express = require("express")
const { userAuth } = require("../middlewares/auth")
const ConnectRequest=require("../models/connectionRequest");
const User =require("../models/user");

const SAFE_DATA= ["firstName","lastName","age","gender","about","skills","photoUrl"]
const userFeedRouter =express.Router()

userFeedRouter.get("/user/requests/received" , userAuth, async(req, res)=>{
    try{

        const loggedInUSer= req.user;
        const connectionRequest= await ConnectRequest.find({
            toUserId: loggedInUSer._id,
            status:"interested",
        }).populate("fromUserId" ,SAFE_DATA)

        if(connectionRequest.length === 0){
            res.send("You do not have any requests pending")
        }
        

        res.status(200).send(connectionRequest)

    }catch(err){
    res.status(400).send("Error :"+err.message);
    }
})

userFeedRouter.get("/user/connections", userAuth, async (req,res)=>{
    try{

        const loggedInUSer= req.user;

        const connectionRequest= await ConnectRequest.find({
            $or:[
                {toUserId:loggedInUSer._id, status:"accepted"},
                {fromUserId:loggedInUSer._id, status:"accepted"}
            ]
        }).populate("fromUserId", SAFE_DATA).populate("toUserId", SAFE_DATA);

        const data= connectionRequest.map((row)=>{
            if(row.fromUserId._id.toString()===loggedInUSer._id.toString()){
                return row.toUserId
            }

            return row.fromUserId
        })



        res.status(200).json(data)

    }catch(err){
        res.status(400).send("Error :"+ err.message)
    }
})

userFeedRouter.get("/feed", userAuth, async(req,res)=>{
    try{

        const loggedInUSer=req.user;
        const page = parseInt(req.query.page)||1;
        let limit= parseInt(req.query.limit)||10;
        limit =limit>50? 50 :limit;
        const skip = (page-1)*limit;


        const connectionRequest= await ConnectRequest.find({
            $or:[
                {fromUserId: loggedInUSer._id},
                {toUserId:loggedInUSer._id}
            ]
        }).select("fromUserId toUserId")

        const hiddenUsersFromFedd= new Set();

        connectionRequest.forEach((req)=>{
            hiddenUsersFromFedd.add(req.fromUserId.toString());
            hiddenUsersFromFedd.add(req.toUserId.toString());
        })

        const users= await User.find({
            $and:[
                {_id:{$nin: Array.from(hiddenUsersFromFedd)}},
                {_id:{$ne: loggedInUSer._id}}
            ]
        }).select(SAFE_DATA).skip(skip).limit(limit)

        res.status(200).send(users)

    }catch(err){
        res.status(400).send("Error :" + err.message)
    }
})


module.exports={userFeedRouter}