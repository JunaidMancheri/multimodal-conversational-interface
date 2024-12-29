import { motion } from 'framer-motion';
import '../styles/WelcomeScreen.css';
import AnimatedBackground from './AnimatedBackground';
import { useContext, useRef, useState } from 'react';
import FaceAuthentication from './FaceAuthentication';
import { useNavigate } from 'react-router-dom';
import UserContext from '../contexts/UserContext';
import EmailModal from './emailModal';
import { toast } from 'react-toastify';

// eslint-disable-next-line react/prop-types
const WelcomeScreen = () => {
  const { user } = useContext(UserContext);
  const emailRef = useRef(null);
  const [faceAuthModalOpen, setFaceAuthModalOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const navigate = useNavigate();

  function handleLoginClick() {
    if (user) {
      setFaceAuthModalOpen(true);
    } else {
      setEmailModalOpen(true);
    }
  }

  function handleEmailSubmit(email) {
    if (email == '' || email == null || email?.length == 0)
      return toast.warn('Email is required');
    emailRef.current = email;
    setEmailModalOpen(false);
    setFaceAuthModalOpen(true);
  }

  return (
    <div className='welcome-container'>
      <FaceAuthentication
        onClose={() => setFaceAuthModalOpen(false)}
        open={faceAuthModalOpen}
        email={user?.email || emailRef.current}
      />
      <EmailModal
        onSubmit={handleEmailSubmit}
        onClose={() => setEmailModalOpen(false)}
        open={emailModalOpen}
      ></EmailModal>
      <AnimatedBackground />
      <div className='welcome-content'>
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='welcome-heading'
        >
          Hello {user ? user.firstName : 'Human'}
        </motion.h1>
        <motion.button
          onClick={handleLoginClick}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className='onboard-button'
        >
          {user ? 'Continue to dashboard' : 'Login'}
        </motion.button>
        <motion.button
          onClick={() => navigate('/onboarding')}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className='onboard-button'
        >
          {user ? 'Onboard as another user' : 'Onboard to Future'}
        </motion.button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
