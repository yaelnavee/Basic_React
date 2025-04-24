import React, { useState } from "react";
import StickyNote from './components/StickyNote.jsx';
import Keyboard from './components/Keyboard.jsx'; 
import EmojisBox from './components/EmojisBox.jsx';
import Login from "./components/login.jsx";
import FileControl from "./components/FileControl.jsx";
import { useNotesManager } from './components/NotesManager.jsx';
import FontBox from './components/FontsBox.jsx';
import UserProfile from "./components/UserProfile.jsx";
import ColorsBox from './components/ColorsBox.jsx';
import './App.css';

function App() {
  // מצב משתמש
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [userImage, setUserImage] = useState(null);
  
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
    saveNoteToFile,
    loadNotes
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

  const handleVirtualKeyPress = (key) => {
    if (isSaveDialogOpen) return;
    
    if (selectedNoteId !== null) {
      updateSelectedNoteText(key);
    }
  };

  // הוספת פונקציה חדשה לטיפול בשינוי פונט
  const handleFontStyleChange = (style) => {
    if (selectedNoteId !== null) {
      if (typeof style === 'number') {
        // אם זה מספר, זה גודל פונט
        updateNote(selectedNoteId, { fontSize: style });
      } else {
        // אחרת זה פונט
        updateNote(selectedNoteId, { fontFamily: style });
      }
    }
  };

  // הוסף פונקציה לשינוי צבע
  const handleColorChange = (color) => {
    if (selectedNoteId !== null) {
      updateNote(selectedNoteId, { color });
    }
  };

  // טיפול בכניסה למערכת
  const handleLogin = (username) => {
    setIsAuthenticated(true);
    setUsername(username);

    // טען פתקים מהסטורג' לפי המפתח הנכון
    const saved = localStorage.getItem(`stickyNotes_${username}`);
    if (saved) {
      const parsedNotes = JSON.parse(saved);
      loadNotes(parsedNotes);
    }
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
                <UserProfile
                  username={username}
                  onLogout={handleLogout}
                  userImage={userImage}
                  onImageChange={setUserImage}
                />
                
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
                    username={username}  
                    notes={notes}               
                    />
                ))}
              </div>
            </div>
            
            {/* Tools area */}
            <div className="keyboard-row">
              <EmojisBox onEmojiClick={handleEmojiClick} />
              <Keyboard onKeyPress={handleVirtualKeyPress} />
              <FontBox onFontChange={handleFontStyleChange} />
              <ColorsBox 
               onColorChange={color => updateNote(selectedNoteId, { color })}
               onBgColorChange={bgColor => updateNote(selectedNoteId, { backgroundColor: bgColor })}
              />
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