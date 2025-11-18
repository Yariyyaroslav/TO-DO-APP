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
    priority: {
        type: Number,
        required: true
    },
    description: {
        type: String
    },
    color: {
        type: String
    },
    order: {
        type: Number,
        default: 0
    },
    startedAt: { type: Date },

    completedAt: { type: Date },

    pullRequest: {
        type: String,
    },

    timeSpent: { type: Number, default: 0 }

}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);