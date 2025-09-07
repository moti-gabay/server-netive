const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());


app.use("/auth", require("./routes/auth"));
app.use("/tasks", require("./routes/tasks"));
app.use("/users", require("./routes/users"));


async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    app.listen(5000, "0.0.0.0",() => console.log("Server running on http://0.0.0.0:5000"));
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  }
}

startServer();
