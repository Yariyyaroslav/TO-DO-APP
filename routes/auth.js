const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return;
        }

        let user = await User.findOne({ email });
        if (user) {
            return;
        }

        user = new User({ username, email, password });
        await user.save();

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });

    } catch (err) {
        console.error(err.message);
        return;
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return;
        }

        const user = await User.findOne({ email });
        if (!user) {
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return ;
        }

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });

    } catch (err) {
        console.error(err.message);
        return;
    }
});
const auth = require('../middleware/auth');

router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');

        if (!user) {
            return res.status(404);
        }

        res.json(user);

    } catch (err) {
        console.error(err.message);
        return;
    }
});

router.put('/updateName', auth, async (req, res) => {
    const newName = req.body.userName;
    const userId = req.user.id;
    try {
        if (!newName || typeof newName !== 'string' || newName.trim().length === 0){
            console.error(`Error incorrect name`);
            return res.status(400);
        }
        const update = await User.updateOne(
            {_id: userId},
            { $set: { username: newName } })
        if (update.nModified === 0){
            console.error(`Not found name`);
            return res.status(400);
        }
        res.json(newName);
    }catch(err){
        console.error(err.message);
    }
})

router.put('/updateEmail', auth, async (req, res) => {
    const newEmail = req.body.email;
    const userId = req.user.id;
    try {
        if (!newEmail || typeof newEmail !== 'string' || newEmail.trim().length === 0){
            console.error(`Error incorrect email`);
            return res.status(400);
        }
        const update = await User.updateOne(
            {_id: userId},
            { $set: { email: newEmail } },)
        if (update.nModified === 0){
            console.error(`Not found email`);
            return res.status(400);
        }
        res.json(newEmail);
    }catch(err){
        console.error(err.message);
        return res.sendStatus(400)

    }
})

router.delete('/delete', auth, async (req, res) => {
    const userId = req.user.id;
    try{
        await User.deleteOne({_id: userId});
        res.sendStatus(200);
    }catch(err){
        console.error(err.message);
    }

})


module.exports = router;