import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import './css/StickyNote.css'; 

const DeleteConfirmDialog = ({ 
  isOpen, 
  onCancel, 
  onConfirmDelete, 
  onSaveBeforeDelete 
}) => {
  if (!isOpen) return null;
  
  // Handle keyboard events directly in the component
  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      onCancel();
    }
  };
  
  // Create portal to render at document body level
  return ReactDOM.createPortal(
    <div 
      className="delete-confirm-overlay" 
      onClick={onCancel}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div 
        className="delete-confirm-dialog" 
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Delete Note</h3>
        <p>Would you like to save the note before deleting?</p>
        <div className="delete-confirm-buttons">
          <button onClick={onCancel} className="cancel-button">Cancel</button>
          <button onClick={onConfirmDelete} className="delete-button">Delete Without Saving</button>
          <button onClick={onSaveBeforeDelete} className="save-button">Save to File</button>
        </div>
      </div>
    </div>,
    document.body // Mount to body element
  );
};

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
  // Default state
  const [text, setText] = useState(initialText || '');
  const [color, setColor] = useState(initialColor || 'yellow');
  const [fontFamily, setFontFamily] = useState(initialFontFamily || 'Arial, sans-serif'); 
  const [textColor, setTextColor] = useState(initialTextColor || '#222222'); 
  const [backgroundColor, setBackgroundColor] = useState(initialBackgroundColor || ''); 
  const [fontSize, setFontSize] = useState(initialFontSize || 16); 
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // References
  const textareaRef = useRef(null);
  
  // Update text if changed externally
  if (initialText !== undefined && initialText !== text) {
    setText(initialText);
  }
  
  // Update color if changed externally
  if (initialColor !== undefined && initialColor !== color) {
    setColor(initialColor);
  }

  // Update font if changed externally
  if (initialFontFamily !== undefined && initialFontFamily !== fontFamily) {
    setFontFamily(initialFontFamily);
  }

  // Update font size if changed externally
  if (initialFontSize !== undefined && initialFontSize !== fontSize) {
    setFontSize(initialFontSize);
  }
  
  // Update text color if changed externally
  if (initialTextColor !== undefined && initialTextColor !== textColor) {
    setTextColor(initialTextColor);
  }
  
  // Update background color if changed externally
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
  
  // Save changes to note
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
  
  // Perform actual deletion
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
      // Send note object with additional property indicating to delete after saving
      onSaveClick({
        id,
        text,
        color,
        fontFamily,
        fontSize,
        textColor,
        backgroundColor,
        deleteAfterSave: true // Mark for deletion after saving
      });
    }
    
    // Close delete confirmation dialog
    setShowDeleteConfirm(false);
  };
  
  const renderTextWithCursor = () => {
    if (!isSelected || isEditing) {
      // Regular text rendering with colored background if defined
      if (backgroundColor) {
        return (
          <span 
            className="text-with-background" 
            style={{
              backgroundColor: backgroundColor,
              color: textColor // Important - text color is applied here
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
    
    // Render text with cursor
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

  return (
    <>
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
              <button className="delete-button" onClick={handleDeleteClick} title="Delete Note">X</button>
            </div>
          </>
        )}
      </div>
      
      {/* Render delete dialog as a portal */}
      <DeleteConfirmDialog 
        isOpen={showDeleteConfirm}
        onCancel={cancelDelete}
        onConfirmDelete={confirmDelete}
        onSaveBeforeDelete={saveBeforeDelete}
      />
    </>
  );
};

export default StickyNote;