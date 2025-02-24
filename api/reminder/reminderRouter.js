// שימוש בספריית express
const express = require('express');
// שימוש בפונקציות ליצירת, קבלת, עדכון ומחיקת תזכורות
const { createReminder, getReminders, updateReminder, deleteReminder } = require('./reminderController');
// יצירת מסגרת של המסלולים
const router = express.Router();


// יצירת מסלול ליצירת תזכורת
router.post('/', createReminder);

// יצירת מסלול לקבלת תזכורות
router.get('/', getReminders);

// יצירת מסלול לעדכון תזכורת
router.put('/:id', updateReminder);

// יצירת מסלול למחיקת תזכורת
router.delete('/:id', deleteReminder);

// יצירת מסלול לקבלת המסלולים
module.exports = router;
