import React from "react";

const KeyRow = ({ keys, activeLanguage }) => {
    return (
        <div className="key-row">
            {keys.map((key, index) => (
                <div
                    key={index}
                    className={`key ${key.className || ""}`}
                    onClick={key.onClick || null} // הוספת פונקציית onClick אם קיימת
                >
                    {key[activeLanguage]} {/* מציג את השפה הפעילה */}
                </div>
            ))}
        </div>
    );
};

export default KeyRow;
