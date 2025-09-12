
const express = require("express");
const Task = require("../models/Tasks");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/allTodos", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});
// 2. יצירת משימה חדשה
// יצירת משימה חדשה
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const task = new Task({
      text,
      done: false,
      user: req.user.id, // 🟢 שומר את המשתמש
    });
    await task.save();

    res.json(task);
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json({ error: "Failed to create task" });
  }
});


// 3. עדכון משימה לפי ID
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const todo = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { text: req.body.text, done: req.body.done },
      { new: true }
    );
    
    res.json(todo);
    if (!todo) return res.status(404).json({ error: "Task not found" });
  } catch (err) {
    res.status(400).json({ error: "Failed to update task" });
  }
});

// 4. מחיקת משימה לפי ID
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: "Failed to delete task" });
  }
});

module.exports = router;
