const express = require("express");
const path = require("path");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../database/User");
var multer = require("multer");
var upload = multer();
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(upload.array());
app.use(express.static(path.join(__dirname, "../build")));
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/authApp");

app.post("/users/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      throw new Error("user already registered");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    User.create({ email, password: hashedPassword });
    res.status(201).send("registered successfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.post("/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User does not exist");
    }
    const compared = await bcrypt.compare(password, user.password);
    if (!compared) {
      throw new Error("Wrong password");
    }
    const token = jwt.sign({ id: user.id }, "shhhhh");
    res.send({ token, id: user.id });
  } catch (err) {
    res.status(400).send(err.message);
  }
});
const verifyToken = async (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, "shhhhh");
    const id = decoded.id;
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User does not exist");
    }
    req.user = user;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

app.get("/me", verifyToken, async (req, res) => {
  res.send(req.user);
});

app.put(`/edit`, verifyToken, async (req, res) => {
  try {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(password, 10);
    }
    delete req.body._id;
    console.log({ user: req.user, body: req.body });
    await User.findByIdAndUpdate(req.user.id, { ...req.body });
    // res.send(UserInfo);
    // console.log(newUser);
    res.status(201).send("Updated successfully");
  } catch (err) {
    // UserInfo.updateOne({
    //   name: name,
    //   bio: bio,
    //   phone: phone,
    //   email: email,
    //   password: password,
    // });
    res.status(400).send(err.message);
  }
});

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../build/index.html"));
// });

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
