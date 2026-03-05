import React, { useState } from 'react';
import './Settings.css';

const Settings = () => {
  // Simple state to handle a toggle switch for demo purposes
  const [notifications, setNotifications] = useState(true);

  const handleSave = (e) => {
    e.preventDefault();
    console.log('Settings saved!');
    alert('Settings have been updated successfully.');
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h3>Account Settings</h3>
      </div>

      <div className="settings-content">
        <form onSubmit={handleSave} className="settings-form">
          
          {/* --- Profile Section --- */}
          <div className="settings-section">
            <h4>Profile Information</h4>
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input type="text" id="fullName" defaultValue="Admin User" placeholder="Enter your full name" />
            </div>
            
            <div className="form-group">
              <label htmlFor="emailAddress">Email Address</label>
              <input type="email" id="emailAddress" defaultValue="admin@example.com" placeholder="Enter your email" />
            </div>

            <div className="form-group">
              <label htmlFor="role">Role</label>
              <input type="text" id="role" defaultValue="Super Administrator" disabled className="disabled-input" />
            </div>
          </div>

          <hr className="divider" />

          {/* --- Preferences Section --- */}
          <div className="settings-section">
            <h4>System Preferences</h4>
            
            <div className="form-group checkbox-group">
              <label>
                <input 
                  type="checkbox" 
                  checked={notifications} 
                  onChange={() => setNotifications(!notifications)} 
                />
                Enable Email Notifications
              </label>
              <p className="helper-text">Receive daily summary reports and system alerts via email.</p>
            </div>
          </div>

          {/* --- Action Buttons --- */}
          <div className="settings-actions">
            <button type="button" className="cancel-btn">Cancel</button>
            <button type="submit" className="save-btn">Save Changes</button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Settings;