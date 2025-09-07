const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// הרשמה
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    // בדיקה אם המשתמש כבר קיים
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // יצירת משתמש חדש
    const user = new User({ email, password });
    await user.save();

    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// התחברות
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // חיפוש המשתמש במסד
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // יצירת JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // שליחה ב-Cookie
    res.cookie(process.env.TOKEN_KEY, token, {
      httpOnly: true,     // לא נגיש ל-JS בצד לקוח
      secure: process.env.NODE_ENV === "production", // רק HTTPS בפרודקשן
      sameSite: "strict", // מגן מ-CSRF
      maxAge: 24 * 60 * 60 * 1000, // יום אחד
    });

    return res.json({ message: "Login successful" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie(process.env.TOKEN_KEY);
  res.json({ message: "Logged out successfully" });
});

module.exports = router;
