const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
app.use(cors());
const port = 3000;
const jwt = require('jsonwebtoken');
app.use(express.json());
mongoose.connect("mongodb://127.0.0.1:27017/project-ba")
.then(() => {
    console.log('Connected to database');
})
.catch((err) => {
    console.log('Error connecting to database');
    console.log(err);
});


app.get('/', (req, res) => {
    res.send({message : 'Hello World!'});
});


app.post('/login', async (req, res) => {
    const UserBase = require('./models/user.model');
    const { username, password } = req.body;
    const UserExist = await UserBase.findOne({username});
    if(UserExist){
        if(UserExist.password === password){
            let payload = {
                username : UserExist.username,
                role : UserExist.role
            };
            let token = jwt.sign(payload, "secretKey", {expiresIn : '5m'});
            link =""
            if(payload.role === 'admin'){
                link = "/admin/home.html";
            }
            else if(payload.role === 'HOD'){
                link = "https://google.com";
            }
            res.send({message : 'Login Successful', token : token, 
                icon : 'success', link: link});

        } else {
            res.send({message : 'Invalid Password', icon : 'warning'});
        }
    } else {
        res.send({message : 'User not found', icon:'error'});
    }
});

const employeeRouter = require('./routes/employee.route');
app.use('/employee', employeeRouter);

const randomizerRouter = require('./routes/randomizer.route');
app.use('/randomizer', randomizerRouter);

const randomizerAdminRouter = require('./routes/randomizer.admin.route');
app.use('/randomizer/settings', randomizerAdminRouter);

const randomizerResultsRouter = require('./routes/randomizer.results.route');
app.use('/randomizer/results',randomizerResultsRouter);

const TesterRouter = require('./routes/tester.route');
app.use('/tester', TesterRouter);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});