import React, { useState } from 'react';   
import './css/EmojisBox.css';

const EmojisBox = ({ onEmojiClick }) => {
    const handleEmojiClick = (emoji) => {
        // קריאה לפונקציה שהועברה מהאפליקציה
        if (onEmojiClick) {
            onEmojiClick(emoji);
        }
        
        console.log(`Emoji clicked: ${emoji}`);
    };

    const [emojis] = useState([
        '😀', '😂', '😍', '😎', '🤔',
        '😱', '😜', '😇', '😏', '😬',
        '😋', '😌', '😷', '🤗', '🤩',
        '😤', '😓', '😩', '😳', '😵',
        '😢', '😡', '👍', '👎', '🎉',
        '❤️', '🔥', '✨', '🌈', '🌍', 
        '🍕', '🍔', '🍣', '🍩', '🍪',
        '🍰', '🍫', '🍭', '🍬', '🍿',
        '🎂', '🍦', '🍉', '🍇', '🍓'        
    ]);
    
    return (
        <div className="emojis-box">
            {emojis.map((emoji, index) => (
                <span 
                    key={index} 
                    className="emoji-item"
                    onClick={() => handleEmojiClick(emoji)} 
                >
                    {emoji}
                </span>
            ))}
        </div>
    );
}
    
export default EmojisBox;