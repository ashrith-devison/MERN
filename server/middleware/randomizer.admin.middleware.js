const jwt = require('jsonwebtoken');

async function verifyToken(req, res, next){
    try{    
        let token = req.header('x-token');
        if(!token){
            return res.status(400).send({error : "Access Denied"});
        }
        jwt.verify(token,"secretKey",(err, decoded) => {
            if(err){
                return res.status(401).send({error : "Login Again ...."});
            }
            req.user = decoded;
            const authorizedRoles = ['admin','HOD'];
            if(authorizedRoles.includes(req.user.role)){
                next();
            }
            else{
                return res.status(400).send(req.user.role+" Dont Have Access for this Route");
            }
        })
    }
    catch(err){
        return res.status(500).send({error : err.message});
    }
}

module.exports = verifyToken;