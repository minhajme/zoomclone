const socket = io('/');

socket.emit('join-room', ROOM_ID, USER_ID);
socket.on('user-connected', userId => {
   console.log('user-connected ', userId); 
});
