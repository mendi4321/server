// ייבוא מודל המשתמש מהקובץ UserModel.js
const User = require('./UserModel');
// ייבוא ספריית bcrypt כדי לצפות בסיס מספר 1 להצבת משתנים מהבקשה (req.body)
const bcrypt = require('bcryptjs');
// ייבוא ספריית jwt כדי ליצור טוקן עבור המשתמש
const jwt = require('jsonwebtoken');

// פונקציית הרשמה למשתמש חדש - מקבלת את בקשת המשתמש (req) ואת אובייקט התגובה (res)
const register = async (req, res) => {
    try {
        // בדיקה אם קיים כבר משתמש עם אותו אימייל במערכת
        // findOne מחזיר את המשתמש הראשון שעונה על התנאי (email)
        const existingUser = await User.findOne({ email: req.body.email });
        // אם נמצא משתמש קיים
        if (existingUser) {
            // מחזיר תשובת שגיאה עם סטטוס 400 (Bad Request)
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }
        // יצירת אובייקט משתמש חדש עם הנתונים שהתקבלו מהבקשה
        const newUser = new User({
            firstName: req.body.firstName,    // שם פרטי
            lastName: req.body.lastName,      // שם משפחה
            email: req.body.email,           // כתובת אימייל
            password: req.body.password,     // סיסמא
            birthday: req.body.birthday,     // תאריך לידה
            permission: 'user'               // הרשאת משתמש - ברירת מחדל 'user'
        });
        // שמירת המשתמש החדש במסד הנתונים
        // save() מחזירה Promise עם המשתמש שנשמר
        const savedUser = await newUser.save();
        // יצירת טוקן עבור המשתמש
        const token = jwt.sign({ userId: savedUser._id }, process.env.TOKEN_SECRET, { expiresIn: '24h' });
        // החזרת תשובה חיובית עם סטטוס 201 (Created)
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                id: savedUser._id,           // המזהה הייחודי שנוצר ע"י מונגו
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
                email: savedUser.email,
                birthday: savedUser.birthday,
                permission: savedUser.permission,
            },
            token,
        });
    } catch (error) {
        // תפיסת שגיאות - אם קרתה שגיאה כלשהי בתהליך
        // מחזיר תשובת שגיאה עם סטטוס 500 (Internal Server Error)
        console.error('Error registering user:', error);
        res.status(500).json({
            success: false,
            message: 'Error registering user',
            error: error.message             // הודעת השגיאה המקורית
        });
    }
};
// פונקציה להתחברות למערכת - מקבלת את בקשת המשתמש והאובייקט התגובה (req, res)
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // בדיקת שדות חובה
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'נדרש אימייל וסיסמה'
            });
        }

        // חיפוש המשתמש
        const user = await User.findOne({ email });
        console.log('Found user:', user ? 'yes' : 'no'); // לוג לדיבוג

        // בדיקת סיסמה
        if (!user || !bcrypt.compareSync(password, user.password)) {
            console.log('Password verification failed'); // לוג לדיבוג
            return res.status(401).json({
                success: false,
                message: 'אימייל או סיסמה שגויים'
            });
        }

        // יצירת טוקן
        const token = jwt.sign(
            { userId: user._id },
            process.env.TOKEN_SECRET,
            { expiresIn: '24h' }
        );

        // שליחת תשובה
        res.status(200).json({
            success: true,
            message: 'התחברת בהצלחה',
            data: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                permission: user.permission,
            },
            token,
        });

        console.log('Login successful for:', email); // לוג לדיבוג
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'שגיאת שרת בתהליך ההתחברות',
            error: error.message
        });
    }
};
// פונקציה לשליפת כל המשתמשים מהמסד הנתונים
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({
            success: true,
            message: 'המשתמשים נשלפו בהצלחה',
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'שגיאה בשליפת המשתמשים',
            error: error.message
        });
    }
};
// ייצוא הפונקציות שיהיו זמינות לשימוש בקבצים אחרים
module.exports = {
    register,
    login,
    getAllUsers,
};