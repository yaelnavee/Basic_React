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

  // האזנה ללחיצות מקלדת
  useEffect(() => {
    const handleKeyDown = (event) => {
      setKeyPressed(event.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
      } else {
        setNotes([
          { id: 1, text: '', color: 'yellow' }
        ]);
        setNextId(2);
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
  };

  // הוספת פתק חדש
  const addNote = () => {
    const newNote = {
      id: nextId,
      text: '',
      color: 'yellow'
    };
    setNotes([...notes, newNote]);
    setNextId(nextId + 1);
  };

  // מחיקת פתק
  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  // עדכון פתק
  const updateNote = (id, updatedData) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, ...updatedData } : note
    ));
  };

  return (
    <div className="app-container">
      {isAuthenticated ? (
        <>
          <div className="grid-container">
            {/* שורה עליונה - אזור הפתקים */}
            <div className="notes-container">
              
              {/* מידע על המשתמש */}
              <div className="user-container" style={{ textAlign: "center", marginTop: "10px", width: "100%" }}>
                <p>שלום, {username}!</p>
                <button onClick={handleLogout}>התנתק</button>
              </div>
              {/* כפתור הוספת פתק */}
              <div className="add-note-container">
                <button onClick={addNote} className="add-note-button">
                  + הוסף פתק חדש
                </button>
              </div>
              {/* הצגת הפתקים */}
              {notes.map(note => (
                <StickyNote 
                  key={note.id}
                  id={note.id}
                  initialText={note.text}
                  initialColor={note.color}
                  onDelete={deleteNote}
                  onUpdate={updateNote}
                />
              ))}
            </div>
            
            {/* שורה תחתונה - מקלדת ואמוג'ים */}
            <div className="keyboard-row">
              <EmojisBox />
              <Keyboard keyPressed={keyPressed} />
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