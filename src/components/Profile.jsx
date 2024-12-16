import React, { useState } from 'react';
import '../styles/Profile.css';

const ProfileCompletionPage = () => {
  const [governmentIds, setGovernmentIds] = useState({
    passport: null,
    driverLicense: null,
    nationalId: null
  });

  const [profileCompletion, setProfileCompletion] = useState(0);

  const handleFileUpload = (idType, file) => {
    setGovernmentIds(prevState => ({
      ...prevState,
      [idType]: file
    }));
    calculateProfileCompletion();
  };

  const calculateProfileCompletion = () => {
    const uploadedIds = Object.values(governmentIds).filter(id => id !== null);
    const completion = Math.min((uploadedIds.length / 3) * 100, 100);
    setProfileCompletion(completion);
  };

  const UploadButton = ({ idType }) => (
    <div className="upload-button">
      <div className="upload-icon">+</div>
      <div className="upload-label">Upload {idType}</div>
    </div>
  );

  return (
    <div className="profile-completion-container">
      <div className="profile-completion-card">
        <div className="profile-completion-header">
          <h2>Complete Your Profile</h2>
          <div className="profile-completion-progress">
            <div
              className="profile-completion-bar"
              style={{ width: `${profileCompletion}%` }}
            />
            <div className="profile-completion-percentage">
              {profileCompletion.toFixed(0)}%
            </div>
          </div>
        </div>
        <div className="profile-completion-section">
          <h3>Government ID Verification</h3>
          <div className="id-upload-container">
            <div className="id-upload-item">
              <div className="id-icon">ID</div>
              <div className="id-upload">
                {governmentIds.passport ? (
                  <img
                    src={URL.createObjectURL(governmentIds.passport)}
                    alt="Passport"
                    className="id-preview"
                  />
                ) : (
                  <UploadButton idType="Passport" />
                )}
              </div>
            </div>
            <div className="id-upload-item">
              <div className="id-icon">ID</div>
              <div className="id-upload">
                {governmentIds.driverLicense ? (
                  <img
                    src={URL.createObjectURL(governmentIds.driverLicense)}
                    alt="Driver License"
                    className="id-preview"
                  />
                ) : (
                  <UploadButton idType="Driver License" />
                )}
              </div>
            </div>
            <div className="id-upload-item">
              <div className="id-icon">ID</div>
              <div className="id-upload">
                {governmentIds.nationalId ? (
                  <img
                    src={URL.createObjectURL(governmentIds.nationalId)}
                    alt="National ID"
                    className="id-preview"
                  />
                ) : (
                  <UploadButton idType="National ID" />
                )}
              </div>
            </div>
          </div>
          <div className="upload-instructions">
            <p>Please upload clear, full-color scans of your government-issued IDs.</p>
            <p>Supported formats: JPG, PNG, PDF (max 5MB each)</p>
          </div>
          <button
            className="submit-verification-btn"
            disabled={profileCompletion < 100}
          >
            Submit for Verification
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletionPage;