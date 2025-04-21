import React, { useEffect, useState } from "react";
import StickyNote from './components/StickyNote.jsx';
import Keyboard from './components/Keyboard.jsx'; 
import EmojisBox from './components/EmojisBox.jsx';
import Login from "./components/login.jsx";
import './App.css';

function App() {
  const [keyPressed, setKeyPressed] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  
  // ניהול פתקים
  const [notes, setNotes] = useState([]);
  const [nextId, setNextId] = useState(1);
  
  // הוספת מצב לפתק נבחר
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  // מעקב אחר הפתק האחרון שעודכן
  const [lastUpdatedId, setLastUpdatedId] = useState(null);

  // האזנה ללחיצות מקלדת פיזית
  useEffect(() => {
    const handleKeyDown = (event) => {
      setKeyPressed(event.key);
      
      // אם יש פתק נבחר, נוסיף את התו למלל של הפתק
      if (selectedNoteId !== null) {
        updateSelectedNoteText(event.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNoteId, notes]); 

  // האזנה לאירועים מהמקלדת הווירטואלית
  useEffect(() => {
    const handleVirtualKeyDown = (event) => {
      // בדיקה שזה אירוע מותאם שלנו (לא מהמקלדת הפיזית)
      if (event.detail && event.detail.virtual) {
        const key = event.detail.key;
        
        // אם יש פתק נבחר, נוסיף את התו למלל של הפתק
        if (selectedNoteId !== null) {
          updateSelectedNoteText(key);
        }
      }
    };

    window.addEventListener('virtualkeydown', handleVirtualKeyDown);
    return () => window.removeEventListener('virtualkeydown', handleVirtualKeyDown);
  }, [selectedNoteId, notes]); 

  // סדר מחדש את הפתקים כך שהפתק האחרון שעודכן יהיה ראשון
  useEffect(() => {
    if (lastUpdatedId !== null && lastUpdatedId !== selectedNoteId) {
      reorderNotes(lastUpdatedId);
      setLastUpdatedId(null);
    }
  }, [selectedNoteId, lastUpdatedId]);

  // פונקציה לסידור מחדש של הפתקים
  const reorderNotes = (noteId) => {
    const updatedNote = notes.find(note => note.id === noteId);
    if (!updatedNote) return;

    // הסר את הפתק מהמערך הנוכחי
    const otherNotes = notes.filter(note => note.id !== noteId);
    
    // הוסף את הפתק המעודכן לתחילת המערך
    setNotes([updatedNote, ...otherNotes]);
  };

  // פונקציה לעדכון טקסט בפתק הנבחר
  const updateSelectedNoteText = (key) => {
    if (!selectedNoteId) return;

    const selectedNote = notes.find(note => note.id === selectedNoteId);
    if (!selectedNote) return;

    let currentText = selectedNote.text || '';
    let newText = currentText;

    // טיפול במקרים מיוחדים
    switch (key) {
      case 'Backspace':
      case 'Del':
        newText = currentText.slice(0, -1); 
        break;
      case 'Enter':
        newText = currentText + '\n'; 
        break;
      case 'Space':
        newText = currentText + ' '; 
        break;
      case 'Tab':
        newText = currentText + '\t'; 
        break;
      default:
        if (key.length === 1) {
          newText = currentText + key; 
        }
        break;
    }

    if (newText !== currentText) {
      updateNote(selectedNoteId, { text: newText });
      // הפתק האחרון שעודכן
      setLastUpdatedId(selectedNoteId);
    }
  };

  // טיפול בלחיצה על אימוג'י
  const handleEmojiClick = (emoji) => {
    if (selectedNoteId !== null) {
      const selectedNote = notes.find(note => note.id === selectedNoteId);
      if (!selectedNote) return;
  
      const newText = (selectedNote.text || '') + emoji;
      
      updateNote(selectedNoteId, { text: newText });
      // הפתק האחרון שעודכן
      setLastUpdatedId(selectedNoteId);
    }
  };

  // טיפול בלחיצה על מקש וירטואלי
  const handleVirtualKeyPress = (key) => {
    const customEvent = new CustomEvent('virtualkeydown', { 
      detail: { key, virtual: true } 
    });
    window.dispatchEvent(customEvent);
  };

  // טעינת הפתקים מה-Local Storage כשמשתמש מתחבר
  useEffect(() => {
    if (isAuthenticated && username) {
      const savedNotes = localStorage.getItem(`stickyNotes_${username}`);
      if (savedNotes) {
        const parsedNotes = JSON.parse(savedNotes);
        setNotes(parsedNotes);
        
        // מציאת ה-ID הגבוה ביותר כדי להמשיך מספור
        const maxId = Math.max(...parsedNotes.map(note => note.id), 0);
        setNextId(maxId + 1);
        
        // בחירת הפתק הראשון כברירת מחדל (אם יש פתקים)
        if (parsedNotes.length > 0) {
          setSelectedNoteId(parsedNotes[0].id);
        }
      } else {
        // יצירת פתק ראשון אם אין
        const firstNote = { id: 1, text: '', color: 'yellow' };
        setNotes([firstNote]);
        setNextId(2);
        setSelectedNoteId(1); 
      }
    }
  }, [isAuthenticated, username]);

  // שמירת הפתקים ב-Local Storage בכל שינוי
  useEffect(() => {
    if (isAuthenticated && username) {
      localStorage.setItem(`stickyNotes_${username}`, JSON.stringify(notes));
    }
  }, [notes, isAuthenticated, username]);

  const handleLogin = (username) => {
    setIsAuthenticated(true);
    setUsername(username);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setNotes([]);
    setSelectedNoteId(null);
    setLastUpdatedId(null);
  };

  // הוספת פתק חדש
  const addNote = () => {
    const newId = nextId;
    const newNote = {
      id: newId,
      text: '',
      color: 'yellow'
    };
    
    // הוסף את הפתק החדש לתחילת הרשימה
    setNotes([newNote, ...notes]);
    setNextId(nextId + 1);
    
    // בחירה אוטומטית של הפתק החדש
    setSelectedNoteId(newId);
  };

  // מחיקת פתק
  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
    
    // אם הפתק הנמחק הוא הפתק הנבחר, נבחר פתק אחר
    if (selectedNoteId === id) {
      // חפש את הפתק הקודם או הבא ברשימה
      const remainingNotes = notes.filter(note => note.id !== id);
      if (remainingNotes.length > 0) {
        setSelectedNoteId(remainingNotes[0].id);
      } else {
        setSelectedNoteId(null);
      }
    }

    // אם הפתק הנמחק הוא הפתק האחרון שעודכן, נאפס את המצב
    if (lastUpdatedId === id) {
      setLastUpdatedId(null);
    }
  };

  // עדכון פתק
  const updateNote = (id, updatedData) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, ...updatedData } : note
    ));
  };

  // כאשר משתמש יוצא ממצב עריכה של פתק
  const handleNoteEditEnd = (id) => {
    // סמן את הפתק כאחרון שעודכן
    setLastUpdatedId(id);
  };

  // בחירת פתק
  const selectNote = (id) => {
    setSelectedNoteId(id);
  };

  return (
    <div className="app-container">
      {isAuthenticated ? (
        <>
          <div className="grid-container">
            {/* שורה עליונה - אזור הפתקים */}
            <div className="notes-container">
              {/* סרגל צד עם פרטי משתמש וכפתור הוספת פתק */}
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
              </div>
              
              {/* אזור תצוגת הפתקים */}
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
                    onSelect={() => selectNote(note.id)}
                  />
                ))}
              </div>
            </div>
            
            {/* שורה תחתונה - אזור הכלים */}
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
                setIsSigningUp(false); // מעבר למסך התחברות אחרי הרשמה
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