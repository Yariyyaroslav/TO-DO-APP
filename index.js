const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/columns', require('./routes/columns'));
app.use('/api/tasks', require('./routes/tasks'));
app.use(express.static(path.join(__dirname, 'public')));
const PORT = process.env.PORT || 5500;
const startServer = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        app.listen(PORT, () => {
        });
        console.log('Server is running on port ' + PORT);

    } catch (error) {
        console.error(error.message);
    }
}

startServer();