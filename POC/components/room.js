const servers = {
    iceServers: [
        {
        urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
        },
    ],
    iceCandidatePoolSize: 10,
};

class Room {
    constructor(stream) {
        this.stream = stream;
        this.connections = [];
        this.test = 'aros';
    }

    createNewConnection() {
        const pc = new RTCPeerConnection(servers);
        return 'createNewConnection';
    }
}

module.exports = Room;