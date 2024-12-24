// const FileTreeNode = ({ fileName, nodes, onSelect, path }) => {
//     const isDir = !!nodes;
//     return (
//       <div
//         onClick={(e) => {
//           e.stopPropagation();
//           if (isDir) return;
//           onSelect(path);
//         }}
//         style={{ marginLeft: "10px" }}
//       >
//         <p className={isDir ? "" : "file-node"}>{fileName}</p>
//         {nodes && fileName !== "node_modules" && (
//           <ul>
//             {Object.keys(nodes).map((child) => (
//               <li key={child}>
//                 <FileTreeNode
//                   onSelect={onSelect}
//                   path={path + "/" + child}
//                   fileName={child}
//                   nodes={nodes[child]}
//                 />
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     );
//   };
  
//   const FileTree = ({ tree, onSelect }) => {
//     return <FileTreeNode onSelect={onSelect} fileName="/" path="" nodes={tree} />;
//   };
//   export default FileTree;
import React, { useState, useEffect } from 'react';

import './tree.css'
//import { getFileTree } from '.fileService./utils/fileService';
import { getFileTree } from '../utils/fileService';
const FileTreeNode = ({ fileName, nodes, onSelect, path }) => {
    const isDir = !!nodes;
    const isOpen = false; // You can add logic here for expanding/collapsing
    
    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          if (isDir) return;
          onSelect(path);
        }}
        style={{ marginLeft: "10px" }}
      >
        <p className={isDir ? "file-node folder" : "file-node file"}>
          {isDir && <span className={`folder ${isOpen ? 'open' : ''}`}></span>}
          {fileName}
        </p>
        {nodes && fileName !== "node_modules" && (
          <ul>
            {Object.keys(nodes).map((child) => (
              <li key={child}>
                <FileTreeNode
                  onSelect={onSelect}
                  path={path + "/" + child}
                  fileName={child}
                  nodes={nodes[child]}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    );
};

// const FileTree = ({ tree, onSelect }) => {
//     return <div className="file-tree"><FileTreeNode onSelect={onSelect} fileName="/" path="" nodes={tree} /></div>;
// };
const FileTree = ({ onSelect }) => {
  const [fileTree, setFileTree] = useState({});
  const POLLING_INTERVAL = 1000; // Poll every 5 seconds

  useEffect(() => {
    const fetchFileTree = async () => {
      try {
        const tree = await getFileTree();
        setFileTree(tree);
      } catch (error) {
        console.error('Error fetching file tree:', error);
      }
    };

    // Initial fetch
    fetchFileTree();

    // Set up polling
    const intervalId = setInterval(fetchFileTree, POLLING_INTERVAL);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="file-tree">
      <FileTreeNode onSelect={onSelect} fileName="/" path="" nodes={fileTree} />
    </div>
  );
};


export default FileTree;
