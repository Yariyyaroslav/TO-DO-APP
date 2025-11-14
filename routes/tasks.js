const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Наш "сторож"
const Task = require('../models/Task');
const Column = require('../models/Column');

router.post('/', auth, async (req, res) => {
    try {
        const { title, description, color, priority, columnId } = req.body;
        const column = await Column.findById(columnId);
        if (!column) {
            return;
        }
        if (column.user.toString() !== req.user.id) {
            return;
        }
        const taskCount = await Task.countDocuments({column: columnId});
        const newTask = new Task({
            title,
            description,
            color,
            priority,
            column: columnId,
            order: taskCount,
            user: req.user.id
        });

        const task = await newTask.save();
        res.json(task);
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

        const tasks = await Task.find({ column: req.params.columnId }).sort({ order: 1 });
        res.json(tasks);

    } catch (err) {
        console.error(err.message);
    }
});

router.put('/reorder', auth, async (req, res) => {
    const {columnId, taskIds} = req.body;
    try{
        const updateOrder = taskIds.map((taskId, index) => {
            return Task.updateOne(
                { _id: taskId, user: req.user.id },
                { column: columnId, order:index},
            );
        });
        await Promise.all(updateOrder);
        res.json(updateOrder);
    }catch(err){
        console.error(err.message);
    }
})

router.delete('/delete', auth, async (req, res) => {
    const { taskId } = req.body;

    try{
        if (!taskId) {
            return;
        }
        await Task.deleteOne({_id: taskId, user: req.user.id});
        res.json(200);
    }catch(err){
        console.error(err.message);
    }

})

router.put('/update', auth, async (req, res) => {
    const {taskId, title, color, description, priority} = req.body;
    try{
        if (!taskId) {
            return;
        }
        const updateTask = await Task.updateOne(
            { _id: taskId, user: req.user.id },
            {title: title, color: color, description: description, priority: priority},
        )
        res.status(200).json(updateTask);
    }catch(err){
        console.error(err.message);
    }
})
router.get('/task/:taskId', auth, async (req, res) => {
    const {taskId} = req.params;
    try{
        if (!taskId) {
            return;
        }
        const task = await Task.findById(taskId)
        res.status(200).json(task);
    }catch(err){
        console.error(err.message);
    }
})

router.get('/getAll', auth, async (req, res) => {
    const filter = {user: req.user.id};
    try{
        const tasks = await Task.find(filter).sort({ priority: 1 });
        res.json(tasks);
    }catch(err){
        console.error(err.message);
        res.sendStatus(500);
    }
})
module.exports = router;