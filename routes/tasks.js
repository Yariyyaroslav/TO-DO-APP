const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');
const Column = require('../models/Column');
const User = require('../models/User');
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
function calculateWorkingDuration(startDate, endDate, workStartMin, workEndMin) {
    const startDay = workStartMin;
    const endDay = workEndMin;
    let totalMinutes = 0;
    let current = new Date(startDate);
    const end = new Date(endDate);
    while (current < end) {
        const currentMinutes = current.getHours() * 60 + current.getMinutes();
        if (currentMinutes >= startDay && currentMinutes < endDay) {
            totalMinutes++;
        }
        current.setMinutes(current.getMinutes() + 1);
    }
    return totalMinutes;
}
router.put('/statusChange', auth, async (req, res) => {
    const { taskId, newColumnId } = req.body;
    try {
        const task = await Task.findOne({ _id: taskId });
        const column = await Column.findOne({ _id: newColumnId });
        const user = await User.findOne({ _id: req.user.id });
        if (column.description === 'Doing') {
            task.startedAt = new Date();
        }
        if (column.description === 'Done' && task.startedAt) {
            const end = new Date();
            task.completedAt = end;
            const minutes = calculateWorkingDuration(task.startedAt, end, user.wHours.from, user.wHours.to);
            task.timeSpent = (task.timeSpent || 0) + minutes;

        }
        task.column = newColumnId;
        await task.save();

        return res.json(task);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});
router.put('/pull', auth, async (req, res) => {
    const {taskId, link} = req.body;
    try{
        if (!taskId) {
            return;
        }
        const task = await Task.findOne({ _id: taskId });
        task.pullRequest = link;
        await task.save();
        res.json(task);
    }catch(err){
        console.error(err.message);
    }
})
module.exports = router;