const express = require("express");
const router = express.Router();
const TransactionController = require("./transactionController");

// נקודות קצה (Routes)
router.get("/", TransactionController.getTransactions);
router.post("/", TransactionController.addTransaction);
router.delete("/:id", TransactionController.deleteTransaction);
router.put("/:id", TransactionController.updateTransaction);

module.exports = router;
