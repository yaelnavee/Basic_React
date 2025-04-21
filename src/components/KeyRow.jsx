import React from "react";

const KeyRow = ({ keys, activeLanguage, onKeyPress }) => {
    const handleKeyClick = (keyValue, customHandler) => {
        // אם יש פונקציית טיפול מותאמת אישית, נפעיל אותה
        if (customHandler) {
            customHandler();
            return;
        }
        
        // אחרת, נקרא לפונקציה שהועברה מהמקלדת
        if (keyValue && onKeyPress) {
            onKeyPress(keyValue);
            console.log(`Key pressed: ${keyValue}`); // הדפסת המקש שנלחץ
        }
    };

    return (
        <div className="key-row">
            {keys.map((key, index) => (
                <div
                    key={index}
                    className={`key ${key.className || ""}`}
                    onClick={() => handleKeyClick(key[activeLanguage] || key.label, key.onClick)}
                >
                    {key[activeLanguage] || key.label} {/* הצגת הערך לפי השפה הפעילה */}
                </div>
            ))}
        </div>
    );
};

export default KeyRow;