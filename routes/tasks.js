const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Наш "сторож"
const Task = require('../models/Task');
const Column = require('../models/Column');

router.post('/', auth, async (req, res) => {
    try {
        const { title, description, color, columnId } = req.body;
        const column = await Column.findById(columnId);
        if (!column) {
            return;
        }
        if (column.user.toString() !== req.user.id) {
            return;
        }

        const newTask = new Task({
            title,
            description,
            color,
            column: columnId,
            user: req.user.id
        });

        const task = await newTask.save();

    } catch (err) {
        console.error(err.message);
    }
});

router.get('/column/:columnId', auth, async (req, res) => {
    try {
        const column = await Column.findById(req.params.columnId);
        if (column.user.toString() !== req.user.id) {
            console.error('not autorised')
            return;
        }

        const tasks = await Task.find({ column: req.params.columnId }).sort({ createdAt: 1 });
        res.json(tasks);

    } catch (err) {
        console.error(err.message);
    }
});

router.put('/:taskId/move', auth, async (req, res) => {
    try{
        const {newColumnId} = req.body;
        let task = await Task.findById(req.params.taskId)

        if (!task) {
            console.error('Task not found')
            return;
        }
        let newColumn = await Column.findById(newColumnId)

        if (!newColumn) {
            console.error('Task not found')
            return;
        }

        if (newColumn.user.toString() !== req.user.id) {
            console.error('not autorised')
            return;
        }
        task.column = newColumnId;
        await task.save();
        res.json(task);

    }catch(err){
        console.error(err.message);
    }
})
module.exports = router;