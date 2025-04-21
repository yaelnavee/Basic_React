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

  useEffect(() => {
    const handleKeyDown = (event) => {
      setKeyPressed(event.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogin = (username) => {
    setIsAuthenticated(true);
    setUsername(username);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
  };

  return (
    <div className="app-container">
      {isAuthenticated ? (
        <>
          <div className="grid-container">
            {/* שורה עליונה */}
            <div className="notes-container">
              <div className="user-container" 
              style={{ textAlign: "center", marginTop: "10px" }}>
              <p>Welcome, {username}!</p>
              <button onClick={handleLogout}>Logout</button>
              </div>
              <div className="sticky-notes">
                <StickyNote />
                <StickyNote />
                <StickyNote />
              </div>
            </div >
            {/* שורה תחתונה */}
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
