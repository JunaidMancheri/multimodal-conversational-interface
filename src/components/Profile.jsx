import React, { useContext, useEffect, useRef, useState } from 'react';
import '../styles/Profile.css';
import axios from 'axios';
import UserContext from '../contexts/UserContext';
import { toast } from 'react-toastify';

const ProfileCompletionPage = () => {
  const { user } = useContext(UserContext);
  const [governmentIds, setGovernmentIds] = useState({
    passport: null,
    pan: null,
    adhaar: null,
  });

  const [profileCompletion, setProfileCompletion] = useState(0);

  useEffect(() => {
    if (!user) return;
    async function getIDs() {
      const result = await axios.get(
        import.meta.env.VITE_SERVICE_URL + '/ids/' + user.uid
      );
      const ids = result.data;
      ids.forEach((id) => {
        setGovernmentIds(prev => ({...prev, [id.type]: true}));
      })
      calculateProfileCompletion();
    }
    getIDs();
  }, [user]);

  const handleFileUpload = (idType, file) => {
    const reader = new FileReader();
    if (!file) return;
    let base64;
    reader.onload = async e => {
      base64 = e.target.result;
      try {
        const result = await axios.post(
          import.meta.env.VITE_SERVICE_URL + '/verify-id',
          {
            image: base64,
            type: idType,
            uid: user.uid,
          }
        );
        toast.success(result.data?.msg);
        setGovernmentIds(prevState => ({
          ...prevState,
          [idType]: true,
        }));
        calculateProfileCompletion();
      } catch (error) {
        toast.error(error.data?.msg);
      }
    };

    reader.readAsDataURL(file);
  };

  const calculateProfileCompletion = () => {
    const uploadedIds = Object.values(governmentIds).filter(id => id !== null);
    const completion = Math.min((uploadedIds.length / 3) * 100, 100);
    setProfileCompletion(completion);
  };

  const UploadButton = ({ idType }) => {
    const inputRef = useRef(null);
    return (
      <div className='upload-button' onClick={() => inputRef.current.click()}>
        <div className='upload-icon'>+</div>
        <div className='upload-label'>Upload {idType}</div>
        <input
          ref={inputRef}
          type='file'
          hidden
          className='upload-input'
          accept='image/jpeg, image/png'
          onChange={e => handleFileUpload(idType, e.target.files[0])}
        />
      </div>
    );
  };

  return (
    <div className='profile-completion-container'>
      <div className='profile-completion-card'>
        <div className='profile-completion-header'>
          <h2>Complete Your Profile</h2>
          <div className='profile-completion-progress'>
            <div
              className='profile-completion-bar'
              style={{ width: `${profileCompletion}%` }}
            />
            <div className='profile-completion-percentage'>
              {profileCompletion.toFixed(0)}%
            </div>
          </div>
        </div>
        <div className='profile-completion-section'>
          <h3>Government ID Verification</h3>
          <div className='id-upload-container'>
            <div className='id-upload-item'>
              <div className='id-icon'>ID</div>
              <div className='id-upload'>
                {governmentIds.passport ? (
                  <img
                    src='https://uxwing.com/verified-symbol-icon/'
                    alt='Passport'
                    className='id-preview'
                  />
                ) : (
                  <UploadButton idType='passport' />
                )}
              </div>
            </div>
            <div className='id-upload-item'>
              <div className='id-icon'>ID</div>
              <div className='id-upload'>
                {governmentIds.pan ? (
                  <img
                    src='https://uxwing.com/verified-symbol-icon/'
                    alt='Pan'
                    className='id-preview'
                  />
                ) : (
                  <UploadButton idType='pan' />
                )}
              </div>
            </div>
            <div className='id-upload-item'>
              <div className='id-icon'>ID</div>
              <div className='id-upload'>
                {governmentIds.adhaar ? (
                  <img
                    src='https://www.google.com/url?sa=i&url=https%3A%2F%2Fuxwing.com%2Fverify-icon%2F&psig=AOvVaw0ziJpCcEfWXtFsqCMvU0ba&ust=1734446425846000&source=images&cd=vfe&opi=89978449&ved=2ahUKEwiDqIPKwqyKAxVNTWwGHWCqEU0QjRx6BAgAEBk'
                    alt='Adhaar'
                    className='id-preview'
                  />
                ) : (
                  <UploadButton idType='adhaar' />
                )}
              </div>
            </div>
          </div>
          <div className='upload-instructions'>
            <p>
              Please upload clear, full-color scans of your government-issued
              IDs.
            </p>
            <p>Supported formats: JPG, PNG, PDF (max 5MB each)</p>
          </div>
          <button
            className='submit-verification-btn'
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
