import React, { useState } from 'react';   
import './css/EmojisBox.css';

const EmojisBox = ({ keyPressed }) => {
    const handleKeyClick = (keyValue) => {
        if (keyValue) {
            // יצירת אירוע של לחיצה על מקש
            const event = new KeyboardEvent("keydown", { key: keyValue });
            window.dispatchEvent(event); // הפעלת האירוע
            console.log(`Key pressed: ${keyValue}`); // הדפסת המקש שנלחץ
        }
    };

    const [emojis] = useState([
        '😀', '😂', '😍', '😎', '🤔', '😢', '😡', '👍', '👎', '🎉',
        '❤️', '🔥', '✨', '🌈', '🌍', '🍕', '🍔', '🍣', '🍩', '🍪'  
    ]);
    return (
        <div className="emojis-box">
            {emojis.map((emoji, index) => (
                <span 
                    key={index} 
                    className="emoji-item"
                    onClick={() => handleKeyClick(emoji)} 
                >
                    {emoji}
                </span>
            ))}
        </div>
    );
}
    
export default EmojisBox;