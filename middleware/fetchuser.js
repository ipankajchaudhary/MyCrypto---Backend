const jwt = require('jsonwebtoken');
const Jwt_SECRET = "PANKAJ CHAUDHARY";

const fetchuser = (req, res, next) => {
    // GET the user from the jwt token and append to user id 
    const token = req.header('auth-token')
    if (!token) {
        res.status(401).send({ error: "upper error" })
    }
    try {
        const data = jwt.verify(token, Jwt_SECRET)
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({ error: "Please Authenticate using valid token" })
    }

}







module.exports = fetchuser;