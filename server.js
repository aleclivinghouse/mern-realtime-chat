const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require('path');
const users = require("./routes/api/users");
const chat = require("./routes/api/users");
const cors = require('cors');
const app = express();
socketEvents = require('./socketEvents');
// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});


// Passport config
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport")(passport);

// Routes
app.use("/api/users", users);
app.use("/api/chat", chat);
const PORT = process.env.PORT || 5002;
const server = app.listen(PORT);
const io = require('socket.io').listen(server);
socketEvents(io);
