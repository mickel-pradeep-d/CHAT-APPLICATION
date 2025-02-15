const socket = io();
let username, room;

function joinChat() {
    username = document.getElementById("username").value.trim();
    room = document.getElementById("room").value.trim();
    
    if (username && room) {
        document.querySelector(".container").style.display = "none";
        document.getElementById("chatBox").style.display = "block";
        socket.emit("joinRoom", { username, room });
    } else {
        alert("Please enter a username and room name.");
    }
}

function sendMessage() {
    const message = document.getElementById("message").value.trim();
    
    if (message) {
        socket.emit("chatMessage", { username, room, message });
        document.getElementById("message").value = "";
    }
}

socket.on("message", (data) => {
    const messagesDiv = document.getElementById("messages");
    const messageElement = document.createElement("div");

    messageElement.classList.add("message");

    // System messages have no background color
    if (data.username === "System") {
        messageElement.style.backgroundColor = "#f4f4f4"; // Light gray background
        messageElement.style.color = "#333"; // Dark text
        messageElement.style.fontWeight = "bold";
        messageElement.style.padding = "10px";
    } else {
        messageElement.style.backgroundColor = data.color;
        messageElement.style.color = "white";
    }

    messageElement.innerHTML = `<strong>${data.username}:</strong> ${data.message} <span class="time">${data.time}</span>`;

    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
});
