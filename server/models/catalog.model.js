const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    shift: {
        type: String,
        required: true,
    },
    lasttime: {
        type: Date,
        required: true,
    },
    percent: {
        type: Number,
    },
});

const catalogSchema = new mongoose.Schema({
    department: {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        data: [dataSchema],
    },
});

module.exports = mongoose.model('Catalog', catalogSchema);