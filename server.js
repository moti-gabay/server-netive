const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");

// לאפשר לכולם (כל הדומיינים)

const app = express();
app.use(cors({
  origin: ["http://192.168.1.92:8081","http://192.168.1.92:5000","http://localhost:8081","http://localhost:5000"], // או כתובת האפליקציה שלך במקום *
  credentials: true, // אם אתה עובד עם עוגיות
}));
app.use(express.json());
app.use(cookieParser());



app.use("/auth", require("./routes/auth"));
app.use("/tasks", require("./routes/tasks"));
app.use("/users", require("./routes/users"));


async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    app.listen(5000, "0.0.0.0", () => console.log("Server running on http://0.0.0.0:5000"));
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  }
}

startServer();
