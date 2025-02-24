const mongoose = require("mongoose");

// שימוש בספריית mongoose כדי ליצור מודל עסקה במסד הנתונים  
const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// יצירת מודל של העסקה
module.exports = mongoose.model("Transaction", transactionSchema);
