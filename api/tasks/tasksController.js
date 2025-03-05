const Task = require("./tasksModel");
const User = require("../User/UserModel");

exports.getAllTasks = async (req, res) => {
  try {
    // כל המשתמשים יכולים לראות את כל המשימות עם פרטי המשתמש המשויך
    const tasks = await Task.find()
      .populate('assignedTo', 'firstName lastName email')
      .sort({ Date: 1 }); // ממיין לפי תאריך
    
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// יצירת מטלה (רק אדמין)
exports.createTask = async (req, res) => {
  try {
    let assignedUserId = req.user._id;

    // אם המשתמש הוא אדמין והוא מציין משתמש אחר
    if (req.user.permission === "admin" && req.body.assignToUserId) {
      const userExists = await User.findById(req.body.assignToUserId);
      if (!userExists) {
        return res.status(404).json({ message: "User not found" });
      }
      assignedUserId = req.body.assignToUserId;
    }

    const task = new Task({
      title: req.body.title,
      description: req.body.description,
      Date: req.body.Date,
      assignedTo: assignedUserId
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// עדכון סטטוס מטלה
exports.updateTaskStatus = async (req, res) => {
  try {
    let query = { _id: req.params.id };
    // אם לא אדמין, מוסיף בדיקה שהמשימה שייכת למשתמש
    if (req.user.permission !== "admin") {
      query.assignedTo = req.user._id;
    }

    const task = await Task.findOneAndUpdate(
      query,
      { completed: req.body.completed },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// מחיקת מטלה (רק אדמין)
exports.deleteTask = async (req, res) => {
  try {
    // רק אדמין יכול למחוק משימות
    if (req.user.permission !== "admin") {
      return res.status(403).json({ message: "Only admins can delete tasks" });
    }

    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// הוספת נקודת קצה חדשה לקבלת רשימת משתמשים (רק לאדמין)
exports.getUsers = async (req, res) => {
  try {
    if (req.user.permission !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    const users = await User.find({}, 'firstName lastName email _id');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
