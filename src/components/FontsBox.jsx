import React, { useState } from 'react';
import './css/FontsBox.css';

const FontsBox = ({ onFontChange, selectedFont, selectedSize }) => {
    const [fonts] = useState([
        { name: 'Arial', value: 'Arial, sans-serif' },
        { name: 'Courier New', value: '"Courier New", monospace' },
        { name: 'Georgia', value: 'Georgia, serif' },
        { name: 'Times New Roman', value: '"Times New Roman", serif' },
        { name: 'Verdana', value: 'Verdana, sans-serif' }
    ]);

    const [sizes] = useState([12, 14, 16, 18, 20, 24, 28, 32]);
    
    // Track selected font and font size in internal state
    const [activeFontValue, setActiveFontValue] = useState(selectedFont || fonts[0].value);
    const [activeSizeValue, setActiveSizeValue] = useState(selectedSize || 16);

    // Update internal values if props change
    if (selectedFont && selectedFont !== activeFontValue) {
        setActiveFontValue(selectedFont);
    }
    
    if (selectedSize && selectedSize !== activeSizeValue) {
        setActiveSizeValue(selectedSize);
    }

    const handleFontChange = (font) => {
        // Update internal state
        setActiveFontValue(font);
        
        // Call external function
        if (onFontChange) {
            onFontChange(font);
        }
    };

    const handleSizeChange = (size) => {
        // Update internal state
        setActiveSizeValue(size);
        
        // Call external function
        if (onFontChange) {
            onFontChange(size);
        }
    };

    return (
        <div className="fonts-box">
            <h3>Font:</h3>
            <div className="font-options">
                {fonts.map((font, index) => (
                    <span
                        key={index}
                        className={`font-item ${font.value === activeFontValue ? 'active' : ''}`}
                        style={{ fontFamily: font.value }}
                        onClick={() => handleFontChange(font.value)}
                    >
                        {font.name}
                    </span>
                ))}
            </div>
            <h3>Size:</h3>
            <div className="size-options">
                {sizes.map((size) => (
                    <span
                        key={size}
                        className={`size-item ${size === activeSizeValue ? 'active' : ''}`}
                        style={{ fontSize: `${size}px` }}
                        onClick={() => handleSizeChange(size)}
                    >
                        {size}
                    </span>
                ))}
            </div>
        </div>
    );
}

export default FontsBox;