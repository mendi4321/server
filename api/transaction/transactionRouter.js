// שימוש בספריית express
const express = require("express");
// יצירת מסלול חדש
const router = express.Router();
// שימוש בפונקציות לשליפת כל העסקאות
const TransactionController = require("./transactionController");

// נקודות קצה (Routes)
router.get("/", TransactionController.getTransactions);
// יצירת מסלול להוספת עסקה חדשה
router.post("/", TransactionController.addTransaction);
// יצירת מסלול למחיקת עסקה
router.delete("/:id", TransactionController.deleteTransaction);
// יצירת מסלול לעדכון עסקה
router.put("/:id", TransactionController.updateTransaction);

// יצירת מסלול לקבלת המסלולים
module.exports = router;
