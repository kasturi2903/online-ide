// require('dotenv').config();
// const mongoose = require('mongoose');
// const express = require('express ');
// const http =require('http')
// const {Server:SocketServer}=require('socket.io')
// const Grid = require('gridfs-stream')
// const mongoURI = process.env.MONGO_URI ;
// const pty = require('node-pty')

// const ptyProcess = pty.spawn(process.platform === 'win32' ? 'cmd.exe' : 'bash', [], {
//   name: 'xterm-color',
//   cols: 80,
//   rows: 30,
//   cwd: process.env.INIT_CWD,
//   env: process.env
// });
// mongoose.connect(mongoURI)
//   .then(() => console.log(`Connected to MongoDB ${mongoURI}`))
//   .catch((err) => console.error('Error connecting to MongoDB:', err));

// const app = express();
// const server = http.createServer(app);
// const PORT = process.env.PORT || 5000;

// const io=new SocketServer({
//   cors : '*'
// })


// io.attach(server)


// app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
// ptyProcess.onData(data => {
//   io.emit('terminal:data', data)
// })

// io.on('connection',(socket)=>{
//   console.log(`Socket connected`,socket.id)


//   socket.on('terminal:write',(data)=>{
//     ptyProcess.write(data);
//   })
// })

const mongoose = require('mongoose');
require('dotenv').config();
const http = require('http');
const express = require('express');
const fs = require('fs/promises');
const { Server: SocketServer } = require('socket.io');
const path = require('path');
const cors = require('cors');
const pty = require('node-pty');
const { stat } = require('fs');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json())
const corsOptions = {
    origin: 'http://localhost:3000',  // Allow requests from React app
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow necessary HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
  };
  
  app.use(cors(corsOptions));
  

const mongoURI = process.env.MONGO_URI ;

mongoose.connect(mongoURI)
  .then(() => console.log(`Connected to MongoDB ${mongoURI}`))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

  
//Import the router file
const { router, getLoggedInUsername } = require('./routes/user.routes');

//Use the router
app.use('/user', router);

app.get('/current-username', (req, res) => {
    const username = getLoggedInUsername(); // Call the function to get the logged-in username
    console.log('Current logged-in username:', username);
    if (username) {
        res.json({ username });
    } else {
        res.status(404).json({ message: 'No user is logged in' });
    }
});
let latestUser = null; // Variable to store the latest user

app.get('/files', async (req, res) => {
    const username = req.query.username; // Access the username from the query parameters
    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }
    latestUser = username; // Store only the latest username
   // console.log(`Latest user: ${latestUser}`); // Log the latest username
    const userDirectory = path.join('./user', latestUser); // Use the latest username to locate the directory
    const fileTree = await generateFileTree(userDirectory);
    return res.json({ tree: fileTree });
});


setInterval(() => {
    if (latestUser) {
        console.log('Latest Active Username:', latestUser);
    } else {
        console.log('No active username.');
    }
}, 5000);
// Create a terminal process



const ptyProcess = pty.spawn(process.platform === 'win32' ? 'cmd.exe' : 'bash', [], {
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    //cwd: path.resolve(process.env.INIT_CWD || '.', 'user',latestUser), // Ensure the path resolves correctly
    cwd: path.resolve(process.env.INIT_CWD || '.', 'user'), // Ensure the path resolves correctly

    env: process.env
});
// const userDir = path.resolve(process.env.INIT_CWD || '.', 'user', latestUser);
// fs.stat(userDir, (err, stats) => {
//     if (err || !stats.isDirectory()) {
//         console.error(`Directory ${userDir} does not exist or is not a directory`);
//         return;
//     }

//     // Proceed with spawning the terminal
//     const ptyProcess = pty.spawn(process.platform === 'win32' ? 'cmd.exe' : 'bash', [], {
//         name: 'xterm-color',
//         cols: 80,
//         rows: 30,
//         cwd: userDir,
//         env: process.env
//     });
// });



const server = http.createServer(app);
const io = new SocketServer(server, {
    cors: {
        origin: '*', // Allow all origins for simplicity
        methods: ['GET', 'POST']
    }
});

app.use(cors());
app.use(express.json()); // For handling JSON payloads

