const Reminder = require('./ReminderModel');

// יצירת תזכורת חדשה
const createReminder = async (req, res) => {
    try {
        const reminder = new Reminder(req.body);
        await reminder.save();
        res.status(201).send(reminder);
    } catch (error) {
        res.status(400).send(error);
    }
};
// קבלת כל התזכורות
const getReminders = async (req, res) => {
    try {
        const reminders = await Reminder.find({ userId: req.user._id });
        res.send(reminders);
    } catch (error) {
        res.status(500).send(error);
    }
};
// עדכון תזכורת
const updateReminder = async (req, res) => {
    try {
        const reminder = await Reminder.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, req.body, { new: true });
        if (!reminder) {
            return res.status(404).send({ message: 'Reminder not found' });
        }
        res.send(reminder);
    } catch (error) {
        res.status(400).send(error);
    }
};
// מחיקת תזכורת
const deleteReminder = async (req, res) => {
    try {
        const reminder = await Reminder.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if (!reminder) {
            return res.status(404).send({ message: 'Reminder not found' });
        }
        res.send({ message: 'Reminder deleted' });
    } catch (error) {
        res.status(500).send(error);
    }
};
// פונקציות ליצירת, קבלת, עדכון ומחיקת תזכורות
module.exports = { createReminder, getReminders, updateReminder, deleteReminder };
