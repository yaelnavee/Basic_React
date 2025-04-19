import React, { useState } from "react"; 
import "./css/Keyboard.css"; 
import KeyRow from "./KeyRow";

const Keyboard = ({ keyPressed }) => {
    const [activeLanguage, setActiveLanguage] = useState("en"); // שפה פעילה: en, he, או sign
    // const [activeKey, setActiveKey] = useState(null); 

    const rows = [
        [
            { en: "1", he: "1", sign: "1" }, { en: "2", he: "2", sign: "2" }, { en: "3", he: "3", sign: "3" },
            { en: "4", he: "4", sign: "4" }, { en: "5", he: "5", sign: "5" }, { en: "6", he: "6", sign: "6" },
            { en: "7", he: "7", sign: "7" }, { en: "8", he: "8", sign: "8" }, { en: "9", he: "9", sign: "9" },
            { en: "0", he: "0", sign: "0" }
        ],
        [
            { en: "Tab", he: "Tab", sign: "!" }, { en: "Q", he: "ק", sign: "@" }, { en: "W", he: "ו", sign: "#" },
            { en: "E", he: "ק", sign: "$" }, { en: "R", he: "ר", sign: "¢"}, { en: "T", he: "א", sign: "£" },
            { en: "Y", he: "ט", sign: "€"  }, { en: "U", he: "ו", sign: "&" }, { en: "I", he: "ן", sign: "(" },
            { en: "O", he: "ם", sign: ")" }, { en: "P", he: "פ", sign: "|" }
        ],
        [
            { en: "Caps", he: "Caps", sign: "=" }, { en: "A", he: "ש", sign: "-" }, { en: "S", he: "ד", sign: "+" },
            { en: "D", he: "ג", sign: "%" }, { en: "F", he: "כ", sign: "*" }, { en: "G", he: "ע", sign: "^" },
            { en: "H", he: "י", sign: ":" }, { en: "J", he: "ח", sign: ";" }, { en: "K", he: "ל", sign: "{" },
            { en: "L", he: "ך", sign: "}" }
        ],
        [
            { en: ",", he: ",", sign: "," }, { en: "Z", he: "ז", sign: "/" }, { en: "X", he: "ס", sign: "\\" }, 
            { en: "C", he: "ב", sign: "\"" },
            { en: "V", he: "ה", sign: "<" }, { en: "B", he: "נ", sign: ">" }, { en: "N", he: "מ", sign: "?" },
            { en: "M", he: "צ", sign: "!" }, { en: ".", he: ".", sign: "." }
        ],
        [
            { en: "", he: "", sign: "", className: "lang-switch-key",  onClick: () => toggleLanguage() }, 
            { en: "Space", he: "Space", sign: "Space", className: "space-key" },
            { en: "Enter", he: "Enter", sign: "Enter", className: "enter-key" }
        ],
    ];

    const toggleLanguage = () => {//מחלף לשפה או שפת סימנים
        if (activeLanguage === "en") {
            setActiveLanguage("he");
        } else if (activeLanguage === "he") {
            setActiveLanguage("sign");
        } else {
            setActiveLanguage("en");
        }
    };


    return (
        <div className="keyboard">
            {rows.map((keys, index) => (
                <KeyRow
                 key={index} 
                keys={keys} 
                keyPressed={keyPressed} 
                activeLanguage={activeLanguage} 
/>
            ))}
        </div>
    );
};

export default Keyboard;
