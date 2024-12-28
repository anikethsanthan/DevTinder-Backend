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
          return res.status(404).json({ message: "The request you are trying to make is invalid" });
        }
//checking if the toUser is existing in the database or not
    const user=  await User.findById(toUserId);
            if(!user){
              return res.status(404).json({ message: "User does not exist" });
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

   return res.json({
        message:"Connection request sent succesfully",
        data,
    })


    }catch(err){
     return   res.status(400).send("Error : "+err.message)
    }
    
})

requestRouter.post("/request/review/:status/:requestId", userAuth, async(req,res)=>{
  try{
    const loggedInUSer= req.user;
    const {status,requestId}= req.params;

    //validating the requests that are allowed
    const allowedRequests=["accepted", "rejected"]
    if(!allowedRequests.includes(status)){
      return res.status(400).json({ message: "Please send a valid request" });
    }

    //validating if the loggedinUSer is same as the toUserID

    const connectionRequest= await ConnectRequest.findOne({
      _id:requestId,
      toUserId:loggedInUSer._id,
      status:"interested"
    })
    if(!connectionRequest){
      return res.status(404).json({ message: "The request you are trying to make is invalid" });
    }


    //all checks ok then change the status in the db

    connectionRequest.status=status;

    const data= await connectionRequest.save();

   return res.status(200).json({ message: `Connection request ${status}`, data})

  }catch(err){
  
    if (!res.headersSent) {
      return res.status(500).json({ message: "Internal server error", error: err.message });
    }
  }
})


module.exports={requestRouter};