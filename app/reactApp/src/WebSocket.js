import openSocket from 'socket.io-client';

// const socket = openSocket('163.172.163.152:3999');
// const socket = openSocket("localhost:3030")
const socket = openSocket("localhost:8091")

socket.on('disconnect', () => {
    console.log("disconnect");
    console.log("waiting...");
});
socket.on('connection', () => {
    console.log("connection");
});


export default socket;