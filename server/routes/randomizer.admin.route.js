const express = require('express');
const router = express.Router();
const middleware = require('../middleware/randomizer.admin.middleware');

router.post('/percent-change/view', middleware,async (req, res) => {
    const { department} = req.body;
    const catalog = require('../models/catalog.model');
    try{
        const log = await catalog.findOne({'department.name' : department});
        if(log){
            const data = await Promise.all(log.department.data.map(async shift =>{
                return (
                    {   
                        department : department,
                        shift : shift.shift,
                        lasttime : shift.lasttime,
                        percent : shift.percent
                    }
                )
            }));
            res.send(data);
        }
        else{
            res.send({message : 'No Data Found'});
        }
    }
    catch(err){
        res.status(500).send(err.message);
    }
});

router.post('/percent-change/update', async (req, res) => {
    const {department, shift, percent} = req.body;
    try{
        const catalog = require('../models/catalog.model');
        const log = await catalog.findOne({
            "department.name" : department,
            "department.data.shift" : shift
        });
        if(log){
            catalog.findOneAndUpdate(
                {"department.name" : department, "department.data.shift" : shift},
                { $set : {
                    "department.data.$.percent" : percent
                }},
                {new  : true, useFindAndModify :  false}
            ).then(data => {
                res.send(data.department.data);
            });
        }
        else{
            res.send({message : 'No Data Found'});
        
        }
    }
    catch(err){
        res.status(500).send(err.message);
    }
});

router.post('/dept/add',async (req, res) => {
    const {department} = req.body;
    try{
        const catalog = require('../models/catalog.model');
        const log = await catalog.findOne({'department.name' : department});
        if(!log){
            const newDept = new catalog({
                department : {
                    name : department,
                    data : []
                }
            });
            newDept.save().then(data => {
                res.send(data);
            });
        }
        else if(log){
            res.send({message : 'Department Already Exists'});
        }
    }
    catch(err){
        res.status(500).send(err.message);
    }
});

router.post('/shift/add', async (req, res) => {
    const {department, shift} = req.body;
    
    try{
        const catalog = require('../models/catalog.model');
        const log = await catalog.findOne({
            "department.name" : department,
            "department.data.shift" : shift
        });
        if(!log){
            catalog.findOneAndUpdate(
                {"department.name" : department},
                { $push : {
                    "department.data" : {
                        shift : shift,
                        lasttime : new Date(),
                        percent : 0
                    }
                }},
                {new : true, useFindAndModify : false}
            ).then(data => {
                res.send(data.department.data);
            });
        }
        else if(log){
            res.send("Hey Shift Already Exists");
        }
    }
    catch(err){
        res.status(500).send(err.message);
    }
});

module.exports = router;