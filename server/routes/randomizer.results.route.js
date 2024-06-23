const express = require('express');
const router = express.Router();
const shiftAllotment = require('../models/shift-allotment.model');
const catalog = require('../models/catalog.model');

router.post('/dept/view', async (req, res) => {
    const {department, shift} = req.body;
    try{
        const data = await catalog.aggregate([
            { $match: { "department.name": department } },
            { $unwind: "$department.data" },
            { $match: { "department.data.shift": shift } },
            
        ]);
        if(data && data.length > 0 && data.length <=1){
            const result = await Promise.all (data.map(async (item) => {
                return {
                    department: item.department.name,
                    shift: item.department.data.shift,
                    lasttime: item.department.data.lasttime,
                    percent: item.department.data.percent,
                }
            }));

            const allotment = await shiftAllotment.find({department: department, shift: shift, date : new Date().toISOString().slice(0,10)});
            if(allotment && allotment.length > 0){
                const allotmentData = await Promise.all(allotment.map(async (allot) => {
                    return {
                        username: allot.username,
                        allotment: allot.date,
                        catalog : result 
                    };
                }));
                return res.status(200).send(allotmentData);
            }
        }
        return res.status(400).send({error : "No Data Found"}); 
    }catch(err){
        return res.status(500).send({error : err.message});
    }
});


router.post('/dept/allshifts', async (req, res) => {
    const {department} = req.body;
    try{
        const data = await catalog.aggregate([
            { $match : { "department.name" : department } },
            { $unwind : "$department.data"}
        ]);
        if(data && data.length > 0){
                
            return res.status(200).send({catalog : data});
        }
        return res.status(200).send(data);
    }catch(err){
        return res.status(500).send({error : err.message});
    }
});


module.exports = router;