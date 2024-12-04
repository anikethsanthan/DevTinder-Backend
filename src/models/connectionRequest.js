const mongoose =require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    status:{
        type:String,
        required:true,
        enum:{
            values:["ignored","interested","accepted","rejected"],
            message:'{value} is incorrect status type'
        }
    }

},{
timestamps:true
})
connectionRequestSchema.pre("save",function(){
    const connectionRequest=this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("You cannot send connection request to yourself")
    };

    next();
    
})

connectionRequestSchema.index({fromUserId:1, toUserId:1})

const ConnectRequest=new mongoose.model("connectRequest", connectionRequestSchema);

module.exports=ConnectRequest;