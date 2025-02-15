const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, "public"))); // Serve frontend files

const users = {}; // Store user data (username & color)

// Function to generate random colors
function getRandomColor() {
    const colors = ["#992828", "#289931", "#282a99", "#ac9a00", "#9800ac", "#008fa8", "#b36500"];
    return colors[Math.floor(Math.random() * colors.length)];
}

io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("joinRoom", ({ username, room }) => {
        socket.join(room);
        
        // Assign a unique color for each user's messages
        users[socket.id] = { username, color: getRandomColor() };

        // Send system message (joining message without color)
        socket.broadcast.to(room).emit("message", {
            username: "System",
            message: `${username} has joined the chat`,
            color: "transparent", // No background color
            time: new Date().toLocaleTimeString()
        });
    });

    socket.on("chatMessage", (data) => {
        io.to(data.room).emit("message", {
            username: data.username,
            message: data.message,
            color: users[socket.id].color, // User-specific color
            time: new Date().toLocaleTimeString()
        });
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
