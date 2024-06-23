const jwt = require('jsonwebtoken');

async function verifyToken(req, res, next){
    try{
        let token = req.header('x-token');
        if(!token){
            return res.status(401).send({message : 'Access Denied'})
        }
        jwt.verify(token,"secretKey", (err, decoded) =>{
            if(err){
                return res.status(400).send({message : 'Invalid Token'})
            }
            req.user = decoded;
            const authorizedRoles = ['admin', 'HOD'];
            if(authorizedRoles.includes(req.user.role)){
                next();
            }
            else{
                return res.status(401).send({message : req.user.role + ' Access Denied'})
            }
        })

    }
    catch(err){
        res.status(500).send({error : err})
    }
}

module.exports = verifyToken;