
// ייבוא הספרייה dotenv שמשמשת להגדרת משתנים בסביבת השרת
require('dotenv').config();
// ייבוא הספרייה express שמשמשת ליצירת שרת
const express = require('express');

// יצירת אפליקציית express חדשה
const app = express();

// ייבוא הראוטר של המשתמשים מהנתיב המתאים
const userRouter = require('./api/User/UserRouter');

// ייבוא ספריית cors שמשמשת להגבלת הגורסים שיכולים להגיע לשרת
const cors = require('cors');

// ייבוא ספריית mongoose שמשמשת לחיבור וניהול מסד הנתונים MongoDB
const mongoose = require('mongoose');

//  כתובת החיבור למסד הנתונים שלי MongoDB Atlas
// כולל שם משתמש וסיסמה
const uri = "mongodb+srv://david:Aa123456@cluster0.gjwge.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// הגדרות חיבור ל-MongoDB
// מגדיר את גרסת ה-API ומספר הגדרות אבטחה
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

// פונקציה אסינכרונית שמתחברת למסד הנתונים
async function run() {
    try {
        // יצירת חיבור למונגו עם ההגדרות שהוגדרו למעלה
        await mongoose.connect(uri, clientOptions);

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

// הגדרת כל הגורסים שיכולים להגיע לשרת
app.use(cors());

// middleware שמאפשר לקרוא JSON מה-body של הבקשה
app.use(express.json());

// הגדרת נתיב בסיסי לכל הבקשות הקשורות למשתמשים
// כל בקשה שמתחילה ב-/api/user תנותב לראוטר המשתמשים
app.use('/api/user', userRouter);

// הגדרת נתיב ראשי (/) שמחזיר Hello World
app.get('/', (req, res) => {
    res.send('Hello World');
});

// הפעלת השרת על פורט 3000
app.listen(3000, () => {
    // הדפסה ללוג כשהשרת עולה בהצלחה
    console.log('Server is running on port 3000');
});