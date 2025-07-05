const express = require("express");
const { validateSignup } = require("../utils/validateSignup");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const getJWT = require("../models/user.js");
const validatePassword = require("../models/user");
const sendMail = require("../utils/sendMail.js");

const authRouter = express.Router();
authRouter.post("/signup", async (req, res) => {
  try {
    validateSignup(req);
    const { firstName, lastName, emailId, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    const token = await user.getJWT();
    if (!token) {
      throw new Error("Invalid token");
    }
    await user.save();
    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    //   maxAge: 24 * 60 * 60 * 1000, // 24 hours
    // });
    res.cookie("token", token);
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR :" + " " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const token = await user.getJWT();
    if (!token) {
      throw new Error("Invalid token");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      throw new Error("Invalid Credentials");
    } else {
      // res.cookie("token", token, {
      //   httpOnly: true,
      //   secure: process.env.NODE_ENV === "production",
      //   sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      //   maxAge: 24 * 60 * 60 * 1000, // 24 hours
      // });
      res.cookie("token", token);
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Error:" + " " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  // res.cookie("token", null, {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === "production",
  //   sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  //   expires: new Date(Date.now()),
  // });
  res.cookie("token", null);
  res.send("Logged Out");
});

authRouter.post("/sendMail", async (req, res) => {
  try {
    const { email, subject, content, htmlcontent } = req.body;
    if (!email || !subject) {
      throw new Error("Email, subject, and content are required");
    }
    const info = await sendMail(email, subject, content, htmlcontent);
    res.status(200).send({
      message: "Email sent successfully",
      info: info,
    });
  } catch (err) {
    res.status(400).send("Error:" + " " + err.message);
  }
});
module.exports = { authRouter };
