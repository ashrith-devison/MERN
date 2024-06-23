const mongoose = require('mongoose');

const shiftsAllotmentSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
    },
    shift : {
        type : String,
        required : true,
    },
    date : {
        type : Date,
        required : true,
    },
    department : {
        type : String,
        required : true,
    }
});

module.exports = mongoose.model('shiftAllocation', shiftsAllotmentSchema);