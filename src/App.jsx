import React, { useEffect, useState, useRef } from "react";
import StickyNote from './components/StickyNote.jsx';
import Keyboard from './components/Keyboard.jsx'; 
import EmojisBox from './components/EmojisBox.jsx';
import Login from "./components/login.jsx";
import FileControl from "./components/FileControl.jsx";
import { useNotesManager } from './components/NotesManager.jsx';
import './App.css';

function App() {
  const [keyPressed, setKeyPressed] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  
  // State for notes management
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [lastUpdatedId, setLastUpdatedId] = useState(null);
  
  // State to track if a save dialog is open
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);

  // Use our StickyNotes hook
  const {
    notes,
    addNote,
    deleteNote,
    updateNote,
    selectNote,
    handleNoteEditEnd,
    updateSelectedNoteText,
    handleEmojiClick,
    loadNoteFromFile,
    saveNoteToFile
  } = useNotesManager({
    username,
    isAuthenticated,
    selectedNoteId,
    setSelectedNoteId,
    lastUpdatedId,
    setLastUpdatedId
  });

  // Get the currently selected note
  const getCurrentNote = () => {
    if (selectedNoteId === null) return null;
    return notes.find(note => note.id === selectedNoteId) || null;
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      // אם יש דיאלוג שמירה פתוח, לא לעדכן את הפתק
      if (isSaveDialogOpen) return;
      
      setKeyPressed(event.key);
      
      if (selectedNoteId !== null) {
        updateSelectedNoteText(event.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNoteId, updateSelectedNoteText, isSaveDialogOpen]); 

  useEffect(() => {
    const handleVirtualKeyDown = (event) => {
      // אם יש דיאלוג שמירה פתוח, לא לעדכן את הפתק
      if (isSaveDialogOpen) return;
      
      if (event.detail && event.detail.virtual) {
        const key = event.detail.key;
        
        if (selectedNoteId !== null) {
          updateSelectedNoteText(key);
        }
      }
    };

    window.addEventListener('virtualkeydown', handleVirtualKeyDown);
    return () => window.removeEventListener('virtualkeydown', handleVirtualKeyDown);
  }, [selectedNoteId, updateSelectedNoteText, isSaveDialogOpen]); 

  const handleVirtualKeyPress = (key) => {
    // אם יש דיאלוג שמירה פתוח, לא לשלוח אירועי מקלדת
    if (isSaveDialogOpen) return;
    
    const customEvent = new CustomEvent('virtualkeydown', { 
      detail: { key, virtual: true } 
    });
    window.dispatchEvent(customEvent);
  };

  const handleLogin = (username) => {
    setIsAuthenticated(true);
    setUsername(username);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setSelectedNoteId(null);
    setLastUpdatedId(null);
  };

  // Handler for loading a note from a file
  const handleLoadNote = (noteData) => {
    loadNoteFromFile(noteData);
  };

  return (
    <div className="app-container">
      {isAuthenticated ? (
        <>
          <div className="grid-container">
            {/* Notes area */}
            <div className="notes-container">
              {/* Sidebar with user info and add note button */}
              <div className="sidebar">
                <div className="user-container">
                  <p>hey, {username}!</p>
                  <button onClick={handleLogout}>logout</button>
                </div>
                
                <div className="add-note-container">
                  <button onClick={addNote} className="add-note-button">
                    + add new note
                  </button>
                </div>
                
                {/* File Control Component */}
                <div className="file-control-container">
                  <FileControl 
                    onLoadNote={handleLoadNote}
                    onSaveNote={saveNoteToFile}
                    username={username}
                    currentNote={getCurrentNote()}
                  />
                </div>
              </div>
              
              {/* Notes display area */}
              <div className="notes-display-area">
                {notes.map(note => (
                  <StickyNote 
                    key={note.id}
                    id={note.id}
                    initialText={note.text}
                    initialColor={note.color}
                    onDelete={deleteNote}
                    onUpdate={updateNote}
                    onEditEnd={() => handleNoteEditEnd(note.id)}
                    isSelected={note.id === selectedNoteId}
                    onSelect={(id) => {
                      // אם מקבלים null מהפתק, סימן שדיאלוג השמירה פתוח
                      if (id === null) {
                        setIsSaveDialogOpen(true);
                      } else {
                        setIsSaveDialogOpen(false);
                        selectNote(id);
                      }
                    }}
                    onSaveNote={saveNoteToFile}
                    onSaveDialogOpen={() => setIsSaveDialogOpen(true)}
                    onSaveDialogClose={() => setIsSaveDialogOpen(false)}
                  />
                ))}
              </div>
            </div>
            
            {/* Tools area */}
            <div className="keyboard-row">
              <EmojisBox onEmojiClick={handleEmojiClick} />
              <Keyboard onKeyPress={handleVirtualKeyPress} />
              <div className="Fonts-box">Fonts</div>
              <div className="Colors-box">Colors</div>
            </div>
          </div>
        </>
      ) : (
        <div style={{ textAlign: "center", paddingTop: "50px" }}>
          <Login
            type={isSigningUp ? "signup" : "signin"}
            onSuccess={(username) => {
              if (isSigningUp) {
                setIsSigningUp(false); // Switch to login screen after signup
              } else {
                handleLogin(username);
              }
            }}
          />
        </div>
      )}
    </div>
  );
}

export default App;