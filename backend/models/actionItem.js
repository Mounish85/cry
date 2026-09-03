const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const actionItemSchema = new Schema({

    projectId: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },

    title: {
        type: String,
        required: [true, 'Please enter action item title'],
        trim: true
    },

    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    dueDate: {
        type: Date,
        required: true
    },

    status: {
        type: String,
        enum: ['PENDING', 'COMPLETED', 'OVERDUE'],
        default: 'PENDING'
    }

});

const ActionItem = mongoose.model('ActionItem', actionItemSchema);

module.exports = ActionItem;