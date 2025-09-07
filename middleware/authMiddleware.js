const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  try {
    // בודק אם קיים קובץ cookie בשם token
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "No token provided, unauthorized" });
    }

    // מאמת את הטוקן
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // מוסיף את פרטי המשתמש ל־req
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = authMiddleware;
