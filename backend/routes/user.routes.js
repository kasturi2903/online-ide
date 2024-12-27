const express = require('express');
const router = express.Router();
const UserModel = require('./../models/UserModel');
const {jwtAuthMiddleware, generateToken} = require('./../jwt');

// Get all users
router.get('/', async(req, res) => {
    try{
        const data = await UserModel.find();
        console.log("Data Fetched");
        res.status(200).json(data);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

// POST method to add a new person (sign up)
router.post('/signup', async(req, res) => {
    try{
        const data = req.body;    //Assuming the request body contains the person data

        //Create a new person document using mongoose model
        const newUser = new UserModel(data);

        //Save the new person to database
        const response = await newUser.save();
        console.log("Data Saved");

        //Generate a JWT token
        const payload = {
            id: response.id,
            username: response.username
        }
        console.log("Payload is:", payload);
        const token = generateToken(payload);
        console.log("Token is:", token);

        res.status(200).json(response);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

//POST method to login
router.post('/login', async(req, res) => {
    try{
        // Extract the username and password from the request body
        const {username, password} = req.body;

        //Find the user by username
        const user = await UserModel.findOne({username: username});

        //Check if the user exists and the password is correct
        // const isMatch = await bcrypt.compare(password, user.password);
        if(!user || !(await user.comparePassword(password))){
            res.status(401).json({error: 'Invalid username or password'});
        }

        //Generate a JWT token
        const payload = {
            id: user.id,
            username: user.username
        }
        const token = generateToken(payload);

        //Return/send the token as response
        res.json({response: 'Login successful', token});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

//Profile route
router.get('/profile', jwtAuthMiddleware, async(req, res) => {
    try{
        const userData = req.user;   // req.user is attached to the request object by jwtAuthMiddleware
        console.log("User Data:", userData);
        
        const userId = userData.id;
        const user = await UserModel.findById(userId);

        res.status(200).json({user});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

//GET method to get persons
router.get('/', jwtAuthMiddleware, async (req, res) => {
    try{
        const data = await UserModel.find();
        console.log("Data Fetched");
        res.status(200).json(data);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})



module.exports = router;


