const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { v4: uuidV4 } = require('uuid');

app.set('view engine', 'ejs');
app.use(express.static('public'));

const users = [];

const new_dummy_id = (id) => {
    return users.filter(uid => !uid.includes(`${id}dummy`)).length + 1;
};

app.get('/', (req, res) => {
    const roomId = uuidV4();
    res.redirect(`/${roomId}`);
});
app.get('/:room', (req, res) => {
    if (req.params.room == 'favicon.ico') return "";
    let userId = (req.headers['x-forwarded-for'] || req.connection.remoteAddress)
        .replaceAll(':', '').replace(',', '');
    if (users.includes(userId)) userId = userId + 'dummy' + new_dummy_id();
    users.push(userId);
    res.render('room', { roomId: req.params.room, userId: userId });
});

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).emit('user-connected', userId);
    });
});

server.listen(3000);
