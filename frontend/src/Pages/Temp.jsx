import React, { useState, useEffect, useCallback, useMemo } from "react";
import AceEditor from "react-ace";
import { io } from "socket.io-client";
import FileTree from "../components/tree";
import TerminalComponent from "../components/terminal";
import { getFileTree } from "../utils/fileService";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";
import "./Temp.css";

// Initialize the Socket.IO client
const socket = io("http://localhost:5000");

const Temp = () => {
  const [fileTree, setFileTree] = useState({});
  const [selectedFile, setSelectedFile] = useState("");
  const [selectedFileContents, setSelectedFileContents] = useState("");
  const [fileContents, setFileContents] = useState("");
   const username = localStorage.getItem('username');
  // console.log(username)
  // Determine if the file is saved
  //console.log(selectedFile)
  const filePath = `${username}/${selectedFile}`;
   // Concatenate username and selected file with a '/'
  // console.log(filePath)
  const isSaved = useMemo(
    () => selectedFileContents === fileContents,
    [selectedFileContents, fileContents]
  );

  // Fetch file contents for the selected file
  const getFileContents = useCallback(async () => {
    if (!selectedFile) return;
    const response = await fetch(
      `http://localhost:5000/files/content?path=${filePath}`
    );
    console.log(filePath)
    const result = await response.json();
    setSelectedFileContents(result.content);
  }, [selectedFile]);

  // Update file tree on component mount
  useEffect(() => {
    const fetchFileTree = async () => {
      const tree = await getFileTree();
      setFileTree(tree);
    };
    fetchFileTree();
  }, []);

  // Fetch file contents when a file is selected
  useEffect(() => {
    if (selectedFile) {
      getFileContents();
    }
  }, [selectedFile, getFileContents]);

  // Synchronize `fileContents` with `selectedFileContents`
  useEffect(() => {
    setFileContents(selectedFileContents);
  }, [selectedFileContents]);

  // Save file changes after 5 seconds of inactivity
  useEffect(() => {
    if (fileContents && !isSaved) {
      const timer = setTimeout(async () => {
        console.log("File content", fileContents);
        console.log("File path", selectedFile);

        // Emit changes to the server
        socket.emit("file:change", {
          path: filePath,
          content: fileContents,
        });
       
       const finalFile={}
        // Re-fetch updated file contents to synchronize state
        const response = await fetch(
          `http://localhost:5000/files/content?path=${selectedFile}`
        );
        const result = await response.json();
        setSelectedFileContents(result.content);
      }, 5 * 1000);

      return () => clearTimeout(timer);
    }
  }, [fileContents, selectedFile, isSaved]);

  return (
    <>
      <div className="file-container">
        <div className="left-panel">
          <FileTree
            onSelect={(path) => {
              const normalizedPath = path.startsWith("/") ? path.substring(1) : path;
              setSelectedFile(normalizedPath);
            }}
            tree={fileTree}
          />
        </div>
        <div className="right-panel">
          <div className="ace-editor">
            {selectedFile && (
              <p>
                Selected File: {selectedFile.replaceAll("/", " > ")}{" "}
                {isSaved ? "Saved" : "Unsaved"}
              </p>
            )}
            <AceEditor
              value={fileContents}
              onChange={(e) => setFileContents(e)}
              mode="javascript"
              theme="github"
              name="editor"
              width="100%"
              height="100%"
              editorProps={{ $blockScrolling: true }}
            />
          </div>
          <div className="terminal">
            <TerminalComponent />
          </div>
        </div>
      </div>
    </>
  );
};

export default Temp;




// import { Terminal } from "@xterm/xterm";
// import React, { useState,useEffect, useCallback } from "react";
// import TerminalComponent from "../components/terminal";
// import { getFileTree,getFileContents } from "../utils/fileService";
// import FileTree from "../components/tree";
// import AceEditor from "react-ace";
// import { io } from "socket.io-client"; // Import socket.io-client

// import "ace-builds/src-noconflict/mode-javascript";
// import "ace-builds/src-noconflict/theme-github";
// import "ace-builds/src-noconflict/ext-language_tools";
// import "./Temp.css"; // Add a CSS file for layout styling
// // import { Socket } from "socket.io-client";

// // Initialize the Socket.IO client
// const socket = io("http://localhost:5000"); // Replace with your server's address if different

// const Temp = () => {
  
//     const [fileTree, setFileTree] = useState({});
//     const [selectedFile, setSelectedFile] = useState('');
//     const [selectedFileContents, setSelectedFileContents] = useState('');
//     const [fileContents, setFileContents] = useState('');

//     const isSaved = selectedFileContents === fileContents;

//     const getFileContents = useCallback(async () => {
//       if(!selectedFile) return;
//       const response = await fetch(
//         `http://localhost:5000/files/content?path=${selectedFile}`
//       );
//       const result = await response.json();
//       setSelectedFileContents(result.content);
//     }, [selectedFile]);

//     useEffect(() => {
//       if(selectedFile && selectedFileContents){
//         setFileContents(selectedFileContents);
//       }
//     }, [selectedFile, selectedFileContents]);

//     useEffect(() => {
//       if(selectedFile) getFileContents();
//     }, [getFileContents,selectedFile]);

//     useEffect(() => {
//       const fetchFileTree = async () => {
//         const tree = await getFileTree(); // Fetch file tree using the modular function
//         setFileTree(tree);
//       };
//       fetchFileTree(); // Get the file tree when the component mounts
//     }, []);

//     useEffect(() => {
//       if(fileContents && !isSaved) {
//         const timer = setTimeout( async () => {
//           console.log("File content", fileContents);
//           console.log("File path", selectedFile);
//           socket.emit('file:change', {
//             path: selectedFile,
//             content: fileContents
//           });

//           // Re-fetch updated file contents to synchronize state
//         const response = await fetch(
//           `http://localhost:5000/files/content?path=${selectedFile}`
//         );
//         const result = await response.json();
//         setSelectedFileContents(result.content);
//         }, 5 * 1000);
//         return () => {
//           clearTimeout(timer);
//         };
//       }
//     }, [fileContents, selectedFile, isSaved]);

//     useEffect(() => {
//       setFileContents("");
//     }, [selectedFile]);

//     useEffect(() => {
//       setFileContents(selectedFileContents);
//     }, [selectedFileContents]);

//   return (
//     <>
//       <div className="file-container">
//         {/* Left panel for file tree */}
//         <div className="left-panel">
//           <FileTree
//             onSelect={(path) => {
//               // Normalize path to ensure it starts from `./user`
//               const normalizedPath = path.startsWith('/') ? path.substring(1) : path;
//               setSelectedFile(normalizedPath);
//             }}
//             tree={fileTree} />
//         </div>

//         {/* Right panel containing Ace Editor and terminal */}
//         <div className="right-panel">
//           {/* Editor */}
//           <div className="ace-editor">
//             {selectedFile && <p>Selected File: {selectedFile.replaceAll('/', ' > ')} {isSaved ? 'Saved' : 'Unsaved'}</p>}
//             <AceEditor
//               value={fileContents}
//               onChange={(e) => setFileContents(e)}
//               mode="javascript"
//               theme="github"
//               name="editor"
//               width="100%" // Ensure editor spans full width
//               height="100%" // Ensure editor spans full height
//               editorProps={{ $blockScrolling: true }}
//             />
//           </div>

//           {/* Terminal */}
//           <div className="terminal">
//             <TerminalComponent />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Temp;


