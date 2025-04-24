import React, { useState } from "react";
import StickyNote from './components/StickyNote.jsx';
import Keyboard from './components/Keyboard.jsx'; 
import EmojisBox from './components/EmojisBox.jsx';
import Login from "./components/login.jsx";
import FileControl from "./components/FileControl.jsx";
import { useNotesManager } from './components/NotesManager.jsx';
 import FontBox from './components/FontsBox.jsx';
import './App.css';

function App() {
  // מצב משתמש
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  
  // מצב פתקים
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [lastUpdatedId, setLastUpdatedId] = useState(null);
  
  // מצב דיאלוגים
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);

  // שימוש במנהל הפתקים
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

  // קבלת הפתק הנבחר הנוכחי
  const getCurrentNote = () => {
    if (selectedNoteId === null) return null;
    return notes.find(note => note.id === selectedNoteId) || null;
  };

  // טיפול בלחיצה על מקש במקלדת הוירטואלית
  const handleVirtualKeyPress = (key) => {
    // אם יש דיאלוג פתוח, לא לעדכן את הפתק
    if (isSaveDialogOpen) return;
    
    if (selectedNoteId !== null) {
      updateSelectedNoteText(key);
    }
  };

  // טיפול בכניסה למערכת
  const handleLogin = (username) => {
    setIsAuthenticated(true);
    setUsername(username);
  };

  // טיפול ביציאה מהמערכת
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setSelectedNoteId(null);
    setLastUpdatedId(null);
  };

  // רישום למקלדת פיזית
  if (typeof document !== 'undefined') {
    document.onkeydown = (event) => {
      if (isSaveDialogOpen) return;
      
      if (selectedNoteId !== null) {
        updateSelectedNoteText(event.key);
      }
    };
  }

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
                    onLoadNote={loadNoteFromFile}
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
              
              <FontBox  />
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