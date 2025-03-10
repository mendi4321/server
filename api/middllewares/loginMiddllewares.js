const jwt = require('jsonwebtoken');
const User = require('../User/UserModel');


// פונקציה לאימות טוקן והחזרת משתמש מסומך בטוקן
async function verifyToken(permission, req, res, next) {
    try {
        // שימוש בטוקן מהכותרת האוטנטיקציה
        const [type, token] = req.headers.authorization?.split(' ');
        if (type !== 'Bearer' || !token) {
            throw new Error();
        }//אם הטוקן אינו תקין או אינו קיים תזרוק שגיאה
        // בדיקה אם הטוקן תקין
        const data = jwt.verify(token, process.env.TOKEN_SECRET);
        // מציאת המשתמש על פי ה-ID שלו
        const user = await User.findById(data.userId);
        if (!user) {
            throw new Error();
        }//אם המשתמש אינו קיים תזרוק שגיאה  
        if (permission == 'admin' && user.permission != 'admin') {
            throw new Error();
        }//אם המשתמש אינו מנהל תזרוק שגיאה
        if (permission == 'author' && user.permission == 'user') {
            throw new Error();
        }//אם המשתמש אינו מוכיח תזרוק שגיאה 
        // העברת המשתמש לפונקציה הבאה
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid token',
            error: 'Invalid token',
        });
    }
}
// פונקציות לאימות טוקן בהתאם לפרמיטרים
const verifyUser = (req, res, next) => verifyToken('user', req, res, next);
// פונקציה לאימות טוקן כמתושב והחזרת משתמש מסומך בטוקן
const verifyAuthor = (req, res, next) => verifyToken('author', req, res, next);
// פונקציה לאימות טוקן כמנהל והחזרת משתמש מסומך בטוקן
const verifyAdmin = (req, res, next) => verifyToken('admin', req, res, next);
// פונקציות לאימות טוקן בהתאם לפרמיטרים 
module.exports = {
    verifyUser,
    verifyAuthor,
    verifyAdmin
};


