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
  "#FF1744", // Red
  "#FFD600", // Yellow
  "#00E676", // Green
  "#2979FF", // Blue
  "#AA00FF", // Purple
  "#FF9100", // Orange
  "#FFC107", // Amber
  "#FF5722", // Deep Orange
  "#E91E63", // Pink
  "#9C27B0", // Purple
  "#FFFFFF", // White - שקוף (ללא רקע)
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

  // טיפול בשינוי צבע רקע לטקסט (מדגיש את הטקסט)
  const handleBgColorClick = (color) => {
    // אם לוחצים על לבן, מבטלים את הרקע
    const selectedColor = color === "#FFFFFF" ? "" : color;
    
    setActiveBgColor(selectedColor);
    if (onBgColorChange) {
      onBgColorChange(selectedColor);
    }
  };

  return (
    <div className="colors-box">
      <h3> Text color:</h3>
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
      <h3>Text background color:</h3>
      <div className="colors-options">
        {BG_COLORS.map((color) => (
          <div
            key={color}
            className={`color-item ${color === activeBgColor ? 'active' : ''}`}
            style={{ backgroundColor: color }}
            onClick={() => handleBgColorClick(color)}
            title={color === "#FFFFFF" ? "ללא הדגשה" : color}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorsBox;