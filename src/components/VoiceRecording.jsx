import React from 'react';
import '../styles/VoiceRecordingIndicator.css';

const VoiceRecordingIndicator = ({ isRecording }) => {
  return (
    <div className="voice-recording-indicator">
      {isRecording && <div className="recording-ping"></div>}
      <div className={`recording-border ${isRecording ? 'active' : ''}`}></div>
      <div className="recording-overlay"></div>
      
      {isRecording && (
        <div className="recording-dot-container">
          <div className="recording-dot"></div>
        </div>
      )}
    </div>
  );
};

export default VoiceRecordingIndicator;