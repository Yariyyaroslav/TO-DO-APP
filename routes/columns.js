const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Column = require('../models/Column');
const Task = require("../models/Task");


router.post('/', auth, async (req, res) => {
    try {
        const { title, color } = req.body;

        const newColumn = new Column({
            title,
            color,
            user: req.user.id
        });

        const column = await newColumn.save();
        res.json(column);
    } catch (err) {
        console.error(err.message);
        return;
    }
});


router.get('/', auth, async (req, res) => {
    try {
        const columns = await Column.find({ user: req.user.id }).sort({ order:1 });
        res.json(columns);
    } catch (err) {
        console.error(err.message);
        return
    }
});
router.put('/order', auth, async (req, res) => {
    try{
        const { columnIds } = req.body;
        const updateOrder = columnIds.map((columnId, index) => {
            return Column.updateOne(
                {user: req.user.id, _id: columnId},
                {$set: {order:index}}
            )

        });
        await Promise.all(updateOrder);
        res.json(updateOrder);
    }catch(err){
        console.error(err.message);
        return;
    }
})

router.delete('/delete', auth, async (req, res) => {
    const { columnId } = req.body;

    try{
        if (!columnId) {
            return;
        }
        await Column.deleteOne({_id: columnId, user: req.user.id});
        await Task.deleteMany({column: columnId, user: req.user.id});
        res.json(200);
    }catch(err){
        console.error(err.message);
    }

})
router.put('/update', auth, async (req, res) => {
    const {columnId, title, color, description} = req.body;
    try{
        if (!columnId) {
            return;
        }
        const updateTask = await Column.updateOne(
            { _id: columnId, user: req.user.id },
            {$set: { title, color, description }},
        )
        res.status(200).json(updateTask);
    }catch(err){
        console.error(err.message);
    }
})
router.get('/column/:columnId', auth, async (req, res) => {
    const {columnId} = req.params;
    try{
        if (!columnId) {
            return;
        }
        const column = await Column.findById(columnId)
        res.status(200).json(column);
    }catch(err){
        console.error(err.message);
    }
})
module.exports = router;