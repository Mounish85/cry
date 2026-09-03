const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const projectSchema = new Schema({

    name: {
        type: String,
        required: [true, 'Please enter project name'],
        trim: true
    },

    ngoId: {
        type: Schema.Types.ObjectId,
        ref: 'NGO',
        required: true
    },

    frontlinerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    cycle: {
        type: String,
        enum: ['JAN', 'JULY'],
        required: true
    },

    startDate: {
        type: Date,
        required: true
    },

    endDate: {
        type: Date,
        required: true
    }

});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;