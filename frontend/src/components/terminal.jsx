// // src/components/Terminal.js
// import React, { useEffect, useRef } from 'react';
// import { Terminal } from 'xterm';
// import 'xterm/css/xterm.css'; // Import xterm styles
// import io from 'socket.io-client'; // Import socket.io-client

// const TerminalComponent = () => {
//   const terminalRef = useRef(null); // Ref to attach xterm terminal to
//   const socket = useRef(null); // Ref to store socket.io client instance

//   useEffect(() => {
//     // Initialize the terminal
//     const term = new Terminal({
//       cursorBlink: true,
//       rows: 30,
//       cols: 80,
//     });

//     // Attach the terminal to the DOM element
//     term.open(terminalRef.current);

//     // Connect to the backend server via Socket.io
//     socket.current = io('http://localhost:5000'); // Change to your server address

//     // Handle terminal output from the server
//     socket.current.on('terminal:data', (data) => {
//       term.write(data); // Write the data received to the terminal
//     });

//     // Handle input from the terminal
//     term.onData((data) => {
//       socket.current.emit('terminal:write', data); // Send terminal input to the server
//     });

//     // Cleanup on component unmount
//     return () => {
//       socket.current.disconnect(); // Disconnect from the server
//       term.dispose(); // Dispose of the terminal instance
//     };
//   }, []);

//   return <div ref={terminalRef} style={{ width: '100%', height: '500px' }}></div>;
// };

// export default TerminalComponent;

import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';
import io from 'socket.io-client';

const TerminalComponent = () => {
  const terminalRef = useRef(null); // Ref to attach xterm terminal to
  const socket = useRef(null); // Ref to store socket.io client instance
  const commandBuffer = useRef(''); // Buffer to store the command being typed

  useEffect(() => {
    const term = new Terminal({
      cursorBlink: true,
      rows: 30,
      cols: 80,
    });

    term.open(terminalRef.current);

    socket.current = io('http://localhost:5000'); // Connect to backend server

    // Handle terminal output from the server
    socket.current.on('terminal:data', (data) => {
      term.write(data); // Write the data received from the server to the terminal
    });

    socket.current.on('terminal:data', (data) => {
      const terminal = document.getElementById('terminal'); // Replace with your terminal element
      terminal.innerHTML += data; // Append data to terminal
    });

    // Handle input from the terminal
    term.onData((data) => {
      if (data === '\r') { // Enter key pressed
        socket.current.emit('terminal:write', commandBuffer.current); // Send the command to the server
        commandBuffer.current = ''; // Clear the buffer
        term.write('\r\n'); // Move to a new line
      } else if (data === '\u007F') { // Handle Backspace
        if (commandBuffer.current.length > 0) {
          commandBuffer.current = commandBuffer.current.slice(0, -1);
          term.write('\b \b'); // Erase the last character visually
        }
      } else {
        commandBuffer.current += data; // Add typed character to buffer
        term.write(data); // Echo the character on the terminal
      }
    });

    return () => {
      socket.current.disconnect(); // Cleanup socket connection
      term.dispose(); // Dispose terminal instance
    };
  }, []);

  return <div ref={terminalRef} style={{ width: '100%', height: '500px' }}></div>;
};

export default TerminalComponent;
