const socket = io('/');
const videoGrid = document.getElementById('video-grid');

const peer = new Peer(undefined, {
    host: '/',
    port: '3001'
});

const video = document.createElement('video');
video.muted = true;
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
   addVideoStream(video, stream);
   peer.on('call', call => {
        call.answer(stream);
        call.on('stream', userVidStream => {
            addVideoStream(document.createElement('video'), userVidStream);
        });
   });
   socket.on('user-connected', userId => {
        attachStreamToUser(stream, userId);
   });
});

peer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);
});

const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedMetaData', () => {
        video.play();
    });
    videoGrid.append(video);
};
const attachStreamToUser = (stream, userId) => {
   const call = peer.call(userId, stream);
   const userVid = document.createElement('video');
    call.on('stream', userVidStream => {
        addVideoStream(userVid, userVidStream);
    }).on('close', () => {
        userVid.remove();
    });
};
