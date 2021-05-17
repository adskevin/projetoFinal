const { ipcRenderer } = require('electron');
const Room = require('../components/room');
const io = require("socket.io-client");
// const configurations = [ "stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302" ];
const configurations = {
    iceServers: [
      {
        urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
      },
    ],
    iceCandidatePoolSize: 10,
  };

// HTML elements
const selectMediaButton = document.getElementById('selectMediaButton');
const previewVideo = document.getElementById('previewVideo');
const createStreamButton = document.getElementById('createStreamButton');
const sessionInput = document.getElementById('sessionInput');
const joinButton = document.getElementById('joinButton');
const endButton = document.getElementById('endButton');

const testWbButton = document.getElementById('testWb');
const createRoomButton = document.getElementById('createRoom');
const joinRoomButton = document.getElementById('joinRoom');
const disconnectWb = document.getElementById('disconnectWb');
const createdRoomCode = document.getElementById('createdRoomCode');

var socket;
var myPeerConnection;
var peerConnectionArray = [];

var stream;

selectMediaButton.onclick = () => {
    ipcRenderer.send('select-media');
};

createRoomButton.onclick = () => {
    console.log('create-room');
    socket.emit('message', ({
        from: 'logged user',
        type: 'create-room'
    }));
}


// joinRoomButton.onclick = async () => {
//     myPeerConnection = new RTCPeerConnection(configurations);
//     const offerDescription = await myPeerConnection.createOffer();
//     await myPeerConnection.setLocalDescription(offerDescription);

//     const offer = {
//         sdp: offerDescription.sdp,
//         type: offerDescription.type,
//     };

//     console.log(offer);

//     // media.getTracks().forEach((track) => {
//     //     myPeerConnection.addTrack(track, media);
//     // });
//     console.log(myPeerConnection.localDescription);
//     socket.emit('message', ({
//         from: 'logged user',
//         type: 'join-room-request',
//         code: document.getElementById('roomCode').value,
//         offer: offer
//     }));
//     myPeerConnection.onicecandidate = (event) => {
//         console.log(event.candidate);
//     }
// }

async function createOffer() {
    myPeerConnection = new RTCPeerConnection(configurations);
    await stream.getTracks().forEach(async (track) => {
        console.log('track');
        console.log(track);
        await myPeerConnection.addTrack(track, stream);
    });
    console.log(myPeerConnection.getLocalStreams()[0].getTracks());
    const offerDescription = await myPeerConnection.createOffer();
    console.log(offerDescription);
    await myPeerConnection.setLocalDescription(offerDescription);
    const offer = {
        sdp: offerDescription.sdp,
        type: offerDescription.type,
    };
    console.log(offer);
    myPeerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            console.log(event.candidate);
        }
    }
    return offer;
}

async function createAnswer(offer, to) {
    var index = peerConnectionArray.push(new RTCPeerConnection(configurations)) - 1;
    myPeerConnection = peerConnectionArray[index];
    myPeerConnection.onicecandidate = (event) => {
        console.log('received ICE');

        if (event.candidate) {
            socket.emit("message", ({
                type: 'iceCandidate',
                to: to,
                iceCandidate: event.candidate
            }));
        }
    }
    const remoteDescription = new RTCSessionDescription(offer);
    console.log(stream);
    stream = new MediaStream();
    previewVideo.srcObject = stream;
    console.log(stream);
    myPeerConnection.addEventListener('track', (event) => {
        console.log('track');
        event.streams[0].getTracks().forEach((track) => {
            console.log(track);
            stream.addTrack(track);
        });
    })
    await myPeerConnection.setRemoteDescription(remoteDescription);
    const answerDescription = await myPeerConnection.createAnswer();
    console.log(answerDescription);
    await myPeerConnection.setLocalDescription(answerDescription);
    // myPeerConnection.ontrack = (event) => {
    //     console.log('also got tracks');
    //     event.streams[0].getTracks().forEach((track) => {
    //         console.log(track);
    //         stream.addTrack(track);
    //     });
    // };
    const answer = {
        sdp: answerDescription.sdp,
        type: answerDescription.type,
    };
    return answer;
}

async function syncAnswer(answer, to) {
    const answerDescription = new RTCSessionDescription(answer);
    await myPeerConnection.setRemoteDescription(answerDescription);
    myPeerConnection.onicecandidate = event => {
        if (event.candidate) {
            socket.emit("message", ({
                type: 'iceCandidate',
                to: to,
                iceCandidate: event.candidate
            }));
        }
    }
}

function sendJoinInfo(offer){
    socket.emit('message', ({
        from: 'logged user',
        type: 'join-room-info',
        offer: offer
    }));
}

joinRoomButton.onclick = async () => {
    socket.emit('message', ({
        from: 'logged user',
        type: 'join-room-request',
        code: document.getElementById('roomCode').value,
    }));
}

