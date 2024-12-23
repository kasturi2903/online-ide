// This file contains the logic for fetching file tree and file contents

export const getFileTree = async () => {
    try {
      const response = await fetch("http://localhost:5000/files");
      const result = await response.json();
      return result.tree; // Return the file tree
    } catch (error) {
      console.error("Error fetching file tree:", error);
      return {};
    }
  };
  
  export const getFileContents = async (selectedFile) => {
    if (!selectedFile) return null;
    
    try {
      const response = await fetch(
        `http://localhost:5000/files/content?path=${selectedFile}`
      );
      const result = await response.json();
      return result.content;
    } catch (error) {
      console.error("Error fetching file contents:", error);
      return null;
    }
  };
  