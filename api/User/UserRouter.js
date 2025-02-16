// ייבוא express כדי ליצור ראוטר
const express = require('express');
const router = express.Router();

// ייבוא הפונקציות מה-controller
const UserController = require('./UserController');

// הגדרת נתיבים (routes)

// POST /api/users/register - הרשמת משתמש חדש
router.post('/register', UserController.register);
router.post('/login', UserController.login);


// ייצוא הראוטר לשימוש בקובץ הראשי (server.js)
module.exports = router;
