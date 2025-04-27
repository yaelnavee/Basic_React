import React, { useState, useRef } from "react";
import defaultAvatar from "/avatar.png";
import "./UserProfile.css";

function UserProfile({ username, onLogout, userImage, onImageChange }) {
  // Using useRef instead of state for file input to prevent re-renders
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
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
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </div>
      <p>hey, {username}!</p>
      <button onClick={onLogout}>logout</button>
    </div>
  );
}

export default UserProfile;