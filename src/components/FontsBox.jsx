import React, { useState } from 'react';
import './css/FontsBox.css';

const FontsBox = ({ onFontChange }) => {
    const [fonts] = useState([
        { name: 'Arial', value: 'Arial, sans-serif' },
        { name: 'Courier New', value: '"Courier New", monospace' },
        { name: 'Georgia', value: 'Georgia, serif' },
        { name: 'Times New Roman', value: '"Times New Roman", serif' },
        { name: 'Verdana', value: 'Verdana, sans-serif' }
    ]);

    const [sizes] = useState([12, 14, 16, 18, 20, 24, 28, 32]);

    const handleFontChange = (font) => {
        if (onFontChange) {
            onFontChange(font);
        }
    };

    const handleSizeChange = (size) => {
        if (onFontChange) {
            onFontChange(size);
        }
    };

    return (
        <div className="fonts-box">
            <h3>Select Font</h3>
            <div className="font-options">
                {fonts.map((font, index) => (
                    <span
                        key={index}
                        className="font-item"
                        style={{ fontFamily: font.value }}
                        onClick={() => handleFontChange(font.value)}
                    >
                        {font.name}
                    </span>
                ))}
            </div>
            <h3>Select Size</h3>
            <div className="size-options">
                {sizes.map((size) => (
                    <span
                        key={size}
                        className="size-item"
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
