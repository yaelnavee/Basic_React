// Responsible for managing files in LocalStorage

import { useState, useEffect } from 'react';

export const useFileManager = (username) => {
  // State for files
  const [files, setFiles] = useState([]);
  const [currentFileName, setCurrentFileName] = useState('');
  
  // Keys for localStorage
  const FILES_LIST_KEY = `files_list_${username}`;
  const FILE_CONTENT_PREFIX = `file_content_${username}_`;
  
  // Load files list when component mounts or username changes
  useEffect(() => {
    if (!username) return;
    
    const savedFilesList = localStorage.getItem(FILES_LIST_KEY);
    if (savedFilesList) {
      setFiles(JSON.parse(savedFilesList));
    }
  }, [username, FILES_LIST_KEY]);
  
  // Save files list whenever it changes
  useEffect(() => {
    if (!username || files.length === 0) return;
    
    localStorage.setItem(FILES_LIST_KEY, JSON.stringify(files));
  }, [files, username, FILES_LIST_KEY]);
  
  // Save file content
  const saveFile = (fileName, content) => {
    if (!username || !fileName) return false;
    
    const fileKey = FILE_CONTENT_PREFIX + fileName;
    
    try {
      // Save file content
      localStorage.setItem(fileKey, content);
      
      // Update files list if this is a new file
      if (!files.includes(fileName)) {
        const updatedFiles = [...files, fileName];
        setFiles(updatedFiles);
      }
      
      // Update current file name
      setCurrentFileName(fileName);
      
      return true;
    } catch (error) {
      console.error('Error saving file:', error);
      return false;
    }
  };
  
  // Save file with a new name (Save As)
  const saveFileAs = (newFileName, content) => {
    return saveFile(newFileName, content);
  };
  
  // Open a file
  const openFile = (fileName) => {
    if (!username || !fileName) return null;
    
    const fileKey = FILE_CONTENT_PREFIX + fileName;
    
    try {
      const content = localStorage.getItem(fileKey);
      
      if (content !== null) {
        // Update current file name
        setCurrentFileName(fileName);
        return content;
      }
      
      return null;
    } catch (error) {
      console.error('Error opening file:', error);
      return null;
    }
  };
  
  // Delete a file
  const deleteFile = (fileName) => {
    if (!username || !fileName) return false;
    
    const fileKey = FILE_CONTENT_PREFIX + fileName;
    
    try {
      // Remove file content
      localStorage.removeItem(fileKey);
      
      // Update files list
      const updatedFiles = files.filter(file => file !== fileName);
      setFiles(updatedFiles);
      
      // Reset current file name if it was the current file
      if (currentFileName === fileName) {
        setCurrentFileName('');
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  };
  
  return {
    files,
    currentFileName,
    saveFile,
    saveFileAs,
    openFile,
    deleteFile
  };
};