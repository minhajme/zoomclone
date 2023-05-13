const socket = io('/');
const videoGrid = document.getElementById('video-grid');

const peer = new Peer(undefined, {
    host: '/',
    port: '3001'
});

const peers = {};

peer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);
});

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    const selfVideo = document.createElement('video');
    selfVideo.muted = true;
   addVideoStream(selfVideo, stream, {self: true});
   peer.on('call', call => {
        call.answer(stream);
        call.on('stream', callerVidStream => {
            addVideoStream(document.createElement('video'), callerVidStream);
        });
   });
   socket.on('user-connected', userId => {
        attachStreamToUser(stream, userId);
   });
});

socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close();
});

const addVideoStream = (video, stream, opts) => {
    video.srcObject = stream;
    video.addEventListener('loadedMetaData', () => {
        video.play();
    });
    if (opts.self) {
        document.getElementById('self-video').append(video);
    } else {
        videoGrid.append(video);
    }
};
const attachStreamToUser = (stream, userId) => {
   const call = peer.call(userId, stream);
   const userVid = document.createElement('video');
    call.on('stream', userVidStream => {
        addVideoStream(userVid, userVidStream);
    }).on('close', () => {
        userVid.remove();
    });
    peers[userId] = call;
};
