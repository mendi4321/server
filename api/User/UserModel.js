const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    firstName: {          // שם פרטי
        type: String,     // מסוג מחרוזת
        required: true,   // שדה חובה
        trim: true       // מסיר רווחים מיותרים בהתחלה ובסוף
    },
    lastName: {           // שם משפחה
        type: String,     // מסוג מחרוזת
        required: true,   // שדה חובה
        trim: true       // מסיר רווחים מיותרים
    },
    email: {              // כתובת אימייל
        type: String,     // מסוג מחרוזת
        required: true,   // שדה חובה
        unique: true,     // חייב להיות ייחודי במערכת
        trim: true,       // מסיר רווחים מיותרים
        lowercase: true   // הופך לאותיות קטנות
    },
    password: {           // סיסמא
        type: String,     // מסוג מחרוזת
        required: true,   // שדה חובה
        trim: true       // מסיר רווחים מיותרים
    },
    birthday: {           // תאריך לידה
        type: Date,       // מסוג תאריך
        required: true    // שדה חובה
    },
    permission: {         // הרשאות משתמש
        type: String,     // מסוג מחרוזת
        required: true,   // שדה חובה
        enum: ['user', 'author', 'admin'],  // מוגבל לשלוש אפשרויות בלבד
        default: 'user'   // ברירת המחדל היא 'user'
    }
}, {
    timestamps: true      // מוסיף שדות של זמן יצירה ועדכון אחרון
});
// פונקציה שמטפלת בסיסמא של המשתמש
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
});

// ייצוא המודל לשימוש בקובץ הראשי (server.js)
const User = mongoose.model('User', userSchema);
module.exports = User;