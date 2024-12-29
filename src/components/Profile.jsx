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
      ids.forEach(id => {
        setGovernmentIds(prev => ({
          ...prev,
          [id.type]: { url: id.url, id: id.id },
        }));
      });
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
          [idType]: { url: result.data?.url, id: result.data?.id },
        }));
        calculateProfileCompletion();
      } catch (error) {
        toast.error(error.response?.data?.msg);
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
          <h3>ID Gallery</h3>
          <div className='id-upload-container'>
            <div className='id-upload-item'>
              <div className='id-upload'>
                {governmentIds.passport ? (
                  <img
                    src={governmentIds.passport?.url}
                    alt='Passport'
                    className='id-preview'
                  />
                ) : (
                  <UploadButton idType='passport' />
                )}
              </div>

            </div>
            <div className='id-upload-item'>
              <div className='id-upload'>
                {governmentIds.pan ? (
                  <img
                    src={governmentIds.pan?.url}
                    alt='Pan'
                    className='id-preview'
                  />
                ) : (
                  <UploadButton idType='pan' />
                )}
              </div>
            </div>
            <div className='id-upload-item'>
              <div className='id-upload'>
                {governmentIds.adhaar ? (
                  <img
                    src={governmentIds.adhaar?.url}
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
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletionPage;
