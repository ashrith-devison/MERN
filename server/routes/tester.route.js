const express = require('express');
const router = express.Router();
const resultEntry = require('../models/test.results.model');
const middleware = require('../middleware/tester.middleware');
const todayDate = new Date().toISOString().slice(0,10);


router.post('/result/update/log', middleware,async(req, res) => {
    const {username, Tester} = req.body;
    const log = {
        TesterName : Tester,
        updationTime : new Date(),
        status : 'Approved'
    };
    const resultUpdate = await resultEntry.findOneAndUpdate(
        {username : username , date : todayDate},
        { $push : {
            updatedTime : log
        },
            status : log.status
        },
        {new : true, useFindAndModify : false}
    );
    res.send(resultUpdate);
});

router.post('/list' ,async(req, res) => {
    const {department, shift} = req.body;
    try{
        const userBase = require('../models/user.model');
        const log = await userBase.find({department : department});
        if(log.length >= 1){
            const logData = await Promise.all(log.map(async user => {
                const result = await resultEntry.findOne({username : user.username, date : todayDate, shift : shift});
                if(result){
                    lock = 1;
                    return {
                        username : user.username,
                        department : user.department,
                        shift : user.shift,
                        date : result.date,
                        logs : result.updatedTime,
                        status : result.status,
                        shift : result.shift,
                    }
                }
                
            }));
            
            const filteredLogData = logData.filter(Boolean);
            return res.send(filteredLogData);
        }
        else{
            return res.send("No");
        }
    }
    catch(err){
        return res.status(500).send(err.message);
    }
})

module.exports = router;