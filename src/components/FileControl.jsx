import React, { useState } from 'react';
import './css/FileControl.css';

const FileControl = ({ onLoadNote, username, currentNote }) => {
  const [savedFiles, setSavedFiles] = useState([]);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Prefix for file storage
  const FILE_STORAGE_PREFIX = `noteFiles_${username}_`;
  
  const loadSavedFilesList = () => {
    const files = [];
    // Iterate through localStorage to find all saved files for this user
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(FILE_STORAGE_PREFIX)) {
        // Extract the actual file name from the storage key
        const fileName = key.replace(FILE_STORAGE_PREFIX, '');
        files.push(fileName);
      }
    }
    setSavedFiles(files);
  };

  const handleLoadClick = () => {
    setShowLoadDialog(true);
    loadSavedFilesList(); // Refresh the list when opening the dialog
    setErrorMessage('');
  };

  const handleLoad = (selectedFileName) => {
    const fullKey = FILE_STORAGE_PREFIX + selectedFileName;
    const fileContent = localStorage.getItem(fullKey);
    
    if (fileContent) {
      try {
        const noteData = JSON.parse(fileContent);
        // Ensure the noteData has the expected structure
        if (typeof noteData === 'object') {
          // מבנה פתק משופר עם כל המאפיינים
          const formattedNote = {
            text: noteData.text || '',
            color: noteData.color || 'yellow',
            fontFamily: noteData.fontFamily || 'Arial, sans-serif',
            fontSize: noteData.fontSize || 16,
            textColor: noteData.textColor || '#222222',
            backgroundColor: noteData.backgroundColor || ''
          };
          
          onLoadNote(formattedNote);
          setShowLoadDialog(false);
          setErrorMessage('');
        } else {
          throw new Error('Invalid note format');
        }
      } catch (error) {
        console.error('Error parsing file:', error);
        setErrorMessage('The file is corrupted or in invalid format');
      }
    } else {
      setErrorMessage('Could not load the selected file');
    }
  };

  const handleDelete = (selectedFileName, event) => {
    // Stop propagation to prevent loading the file when clicking delete
    event.stopPropagation();
    
    if (window.confirm(`Are you sure you want to delete "${selectedFileName}"?`)) {
      const fullKey = FILE_STORAGE_PREFIX + selectedFileName;
      localStorage.removeItem(fullKey);
      loadSavedFilesList(); // Refresh the list
    }
  };

  return (
    <div className="file-control">
      <div className="file-buttons">
        <button className="file-button" onClick={handleLoadClick}>
          Load Note
        </button>
      </div>

      {/* Load Dialog */}
      {showLoadDialog && (
        <div className="file-dialog">
          <h3>Load Note</h3>
          {savedFiles.length > 0 ? (
            <div className="files-list">
              {savedFiles.map((file, index) => (
                <div key={index} className="file-item">
                  <span onClick={() => handleLoad(file)}>{file}</span>
                  <button 
                    className="delete-file" 
                    onClick={(e) => handleDelete(file, e)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p>No saved files found</p>
          )}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <div className="dialog-buttons">
            <button onClick={() => setShowLoadDialog(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileControl;