import { Modal } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { io } from 'socket.io-client';

export function FaceAuthentication({ open, onClose }) {
  return (
    <>
      <Modal
        onCancel={onClose}
        open={open}
        footer={false}
        okText='Capture'
        destroyOnClose={true}
      >
        <WebCam />
      </Modal>
    </>
  );
}

export default FaceAuthentication;

const WebCam = () => {
  const [message, setMessage] = useState('Please show your face to the camera');
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io(import.meta.env.VITE_SERVICE_URL + '/auth');
    socket.current.on('events', event => {
      if (event == 'success') {
        setMessage('Authentication Successful');
        setTimeout(() => navigate('/profile'), 800);
      } else {
      }
    });
  }, []);

  useEffect(() => {
    const id = setInterval(captureImage, 1000);
    return () => clearInterval(id);
  }, []);

  function captureImage() {
    const capturedImage = webcamRef.current.getScreenshot();
    if (socket.current) {
      setMessage('Verifying...');
      socket.current.emit('authenticate', capturedImage);
    }
  }
  return (
    <>
      <span>{message}</span>
      <Webcam ref={webcamRef} style={{ width: '90%', height: 'auto' }}></Webcam>
    </>
  );
};
