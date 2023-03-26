const jwt = require("jsonwebtoken")

const verifyToken = (req, res, next) => {
    const authorization = req.headers.authorization;

    if(!authorization) return res.status(403).json({ msg: "Not authorized. No token"})

    if(authorization) {
        const token = authorization.slice(7, authorization.length);
        jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
            if (err) {
                res.status(401).send({ msg: "Invalid Token"});
            } else {
                req.user = data;
                next();
            }
        })
    }
    
}

module.exports = verifyToken
  