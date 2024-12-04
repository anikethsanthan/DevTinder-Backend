const express=require("express");
const requestRouter= express.Router();
const {userAuth}=require("../middlewares/auth");
const User =require("../models/user");
const ConnectRequest=require("../models/connectionRequest");

requestRouter.post("/request/send/:status/:userId", userAuth,async (req,res)=>{
    try{
        const fromUserId=req.user._id;
        const toUserId=req.params.userId;
        const status=req.params.status;

//checking for valid status by req
        const allowedStatus=["ignored","interested"]
        if(!allowedStatus.includes(status)){
          throw new Error("This request is not allowed")
        }
//checking if the toUser is existing in the database or not
    const user=  await User.findById(toUserId);
            if(!user){
                throw new Error("User does not exist")
            }

//checking they cannot send request to each other if already a connection
const existingConnectionRequest = await ConnectRequest.findOne({
    $or: [
      { fromUserId, toUserId },
      { fromUserId: toUserId, toUserId: fromUserId },
    ],
  });
  if (existingConnectionRequest) {
    return res
      .status(400)
      .send({ message: "Connection Request Already Exists!!" });
  }


//saving data to db
    const connectionRequest=new ConnectRequest({
        fromUserId,
        toUserId,
        status
    })    
    const data = await connectionRequest.save();

    res.json({
        message:"Connection request sent succesfully",
        data,
    })


    }catch(err){
        res.status(400).send("Error : "+err.message)
    }
    
})


module.exports={requestRouter};