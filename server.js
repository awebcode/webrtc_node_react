require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");
const friendInvitationRoutes = require("./routes/friendInvitationRoutes");
const groupChatRoutes = require("./routes/groupChatRoutes");

const { createSocketServer } = require("./socket/socketServer");
const path = require("path");

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cors());

// register the routes
app.use("/api/auth", authRoutes);
app.use("/api/invite-friend", friendInvitationRoutes);
app.use("/api/group-chat", groupChatRoutes);

const server = http.createServer(app);

// socket connection
createSocketServer(server);

// Serve static files from the "/client/build" directory
app.use(express.static(path.join(__dirname, "client", "build")));

// Serve the index.html file when the root URL ("/") is accessed
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client","build","index.html"));
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`MONGODB CONNECTED.....!`);
      console.log(`SERVER STARTED ON ${PORT}.....!`);
    });
  })
  .catch((err) => {
    console.log("database connection failed. Server not started");
    console.error(err);
  });
