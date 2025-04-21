import React, { useState } from 'react';
import './css/StickyNote.css'; 

const StickyNote = ({ id, initialText, initialColor, onDelete, onUpdate }) => {
  const [text, setText] = useState(initialText || '');
  const [color, setColor] = useState(initialColor || 'yellow');
  const [isEditing, setIsEditing] = useState(false);

  // טיפול בלחיצה כפולה לפתיחת הפתק לעריכה
  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  // שמירת הטקסט ויציאה ממצב עריכה
  const handleSave = () => {
    setIsEditing(false);
    if (onUpdate) {
      onUpdate(id, { text, color });
    }
  };

  // שינוי צבע הפתק
  const handleColorChange = (newColor) => {
    setColor(newColor);
    if (onUpdate) {
      onUpdate(id, { text, color: newColor });
    }
  };

  // מחיקת הפתק
  const handleDelete = () => {
    if (onDelete) {
      onDelete(id);
    }
  };

  return (
    <div 
      className={`sticky-note ${color}`} 
      onDoubleClick={handleDoubleClick}
    >
      {isEditing ? (
        <div className="editing-mode">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            autoFocus
          />
          <div className="note-toolbar">
            <div className="color-options">
              <button 
                className="color-option yellow" 
                onClick={() => handleColorChange('yellow')}
              ></button>
              <button 
                className="color-option green" 
                onClick={() => handleColorChange('green')}
              ></button>
              <button 
                className="color-option pink" 
                onClick={() => handleColorChange('pink')}
              ></button>
              <button 
                className="color-option blue" 
                onClick={() => handleColorChange('blue')}
              ></button>
            </div>
            <button className="save-button" onClick={handleSave}>שמור</button>
          </div>
        </div>
      ) : (
        <>
          <div className="note-content">{text}</div>
          <button className="delete-button" onClick={handleDelete}>×</button>
        </>
      )}
    </div>
  );
};

export default StickyNote;