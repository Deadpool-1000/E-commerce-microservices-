const jwt = require('jsonwebtoken');

module.exports= async function isAuthenticated(req,res,next){
    // console.log(req.headers);
    const token = req.headers["authorization"].split(" ")[1];
    try {
        const payload = jwt.verify(token, "secret");
        req.user=payload;
        next();
    } catch(err) {
        // err
        return console.log(err);
    }
}