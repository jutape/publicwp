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
  socket.on("user connect", (people, callback) => {
    if (usersArray.indexOf(people) != -1) {
      callback(false, "Nome de usuario já em uso!");
    } else {
      if (people && people.length >= 4) {
        callback(true, undefined);
        socket.nickname = people;
        usersArray.push(socket.nickname);
        io.emit("user connect", socket.nickname, usersArray);
      } else {
        callback(false, "Nome do usuario invalido! minimo de 4 caracteres.");
      }
    }
  });

  socket.on("chat message", function(msg) {
    io.emit("chat message", msg, socket.nickname);
  });

  socket.on("disconnect", function() {
    let index = usersArray.indexOf(socket.nickname);
    if (index > -1) {
      usersArray.splice(index, 1);
    }
    io.emit("disconnect", socket.nickname, usersArray);
  });
});

io.emit("some event", { for: "everyone" });

module.exports = app;
