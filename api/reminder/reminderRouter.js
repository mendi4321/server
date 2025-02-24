const express = require('express');
const { createReminder, getReminders, updateReminder, deleteReminder } = require('./ReminderController');

const router = express.Router();

router.post('/', createReminder);
router.get('/', getReminders);
router.put('/:id', updateReminder);
router.delete('/:id', deleteReminder);

module.exports = router;
