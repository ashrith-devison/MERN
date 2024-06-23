const express = require('express');
const router = express.Router();
const UserBase = require('../models/user.model');
const allotmentData = require('../models/shift-allotment.model');
const middleware = require('../middleware/randomizer.middleware');
const catalogModel = require('../models/catalog.model');
router.get('/', (req, res) => {
    res.send({message : 'Hello World!'});
});

router.post('/allotment',middleware, async (req,res) => {
    const {department} = req.body;
    try{
        const Userdata = await UserBase.find({department});
        if(Userdata){
            const data = await Promise.all(Userdata.map(async user => {
                const allotment = await allotmentData.findOne({username : user.username, date : new Date().toISOString().slice(0,10)});
                if(allotment){
                    return {
                        username : user.username,
                        name : user.name,
                        email : user.email,
                        role : user.role,
                        allotment : allotment.shift
                    }
                }
                else{
                    return {
                        username : user.username,
                        name : user.name,
                        email : user.email,
                        role : user.role,
                        allotment : 'NaN'
                    }
                }
            }));
            res.send(data);
        }
    }
    catch(err){
        console.log(err);
    }
});

router.post('/shift/update', middleware,async (req, res)=>{
    const {username, shift, department} = req.body;
    try{
        const TodayDate = new Date().toISOString().slice(0,10)
        const user = {username : username, shift : shift, department : department, date : TodayDate};
        
        const allotment = await allotmentData.findOne({username : user.username, date :user.date});
        if(allotment){
            allotmentData.findOneAndUpdate({username : user.username, date : user.date}, {shift : user.shift}, {new : true, useFindAndModify : false })
            .then(div =>{
                res.send({message : "Updated Successfully", data : div.shift});
            })
        }
        else{
            const newAllotment = new allotmentData(user);
            newAllotment.save();
            res.send({message : "Updated Successfully"} );
        }
    }
    catch(err){
        res.status(500).send({error : err});
    }
});

router.post('/shifts-data', middleware,async (req, res) => {
    const {department, shift} = req.body;
    try{
        const allotment = await allotmentData.find({department,shift});
        if(allotment){
            res.send(allotment);
        }
        else{
            res.send({message : 'No Data Found'});
        }
    }
    catch(err){
        console.log(err);
    }
});

router.post('/proceed', async (req, res) => {
    try {
        const {department, shift} = req.body;
        const data = await catalogModel.aggregate([
            {$match : {"department.name" : department}},
            {$unwind : "$department.data"},
            {$match : {"department.data.shift" : shift}}
        ]);
        if(data.length > 1){
            return res.send("Code Red ... Contact the admin with this code : M.CATALOG.EXC.SHIFT");
        }
        const envData = data[0];
        const TodayDate = new Date().toISOString().slice(0,10);
        envData.department.data.lasttime = envData.department.data.lasttime.toISOString().slice(0,10);
        if(TodayDate > envData.department.data.lasttime){
            const users = ['ameena','waheeda','bibbojaan','mallikajaan','satto','phatto','rehana','fareedan'];
            const resultModel = require('../models/test.results.model');
            
            const resultLog = await Promise.all (users.map(async user => {
                const data = await resultModel.findOne({username : user, date : TodayDate});
                if(data){
                    const responseLog = {
                        username : data.username,
                        date : data.date,
                        status : data.status,
                        shift : data.shift
                    }
                    return {message : "User already allocated by randomizer", attachment : responseLog};
                }
                else{
                    const allocation = new resultModel({
                        username : user,
                        date : TodayDate,
                        status : 'Pending',
                        shift : shift,
                    });
                    allocation.save();
                    
                }
                }));
                return res.status(200).send(resultLog);
            }
        else if(TodayDate === envData.department.data.lasttime){
            return res.status(500).send({message : "Randomizer already executed ..",
                attachment : envData.department
            });
        }
        
    }
    catch(err){
        return res.status(500).send(err.message);
    }
});


module.exports = router;
