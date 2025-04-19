import StickyNote from './components/StickyNote.jsx';
import Keyboard from './components/Keyboard.jsx'; 
import EmojisBox from './components/EmojisBox.jsx';

import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [keyPressed, setKeyPressed] = useState('');

  useEffect(() => {
    const handleKeyDown = (event) => {
      setKeyPressed(event.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="grid-container">
      {/* שורה עליונה */}
      <div className="notes-container">
        <StickyNote />

        <StickyNote />
        
        <StickyNote />
      </div>

      {/* שורה תחתונה */}
      <div className="keyboard-row">
        <EmojisBox/>
        <Keyboard keyPressed={keyPressed} />
        <div className="Fonts-box">Fonts</div>
        <div className="Colors-box">Colors</div>
      </div>
    </div>
  );
}

export default App;
