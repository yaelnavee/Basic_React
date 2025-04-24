// קופסא עם אפשרויות פונט לעיצוב טקסט 
// פונט עברי, פונט אנגלי, גודל פונט, עובי פונט, 
//   קו חוצה

import React, { useState } from 'react';
// import './FontsBox.css'; 


const FontsBox = ({ onFontChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFont, setSelectedFont] = useState(''); // מצב לשמירת הפונט הנבחר
    const [selectedSize, setSelectedSize] = useState(''); // מצב לשמירת גודל הפונט הנבחר
   
    const toggleFontsBox = () => {
        setIsOpen(!isOpen);
    };

    const handleFontChange = (font) => {
        setSelectedFont(font);
        onFontChange(font, selectedSize, selectedWeight, selectedStyle); // העברת הפונט הנבחר להורה
    };

    const handleSizeChange = (size) => {
        setSelectedSize(size);
        onFontChange(selectedFont, size, selectedWeight, selectedStyle); // העברת גודל הפונט הנבחר להורה
    };

    return (
        <div className="fonts-box">
            <button className="fonts-button" onClick={toggleFontsBox}>
                <FontAwesomeIcon icon={faFont} /> פונט
            </button>
            {isOpen && (
                <div className="fonts-dropdown">
                    <div className="font-options">
                        <h4>בחר פונט:</h4>
                        <button onClick={() => handleFontChange('Arial')}>Arial</button>
                        <button onClick={() => handleFontChange('Times New Roman')}>Times New Roman</button>
                        <button onClick={() => handleFontChange('Courier New')}>Courier New</button>
                    </div>
                    <div className="size-options">
                        <h4>בחר גודל פונט:</h4>
                        <button onClick={() => handleSizeChange('12px')}>12</button>
                        <button onClick={() => handleSizeChange('16px')}>16</button>
                        <button onClick={() => handleSizeChange('20px')}>20</button>
                    </div>
                </div>
            )}
        </div>
    );
}
export default FontsBox;