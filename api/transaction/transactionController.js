const Transaction = require("./transactionModel");

// שליפת כל העסקאות
exports.getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find().sort({ date: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: "Error fetching transactions" });
    }
};

// הוספת עסקה חדשה
exports.addTransaction = async (req, res) => {
    try {
        console.log(req.body)
        const { date, description, amount, type, userId } = req.body;
        const newTransaction = new Transaction({ date, description, amount, type, userId });
        await newTransaction.save();
        res.json(newTransaction);
    } catch (error) {
        res.status(500).json({ error: "Error saving transaction" });
    }
};

// מחיקת עסקה
exports.deleteTransaction = async (req, res) => {
    try {
        await Transaction.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Error deleting transaction" });
    }
};

// עדכון עסקה
exports.updateTransaction = async (req, res) => {
    try {
        const updatedTransaction = await Transaction.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedTransaction) {
            return res.status(404).json({ error: "Transaction not found" });
        }
        res.json(updatedTransaction);
    } catch (error) {
        res.status(500).json({ error: "Error updating transaction" });
    }
};
