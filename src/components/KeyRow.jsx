import React from "react";

const KeyRow = ({ keys, activeLanguage }) => {
    const handleKeyClick = (keyValue) => {
        if (keyValue) {
            // יצירת אירוע של לחיצה על מקש
            const event = new KeyboardEvent("keydown", { key: keyValue });
            window.dispatchEvent(event); // הפעלת האירוע
            console.log(`Key pressed: ${keyValue}`); // הדפסת המקש שנלחץ
        }
    };

    return (
        <div className="key-row">
            {keys.map((key, index) => (
                <div
                    key={index}
                    className={`key ${key.className || ""}`}
                    onClick={key.onClick || (() => handleKeyClick(key[activeLanguage] || key.label))} // עטיפה בפונקציה אנונימית
                >
                    {key[activeLanguage] || key.label} {/* הצגת הערך לפי השפה הפעילה */}
                </div>
            ))}
        </div>
    );
};

export default KeyRow;
