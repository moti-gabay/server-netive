
const express = require("express");
const User = require("../models/User");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// 2. יצירת משימה חדשה
// router.post("/users", async (req, res) => {
//   try {
//     const user = new User(req.body);
//     await user.save();
//     res.status(201).json(user);
//   } catch (err) {
//     res.status(400).json({ error: "Failed to create task" });
//   }
// });

// 3. עדכון משימה לפי ID
router.put("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: "Failed to update task" });
  }
});

// 4. מחיקת משימה לפי ID
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "Task not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: "Failed to delete task" });
  }
});

module.exports = router;
