const express = require("express");
const { createTask, updateTaskStatus, deleteTask, getAllTasks } = require("./tasksController");
const { protect } = require("../middllewares/authMiddlewares");
const router = express.Router();

router.get("/tasks", protect, getAllTasks);
router.post("/tasks", protect, createTask);
router.patch("/tasks/:id", protect, updateTaskStatus);
router.delete("/tasks/:id", protect, deleteTask);

module.exports = router;
