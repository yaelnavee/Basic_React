import React, { useState } from 'react';
import StickyNote from './StickyNote.jsx';

const useNotesManager = ({ 
  username, 
  isAuthenticated, 
  selectedNoteId, 
  setSelectedNoteId, 
  lastUpdatedId, 
  setLastUpdatedId 
}) => {
  const [notes, setNotes] = useState(() => {
    // Initialize notes from localStorage during first render
    if (isAuthenticated && username) {
      const savedNotes = localStorage.getItem(`stickyNotes_${username}`);
      if (savedNotes) {
        try {
          const parsedNotes = JSON.parse(savedNotes);
          if (parsedNotes.length > 0) {
            setSelectedNoteId(parsedNotes[0].id);
          }
          return parsedNotes;
        } catch (error) {
          console.error("Error parsing saved notes:", error);
        }
      }
    }
    // Default to empty array if no saved notes
    return [];
  });

  const [nextId, setNextId] = useState(() => {
    // Initialize nextId based on existing notes
    if (notes.length > 0) {
      return Math.max(...notes.map(note => note.id), 0) + 1;
    }
    return 1;
  });

  const createFirstNote = () => {
    const firstNote = { 
      id: 1, 
      text: '', 
      color: 'yellow',
      fontFamily: 'Arial, sans-serif',
      fontSize: 16
    };
    setNotes([firstNote]);
    setNextId(2);
    setSelectedNoteId(1);
    saveToLocalStorage([firstNote]);
  };

  const saveToLocalStorage = (updatedNotes) => {
    if (isAuthenticated && username) {
      localStorage.setItem(`stickyNotes_${username}`, JSON.stringify(updatedNotes));
    }
  };

  const reorderNotes = (noteId) => {
    const updatedNote = notes.find(note => note.id === noteId);
    if (!updatedNote) return;
    const otherNotes = notes.filter(note => note.id !== noteId);
    const newNotes = [updatedNote, ...otherNotes];
    // עדכן את מצב הרשימה
    setNotes(newNotes);
    // שמור לאחסון מקומי
    saveToLocalStorage(newNotes);
  };

  const addNote = () => {
    const newId = nextId;
    const newNote = {
      id: newId,
      text: '',
      color: 'yellow',
      fontFamily: 'Arial, sans-serif',
      fontSize: 16
    };
    const newNotes = [newNote, ...notes];
    setNotes(newNotes);
    setNextId(nextId + 1);
    setSelectedNoteId(newId);
    saveToLocalStorage(newNotes);
  };

  const deleteNote = (id) => {
    const newNotes = notes.filter(note => note.id !== id);
    setNotes(newNotes);
    saveToLocalStorage(newNotes);
    
    if (selectedNoteId === id) {
      if (newNotes.length > 0) {
        setSelectedNoteId(newNotes[0].id);
      } else {
        setSelectedNoteId(null);
      }
    }

    if (lastUpdatedId === id) {
      setLastUpdatedId(null);
    }
  };

  const updateNote = (id, updatedData) => {
    const newNotes = notes.map(note => 
      note.id === id ? { ...note, ...updatedData } : note
    );
    setNotes(newNotes);
    saveToLocalStorage(newNotes);
  };

  // When user finishes editing a note
  const handleNoteEditEnd = (id) => {
    // Mark the note as last updated
    setLastUpdatedId(id);
  };

  // Select a note
  const selectNote = (id) => {
    // אם יש פתק מעודכן אחרון ואנחנו בוחרים פתק אחר, נסדר מחדש
    if (lastUpdatedId !== null && lastUpdatedId !== id) {
      reorderNotes(lastUpdatedId);
      setLastUpdatedId(null); // איפוס אחרי הטיפול
    }
    
    setSelectedNoteId(id);
  };

  // Update selected note text
  const updateSelectedNoteText = (key) => {
    if (!selectedNoteId) return;

    const selectedNote = notes.find(note => note.id === selectedNoteId);
    if (!selectedNote) return;

    let currentText = selectedNote.text || '';
    let newText = currentText;

    switch (key) {
      case 'DelWord':
        const words = currentText.trim().split(/\s+/);
        words.pop();
        newText = words.join(' ');
        break;
      case 'Del':
        newText = currentText.slice(0, -1); 
        break;
      case 'Enter':
        newText = currentText + '\n'; 
        break;
      case 'Space':
        newText = currentText + ' '; 
        break;
      case 'Tab':
        newText = currentText + '\t'; 
        break;
      default:
        if (key.length === 1) {
          newText = currentText + key; 
        }
        break;
    }

    if (newText !== currentText) {
      updateNote(selectedNoteId, { text: newText });
      setLastUpdatedId(selectedNoteId);
    }
  };

  // Handle emoji insertion
  const handleEmojiClick = (emoji) => {
    if (selectedNoteId !== null) {
      const selectedNote = notes.find(note => note.id === selectedNoteId);
      if (!selectedNote) return;
  
      const newText = (selectedNote.text || '') + emoji;
      
      updateNote(selectedNoteId, { text: newText });
      setLastUpdatedId(selectedNoteId);
    }
  };

  // Load a note from a file
  const loadNoteFromFile = (noteData) => {
    if (!noteData || typeof noteData !== 'object') {
      console.error("Invalid note data:", noteData);
      return;
    }
  
    const newId = nextId;
    const newNote = {
      id: newId,
      text: noteData.text || '',
      color: noteData.color || 'yellow',
      fontFamily: noteData.fontFamily || 'Arial, sans-serif',
      fontSize: noteData.fontSize || 16,
      textColor: noteData.textColor || '#222222',
      backgroundColor: noteData.backgroundColor || ''
    };
    
    console.log("Loading note with properties:", newNote);
    
    // Add the loaded note to the beginning of the list
    const newNotes = [newNote, ...notes];
    setNotes(newNotes);
    
    // Calculate next ID based on all notes including the new one
    const maxId = Math.max(...newNotes.map(note => note.id), 0);
    setNextId(maxId + 1);
    
    // Automatically select the new note
    setSelectedNoteId(newId);
    saveToLocalStorage(newNotes);
  };

  // Save a note to a file
  const saveNoteToFile = (fileName, noteData) => {
    if (!isAuthenticated || !username) {
      console.error("User not authenticated");
      return false;
    }
  
    if (!fileName || !noteData) {
      console.error("Invalid file name or note data");
      return false;
    }
  
    try {
      // Create a storage key with the prefix for this user
      const storageKey = `noteFiles_${username}_${fileName}`;
      
      // Create a clean copy of the note data to store - עם כל המאפיינים
      const cleanNoteData = {
        text: noteData.text || '',
        color: noteData.color || 'yellow',
        fontFamily: noteData.fontFamily || 'Arial, sans-serif',
        fontSize: noteData.fontSize || 16,
        textColor: noteData.textColor || '#222222',
        backgroundColor: noteData.backgroundColor || ''
      };
      
      // Store the clean note data
      localStorage.setItem(storageKey, JSON.stringify(cleanNoteData));
      console.log(`Note saved to file: ${fileName} with all style properties`);
      
      return true;
    } catch (error) {
      console.error("Error saving note to file:", error);
      return false;
    }
  };

  const loadNotes = (notesArr) => {
    setNotes(notesArr || []);
    saveToLocalStorage(notesArr || []);
    if (notesArr && notesArr.length > 0) {
      setSelectedNoteId(notesArr[0].id);
    } else {
      setSelectedNoteId(null);
    }
  };

  return {
    notes,
    setNotes,
    addNote,
    deleteNote,
    updateNote,
    selectNote,
    handleNoteEditEnd,
    updateSelectedNoteText,
    handleEmojiClick,
    loadNoteFromFile,
    saveNoteToFile,
    loadNotes
  };
};

export { useNotesManager };