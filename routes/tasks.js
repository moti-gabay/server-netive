
const express = require("express");
const Task = require("../models/Tasks");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware,async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// 2. יצירת משימה חדשה
// יצירת משימה חדשה
router.post("/", authMiddleware,async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const task = new Task({ title, completed: false });
    await task.save();

    res.json(task);
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json({ error: "Failed to create task" });
  }
});


// 3. עדכון משימה לפי ID
router.put("/:id", authMiddleware,async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: "Failed to update task" });
  }
});

// 4. מחיקת משימה לפי ID
router.delete("/:id", authMiddleware,async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: "Failed to delete task" });
  }
});

module.exports = router;
