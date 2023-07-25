const jwt = require('jsonwebtoken');

module.exports= async function isAuthenticatedAdmin(req,res,next){
    // console.log(req.headers);
    const token = req.headers["authorization"].split(" ")[1];
    try {
        const payload = jwt.verify(token, "secret");
        req.user=payload;
        if(req.user.role!='admin') throw new Error('User is not admin!');
        next();
    } catch(err) {
        // err
        return console.log(err);
    }
}