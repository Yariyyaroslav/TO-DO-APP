const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    column: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Column'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    color: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);