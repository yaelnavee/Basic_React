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
  onSaveClick, // prop חדש
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
  
  // רפרנסים
  const textareaRef = useRef(null);
  
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
    onSelect?.(id);
  };
  
  // עריכת פתק
  const handleDoubleClick = () => {
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
  
  // פתיחת דיאלוג שמירה - משתמש בפונקציה החדשה מהאפליקציה
  const handleSaveClick = (e) => {
    e.stopPropagation();
    if (onSaveClick) {
      onSaveClick({
        id,
        text,
        color,
        fontFamily,
        fontSize,
        textColor,
        backgroundColor
      });
    }
  };
  
  const renderTextWithCursor = () => {
    if (!isSelected || isEditing) return text;
    
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
      className={`sticky-note ${color} ${isSelected ? 'selected' : ''}`}
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
            <button className="save-button" onClick={handleSave}>שמור</button>
          </div>
        </div>
      ) : (
        <>
          <div className="note-content" style={noteContentStyle}>
            {renderTextWithCursor()}
          </div>
          <div className="note-buttons">
            <button className="save-note-button" onClick={handleSaveClick} title="שמור פתק לקובץ">💾</button>
            <button className="delete-button" onClick={handleDelete} title="מחק פתק">X</button>
          </div>
        </>
      )}
    </div>
  );
};

export default StickyNote;