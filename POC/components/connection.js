import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAPVZKKc4H1zACexxcZDzgmbEI74VxYgNA",
  authDomain: "watch-party-3ac5d.firebaseapp.com",
  databaseURL: "https://watch-party-3ac5d-default-rtdb.firebaseio.com",
  projectId: "watch-party-3ac5d",
  storageBucket: "watch-party-3ac5d.appspot.com",
  messagingSenderId: "922059772135",
  appId: "1:922059772135:web:27199c96392ecb4d665242",
  measurementId: "G-Q6H0JVBLB1"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const firestore = firebase.firestore();

const servers = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
};

class Connection {
    constructor() {
        this.peerConnection = new RTCPeerConnection(servers);
    }

    createNewConnection() {
        return 'createNewConnection';
    }
}

module.exports = Connection;