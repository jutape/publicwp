const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const socketio = require('socket.io');

const indexRouter = require('./src/routes/index');
const chatFunction = require('./src/socket/chat');

const app = express();
const io = socketio();
app.io = io;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

io.on('connection', chatFunction(io));
io.emit('some event', {for: 'everyone'});

module.exports = app;
