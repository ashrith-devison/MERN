const jwt = require('jsonwebtoken');

async function vertify(req, res, next){
    try{
        let token = req.header('x-token');
        if(!token){
            return res.status(401).send({message : "Access Denied", icon : "warning"});
        }
        jwt.verify(token, "secretKey", (err,decoded) => {
            if(err){
                return res.status(401).send({message : "Session Expired.. Please Login Again", icon : "error"});
            }
            const user =decoded;
            console.log(user);
            const auth_role = ['tester','admin'];
            if(auth_role.includes(user.role)){
                next();
            }
            else{
                return res.status(400).send({message:"Access for this Page is denied for your Role. contact Admin", icon : "error"});
            }
        })
    }
    catch(err){
        return res.status(500).send(err.message);
    }
};

module.exports = vertify;