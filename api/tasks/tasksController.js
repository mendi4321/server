const Task = require("./tasksModel");
const User = require("../User/UserModel");

exports.getAllTasks = async (req, res) => {
  try {
    let query = {};

    // תמיד מסנן לפי משתמש שמבקש את המידע
    // אם מועבר מזהה ספציפי, משתמשים בו
    if (req.query.userId) {
      query.assignedTo = req.query.userId;
    } else {
      // אחרת משתמשים במזהה של המשתמש המחובר
      query.assignedTo = req.user._id;
    }

    // שליפת המשימות לפי השאילתה
    const tasks = await Task.find(query)
      .populate('assignedTo', 'firstName lastName email')
      .sort({ Date: 1 }); // ממיין לפי תאריך

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// יצירת מטלה
exports.createTask = async (req, res) => {
  try {
    // המשימה תמיד משויכת למשתמש שיצר אותה
    let assignedUserId = req.user._id;

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
    // משתמש יכול לעדכן רק משימות שלו
    let query = {
      _id: req.params.id,
      assignedTo: req.user._id
    };

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

// מחיקת מטלה
exports.deleteTask = async (req, res) => {
  try {
    // משתמש יכול למחוק רק משימות שלו
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      assignedTo: req.user._id
    });

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
