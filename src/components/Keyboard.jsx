import React, { useState } from "react"; 
import "./css/Keyboard.css"; 
import KeyRow from "./KeyRow"; 

const Keyboard = ({ keyPressed }) => {
    const [activeLanguage, setActiveLanguage] = useState("en"); // שפה פעילה: en, HE, או sign

    const rows = [
        [
            { label: "Del", className: "wide-key" },
            { label: "1" }, { label: "2" }, { label: "3" },
            { label: "4" }, { label: "5" }, { label: "6" },
            { label: "7" }, { label: "8" }, { label: "9" },
            { label: "0" }
        ],
        [
            {  label: "Tab", sign: "!" },
            { EN: "Q", en: "q", HE: "ק", sign: "@" },
            { EN: "W", en: "w", HE: "ו", sign: "#" },
            { EN: "E", en: "e", HE: "ק", sign: "$" },
            { EN: "R", en: "r", HE: "ר", sign: "¢" },
            { EN: "T", en: "t", HE: "א", sign: "£" },
            { EN: "Y", en: "y", HE: "ט", sign: "€" },
            { EN: "U", en: "u", HE: "ו", sign: "&" },
            { EN: "I", en: "i", HE: "ן", sign: "(" },
            { EN: "O", en: "o", HE: "ם", sign: ")" },
            { EN: "P", en: "p", HE: "פ", sign: "|" }
        ],
        [
            { label: "Cps",  HE: " ", sign: "=", onClick: () => toggCapsLoack() },
            { EN: "A", en: "a", HE: "ש", sign: "-" },
            { EN: "S", en: "s", HE: "ד", sign: "+" },
            { EN: "D", en: "d", HE: "ג", sign: "%" },
            { EN: "F", en: "f", HE: "כ", sign: "*" },
            { EN: "G", en: "g", HE: "ע", sign: "^" },
            { EN: "H", en: "h", HE: "י", sign: ":" },
            { EN: "J", en: "j", HE: "ח", sign: ";" },
            { EN: "K", en: "k", HE: "ל", sign: "{" },
            { EN: "L", en: "l", HE: "ך", sign: "}" }
        ],
        [
            { label: "," },
            { EN: "Z", en: "z", HE: "ז", sign: "/" },
            { EN: "X", en: "x", HE: "ס", sign: "\\" },
            { EN: "C", en: "c", HE: "ב", sign: "\"" },
            { EN: "V", en: "v", HE: "ה", sign: "<" },
            { EN: "B", en: "b", HE: "נ", sign: ">" },
            { EN: "N", en: "n", HE: "מ", sign: "?" },
            { EN: "M", en: "m", HE: "צ", sign: "!" },
            { label: "." }
        ],
        [
            { label: "", className: "lang-switch-key",  onClick: () => toggleLanguage() }, 
            { label: "Space", className: "space-key" },
            { label: "Enter", className: "wide-key" }
        ],
    ];

    const toggleLanguage = () => {
        if (activeLanguage === "en" || activeLanguage === "EN") {
            setActiveLanguage("HE");
        } else if (activeLanguage === "HE") {
            setActiveLanguage("sign");
        } else {
            setActiveLanguage("en");
        }
    };

    const toggCapsLoack = () => {
        // english letters caps lock
        if (activeLanguage === "en") {
            setActiveLanguage("EN");
        } else if (activeLanguage === "EN") {
            setActiveLanguage("en");
        }

        // in sign language, we don't have caps lock, 
        if (activeLanguage === "sign") {
            // type "=" to screen. return "="
            //TODO: add lisiner of key down or somthinfg like that
            keyPressed("=");
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
