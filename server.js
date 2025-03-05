require('dotenv').config();// ייבוא הספרייה dotenv שמשמשת להגדרת משתנים בסביבת השרת
const express = require('express');// ייבוא הספרייה express שמשמשת ליצירת שר
const app = express();// יצירת אפליקציית express חדשה
const userRouter = require('./api/User/UserRouter');// ייבוא הראוטר של המשתמשים מהנתיב המתאים
const cors = require('cors');// ייבוא ספריית cors שמשמשת להגבלת הגורסים שיכולים להגיע לשרת
const mongoose = require('mongoose');// ייבוא ספריית mongoose שמשמשת לחיבור וניהול מסד הנתונים MongoDB
const transactionRouter = require('./api/transaction/transactionRouter');// ייבוא הראוטר של העסקאות מהנתיב המתאים
const reminderRouter = require('./api/reminder/ReminderRouter');
const { verifyUser } = require('./api/middllewares/loginMiddllewares');
const taskRoutes = require('./api/tasks/tasckRouter');

// מגדיר את גרסת ה-API ומספר הגדרות אבטחה
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

// פונקציה אסינכרונית שמתחברת למסד הנתונים
async function run() {
    try {
        // יצירת חיבור למונגו עם ההגדרות שהוגדרו למעלה
        await mongoose.connect(process.env.MONGODB_URI, clientOptions);

        // בדיקה שהחיבור עובד על ידי שליחת פקודת ping
        await mongoose.connection.db.admin().command({ ping: 1 });

        // הדפסה ללוג אם החיבור הצליח
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (error) {
        // אם יש שגיאה בחיבור, היא תיתפס כאן ותודפס ללוג
        console.error('Error connecting to MongoDB:', error);
    }
}

// הפעלת פונקציית החיבור למסד הנתונים
run().catch(console.dir);

// שינוי הפורט ל-5001
const PORT = process.env.PORT || 5001;

// הגדרת כל הגורסים שיכולים להגיע לשרת
app.use(cors());

// middleware שמאפשר לקרוא JSON מה-body של הבקשה
app.use(express.json());

// הוספת לוג לבקשות נכנסות
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// הגדרת נתיב בסיסי לכל הבקשות הקשורות למשתמשים
// כל בקשה שמתחילה ב-/api/user תנותב לראוטר המשתמשים
app.use('/api/user', userRouter);
app.use('/api/transactions', verifyUser, transactionRouter);
app.use('/api/reminders', verifyUser, reminderRouter);
app.use('/api', taskRoutes);

// הפעלת השרת על פורט 5001
app.listen(PORT, () => {
    // הדפסה ללוג כשהשרת עולה בהצלחה
    console.log(`Server is running on port ${PORT}`);
});