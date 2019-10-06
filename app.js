var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var socketio = require("socket.io");

var indexRouter = require("./routes/index");

var app = express();
var io = socketio();
app.io = io;

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

var usersArray = [];
io.on("connection", function(socket) {
  let user;
  socket.on("user connect", people => {
    console.log(`usuario ${people} se conectou`);
    user = people;
    usersArray.push(user);
    io.emit("user connect", people, usersArray);
  });
  socket.on("chat message", function(msg, people) {
    console.log(`${people}:`, msg);
    io.emit("chat message", msg, people);
  });
  socket.on("disconnect", function() {
    var index = usersArray.indexOf(user);
    if (index > -1) {
      usersArray.splice(index, 1);
    }
    io.emit("disconnect", user, usersArray);
  });
});

io.emit("some event", { for: "everyone" });

module.exports = app;
