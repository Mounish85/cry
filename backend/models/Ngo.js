const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ngoSchema = new Schema({

    name: {
        type: String,
        required: [true, 'Please enter NGO name'],
        trim: true
    }

});

const NGO = mongoose.model('NGO', ngoSchema);

module.exports = NGO;