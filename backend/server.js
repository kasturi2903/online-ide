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


const mongoURI = process.env.MONGO_URI ;

mongoose.connect(mongoURI)
  .then(() => console.log(`Connected to MongoDB ${mongoURI}`))
  .catch((err) => console.error('Error connecting to MongoDB:', err));


// Create a terminal process
const ptyProcess = pty.spawn(process.platform === 'win32' ? 'cmd.exe' : 'bash', [], {
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    cwd: path.resolve(process.env.INIT_CWD || '.', 'user'), // Ensure the path resolves correctly
    env: process.env
});

const app = express();
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

    // Handle terminal write event
    socket.on('terminal:write', (data) => {
        console.log('Terminal input:', data);
        if (data) {
            ptyProcess.write(`${data}\r`); // Write input to the terminal process
        }
    });
});

app.get('/files', async (req, res) => {
  const fileTree = await generateFileTree('./user');
  return res.json({ tree: fileTree })
})
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
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
