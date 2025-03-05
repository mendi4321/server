const express = require("express");
const { createTask, updateTaskStatus, deleteTask, getAllTasks, getUsers } = require("./tasksController");
const { protect, adminOnly } = require("../middllewares/authMiddlewares");
const router = express.Router();

router.get("/tasks", protect, getAllTasks);
router.get("/users", protect, adminOnly, getUsers);
router.post("/tasks", protect, createTask);
router.patch("/tasks/:id", protect, updateTaskStatus);
router.delete("/tasks/:id", protect, adminOnly, deleteTask);

module.exports = router;
