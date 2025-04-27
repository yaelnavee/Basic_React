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
  
  // מצב דיאלוג שמירה גלובלי
  const [showGlobalSaveDialog, setShowGlobalSaveDialog] = useState(false);
  const [saveFileName, setSaveFileName] = useState('');
  const [saveNoteData, setSaveNoteData] = useState(null);

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

  // פונקציות לניהול דיאלוג שמירה גלובלי
  const openSaveDialog = (noteData) => {
    // הכן שם קובץ ברירת מחדל
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
      closeSaveDialog();
    }
  };

  // רינדור דיאלוג השמירה הגלובלי
  const renderSaveDialog = () => {
    if (!showGlobalSaveDialog) return null;

    return (
      <div className="global-save-dialog-overlay" onClick={closeSaveDialog}>
        <div className="global-save-dialog" onClick={(e) => e.stopPropagation()}>
          <h3>שמירת פתק</h3>
          <input
            type="text"
            value={saveFileName}
            onChange={(e) => setSaveFileName(e.target.value)}
            placeholder="הזן שם לקובץ"
            autoFocus
          />
          <div className="dialog-buttons">
            <button onClick={handleSaveNote} className="save-button">שמור</button>
            <button onClick={closeSaveDialog} className="cancel-button">ביטול</button>
          </div>
        </div>
      </div>
    );
  };

  // טיפול בלחיצה על מקש במקלדת הווירטואלית
  const handleVirtualKeyPress = (key) => {
    // אם דיאלוג השמירה פתוח, טפל בשדה שם הקובץ
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
    // אחרת, טפל בטקסט הפתק הרגיל
    else if (selectedNoteId !== null) {
      updateSelectedNoteText(key);
    }
  };

  //  פונקציה לטיפול בשינוי פונט
  const handleFontStyleChange = (style) => {
    if (selectedNoteId !== null) {
      if (typeof style === 'number') {
        // אם זה מספר, זה גודל פונט
        updateNote(selectedNoteId, { fontSize: style });
        console.log(`Changed font size to ${style}px for note ${selectedNoteId}`);
      } else {
        // אחרת זה פונט
        updateNote(selectedNoteId, { fontFamily: style });
        console.log(`Changed font family to ${style} for note ${selectedNoteId}`);
      }
      // סימון הפתק כעודכן לאחרונה
      setLastUpdatedId(selectedNoteId);
    } else {
      console.log("No note selected for font style change");
    }
  };

  // הוסף פונקציה לשינוי צבע
  const handleColorChange = (color) => {
    if (selectedNoteId !== null) {
      updateNote(selectedNoteId, { color });
    }
  };

  // פונקציה לטיפול בשינוי צבע הטקסט
  const handleTextColorChange = (color) => {
    if (selectedNoteId !== null) {
      updateNote(selectedNoteId, { textColor: color });
      console.log(`Changed text color to ${color} for note ${selectedNoteId}`);
      // סימון הפתק כעודכן לאחרונה
      setLastUpdatedId(selectedNoteId);
    } else {
      console.log("No note selected for text color change");
    }
  };

  // פונקציה לטיפול בשינוי צבע הרקע
  const handleBackgroundColorChange = (color) => {
    if (selectedNoteId !== null) {
      updateNote(selectedNoteId, { backgroundColor: color });
      console.log(`Changed background color to ${color} for note ${selectedNoteId}`);
      // סימון הפתק כעודכן לאחרונה
      setLastUpdatedId(selectedNoteId);
    } else {
      console.log("No note selected for background color change");
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
      // אם דיאלוג השמירה הגלובלי פתוח, טפל בלחיצת מקשים
      if (showGlobalSaveDialog) {
        if (event.key === 'Enter') {
          handleSaveNote();
          event.preventDefault();
        } else if (event.key === 'Escape') {
          closeSaveDialog();
          event.preventDefault();
        }
        // לשאר המקשים, נאפשר התנהגות רגילה באינפוט
        return;
      }
      
      // אחרת, נעביר את המקש לפתק
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
                    + הוסף פתק חדש
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