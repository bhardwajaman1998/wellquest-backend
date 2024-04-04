const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
    if (req.headers['authorization']) {
        try {
            let authorization = req.headers['authorization'].split(' ');
            if (authorization[0] !== 'Bearer') {
                return res.status(401).send('invalid request'); //invalid request
            } else {
                req.jwt = jwt.verify(authorization[1], JWT_SECRET);
                return next();
            }
        } catch (err) {
            return res.status(403).send()
        }
    } else {
        return res.status(401).send('invalid request');
    }
};

module.exports = authenticateToken;
