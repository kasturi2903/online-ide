import { Terminal } from "@xterm/xterm";
import React, { useState,useEffect } from "react";
import TerminalComponent from "../components/terminal";
import { getFileTree,getFileContents } from "../utils/fileService";
import FileTree from "../components/tree";
const Temp = () => {
  
    const [fileTree, setFileTree] = useState({});
  
    useEffect(() => {
      const fetchFileTree = async () => {
        const tree = await getFileTree(); // Fetch file tree using the modular function
        setFileTree(tree);
      };
      
      fetchFileTree(); // Get the file tree when the component mounts
    }, []);

  return (
    <>
    <FileTree tree={fileTree} />
    <TerminalComponent/>
    </>
  );
};

export default Temp;
