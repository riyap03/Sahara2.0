const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.post('/', taskController.createTask);
router.get('/:taskId', taskController.getTask);
router.get('/', taskController.getAllTasks);

module.exports = router;
