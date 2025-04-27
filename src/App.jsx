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
  // User state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [userImage, setUserImage] = useState(null);
  
  // Notes state
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [lastUpdatedId, setLastUpdatedId] = useState(null);
  
  // Dialog state
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  
  // Global save dialog state
  const [showGlobalSaveDialog, setShowGlobalSaveDialog] = useState(false);
  const [saveFileName, setSaveFileName] = useState('');
  const [saveNoteData, setSaveNoteData] = useState(null);

  // Use notes manager
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

  // Get current selected note
  const getCurrentNote = () => {
    if (selectedNoteId === null) return null;
    return notes.find(note => note.id === selectedNoteId) || null;
  };

  // Global save dialog management functions
  const openSaveDialog = (noteData) => {
    // Prepare default file name
    const defaultName = noteData.text 
      ? noteData.text.trim().split(/\s+/).slice(0, 3).join('_') || `note_${noteData.id}`
      : `note_${noteData.id}`;
    
    setSaveFileName(defaultName);
    setSaveNoteData(noteData);
    setShowGlobalSaveDialog(true);
  };

  const closeSaveDialog = () => {
    setShowGlobalSaveDialog(false);
    setSaveFileName('');
    setSaveNoteData(null);
  };

  const handleSaveNote = () => {
    if (saveNoteData && saveFileName.trim()) {
      saveNoteToFile(saveFileName, saveNoteData);
      
      if (saveNoteData.deleteAfterSave) {
        deleteNote(saveNoteData.id);
      }
      
      closeSaveDialog();
    }
  };

  // Render global save dialog
  const renderSaveDialog = () => {
    if (!showGlobalSaveDialog) return null;

    return (
      <div className="global-save-dialog-overlay" onClick={closeSaveDialog}>
        <div className="global-save-dialog" onClick={(e) => e.stopPropagation()}>
          <h3>Save Note</h3>
          <input
            type="text"
            value={saveFileName}
            onChange={(e) => setSaveFileName(e.target.value)}
            placeholder="Enter file name"
            autoFocus
          />
          <div className="save-buttons-row">
            <button onClick={closeSaveDialog} className="cancel-button">Cancel</button>
            <button onClick={handleSaveNote} className="save-button">Save</button>
          </div>
        </div>
      </div>
    );
  };

  // Handle virtual keyboard key press
  const handleVirtualKeyPress = (key) => {
    // If save dialog is open, handle file name input
    if (showGlobalSaveDialog) {
      switch (key) {
        case 'Del':
          setSaveFileName(prev => prev.slice(0, -1));
          break;
        case 'DelWord':
          const words = saveFileName.trim().split(/\s+/);
          words.pop();
          setSaveFileName(words.join(' '));
          break;
        case 'Enter':
          handleSaveNote();
          break;
        case 'Space':
          setSaveFileName(prev => prev + ' ');
          break;
        default:
          if (key.length === 1) {
            setSaveFileName(prev => prev + key);
          }
          break;
      }
    } 
    // Otherwise, handle note text input
    else if (selectedNoteId !== null) {
      updateSelectedNoteText(key);
    }
  };

  // Font style change handler
  const handleFontStyleChange = (style) => {
    if (selectedNoteId !== null) {
      if (typeof style === 'number') {
        // If it's a number, it's a font size
        updateNote(selectedNoteId, { fontSize: style });
      } else {
        // Otherwise it's a font family
        updateNote(selectedNoteId, { fontFamily: style });
      }
      // Mark the note as last updated
      setLastUpdatedId(selectedNoteId);
    }
  };

  // Color change handler
  const handleColorChange = (color) => {
    if (selectedNoteId !== null) {
      updateNote(selectedNoteId, { color });
    }
  };

  // Text color change handler
  const handleTextColorChange = (color) => {
    if (selectedNoteId !== null) {
      updateNote(selectedNoteId, { textColor: color });
      // Mark the note as last updated
      setLastUpdatedId(selectedNoteId);
    }
  };

  // Background color change handler
  const handleBackgroundColorChange = (color) => {
    if (selectedNoteId !== null) {
      updateNote(selectedNoteId, { backgroundColor: color });
      // Mark the note as last updated
      setLastUpdatedId(selectedNoteId);
    }
  };

  // Login handler
  const handleLogin = (username) => {
    setIsAuthenticated(true);
    setUsername(username);

    // Load notes from storage by the correct key
    const saved = localStorage.getItem(`stickyNotes_${username}`);
    if (saved) {
      const parsedNotes = JSON.parse(saved);
      loadNotes(parsedNotes);
    }
  };

  // Logout handler
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setSelectedNoteId(null);
    setLastUpdatedId(null);
  };

  // Register for physical keyboard events
  if (typeof document !== 'undefined') {
    document.onkeydown = (event) => {
      // If global save dialog is open, handle key presses
      if (showGlobalSaveDialog) {
        if (event.key === 'Enter') {
          handleSaveNote();
          event.preventDefault();
        } else if (event.key === 'Escape') {
          closeSaveDialog();
          event.preventDefault();
        }
        // For other keys, allow normal input behavior
        return;
      }
      
      // Otherwise, pass the key to the note
      if (selectedNoteId !== null) {
        updateSelectedNoteText(event.key);
      }
    };
  }

  return (
    <div className={`app-container ${showGlobalSaveDialog ? 'keyboard-save-mode' : ''}`}>
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
                    + Add Note
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
                    initialFontFamily={note.fontFamily}
                    initialFontSize={note.fontSize}
                    initialTextColor={note.textColor}       
                    initialBackgroundColor={note.backgroundColor} 
                    onDelete={deleteNote}
                    onUpdate={updateNote}
                    onEditEnd={() => handleNoteEditEnd(note.id)}
                    isSelected={note.id === selectedNoteId}
                    onSelect={(id) => {
                      selectNote(id);
                    }}
                    onSaveNote={saveNoteToFile}
                    onSaveDialogOpen={() => setIsSaveDialogOpen(true)}
                    onSaveDialogClose={() => setIsSaveDialogOpen(false)}
                    onSaveClick={(note) => openSaveDialog(note)}
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
              <FontBox 
                onFontChange={handleFontStyleChange} 
                selectedFont={getCurrentNote()?.fontFamily} 
                selectedSize={getCurrentNote()?.fontSize}
              />
              <ColorsBox 
                onColorChange={handleTextColorChange}
                onBgColorChange={handleBackgroundColorChange}
                selectedTextColor={getCurrentNote()?.textColor}
                selectedBgColor={getCurrentNote()?.backgroundColor}
              />
            </div>
          </div>
          
          {/* Global Save Dialog */}
          {renderSaveDialog()}
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