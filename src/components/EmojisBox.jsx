
import React, { useState }  from 'react';   
import './css/EmojisBox.css';

const EmojisBox = ({ keyPressed }) => {
    const [emojis] = useState([
        '😀', '😂', '😍', '😎', '🤔', '😢', '😡', '👍', '👎', '🎉',
        '❤️', '🔥', '✨', '🌈', '🌍', '🍕', '🍔', '🍣', '🍩', '🍪',
        '🎈', '🎁', '🎶', '🎵', '🎤', '🎧', '🎸', '🎹', '🥁', '🎺',
    ]);

    return (
        <div className="emojis-box">
            {emojis.map((emoji, index) => (
                <span 
                    key={index} 
                    className="emoji"
                    onClick={() => keyPressed(emoji)} 
                >
                    {emoji}
                </span>
            ))}
        </div>
    );
    }
    
export default EmojisBox;