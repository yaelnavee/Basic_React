import React, { useState, useEffect, useRef } from 'react';
import './css/StickyNote.css'; 

const StickyNote = ({ 
  id, 
  initialText, 
  initialColor, 
  onDelete, 
  onUpdate, 
  isSelected, 
  onSelect, 
  onEditEnd, 
  onSaveNote,
  onSaveDialogOpen,
  onSaveDialogClose
}) => {
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
    if (showSaveDialog) return; // לא לפתוח עריכה אם דיאלוג פתוח
    
    setIsEditing(true);
    if (onSelect) {
      onSelect(id);
    }
  };
  
  // טיפול בלחיצה על הפתק - בחירת הפתק
  const handleClick = () => {
    if (showSaveDialog) return; // לא לבחור אם דיאלוג פתוח
    
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
    e.stopPropagation(); // מניעת בחירת הפתק בלחיצה על כפתור השמירה
    
    // בטל בחירה של הפתק בזמן שדיאלוג השמירה פתוח
    if (isSelected && onSelect) {
      onSelect(null);
    }
    
    // הודע לאפליקציה שדיאלוג השמירה פתוח
    if (onSaveDialogOpen) {
      onSaveDialogOpen();
    }
    
    setShowSaveDialog(true);
    
    // יצירת שם קובץ מחדל מהטקסט בפתק
    if (text) {
      const defaultName = text.trim().split(/\s+/).slice(0, 3).join('_');
      if (defaultName) {
        setFileName(defaultName);
      } else {
        setFileName(`note_${id}`);
      }
    } else {
      setFileName(`note_${id}`);
    }
    
    setErrorMessage('');
  };

  // סגירת דיאלוג השמירה
  const closeSaveDialog = () => {
    setShowSaveDialog(false);
    
    // הודע לאפליקציה שדיאלוג השמירה נסגר
    if (onSaveDialogClose) {
      onSaveDialogClose();
    }
    
    // החזר את הבחירה לפתק
    if (onSelect) {
      onSelect(id);
    }
  };

  // סגירת דיאלוג בלחיצה מחוץ לדיאלוג
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (saveDialogRef.current && !saveDialogRef.current.contains(event.target)) {
        closeSaveDialog();
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
        closeSaveDialog();
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
    if (!isSelected || isEditing || showSaveDialog) return text;
    
    // הוספת אלמנט הסמן לסוף הטקסט רק אם הפתק נבחר ואין דיאלוג פתוח
    return (
      <>
        {text}
        <span className="cursor"></span>
      </>
    );
  };

  return (
    <div 
      className={`sticky-note ${color} ${isSelected && !showSaveDialog ? 'selected' : ''}`} 
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
              <button 
                className="color-option purple" 
                onClick={() => handleColorChange('purple')}
              ></button>
            </div>
            <button className="save-button" onClick={handleSave}>Save</button>
          </div>
        </div>
      ) : (
        <>
          <div className="note-content">{renderTextWithCursor()}</div>
          <div className="note-buttons">
            <button className="save-note-button" onClick={handleSaveClick} title="Save note to file">💾</button>
            <button className="delete-button" onClick={handleDelete} title="Delete note">×</button>
          </div>
        </>
      )}

      {/* Save Dialog */}
      {showSaveDialog && (
        <div 
          className="note-save-dialog-overlay"
          onClick={(e) => {
            e.stopPropagation();
            closeSaveDialog();
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
                autoFocus
              />
              {errorMessage && <p className="error-message">{errorMessage}</p>}
              <div className="dialog-buttons">
                <button type="submit">Save</button>
                <button 
                  type="button" 
                  onClick={(e) => {
                    e.stopPropagation();
                    closeSaveDialog();
                  }}
                >
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