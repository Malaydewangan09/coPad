import React, { useState } from 'react';
import './App.css';
import { OpenFile, SaveFile, SendEmail, UpdateEmailSettings } from '../wailsjs/go/main/App';

function App() {
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailSettings, setEmailSettings] = useState({
    email: '',
    password: '',
    smtpHost: '',
    smtpPort: '',
  });

  const handleOpen = async () => {
    const fileContent = await OpenFile();
    if (fileContent) {
      setContent(fileContent);
      setStatus('File opened successfully');
    } else {
      setStatus('No file selected');
    }
  };

  const handleSave = async () => {
    const result = await SaveFile(content);
    setStatus(result || 'File not saved');
  };

  const handleSendEmail = async () => {
    if (showEmailForm) {
      const result = await SendEmail(emailTo, emailSubject, content);
      setStatus(result);
      setShowEmailForm(false);
    } else {
      setShowEmailForm(true);
    }
  };

  const handleUpdateSettings = async () => {
    const result = await UpdateEmailSettings(
      emailSettings.email,
      emailSettings.password,
      emailSettings.smtpHost,
      emailSettings.smtpPort
    );
    setStatus(result);
    setShowSettings(false);
  };

  return (
    <div className="App">
      <div className="menu-bar">
        <button onClick={handleOpen}>Open</button>
        <button onClick={handleSave}>Save</button>
        <button onClick={handleSendEmail}>Send Email</button>
        <button onClick={() => setShowSettings(!showSettings)}>Email Settings</button>
        <span className="status">{status}</span>
      </div>
      {showSettings && (
        <div className="settings-form">
          <input
            type="email"
            placeholder="Your Email"
            value={emailSettings.email}
            onChange={(e) => setEmailSettings({...emailSettings, email: e.target.value})}
          />
          <input
            type="password"
            placeholder="App Password"
            value={emailSettings.password}
            onChange={(e) => setEmailSettings({...emailSettings, password: e.target.value})}
          />
          <input
            type="text"
            placeholder="SMTP Host"
            value={emailSettings.smtpHost}
            onChange={(e) => setEmailSettings({...emailSettings, smtpHost: e.target.value})}
          />
          <input
            type="text"
            placeholder="SMTP Port"
            value={emailSettings.smtpPort}
            onChange={(e) => setEmailSettings({...emailSettings, smtpPort: e.target.value})}
          />
          <button onClick={handleUpdateSettings}>Update Settings</button>
        </div>
      )}
      {showEmailForm && (
        <div className="email-form">
          <input
            type="email"
            placeholder="To"
            value={emailTo}
            onChange={(e) => setEmailTo(e.target.value)}
          />
          <input
            type="text"
            placeholder="Subject"
            value={emailSubject}
            onChange={(e) => setEmailSubject(e.target.value)}
          />
          <button onClick={handleSendEmail}>Send</button>
        </div>
      )}
      <textarea
        className="editor"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type your text here..."
      />
    </div>
  );
}

export default App;