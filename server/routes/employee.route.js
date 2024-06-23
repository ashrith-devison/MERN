const express = require('express');
const router = express.Router();
const UserBase = require('../models/user.model');
router.use(express.json());
const middleware = require('../middleware/employee.middleware');

router.get('/', (req, res) => {
    res.send({message : 'Hello World!'});
});

router.post('/register',middleware,async (req, res) => {
    try{
        const {name, username, password, role, email, department} = req.body;
        const UserExist = await UserBase.findOne({username});
        if(UserExist){
            res.send({message : 'User already exists'});
        } 
        else {
            const user = {
                name,
                username,
                password,
                role,
                email,
                department
            };

            for(let key in user){
                if(user[key] === undefined){
                    res.status(400).send({message : 'Please fill all fields'});
                    return;
                }
            }
            const newUser = new UserBase(user);
            newUser.save();
            res.send({message : 'User created'});
        }
    } catch(err){
        res.send({error : err});
    }
});

router.post('/drop',middleware ,async(req, res) =>{
    const {username} = req.body;
    try{
        const UserExist = await UserBase.findOne({username});
        if(UserExist){
            await UserBase.deleteOne({_id : UserExist._id}).then(() => {
                res.send({message : 'User deleted'});
            });
        }
        else{
            res.status(400).send({message : 'User not found'});
        }
    }
    catch(err){
        res.send({error : err});
    }
});

router.post('/update', middleware,async(req, res) =>{
    const {username,name, role, email, department} = req.body;
    try{
        const UserExist = await UserBase.findOne({username});
        if(!UserExist){
            res.status(400).send({message : 'User not found'});
            return;
        }
        else{
            const user = {
                name, role, email, username, department
            };
            for(let key in user){
                if(user[key] === undefined || user[key]===''){
                    res.status(400).send({message : 'Please fill all fields'});
                    return;
                }
            }
            UserBase.findOneAndUpdate({username}, user, {new : true, useFindAndModify: false})
            .then(div => {
                res.send({message : 'User updated'}); 
            })
            .catch(err => {
                res.status(401).send({error : err});
            });
            }
        
    }
    catch(err){
        res.send({error : err});
    }
});

module.exports = router;