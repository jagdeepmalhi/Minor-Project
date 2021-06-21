const express = require('express');
const app = express();
const socket = require('socket.io');
// const mongoose = require('mongoose');
const path = require('path');
// const { render } = require('ejs');
// const Game = require('./models/game');
// const quotableAPI = require('./quotableAPI');
const port = process.env.PORT || 4000 ;

app.use(express.urlencoded())

// mongoose.connect('mongodb://localhost:27017/typego',{useNewUrlParser : true, useUnifiedTopology : true}, ()=>{ console.log('successfully connected')})

app.use(express.static(path.join(__dirname, 'public')));

// set view engine
app.set('view engine', 'ejs')

// template engin route
app.get('/', (req, res) => {
  res.render('home');
})

app.post('/creategame', (req, res) => {
  // console.log(req.body);
  res.render('creategame');
})

app.post('/joingame', (req, res) => {
  // console.log(req.body);
  res.render('joingame');
})

app.get('/about', (req, res) => {
  res.render('about');
})


//server setup
const server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


//socket io setup
const io = socket(server);

var rooms = [];
var adminSocketId = [];

io.on('connection',(socket)=>{

  socket.on('createRoom',(roomCode)=>{
      let index = rooms.indexOf(roomCode.roomCode);
      if (index > -1) {
        socket.emit('createRomeError');
      }else{
        rooms.push(roomCode.roomCode);
        adminSocketId.push(socket.id);
        socket.join(roomCode.roomCode);
        // console.log('created',roomCode.roomCode, 'total rooms',rooms);
      }
  })

  socket.on('joinRoom',(roomCode)=>{
    if(rooms.includes(roomCode.roomCode)){
      socket.join(roomCode.roomCode);
      // console.log('room joined having id:',roomCode.roomCode);

      let joinedUserId = socket.id;
      //for admin
      io.sockets.in(roomCode.roomCode).emit('joinedRoom',joinedUserId,roomCode);
      //for joined user
      socket.broadcast.to(roomCode.roomCode).emit('newlyJoinedUser', roomCode, joinedUserId);
      // socket.to(joinedUserId).emit('newlyJoinedUser', roomCode, joinedUserId);
    }

    else{
        // console.log('Room not exits');
        socket.emit('joinError', roomCode.roomCode);
    }
  })

  socket.on('thenIamSendingMyDataToJoinedUser',(recived)=>{
    let createrId = socket.id;
    socket.broadcast.to(recived.idOfJoinedUser).emit('okISendedMyDataToJoinedUser',recived,createrId);
  })

  socket.on('sendMyDataToOnlyNewlyJoinedUser',(dataFromJoinUser)=>{
    let joinedUserId = socket.id;
    socket.broadcast.to(dataFromJoinUser.toUser).emit('okISendMyDataToNewlyJoinedUser',dataFromJoinUser,joinedUserId);
    // socket.to(joinedUserId).emit('okISendMyDataToNewlyJoinedUser',dataFromJoinUser,joinedUserId);
  })

  socket.on('startGame',(startCredentials)=>{
    // console.log(startCredentials.roomCode);
    io.sockets.in(startCredentials.roomCode).emit('startGame',startCredentials);
    // io.sockets.emit('startGame',startCredentials);
  })
  
  socket.on('updateProgressBar', (myData)=>{
    socket.broadcast.to(myData.roomCode).emit('updatingBar',myData.calculateWidthOfProgressBar,socket.id);
  })

  socket.on('result',(myData)=>{
    io.sockets.in(myData.roomCode).emit('result',myData);
  })

  socket.on('disconnecting', () => {
    // console.log("leaved ",Array.from(socket.rooms)[1]);
    socket.broadcast.to(Array.from(socket.rooms)[1]).emit('left',socket.id);

    if(adminSocketId.includes(socket.id)){
      socket.broadcast.to(Array.from(socket.rooms)[1]).emit('Adminleft');
      let roomName = Array.from(socket.rooms)[1];
      let index = rooms.indexOf(roomName);
      if (index > -1) {
        // console.log('rooms before delete',rooms);
        rooms.splice(index, 1);
        // console.log('room deleted, rooms after detele',rooms);
      }

      let adminIDIndex = adminSocketId.indexOf(socket.id);
      if (adminIDIndex > -1) {
        // console.log('adimn array before delete',adminSocketId);
        adminSocketId.splice(adminIDIndex, 1);
        // console.log('adimn array after delete',adminSocketId);
      }
    }
  });

});