import React, { useState, useEffect } from 'react';
import StickyNote from './StickyNote.jsx';

// Using a custom hook approach instead of a component
const useNotesManager = ({ 
  username, 
  isAuthenticated, 
  selectedNoteId, 
  setSelectedNoteId, 
  lastUpdatedId, 
  setLastUpdatedId 
}) => {
  // State for notes management
  const [notes, setNotes] = useState([]);
  const [nextId, setNextId] = useState(1);

  // Load notes from localStorage when user authenticates
  useEffect(() => {
    if (isAuthenticated && username) {
      const savedNotes = localStorage.getItem(`stickyNotes_${username}`);
      if (savedNotes) {
        try {
          const parsedNotes = JSON.parse(savedNotes);
          setNotes(parsedNotes);
          
          const maxId = Math.max(...parsedNotes.map(note => note.id), 0);
          setNextId(maxId + 1);
          
          if (parsedNotes.length > 0) {
            setSelectedNoteId(parsedNotes[0].id);
          }
        } catch (error) {
          console.error("Error parsing saved notes:", error);
          // Create first note if parsing failed
          createFirstNote();
        }
      } else {
        // Create first note if none exists
        createFirstNote();
      }
    }
  }, [isAuthenticated, username, setSelectedNoteId]);

  // Helper function to create a first note
  const createFirstNote = () => {
    const firstNote = { id: 1, text: '', color: 'yellow' };
    setNotes([firstNote]);
    setNextId(2);
    setSelectedNoteId(1);
  };

  // Save notes to localStorage whenever they change
  useEffect(() => {
    if (isAuthenticated && username) {
      localStorage.setItem(`stickyNotes_${username}`, JSON.stringify(notes));
    }
  }, [notes, isAuthenticated, username]);

  // Reorder notes when one is updated
  useEffect(() => {
    if (lastUpdatedId !== null && lastUpdatedId !== selectedNoteId) {
      reorderNotes(lastUpdatedId);
      setLastUpdatedId(null);
    }
  }, [selectedNoteId, lastUpdatedId, setLastUpdatedId]);

  const reorderNotes = (noteId) => {
    const updatedNote = notes.find(note => note.id === noteId);
    if (!updatedNote) return;
    const otherNotes = notes.filter(note => note.id !== noteId);
    setNotes([updatedNote, ...otherNotes]);
  };

  // Add a new note
  const addNote = () => {
    const newId = nextId;
    const newNote = {
      id: newId,
      text: '',
      color: 'yellow'
    };
    
    // Add the new note to the beginning of the list
    setNotes([newNote, ...notes]);
    setNextId(nextId + 1);
    
    // Automatically select the new note
    setSelectedNoteId(newId);
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
      color: noteData.color || 'yellow'
    };
    
    // Add the loaded note to the beginning of the list
    setNotes([newNote, ...notes]);
    setNextId(nextId + 1);
    
    // Automatically select the new note
    setSelectedNoteId(newId);
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
      
      // Create a clean copy of the note data to store - containing ONLY text and color
      const cleanNoteData = {
        text: noteData.text || '',
        color: noteData.color || 'yellow'
      };
      
      // Store the clean note data
      localStorage.setItem(storageKey, JSON.stringify(cleanNoteData));
      
      return true;
    } catch (error) {
      console.error("Error saving note to file:", error);
      return false;
    }
  };

  // Delete a note
  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
    
    // If the deleted note is the selected note, select another one
    if (selectedNoteId === id) {
      const remainingNotes = notes.filter(note => note.id !== id);
      if (remainingNotes.length > 0) {
        setSelectedNoteId(remainingNotes[0].id);
      } else {
        setSelectedNoteId(null);
      }
    }

    // If the deleted note is the last updated note, reset the state
    if (lastUpdatedId === id) {
      setLastUpdatedId(null);
    }
  };

  // Update a note
  const updateNote = (id, updatedData) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, ...updatedData } : note
    ));
  };

  // When user finishes editing a note
  const handleNoteEditEnd = (id) => {
    // Mark the note as last updated
    setLastUpdatedId(id);
  };

  // Select a note
  const selectNote = (id) => {
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
      case 'Backspace':
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

  // When loading notes from a file, we need to set nextId based on loaded notes
  useEffect(() => {
    if (notes.length > 0) {
      const maxId = Math.max(...notes.map(note => note.id), 0);
      setNextId(maxId + 1);
    } else {
      setNextId(1);
    }
  }, [notes]);

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
    saveNoteToFile
  };
};

export { useNotesManager };