const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require('./routes/userRoutes');
const messageRoute = require('./routes/messagesRoute');
const app = express();
const socket = require("socket.io");
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoute);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1/talkr'

mongoose.connect(MONGODB_URI)

const db = mongoose.connection

db.once('open', () => {
    console.log(`connected to MongoDB @ ${db.host}: ${db.port}`)
})

db.on('error', err => {
    console.error('database is not very happy 😓', err)
})

/* mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    })
    .then(()=> {
        console.log("DB connection succesful");
    })  
    .catch((err) => {
        console.log(err.message);
    });

const db = mongoose.connection
*/

const server = app.listen(process.env.PORT, ()=> {
//  console.log(`Server running on port ${MONGODB_URI}`);
//    console.log(`connected to MongoDB @ ${db.host}: ${db.port}`)
}); 

const io = socket(server, {
    cors:{
        origin:"http://localhost:3000",
        credentials: true,
    },
})

// SOCKET CONNECTION 

global.onlineUsers = new Map();

io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    });

    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if(sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-receive", data.msg);
        }
    });
});