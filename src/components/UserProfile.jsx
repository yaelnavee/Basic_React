import React, { useState } from "react";
import defaultAvatar from "/avatar.png";
import "./UserProfile.css"; // <-- Add this line

function UserProfile({ username, onLogout, userImage, onImageChange }) {
  const [fileInput, setFileInput] = useState(null);

  const handleImageClick = () => {
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        onImageChange(ev.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="user-container">
      <div
        className="user-avatar"
        onClick={handleImageClick}
        title="Change profile picture"
      >
        <img
          src={userImage || defaultAvatar}
          alt="User"
        />
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          ref={el => setFileInput(el)}
          onChange={handleFileChange}
        />
      </div>
      <p>hey, {username}!</p>
      <button onClick={onLogout}>logout</button>
    </div>
  );
}

export default UserProfile;