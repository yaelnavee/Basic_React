import React, { useState, useEffect, useRef } from 'react';
import './css/StickyNote.css'; 

const StickyNote = ({ id, initialText, initialColor, onDelete, onUpdate, isSelected, onSelect, onEditEnd }) => {
  const [text, setText] = useState(initialText || '');
  const [color, setColor] = useState(initialColor || 'yellow');
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef(null);
  
  // טיפול בלחיצה כפולה לפתיחת הפתק לעריכה
  const handleDoubleClick = () => {
    setIsEditing(true);
    if (onSelect) {
      onSelect(id);
    }
  };
  
  // טיפול בלחיצה על הפתק - בחירת הפתק
  const handleClick = () => {
    if (onSelect) {
      onSelect(id);
    }
  };

  // שמירת הטקסט ויציאה ממצב עריכה
  const handleSave = () => {
    setIsEditing(false);
    if (onUpdate) {
      onUpdate(id, { text, color });
    }
    
    // קריאה לפונקציית סיום העריכה
    if (onEditEnd) {
      onEditEnd(id);
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
  const handleDelete = (e) => {
    e.stopPropagation(); // מניעת בחירת הפתק בעת לחיצה על כפתור המחיקה
    if (onDelete) {
      onDelete(id);
    }
  };

  // עדכון טקסט מהחוץ
  useEffect(() => {
    setText(initialText || '');
  }, [initialText]);
  
  // התמקדות בטקסטאריה כאשר הפתק נבחר או במצב עריכה
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);
  
  // יצירת ייצוג ויזואלי של הטקסט עם סמן
  const renderTextWithCursor = () => {
    if (!isSelected || isEditing) return text;
    
    // הוספת אלמנט הסמן לסוף הטקסט
    return (
      <>
        {text}
        <span className="cursor"></span>
      </>
    );
  };

  return (
    <div 
      className={`sticky-note ${color} ${isSelected ? 'selected' : ''}`} 
      onDoubleClick={handleDoubleClick}
      onClick={handleClick}
    >
      {isEditing ? (
        <div className="editing-mode">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (onUpdate) {
                onUpdate(id, { text: e.target.value, color });
              }
            }}
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
          <div className="note-content">{renderTextWithCursor()}</div>
          <button className="delete-button" onClick={handleDelete}>×</button>
        </>
      )}
    </div>
  );
};

export default StickyNote;