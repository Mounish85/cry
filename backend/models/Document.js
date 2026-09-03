const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const documentSchema = new Schema({

    actionItemId: {
        type: Schema.Types.ObjectId,
        ref: 'ActionItem',
        required: true
    },

    uploadedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    documentType: {
        type: String,
        required: true
    },

    fileUrl: {
        type: String,
        required: true
    }

}, { timestamps: true });

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;