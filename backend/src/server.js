require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const symptomCheckRoutes = require("./routes/symptomCheckRoutes");

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*" }));
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/symptom-check", symptomCheckRoutes);
// Next: app.use("/api/appointments", appointmentRoutes)

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: process.env.CLIENT_ORIGIN || "*" } });

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
  socket.on("chat:message", (data) => {
    io.to(data.room).emit("chat:message", data);
  });
  socket.on("join", (room) => socket.join(room));
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => console.log(`HealthConnect API running on port ${PORT}`));
});
