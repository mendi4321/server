// ייבוא express כדי ליצור ראוטר
const express = require('express');
const router = express.Router();
// ייבוא הפונקציות מה-controller
const UserController = require('./UserController');
// ייבוא הפונקציות לאימות טוקן
const { verifyUser } = require('../middllewares/loginMiddllewares');

// הגדרת נתיבים (routes)

// GET /api/users - שליפת כל המשתמשים
router.get('/', verifyUser, UserController.getAllUsers);


// POST /api/users/register - הרשמת משתמש חדש
router.post('/register', UserController.register);
// POST /api/users/login - התחברות למערכת
router.post('/login', UserController.login);

// ייצוא הראוטר לשימוש בקובץ הראשי (server.js)
module.exports = router;
