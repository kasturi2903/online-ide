const jwt = require('jsonwebtoken');

const jwtAuthMiddleware = (req, res, next) => {

    //Check if the request contains a JWT token  OR first check request header has authorization or not
    const authorization = req.headers.authorization;
    if(!authorization) return res.status(401).json({error: 'Token not found'});

    // Extract the jwt token from the request header
    const token = req.headers.authorization.split(' ')[1];
    if(!token) return res.status(401).json({error: 'Unouthorized'});

    try{
        //Verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //Attach the user information to the request object
        req.user = decoded;   // In this "user" key we will store decoded data  (For example : we are using this "user" in personRoutes.js in profile route)
        next();
    }
    catch(err){
        console.log(err);
        res.status(401).json({error: 'Invalid Token'});        
    }
}

//Function to generate JWT token
const generateToken = (userData) => {
    //Generate a new JWT token using the user data
    const token = jwt.sign(userData, process.env.JWT_SECRET, {expiresIn: 3000});
    return token;
}

module.exports = {jwtAuthMiddleware, generateToken}; 