testWbButton.onclick = () => {
    var token;
    var a1 = document.getElementById('1');
    var a2 = document.getElementById('2');
    var a3 = document.getElementById('3');
    var a4 = document.getElementById('4');
    var a5 = document.getElementById('5');
    // var a6 = document.getElementById('6');
    if (a1.checked) {
        token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwNmNlMmRjNTg0NTc5ZmJhZDJiYWQ1MCIsImVtYWlsIjoiYWxvdTJAYWxvdS5jb20iLCJpYXQiOjE2MTc3NTI0OTN9.cr-eD3TN94sXU7w6qQvNuysY1_5vpCc2JZR2pyTuoiQ'
    } else if (a2.checked) {
        token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwNjk0YzJmMjIyM2YyMzFkZGEzOGZkMiIsImVtYWlsIjoiYWxvdUBhbG91LmNvbSIsImlhdCI6MTYxNzc1MjQ3MX0.5BQO0cko_mv5jhuuLNlJu6Jt6Y0k5kXIBcsk70sJJMk'
    } else if (a3.checked) {
        token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwODRiYjNiNzI3YjIxNzc2NGIzNDQ3NSIsImVtYWlsIjoiYWxvdTNAYWxvdS5jb20iLCJpYXQiOjE2MTkzMTE0Mjh9.t89N7BC9P3-8beWzWkR7MoDs5RlH9SWzlJrCmrNXr5U'
    } else if (a4.checked) {
        token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwODRiYmJjNzI3YjIxNzc2NGIzNDQ3NiIsImVtYWlsIjoiYWxvdTRAYWxvdS5jb20iLCJpYXQiOjE2MTkzMTE1NTZ9.6g6TVsVR-9_f7J8kXUmi54vzoaVk1a-L_9RzU42_izg'
    } else if( a5.checked) {
        token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwODRiYmJlNzI3YjIxNzc2NGIzNDQ3NyIsImVtYWlsIjoiYWxvdTVAYWxvdS5jb20iLCJpYXQiOjE2MTkzMTE1ODB9.bqrP6ssmfXFNF6kJFp5hsodL66ejjWY1bT-e3NmRdl0'
    } else {
        token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwODRiYmMxNzI3YjIxNzc2NGIzNDQ3OCIsImVtYWlsIjoiYWxvdTZAYWxvdS5jb20iLCJpYXQiOjE2MTkzMTE2MDF9.PVY4Uo35uTi6nogzQF22Mc73VKbdZB3uGRmTIUL10R8'
    }

    socket = io.connect("http://kvsza.ddns.net:3001", {
        query: {
            token: token
        }
    });

    socket.on('message', async (msg) => {
        if (msg.type) {
            switch (msg.type) {
                case 'room-created':
                    console.log('room-created: ' + msg.room);
                    createdRoomCode.innerHTML = msg.room.code;
                    break;
                case 'join-room-request':
                    console.log('join-room-request: ');
                    const offer = await createOffer();
                    offer.to = msg.from;
                    sendJoinInfo(offer);
                    break;
                case 'join-room-info':
                    console.log('join-room-info: ');
                    const answer = await createAnswer(msg.offer, msg.from);
                    socket.emit('message', ({
                        to: msg.from,
                        type: 'join-room-answer',
                        answer: answer
                    }));
                    break;
                case 'join-room-answer':
                    console.log('join-room-answer: ');
                    syncAnswer(msg.answer, msg.from);
                    break;
                case 'iceCandidate':
                    console.log('iceCandidate');
                    console.log(msg.iceCandidate);
                    console.log(typeof msg.iceCandidate);
                    await myPeerConnection.addIceCandidate(new RTCIceCandidate(msg.iceCandidate));
                default:
                    console.log('nothing to do');
            }
        }
    });
};

disconnectWb.onclick = () => {
    socket.disconnect();
}

ipcRenderer.on('selected-media-id', async (event, sourceId) => {
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            audio: 
                false
                // mandatory: {
                //     chromeMediaSource: 'desktop',
                //     chromeMediaSourceId: sourceId,
                //     // echoCancellation: true,
                //     // noiseSuppression: true,
                //     // sampleRate: 44100,
                // }
            ,
            video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: sourceId,
                    minWidth: 1280,
                    maxWidth: 1280,
                    minHeight: 720,
                    maxHeight: 720
                }
            }
        })
        console.log(stream);
        previewVideo.srcObject = stream;
        previewVideo.onloadedmetadata = (e) => previewVideo.play();
        // const room = new Room(stream);
        // console.log(room.test);
        // console.log(room.createNewConnection());
        stream.onended = function() {
            console.log('Stream Ended');
        };
    } catch (e) {
        getUserMediaError(e);
    }

    function getUserMediaError(e) {
        console.log(e);
    }
})
