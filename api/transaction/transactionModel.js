const mongoose = require("mongoose");

// שימוש בספריית mongoose כדי ליצור מודל עסקה במסד הנתונים  
const transactionSchema = new mongoose.Schema({
    // שדה המזהה של המשתמש
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // שדה הסוג של העסקה
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: true
    },
    // שדה הסכום של העסקה
    amount: {
        type: Number,
        required: true
    },
    // שדה התיאור של העסקה
    description: {
        type: String,
        required: false
    },
    // שדה הקטגוריה של העסקה
    category: {
        type: String,
        required: false
    },
    // שדה התאריך של העסקה
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// יצירת מודל של העסקה
module.exports = mongoose.model("Transaction", transactionSchema);
