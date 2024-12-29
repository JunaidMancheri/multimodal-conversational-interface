import { Modal } from 'antd';
import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { io } from 'socket.io-client';
import UserContext from '../contexts/UserContext';
import DeviceInfoContext from '../contexts/DeviceInfoContext';
import { toast } from 'react-toastify';
import axios from 'axios';

export function FaceAuthentication({ open, onClose, email }) {
  return (
    <>
      <Modal
        onCancel={onClose}
        open={open}
        footer={false}
        okText='Capture'
        destroyOnClose={true}
      >
        <WebCam email={email} />
      </Modal>
    </>
  );
}

export default FaceAuthentication;

const WebCam = ({ email }) => {
  const { setIsLoggedIn, setUser } = useContext(UserContext);
  const { machineId } = useContext(DeviceInfoContext);
  const [message, setMessage] = useState('Please show your face to the camera');
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io(import.meta.env.VITE_SERVICE_URL + '/auth');
    socket.current.on('events', async event => {
      if (event == 'success') {
        socket.current.off('events')
        setMessage('Authentication Successful');
        setIsLoggedIn(true);
        toast.success('Authentication Successfull');
        const response = await axios.get(
          import.meta.env.VITE_SERVICE_URL + '/machine-id/' + machineId
        );
        setUser(response.data);
        setTimeout(() => navigate('/profile'), 800);
      } else if (event == 'failed') {
        setMessage('Authentication Failed');
        toast.info('Authentication Failed');
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
      socket.current.emit('authenticate', {
        email,
        machineId,
        image: capturedImage,
      });
    }
  }
  return (
    <>
      <span>{message}</span>
      <Webcam ref={webcamRef} style={{ width: '90%', height: 'auto' }}></Webcam>
    </>
  );
};
