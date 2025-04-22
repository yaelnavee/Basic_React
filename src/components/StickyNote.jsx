import React, { useState, useEffect, useRef } from 'react';
import './css/StickyNote.css'; 

const StickyNote = ({ id, initialText, initialColor, onDelete, onUpdate, isSelected, onSelect, onEditEnd, onSaveNote }) => {
  const [text, setText] = useState(initialText || '');
  const [color, setColor] = useState(initialColor || 'yellow');
  const [isEditing, setIsEditing] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [fileName, setFileName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const textareaRef = useRef(null);
  const saveDialogRef = useRef(null);
  
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

  // פתיחת דיאלוג שמירה
  const handleSaveClick = (e) => {
    e.stopPropagation(); // מניעת בחירת הפתק בעת לחיצה על כפתור השמירה
    setShowSaveDialog(true);
    setFileName('');
    setErrorMessage('');
  };

  // סגירת דיאלוג בלחיצה מחוץ לדיאלוג
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (saveDialogRef.current && !saveDialogRef.current.contains(event.target)) {
        setShowSaveDialog(false);
      }
    };

    // הוספת מאזין לחיצה רק כאשר הדיאלוג מוצג
    if (showSaveDialog) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSaveDialog]);

  // שמירת הפתק כקובץ
  const handleSaveAsFile = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!fileName.trim()) {
      setErrorMessage('Please enter a file name');
      return;
    }

    if (onSaveNote) {
      // הכנת העתק של הנתונים לשמירה - לא מקושר למשתנים המקומיים
      const noteDataToSave = {
        text: text,
        color: color
      };
      
      // העבר את שם הקובץ ואת העתק התוכן לפונקציית השמירה
      const success = onSaveNote(fileName, noteDataToSave);
      
      if (success) {
        setShowSaveDialog(false);
        setFileName('');
        setErrorMessage('');
      } else {
        setErrorMessage('Failed to save the note');
      }
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
          <div className="note-buttons">
            <button className="save-note-button" onClick={handleSaveClick}>💾</button>
            <button className="delete-button" onClick={handleDelete}>×</button>
          </div>
        </>
      )}

      {/* Save Dialog */}
      {showSaveDialog && (
        <div 
          className="note-save-dialog-overlay"
          onClick={(e) => {
            e.stopPropagation();
            setShowSaveDialog(false);
          }}
        >
          <div 
            className="note-save-dialog" 
            onClick={(e) => e.stopPropagation()}
            ref={saveDialogRef}
          >
            <h3>Save Note As</h3>
            <form onSubmit={handleSaveAsFile}>
              <input
                type="text"
                placeholder="Enter file name"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
              {errorMessage && <p className="error-message">{errorMessage}</p>}
              <div className="dialog-buttons">
                <button type="submit">Save</button>
                <button type="button" onClick={(e) => {
                  e.stopPropagation();
                  setShowSaveDialog(false);
                }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StickyNote;