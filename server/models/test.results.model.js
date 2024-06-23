const mongoose = require('mongoose');

const updatedLog = new mongoose.Schema({
    TesterName : {
        type : 'String',
        required : true
    },
    updationTime : {
        type : 'Date',
        required : true
    },
    status : {
        type : 'String',
        required : true
    }
}, {"_id" : false});
const TestResultSchema = new mongoose.Schema({
    username : {
        type : 'String',
        required : true
    },
    date : {
        type : 'Date',
        required : true,
    },
    updatedTime : {
        type : [updatedLog],
        required : false,
    },
    status : {
        type : 'String',
        required : true
    },
    shift : {
        type : "String",
        required : true
    }
});

module.exports = mongoose.model('tester-result', TestResultSchema);