// Terminal process data handling
ptyProcess.onData((data) => {
    io.emit('terminal:data', data); // Emit terminal output to connected clients
});

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log(`Socket connected`, socket.id);

    // Emit the current working directory to the client when they connect
    const currentDir = `${path.resolve('./user')}> `;
    socket.emit('terminal:data', currentDir); // Send the directory prompt to the client

    // Notify client to refresh files
    socket.emit('file:refresh');

    

    // Handle file change event
    socket.on('file:change', async ({ path: filePath, content }) => {
        try {
            const resolvedPath = path.resolve('./user', filePath); // Ensure safe path resolution
            await fs.writeFile(resolvedPath, content);
            console.log(`File updated: ${resolvedPath}`);
        } catch (error) {
            console.error(`Error updating file:`, error.message);
            socket.emit('file:error', { message: `Failed to write file: ${error.message}` });
        }
    });

    // socket.on('file:change', async ({ path, content }) => {
    //     await fs.writeFile(`./user${path}`, content);
    // })
    socket.on('file:change', async ({ path: filePath, content }) => {
        try {
            // Ensure the file path is resolved relative to the `./user` directory
            const resolvedPath = path.resolve('./user', filePath);
    
            // Validate that the resolved path is within `./user`
            if (!resolvedPath.startsWith(path.resolve('./user'))) {
                throw new Error('Invalid file path');
            }
    
            await fs.writeFile(resolvedPath, content);
            console.log(`File updated successfully: ${resolvedPath}`);
        } catch (error) {
            console.error(`Error updating file:`, error.message);
            socket.emit('file:error', { message: `Failed to write file: ${error.message}` });
        }
    });
    

    // Handle terminal write event
    socket.on('terminal:write', (data) => {
        console.log('Terminal input:', data);
        if (data) {
            ptyProcess.write(`${data}\r`); // Write input to the terminal process
        }
    });
});

// app.get('/files', async (req, res) => {
//     // const username = req.headers['username']; // Access the username from the headers
//     // console.log(username)
//     // if (!username) {
//     //   return res.status(400).json({ error: 'Username is required' });
//     // }
//   const fileTree = await generateFileTree('./user');
//   return res.json({ tree: fileTree })
// })
// const userSessions = {};
// app.get('/files', async (req, res) => {
//     const username = req.query.username; // Access the username from the query parameters
//    // console.log(username)
//     if (!username) {
//       return res.status(400).json({ error: 'Username is required' });
//     }
//     userSessions[username] = { lastAccessed: new Date() }; // Store user-specific data
//     //console.log('Current User Sessions:', userSessions);

//     const userDirectory = path.join('./user', username); // Use the username to locate the directory
//     const fileTree = await generateFileTree(userDirectory);
//     return res.json({ tree: fileTree });
//   });
//   setInterval(() => {
//     const usernames = Object.keys(userSessions);
//     if (usernames.length === 0) {
//         console.log('No active usernames.');
//     } else {
//         console.log('Active Usernames:', usernames.join(', '));
//     }
// }, 5000);

// // app.get('/files/content', async (req, res) => {
// //     const path = req.query.path;
// //     const content = await fs.readFile(`./user${path}`, 'utf-8');
// //     return res.json({ content });
// // })
// let latestUser = null; // Variable to store the latest user

// app.get('/files', async (req, res) => {
//     const username = req.query.username; // Access the username from the query parameters
//     if (!username) {
//         return res.status(400).json({ error: 'Username is required' });
//     }
//     latestUser = username; // Store only the latest username
//    // console.log(`Latest user: ${latestUser}`); // Log the latest username
//     const userDirectory = path.join('./user', latestUser); // Use the latest username to locate the directory
//     const fileTree = await generateFileTree(userDirectory);
//     return res.json({ tree: fileTree });
// });

// // Periodically log the latest username
// // setInterval(() => {
// //     if (latestUser) {
// //         console.log('Latest Active Username:', latestUser);
// //     } else {
// //         console.log('No active username.');
// //     }
// // }, 5000);
app.get('/files/content', async (req, res) => {
    const filePath = req.query.path;
    console.log(filePath)
    // Validate that path is provided
    if (!filePath) {
        return res.status(400).json({ error: "Path query parameter is required." });
    }

    try {
        // Resolve the file path relative to the `./user` directory
        const resolvedPath = path.resolve('./user', filePath);
        
        // Ensure the resolved path is within the `./user` directory
        if (!resolvedPath.startsWith(path.resolve('./user'))) {
            return res.status(400).json({ error: "Invalid file path." });
        }

        // Read the file content
        const content = await fs.readFile(resolvedPath, 'utf-8');
        console.log(`File content read successfully: ${resolvedPath}`);
        return res.json({ content });
    } catch (error) {
        console.error("Error reading file:", error.message);

        // Handle file not found
        if (error.code === 'ENOENT') {
            return res.status(404).json({ error: "File not found." });
        }

        // Handle other errors
        return res.status(500).json({ error: "Failed to read file content." });
    }
});

async function generateFileTree(directory) {
  const tree = {}

  async function buildTree(currentDir, currentTree) {
      const files = await fs.readdir(currentDir)

      for (const file of files) {
          const filePath = path.join(currentDir, file)
          const stat = await fs.stat(filePath)

          if (stat.isDirectory()) {
              currentTree[file] = {}
              await buildTree(filePath, currentTree[file])
          } else {
              currentTree[file] = null
          }
      }
  }

  await buildTree(directory, tree);
  return tree
}

// //Import the router file
// const userRoutes = require('./routes/user.routes');

// //Use the router
// app.use('/user', userRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

