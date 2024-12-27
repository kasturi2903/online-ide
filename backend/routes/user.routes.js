// const express = require('express');
// const router = express.Router();
// const UserModel = require('./../models/UserModel');
// const {jwtAuthMiddleware, generateToken} = require('./../jwt');
// const fs = require('fs');
// const path = require('path');
// // Get all users
// router.get('/', async(req, res) => {
//     try{
//         const data = await UserModel.find();
//         console.log("Data Fetched");
//         res.status(200).json(data);
//     }
//     catch(err){
//         console.log(err);
//         res.status(500).json({error: 'Internal Server Error'});
//     }
// })

// // POST method to add a new person (sign up)
// router.post('/signup', async(req, res) => {
//     try{
//         const data = req.body;    //Assuming the request body contains the person data

//         //Create a new person document using mongoose model
//         const newUser = new UserModel(data);

//         //Save the new person to database
//         const response = await newUser.save();
//         console.log("Data Saved");

//         //Generate a JWT token
//         const payload = {
//             id: response.id,
//             username: response.username
//         }
//         console.log("Payload is:", payload);
//         const token = generateToken(payload);
//         console.log("Token is:", token);

//         res.status(200).json(response);
//     }
//     catch(err){
//         console.log(err);
//         res.status(500).json({error: 'Internal Server Error'});
//     }
// })

// // //POST method to login

// // POST method to login
// // router.post('/login', async (req, res) => {
// //     try {
// //         // Extract the username and password from the request body
// //         const { username, password } = req.body;

// //         // Find the user by username
// //         const user = await UserModel.findOne({ username: username });

// //         // Check if the user exists and the password is correct
// //         if (!user || !(await user.comparePassword(password))) {
// //             return res.status(401).json({ error: 'Invalid username or password' });
// //         }

// //         // Generate a JWT token
// //         const payload = {
// //             id: user.id,
// //             username: user.username
// //         };
// //         const token = generateToken(payload);

// //         // Check if the user's directory exists
// //         const userDir = path.resolve('./user', username);
// //         if (!fs.existsSync(userDir)) {
// //             fs.mkdirSync(userDir);
// //             console.log(`User directory created: ${userDir}`);
// //         } else {
// //             console.log(`User directory already exists: ${userDir}`);
// //         }

// //         // Return/send the token as response
// //         res.json({ response: 'Login successful', token });
// //     } catch (err) {
// //         console.log(err);
// //         res.status(500).json({ error: 'Internal Server Error' });
// //     }

// // });
// let loggedInUsername = null; // Variable to store the logged-in username

// // POST method to login
// router.post('/login', async (req, res) => {
//     try {
//         const { username, password } = req.body;

//         const user = await UserModel.findOne({ username: username });
//         if (!user || !(await user.comparePassword(password))) {
//             return res.status(401).json({ error: 'Invalid username or password' });
//         }

//         const payload = {
//             id: user.id,
//             username: user.username
//         };
//         const token = generateToken(payload);

//         const userDir = path.resolve('./user', username);
//         if (!fs.existsSync(userDir)) {
//             fs.mkdirSync(userDir);
//             console.log(`User directory created: ${userDir}`);
//         } else {
//             console.log(`User directory already exists: ${userDir}`);
//         }

//         loggedInUsername = username; // Set the logged-in username

//         res.json({ response: 'Login successful', token });
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// // Function to get the logged-in username
// const getLoggedInUsername = () => loggedInUsername;


// //Profile route
// router.get('/profile', jwtAuthMiddleware, async(req, res) => {
//     try{
//         const userData = req.user;   // req.user is attached to the request object by jwtAuthMiddleware
//         console.log("User Data:", userData);
        
//         const userId = userData.id;
//         const user = await UserModel.findById(userId);

//         res.status(200).json({user});
//     }
//     catch(err){
//         console.log(err);
//         res.status(500).json({error: 'Internal Server Error'});
//     }
// })

// //GET method to get persons
// router.get('/', jwtAuthMiddleware, async (req, res) => {
//     try{
//         const data = await UserModel.find();
//         console.log("Data Fetched");
//         res.status(200).json(data);
//     }
//     catch(err){
//         console.log(err);
//         res.status(500).json({error: 'Internal Server Error'});
//     }
// })



//  module.exports = router;
// // module.exports = {
// //     router,
// //     getLoggedInUsername
// // };

const express = require('express');
const router = express.Router();
const UserModel = require('./../models/UserModel');
const { jwtAuthMiddleware, generateToken } = require('./../jwt');
const fs = require('fs');
const path = require('path');

let loggedInUsername = null; // Variable to store the logged-in username

// Function to get the logged-in username
const getLoggedInUsername = () => loggedInUsername;

// Get all users (protected)
router.get('/', jwtAuthMiddleware, async (req, res) => {
    try {
        const data = await UserModel.find();
        console.log("Data Fetched");
        res.status(200).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Sign up route
router.post('/signup', async (req, res) => {
    try {
        const data = req.body;

        // Create a new user
        const newUser = new UserModel(data);
        const response = await newUser.save();
        console.log("User Registered");

        // Generate a JWT token
        const payload = { id: response.id, username: response.username };
        const token = generateToken(payload);

        res.status(200).json({ response, token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Authenticate user
        const user = await UserModel.findOne({ username });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Generate a JWT token
        const payload = { id: user.id, username: user.username };
        const token = generateToken(payload);

        // Create user directory if not exists
        const userDir = path.resolve('./user', username);
        if (!fs.existsSync(userDir)) {
            fs.mkdirSync(userDir);
            console.log(`User directory created: ${userDir}`);
        } else {
            console.log(`User directory already exists: ${userDir}`);
        }

        loggedInUsername = username; // Update the logged-in username
        res.json({ response: 'Login successful', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Profile route
router.get('/profile', jwtAuthMiddleware, async (req, res) => {
    try {
        const userData = req.user; // User data from JWT middleware
        const user = await UserModel.findById(userData.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//module.exports = router;  // Export only the router
module.exports = { router, getLoggedInUsername };
