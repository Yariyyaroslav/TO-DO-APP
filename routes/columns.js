const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Column = require('../models/Column');


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



module.exports = router;