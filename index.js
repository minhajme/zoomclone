const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { v4: uuidV4 } = require('uuid');

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    const roomId = uuidV4();
    res.redirect(`/${roomId}`);
});
app.get('/:room', (req, res) => {
    if (req.params.room == 'favicon.ico') return "";
    res.render('room', { roomId: req.params.room });
});

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        console.log('join room');
        socket.join(roomId);
        socket.to(roomId).emit('user-connected', userId);
        socket.on('disconnect', () => {
            console.log('disconnect');
           socket.to(roomId).emit('user-disconnected', userId); 
        });
    });
});

server.listen(3000);
