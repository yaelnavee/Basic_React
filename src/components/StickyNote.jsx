import React, { useState, useRef } from 'react';
import './css/StickyNote.css'; 

const StickyNote = ({ 
  id, 
  initialText, 
  initialColor, 
  initialFontFamily,  
  initialFontSize,   
  initialTextColor,    
  initialBackgroundColor, 
  onDelete, 
  onUpdate, 
  isSelected, 
  onSelect, 
  onEditEnd, 
  onSaveNote,
  onSaveDialogOpen,
  onSaveDialogClose,
  username,
  notes 
}) => {
  //ברירת מחדל - מצב הפתק
  const [text, setText] = useState(initialText || '');
  const [color, setColor] = useState(initialColor || 'yellow');
  const [fontFamily, setFontFamily] = useState(initialFontFamily || 'Arial, sans-serif'); 
  const [textColor, setTextColor] = useState(initialTextColor || '#222222'); 
  const [backgroundColor, setBackgroundColor] = useState(initialBackgroundColor || ''); 
  const [fontSize, setFontSize] = useState(initialFontSize || 16); 
  const [isEditing, setIsEditing] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [fileName, setFileName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // רפרנסים
  const textareaRef = useRef(null);
  const saveDialogRef = useRef(null);
  
  
  // עדכון טקסט אם השתנה מבחוץ
  if (initialText !== undefined && initialText !== text) {
    setText(initialText);
  }
  
  // עדכון צבע אם השתנה מבחוץ
  if (initialColor !== undefined && initialColor !== color) {
    setColor(initialColor);
  }

  // עדכון פונט אם השתנה מבחוץ
  if (initialFontFamily !== undefined && initialFontFamily !== fontFamily) {
    setFontFamily(initialFontFamily);
  }

  // עדכון גודל פונט אם השתנה מבחוץ
  if (initialFontSize !== undefined && initialFontSize !== fontSize) {
    setFontSize(initialFontSize);
  }
  
  // עדכון צבע טקסט אם השתנה מבחוץ
  if (initialTextColor !== undefined && initialTextColor !== textColor) {
    setTextColor(initialTextColor);
  }
  
  // עדכון צבע רקע אם השתנה מבחוץ
  if (initialBackgroundColor !== undefined && initialBackgroundColor !== backgroundColor) {
    setBackgroundColor(initialBackgroundColor);
  }

  // בחירת פתק
  const handleClick = () => {
    if (showSaveDialog) return;
    onSelect?.(id);
  };
  
  // עריכת פתק
  const handleDoubleClick = () => {
    if (showSaveDialog) return;
    setIsEditing(true);
    onSelect?.(id);
    setTimeout(() => textareaRef.current?.focus(), 10);
  };
  
  // שמירת שינויים בפתק
  const handleSave = () => {
    setIsEditing(false);
    onUpdate?.(id, { 
      text, 
      color, 
      fontFamily, 
      fontSize,
      textColor,
      backgroundColor
    });
    onEditEnd?.(id);
  };
  
  // שינוי צבע הפתק
  const handleColorChange = (newColor) => {
    setColor(newColor);
    onUpdate?.(id, { 
      text, 
      color: newColor, 
      fontFamily, 
      fontSize,
      textColor,
      backgroundColor
    });
  };
  
  // מחיקת פתק
  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete?.(id);
  };
  
  // פתיחת דיאלוג שמירה
  const handleSaveClick = (e) => {
    e.stopPropagation();
    
    if (isSelected) onSelect?.(null);
    onSaveDialogOpen?.();
    setShowSaveDialog(true);
    
    // קביעת שם קובץ ברירת מחדל
    const defaultName = text ? text.trim().split(/\s+/).slice(0, 3).join('_') || `note_${id}` : `note_${id}`;
    setFileName(defaultName);
    setErrorMessage('');
  };
  
  // סגירת דיאלוג שמירה
  const closeSaveDialog = () => {
    setShowSaveDialog(false);
    onSaveDialogClose?.();
    onSelect?.(id);
  };
  
  // טיפול בלחיצה מחוץ לדיאלוג
  const handleClickOutside = (event) => {
    if (showSaveDialog && saveDialogRef.current && !saveDialogRef.current.contains(event.target)) {
      closeSaveDialog();
    }
  };
  
  // רישום מאזין לחיצה חיצונית כשדיאלוג פתוח
  if (showSaveDialog) {
    document.addEventListener('mousedown', handleClickOutside);
    setTimeout(() => {
      if (!showSaveDialog) {
        document.removeEventListener('mousedown', handleClickOutside);
      }
    }, 0);
  }
  
  const handleSaveAsFile = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!fileName.trim()) {
      setErrorMessage('Please enter a file name');
      return;
    }

    const success = onSaveNote?.(fileName, {
      text: text,
      color: color,
      fontFamily: fontFamily,
      fontSize: fontSize,
      textColor: textColor,
      backgroundColor: backgroundColor
    });
    
    if (success) {
      closeSaveDialog();
      setFileName('');
    } else {
      setErrorMessage('Failed to save the note');
    }
  };
  
  const renderTextWithCursor = () => {
    if (!isSelected || isEditing || showSaveDialog) return text;
    
    return (
      <>
        {text}
        <span className="cursor"></span>
      </>
    );
  };

  // יצירת סגנון עבור תוכן הפתק, כולל פונט, גודל פונט, צבע טקסט וצבע רקע
  const noteContentStyle = {
    fontFamily: fontFamily,
    fontSize: `${fontSize}px`,
    color: textColor,
    backgroundColor: backgroundColor || undefined
  };


  return (
    <div 
      className={`sticky-note ${color} ${isSelected && !showSaveDialog ? 'selected' : ''}`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {isEditing ? (
        <div className="editing-mode">
          <textarea
            ref={textareaRef}
            value={text}
            style={noteContentStyle} // הוספת סגנון לאזור העריכה
            onChange={(e) => {
              setText(e.target.value);
              onUpdate?.(id, { 
                text: e.target.value, 
                color,
                fontFamily,
                fontSize,
                textColor,
                backgroundColor
              });
            }}
            autoFocus
          />
          <div className="note-toolbar">
            <div className="color-options">
              {['yellow', 'green', 'pink', 'blue'].map(colorOption => (
                <button 
                  key={colorOption}
                  className={`color-option ${colorOption}`} 
                  onClick={() => handleColorChange(colorOption)}
                />
              ))}
            </div>
            <button className="save-button" onClick={handleSave}>Save</button>
          </div>
        </div>
      ) : (
        <>
          <div className="note-content" style={noteContentStyle}>
            {renderTextWithCursor()}
          </div>
          <div className="note-buttons">
            <button className="save-note-button" onClick={handleSaveClick} title="Save note to file">💾</button>
            <button className="delete-button" onClick={handleDelete} title="Delete note">X</button>
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
            onClick={e => e.stopPropagation()}
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