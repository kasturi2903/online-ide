// const mongoose = require('mongoose');
// const { GridFSBucket } = require('mongodb');
// const chokidar = require('chokidar');
// const fs = require('fs');
// const path = require('path');
// const stream = require('stream');

// // GridFS setup
// let bucket;
// mongoose.connection.once('open', () => {
//     bucket = new GridFSBucket(mongoose.connection.db, {
//         bucketName: 'userFiles'
//     });
// });

// // Function to upload file to GridFS
// async function uploadToGridFS(filePath, username) {
//     const filename = path.basename(filePath);
//     const relativePath = path.relative(path.join('./user', username), filePath);
    
//     try {
//         // Check if file already exists in GridFS
//         const existing = await mongoose.connection.db
//             .collection('userFiles.files')
//             .findOne({ 'metadata.path': relativePath, 'metadata.username': username });

//         if (existing) {
//             // Delete existing file
//             await bucket.delete(existing._id);
//         }

//         // Create upload stream
//         const uploadStream = bucket.openUploadStream(filename, {
//             metadata: {
//                 path: relativePath,
//                 username: username,
//                 uploadDate: new Date()
//             }
//         });

//         // Create read stream and pipe to GridFS
//         const readStream = fs.createReadStream(filePath);
//         await new Promise((resolve, reject) => {
//             readStream.pipe(uploadStream)
//                 .on('error', reject)
//                 .on('finish', resolve);
//         });

//         console.log(`Uploaded ${filename} to GridFS`);
//     } catch (error) {
//         console.error(`Error uploading ${filename} to GridFS:`, error);
//         throw error;
//     }
// }

// // Function to handle file deletions
// async function deleteFromGridFS(filePath, username) {
//     const relativePath = path.relative(path.join('./user', username), filePath);
    
//     try {
//         const file = await mongoose.connection.db
//             .collection('userFiles.files')
//             .findOne({ 'metadata.path': relativePath, 'metadata.username': username });

//         if (file) {
//             await bucket.delete(file._id);
//             console.log(`Deleted ${relativePath} from GridFS`);
//         }
//     } catch (error) {
//         console.error(`Error deleting ${relativePath} from GridFS:`, error);
//         throw error;
//     }
// }

// // Initialize file watcher for a user
// function initializeWatcher(username) {
//     const userPath = path.join('./user', username);
    
//     // Create watcher
//     const watcher = chokidar.watch(userPath, {
//         persistent: true,
//         ignoreInitial: false,
//         ignored: /(^|[\/\\])\../ // Ignore hidden files
//     });

//     // Handle file events
//     watcher
//         .on('add', filePath => uploadToGridFS(filePath, username))
//         .on('change', filePath => uploadToGridFS(filePath, username))
//         .on('unlink', filePath => deleteFromGridFS(filePath, username))
//         .on('error', error => console.error(`Watcher error: ${error}`));

//     return watcher;
// }

// // Store active watchers
// const activeWatchers = new Map();

// // Function to start watching a user's directory
// function startWatching(username) {
//     if (!activeWatchers.has(username)) {
//         const watcher = initializeWatcher(username);
//         activeWatchers.set(username, watcher);
//         console.log(`Started watching ${username}'s directory`);
//     }
// }

// // Function to stop watching a user's directory
// function stopWatching(username) {
//     const watcher = activeWatchers.get(username);
//     if (watcher) {
//         watcher.close();
//         activeWatchers.delete(username);
//         console.log(`Stopped watching ${username}'s directory`);
//     }
// }

// // Export functions
// module.exports = {
//     startWatching,
//     stopWatching
// };
const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');
const chokidar = require('chokidar');
const fs = require('fs');
const path = require('path');

// GridFS setup
let bucket;
mongoose.connection.once('open', () => {
    bucket = new GridFSBucket(mongoose.connection.db, {
        bucketName: 'userFiles'
    });
});

// Function to upload file to GridFS
async function uploadToGridFS(filePath, username) {
    const filename = path.basename(filePath);
    const relativePath = path.relative(path.join('./user', username), filePath);
    
    try {
        // Check if file already exists in GridFS
        const existing = await mongoose.connection.db
            .collection('userFiles.files')
            .findOne({ 'metadata.path': relativePath, 'metadata.username': username });

        if (existing) {
            // Delete existing file
            await bucket.delete(existing._id);
        }

        // Create upload stream
        const uploadStream = bucket.openUploadStream(filename, {
            metadata: {
                path: relativePath,
                username: username,
                uploadDate: new Date()
            }
        });

        // Create read stream and pipe to GridFS
        const readStream = fs.createReadStream(filePath);
        await new Promise((resolve, reject) => {
            readStream.pipe(uploadStream)
                .on('error', reject)
                .on('finish', resolve);
        });

        console.log(`Uploaded ${filename} to GridFS`);
    } catch (error) {
        console.error(`Error uploading ${filename} to GridFS:`, error);
        throw error;
    }
}

// Function to handle file deletions
async function deleteFromGridFS(filePath, username) {
    const relativePath = path.relative(path.join('./user', username), filePath);
    console.log(`Attempting to delete file: ${relativePath}`); // Log the file being deleted

    try {
        const file = await mongoose.connection.db
            .collection('userFiles.files')
            .findOne({ 'metadata.path': relativePath, 'metadata.username': username });

        if (file) {
            console.log(`File found in GridFS: ${relativePath}`);
            await bucket.delete(file._id);
            console.log(`Deleted ${relativePath} from GridFS`);
        } else {
            console.log(`File not found in GridFS: ${relativePath}`);
        }
    } catch (error) {
        console.error(`Error deleting ${relativePath} from GridFS:`, error);
        throw error;
    }
}

// Initialize file watcher for a user
function initializeWatcher(username) {
    const userPath = path.join('./user', username);
    
    // Create watcher
    const watcher = chokidar.watch(userPath, {
        persistent: true,
        ignoreInitial: false,
        ignored: /(^|[\/\\])\../ // Ignore hidden files
    });

    // Handle file events
    watcher
        .on('add', filePath => {
            console.log(`File added: ${filePath}`); // Log file addition
            uploadToGridFS(filePath, username);
        })
        .on('change', filePath => {
            console.log(`File changed: ${filePath}`); // Log file change
            uploadToGridFS(filePath, username);
        })
        .on('unlink', filePath => {
            console.log(`File deleted: ${filePath}`); // Log file deletion
            deleteFromGridFS(filePath, username);
        })
        .on('error', error => console.error(`Watcher error: ${error}`));

    return watcher;
}

// Store active watchers
const activeWatchers = new Map();

// Function to start watching a user's directory
function startWatching(username) {
    if (!activeWatchers.has(username)) {
        const watcher = initializeWatcher(username);
        activeWatchers.set(username, watcher);
        console.log(`Started watching ${username}'s directory`);
    }
}

// Function to stop watching a user's directory
function stopWatching(username) {
    const watcher = activeWatchers.get(username);
    if (watcher) {
        watcher.close();
        activeWatchers.delete(username);
        console.log(`Stopped watching ${username}'s directory`);
    }
}

// Export functions
module.exports = {
    startWatching,
    stopWatching
};
