const socket = require("socket.io");
const Chat = require("../models/chat");

const initialiseSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ userId, tagetUserId }) => {
      const room = [userId, tagetUserId].sort().join("-");
      console.log("room joinde", room);
      socket.join(room);
    });
    socket.on("sendMessage", async ({ userId, tagetUserId, message }) => {
      const room = [userId, tagetUserId].sort().join("-");
      console.log("room", room);
      console.log(message);
      try {
        let chat = await Chat.findOne({
          participants: { $all: [userId, tagetUserId] },
        });
        if (!chat) {
          chat = new Chat({
            participants: [userId, tagetUserId],
            messages: [],
          });
          await chat.save();
        } else {
          chat.messages.push({
            senderId: userId,
            text: message,
          });
          await chat.save();
        }
        io.to(room).emit("receiveMessage", { senderId: userId, text: message });
      } catch (err) {
        console.log(err);
      }
    });
    socket.on("disconnect", () => {});
  });
};

module.exports = initialiseSocket;
