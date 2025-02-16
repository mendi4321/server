
// ייבוא מודל המשתמש מהקובץ UserModel.js
const User = require('./UserModel');

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

        // החזרת תשובה חיובית עם סטטוס 201 (Created)
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                id: savedUser._id,           // המזהה הייחודי שנוצר ע"י מונגו
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
                email: savedUser.email
            }
        });

    } catch (error) {
        // תפיסת שגיאות - אם קרתה שגיאה כלשהי בתהליך
        // מחזיר תשובת שגיאה עם סטטוס 500 (Internal Server Error)
        res.status(500).json({
            success: false,
            message: 'Error registering user',
            error: error.message             // הודעת השגיאה המקורית
        });
    }
};

const login = async (req, res) => {


    // ייצוא הפונקציות שיהיו זמינות לשימוש בקבצים אחרים
    module.exports = {
        register,
        login,
    };