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
import './tree.css'
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

const FileTree = ({ tree, onSelect }) => {
    return <div className="file-tree"><FileTreeNode onSelect={onSelect} fileName="/" path="" nodes={tree} /></div>;
};

export default FileTree;
