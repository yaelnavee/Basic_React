import React from "react";
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

const ColorsBox = ({ onColorChange, onBgColorChange }) => (
  <div className="colors-box">
     <h3>Text Color:</h3>
    <div className="colors-options">
      {COLORS.map((color) => (
        <div
          key={color}
          className="color-item"
          style={{ backgroundColor: color }}
          onClick={() => onColorChange && onColorChange(color)}
          title={color}
        />
      ))}
    </div>
    <h3>Background Color:</h3>
    <div className="colors-options">
      {BG_COLORS.map((color) => (
        <div
          key={color}
          className="color-item"
          style={{ backgroundColor: color }}
          onClick={() => onBgColorChange && onBgColorChange(color)}
          title={color}
        />
      ))}
    </div>
  </div>
);

export default ColorsBox;