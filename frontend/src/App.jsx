// import React from 'react';
// // import Button from 'react-bootstrap/Button';
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Home from './Pages/Home';
// import Login from './Pages/Login';
// import Signup from './Pages/Signup';
// import Temp from './Pages/Temp';

// function App() {
//   return (
//     <Router>
//       <div className="App">
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/login" element={<Login />} />

//           <Route path="/signup" element={<Signup />} />
//           <Route path="/temp" element={<Temp/>} />

//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;

// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Home from './Pages/Home';
// import Login from './Pages/Login';
// import Signup from './Pages/Signup';
// import Temp from './Pages/Temp';

// // Import the modular function for fetching the file tree

// import { getFileTree } from './utils/fileService';

// function App() {
//   const [fileTree, setFileTree] = useState({});

//   // Fetch file tree when the component mounts
//   useEffect(() => {
//     const fetchFileTree = async () => {
//       const tree = await getFileTree();
//       setFileTree(tree);
//     };

//     fetchFileTree();
//   }, []);

//   return (
//     <Router>
//       <div className="App">
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />
//           <Route path="/temp" element={<Temp fileTree={fileTree} />} /> {/* Pass the fileTree prop to Temp */}
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Temp from './Pages/Temp';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/temp" element={<Temp />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
