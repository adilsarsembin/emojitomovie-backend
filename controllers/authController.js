const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require('dotenv').config()

const generateAccessToken = (id) => {
  const payload = {
    id,
  };
  return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "24h" });
};

class authController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: "Registration field error", errors });
      }
      const { username, password } = req.body;
      const candidate = await User.findOne({ username });
      if (candidate) {
        return res
          .status(400)
          .json({ message: `There's already an user with ${username} name` });
      }
      const hashedPassword = bcrypt.hashSync(password, 5);
      const user = new User({
        username,
        password: hashedPassword,
      });
      await user.save();
      return res.json({ message: "User has been created succesfully" });
    } catch (e) {
      res.status(400).json({ message: "Registration error" });
    }
  }
  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user) {
        return res
          .status(400)
          .json({ message: `There's no user with ${username}` });
      }
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: "Incorrect password" });
      }
      const token = generateAccessToken(user._id);
      return res.json({ token });
    } catch (e) {
      res.status(400).json({ message: "Login error" });
    }
  }
  async check(req, res, next) {
    try {
      const token = generateAccessToken(req.user._id);
      return res.json({ token });
    } catch (e) {
      console.log(e);
    }
  }
  async scoreUpdate(req, res) {
    try {
      const { username, score } = req.body;
      const candidate = await User.findOne({ username });
      if (!candidate) {
        return res
          .status(400)
          .json({ message: `There's no user with ${username}` });
      }
      await User.updateOne({ username }, { $inc: { score: 1 } });
      return res.json({ message: "User's score has been updated succesfully" });
    } catch (e) {
      console.log(e);
    }
  }
  async leaderboard(req, res) {
    try {
      return res.json({message: 'You are in leaderboards'})
    } catch(e) {
      console.log(e)
    }
  }
}

module.exports = new authController();
