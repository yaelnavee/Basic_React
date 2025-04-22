import React, { useState } from 'react';
import './css/FileControl.css';

const FileControl = ({ 
  files, 
  currentFileName, 
  onSave, 
  onSaveAs, 
  onOpen, 
  onDelete 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFileListOpen, setIsFileListOpen] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [showSaveAsDialog, setShowSaveAsDialog] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Close file list when toggling menu
    if (isFileListOpen) setIsFileListOpen(false);
  };
  
  const toggleFileList = () => {
    setIsFileListOpen(!isFileListOpen);
  };
  
  const handleSave = () => {
    if (currentFileName) {
      // If we already have a file name, save to that file
      onSave(currentFileName);
    } else {
      // Otherwise show the Save As dialog
      setShowSaveAsDialog(true);
    }
    setIsMenuOpen(false);
  };
  
  const handleSaveAs = () => {
    setShowSaveAsDialog(true);
    setIsMenuOpen(false);
  };
  
  const handleSaveAsSubmit = () => {
    if (newFileName.trim()) {
      onSaveAs(newFileName.trim());
      setNewFileName('');
      setShowSaveAsDialog(false);
    }
  };
  
  const handleOpen = (fileName) => {
    onOpen(fileName);
    setIsFileListOpen(false);
    setIsMenuOpen(false);
  };
  
  const handleDelete = (fileName, e) => {
    e.stopPropagation(); // Prevent opening the file when clicking delete
    
    if (window.confirm(`האם אתה בטוח שברצונך למחוק את הקובץ "${fileName}"?`)) {
      onDelete(fileName);
    }
  };
  
  return (
    <div className="file-control">
      <button className="file-menu-button" onClick={toggleMenu}>
        קובץ
      </button>
      
      {isMenuOpen && (
        <div className="file-menu">
          <button onClick={handleSave}>שמירה</button>
          <button onClick={handleSaveAs}>שמירה בשם</button>
          <button onClick={toggleFileList}>פתיחה</button>
        </div>
      )}
      
      {isFileListOpen && (
        <div className="file-list">
          <h3>רשימת קבצים</h3>
          {files.length === 0 ? (
            <p>אין קבצים שמורים</p>
          ) : (
            <ul>
              {files.map((fileName) => (
                <li key={fileName} onClick={() => handleOpen(fileName)}>
                  <span className="file-name">{fileName}</span>
                  <button 
                    className="delete-file" 
                    onClick={(e) => handleDelete(fileName, e)}
                  >
                    מחק
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      
      {showSaveAsDialog && (
        <div className="save-as-dialog">
          <div className="save-as-content">
            <h3>שמירה בשם</h3>
            <input 
              type="text" 
              value={newFileName} 
              onChange={(e) => setNewFileName(e.target.value)} 
              placeholder="הזן שם קובץ"
            />
            <div className="save-as-buttons">
              <button onClick={handleSaveAsSubmit}>שמור</button>
              <button onClick={() => setShowSaveAsDialog(false)}>ביטול</button>
            </div>
          </div>
        </div>
      )}
      
      {currentFileName && (
        <div className="current-file">
          <span title={currentFileName}>
            קובץ נוכחי: {currentFileName}
          </span>
        </div>
      )}
    </div>
  );
};

export default FileControl;