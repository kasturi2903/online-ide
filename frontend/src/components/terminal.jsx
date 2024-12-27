
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
