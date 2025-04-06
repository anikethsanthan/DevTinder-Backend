const express = require("express");
const { connectDb } = require("./config/database");
const http = require("http");
const dotenv = require("dotenv");
const initialiseSocket = require("./utils/socket");

dotenv.config();

const cookieparser = require("cookie-parser");
const cors = require("cors");

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieparser());

const { authRouter } = require("./routes/auth");
const { profileRouter } = require("./routes/profile");
const { requestRouter } = require("./routes/request");
const { userFeedRouter } = require("./routes/userFeed");
const { chatRouter } = require("./routes/chatRouter");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userFeedRouter);
app.use("/", chatRouter);

const server = http.createServer(app);

initialiseSocket(server);

connectDb()
  .then(() => {
    console.log("Connection established to database");
    server.listen(7777, () => {
      console.log("Server running successfully");
    });
  })
  .catch(() => {
    console.log(" unsuccessfull connection with the database");
  });
