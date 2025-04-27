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
  onSaveClick, 
  onSaveDialogOpen,
  onSaveDialogClose,
  username,
  notes 
}) => {
  // States
  const [text, setText] = useState(initialText || '');
  const [color, setColor] = useState(initialColor || 'yellow');
  const [fontFamily, setFontFamily] = useState(initialFontFamily || 'Arial, sans-serif'); 
  const [textColor, setTextColor] = useState(initialTextColor || '#222222'); 
  const [backgroundColor, setBackgroundColor] = useState(initialBackgroundColor || ''); 
  const [fontSize, setFontSize] = useState(initialFontSize || 16); 
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Refs
  const textareaRef = useRef(null);
  
  // Update values if props change
  if (initialText !== undefined && initialText !== text) {
    setText(initialText);
  }
  if (initialColor !== undefined && initialColor !== color) {
    setColor(initialColor);
  }
  if (initialFontFamily !== undefined && initialFontFamily !== fontFamily) {
    setFontFamily(initialFontFamily);
  }
  if (initialFontSize !== undefined && initialFontSize !== fontSize) {
    setFontSize(initialFontSize);
  }
  if (initialTextColor !== undefined && initialTextColor !== textColor) {
    setTextColor(initialTextColor);
  }
  if (initialBackgroundColor !== undefined && initialBackgroundColor !== backgroundColor) {
    setBackgroundColor(initialBackgroundColor);
  }

  // Select note
  const handleClick = () => {
    onSelect?.(id);
  };
  
  // Edit note
  const handleDoubleClick = () => {
    setIsEditing(true);
    onSelect?.(id);
    setTimeout(() => textareaRef.current?.focus(), 10);
  };
  
  // Save note changes
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
  
  // Change note color
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
  
  // Open delete confirmation dialog
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };
  
  // Confirm deletion
  const confirmDelete = () => {
    setShowDeleteConfirm(false);
    onDelete?.(id);
  };
  
  // Cancel deletion
  const cancelDelete = (e) => {
    if (e) e.stopPropagation();
    setShowDeleteConfirm(false);
  };
  
  // Save note before deletion
  const saveBeforeDelete = (e) => {
    if (e) e.stopPropagation();
    
    // Open global save dialog
    if (onSaveClick) {
      // Send note object with flag to delete after save
      onSaveClick({
        id,
        text,
        color,
        fontFamily,
        fontSize,
        textColor,
        backgroundColor,
        deleteAfterSave: true // Flag to delete after saving
      });
    }
    
    // Close delete confirmation dialog
    setShowDeleteConfirm(false);
  };
  
  const renderTextWithCursor = () => {
    if (!isSelected || isEditing) {
      // Regular text rendering with background color if defined
      if (backgroundColor) {
        return (
          <span 
            className="text-with-background" 
            style={{
              backgroundColor: backgroundColor,
              color: textColor
            }}
          >
            {text}
          </span>
        );
      }
      // Regular text rendering without background but with text color
      return (
        <span style={{ color: textColor }}>
          {text}
        </span>
      );
    }
    
    // Text rendering with cursor
    if (backgroundColor) {
      return (
        <>
          <span 
            className="text-with-background" 
            style={{
              backgroundColor: backgroundColor,
              color: textColor
            }}
          >
            {text}
          </span>
          <span className="cursor" style={{ backgroundColor: textColor }}></span>
        </>
      );
    }
    
    return (
      <>
        <span style={{ color: textColor }}>
          {text}
        </span>
        <span className="cursor" style={{ backgroundColor: textColor }}></span>
      </>
    );
  };

  // Create style for note content, including font and font size
  const noteContentStyle = {
    fontFamily: fontFamily,
    fontSize: `${fontSize}px`,
  };

  // Render delete confirmation dialog
  const renderDeleteConfirmDialog = () => {
    if (!showDeleteConfirm) return null;
    
    return (
      <div className="global-save-dialog-overlay" onClick={cancelDelete}>
        <div className="global-save-dialog delete-dialog" onClick={(e) => e.stopPropagation()}>
          <h3>Delete Note</h3>
          <div className="save-buttons-row compact-buttons">
            <button onClick={cancelDelete} className="neutral-button">Cancel</button>
            <button onClick={confirmDelete} className="cancel-button">Delete</button>
            <button onClick={saveBeforeDelete} className="save-button">Save to File</button>
          </div>
        </div>
      </div>
    );
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
            style={{
              ...noteContentStyle,
              color: textColor,
              backgroundColor: backgroundColor || 'transparent'
            }}
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
          <div className="note-content-wrapper" style={noteContentStyle}>
            {renderTextWithCursor()}
          </div>
          <div className="note-buttons">
            <button className="delete-button" onClick={handleDeleteClick} title="Delete note">X</button>
          </div>
        </>
      )}
      
      {/* Delete confirmation dialog */}
      {renderDeleteConfirmDialog()}
    </div>
  );
};

export default StickyNote;