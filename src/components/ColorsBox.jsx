import React, { useState, useEffect } from "react";
import "./css/ColorsBox.css";

const COLORS = [
  "#222222", // Black
  "#FF1744", // Red
  "#FFD600", // Yellow
  "#00E676", // Green
  "#2979FF", // Blue
  "#AA00FF", // Purple
  "#FF9100", // Orange
  "#FFFFFF", // White
];

const BG_COLORS = [
  "#FFF475", // Yellow
  "#FFD6A5", // Orange
  "#FDFFB6", // Light Yellow
  "#CAFFBF", // Green
  "#9BF6FF", // Blue
  "#A0C4FF", // Light Blue
  "#BDB2FF", // Purple
  "#FFC6FF", // Pink
  "#FFFFFF", // White
  "#E0E0E0", // Gray
];

const ColorsBox = ({ onColorChange, onBgColorChange, selectedTextColor, selectedBgColor }) => {
  // מצב פנימי לצבעים הנבחרים
  const [activeTextColor, setActiveTextColor] = useState(selectedTextColor || "#222222");
  const [activeBgColor, setActiveBgColor] = useState(selectedBgColor || "");

  // עדכון המצב הפנימי כאשר props משתנים
  useEffect(() => {
    if (selectedTextColor) {
      setActiveTextColor(selectedTextColor);
    }
    if (selectedBgColor) {
      setActiveBgColor(selectedBgColor);
    }
  }, [selectedTextColor, selectedBgColor]);

  // טיפול בשינוי צבע טקסט
  const handleTextColorClick = (color) => {
    setActiveTextColor(color);
    if (onColorChange) {
      onColorChange(color);
    }
  };

  // טיפול בשינוי צבע רקע
  const handleBgColorClick = (color) => {
    setActiveBgColor(color);
    if (onBgColorChange) {
      onBgColorChange(color);
    }
  };

  return (
    <div className="colors-box">
      <h3>Text Color:</h3>
      <div className="colors-options">
        {COLORS.map((color) => (
          <div
            key={color}
            className={`color-item ${color === activeTextColor ? 'active' : ''}`}
            style={{ backgroundColor: color }}
            onClick={() => handleTextColorClick(color)}
            title={color}
          />
        ))}
      </div>
      <h3>Background Color:</h3>
      <div className="colors-options">
        {BG_COLORS.map((color) => (
          <div
            key={color}
            className={`color-item ${color === activeBgColor ? 'active' : ''}`}
            style={{ backgroundColor: color }}
            onClick={() => handleBgColorClick(color)}
            title={color}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorsBox;