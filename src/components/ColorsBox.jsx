import React, { useState } from "react";
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
  "#FFFFFF", // White - transparent (no background)
];

const ColorsBox = ({ onColorChange, onBgColorChange, selectedTextColor, selectedBgColor }) => {
  // Initialize state with the prop value or default
  const [activeTextColor, setActiveTextColor] = useState(selectedTextColor || "#222222");
  const [activeBgColor, setActiveBgColor] = useState(selectedBgColor || "");

  // REMOVE the conditional state updates from here!
  // Don't have any setState calls in the component body

  // Handle text color change
  const handleTextColorClick = (color) => {
    setActiveTextColor(color);
    if (onColorChange) {
      onColorChange(color);
    }
  };

  // Handle text background color change (highlights text)
  const handleBgColorClick = (color) => {
    // If clicking white, remove the background
    const selectedColor = color === "#FFFFFF" ? "" : color;
    
    setActiveBgColor(selectedColor);
    if (onBgColorChange) {
      onBgColorChange(selectedColor);
    }
  };

  return (
    <div className="colors-box">
      <h3>Text color:</h3>
      <div className="colors-options">
        {COLORS.map((color) => (
          <div
            key={color}
            className={`color-item ${color === (selectedTextColor || activeTextColor) ? 'active' : ''}`}
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
            className={`color-item ${color === (selectedBgColor || activeBgColor) ? 'active' : ''}`}
            style={{ backgroundColor: color }}
            onClick={() => handleBgColorClick(color)}
            title={color === "#FFFFFF" ? "No highlight" : color}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorsBox;