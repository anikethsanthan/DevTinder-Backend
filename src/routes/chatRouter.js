const express = require("express");
const Chat = require("../models/chat");
const { userAuth } = require("../middlewares/auth");

const chatRouter = express.Router();

chatRouter.get("/chat/:tagetUserId", userAuth, async (req, res) => {
  try {
    const { tagetUserId } = req.params;
    const userId = req.user._id;

    if (!userId || !tagetUserId) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const chat = await Chat.findOne({
      participants: { $all: [userId, tagetUserId] },
    }).populate({
      path: "messages.senderId",
      select: "firstName lastName photoUrl",
    });
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    return res.status(200).json({ chat });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = { chatRouter };
