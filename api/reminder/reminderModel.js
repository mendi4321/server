const mongoose = require('mongoose');

// שימוש בסכמה של התזכורת   
const reminderSchema = new mongoose.Schema({
    // שדה המזהה של המשתמש
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // שדה הכותרת של התזכורת
    title: {
        type: String,
        required: true,
        trim: true
    },
    // שדה הסכום של התזכורת
    amount: {
        type: Number,
        required: true
    },
    // שדה התאריך המועד של התזכורת
    dueDate: {
        type: Date,
        required: true
    },
    // שדה התאריך של היצירה של התזכורת
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// יצירת מודל של התזכורת
module.exports = mongoose.model("Reminder", reminderSchema);