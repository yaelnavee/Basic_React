import React, { useState } from 'react';

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

  // סגנונות לפתק בהתאם לצבע שנבחר
  const noteStyles = {
    backgroundColor: 
      color === 'yellow' ? '#fff9c4' :
      color === 'blue' ? '#bbdefb' :
      color === 'green' ? '#c8e6c9' :
      color === 'pink' ? '#f8bbd0' : '#fff9c4',
    position: 'relative',
    width: '200px',
    minHeight: '200px',
    margin: '10px',
    padding: '15px',
    borderRadius: '5px',
    boxShadow: '0 3px 6px rgba(0, 0, 0, 0.16)',
    overflow: 'hidden',
    transition: 'transform 0.2s, box-shadow 0.2s',
  };

  const noteHoverStyles = {
    transform: 'scale(1.02)',
    boxShadow: '0 5px 10px rgba(0, 0, 0, 0.2)',
  };

  const noteContentStyles = {
    fontFamily: "'Assistant', 'Segoe UI', sans-serif",
    fontSize: '14px',
    lineHeight: '1.5',
    minHeight: '170px',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    direction: 'rtl',
  };

  const deleteButtonStyles = {
    position: 'absolute',
    top: '5px',
    right: '5px',
    width: '24px',
    height: '24px',
    background: 'none',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    color: 'rgba(0, 0, 0, 0.5)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const textareaStyles = {
    width: '100%',
    height: '170px',
    border: 'none',
    background: 'transparent',
    fontFamily: "'Assistant', 'Segoe UI', sans-serif",
    fontSize: '14px',
    lineHeight: '1.5',
    resize: 'none',
    outline: 'none',
    padding: '0',
    direction: 'rtl',
  };

  const noteToolbarStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px',
  };

  const colorOptionsStyles = {
    display: 'flex',
    gap: '5px',
  };

  const colorOptionBaseStyles = {
    width: '20px',
    height: '20px',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
  };

  const saveButtonStyles = {
    padding: '4px 8px',
    border: 'none',
    backgroundColor: '#4caf50',
    color: 'white',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  };

  return (
    <div 
      style={noteStyles} 
      onDoubleClick={handleDoubleClick}
      onMouseOver={(e) => {
        Object.assign(e.currentTarget.style, noteHoverStyles);
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 3px 6px rgba(0, 0, 0, 0.16)';
      }}
    >
      {isEditing ? (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={textareaStyles}
            autoFocus
          />
          <div style={noteToolbarStyles}>
            <div style={colorOptionsStyles}>
              <button 
                style={{ ...colorOptionBaseStyles, backgroundColor: '#fff9c4' }} 
                onClick={() => handleColorChange('yellow')}
              ></button>
              <button 
                style={{ ...colorOptionBaseStyles, backgroundColor: '#bbdefb' }} 
                onClick={() => handleColorChange('blue')}
              ></button>
              <button 
                style={{ ...colorOptionBaseStyles, backgroundColor: '#c8e6c9' }} 
                onClick={() => handleColorChange('green')}
              ></button>
              <button 
                style={{ ...colorOptionBaseStyles, backgroundColor: '#f8bbd0' }} 
                onClick={() => handleColorChange('pink')}
              ></button>
            </div>
            <button style={saveButtonStyles} onClick={handleSave}>שמור</button>
          </div>
        </div>
      ) : (
        <>
          <div style={noteContentStyles}>{text}</div>
          <button 
            style={deleteButtonStyles} 
            onClick={handleDelete}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.color = 'rgba(0, 0, 0, 0.8)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'rgba(0, 0, 0, 0.5)';
            }}
          >×</button>
        </>
      )}
    </div>
  );
};

export default StickyNote;