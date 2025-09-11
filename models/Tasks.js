const mongoose = require("mongoose");

const Task = mongoose.model("Task", new mongoose.Schema({
  text: { type: String, required: true },
  done: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true }));


module.exports = Task;