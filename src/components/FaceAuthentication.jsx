import { Modal } from 'antd';
import { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { io } from 'socket.io-client';

export function FaceAuthentication({ open, onClose, onCapture }) {
  const webcamRef = useRef(null);
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io(import.meta.env.VITE_SERVICE_URL + '/auth');    
  }, [])

  function captureImage() {
    const capturedImage = webcamRef.current.getScreenshot();
    if (socket.current) {
      socket.current.emit('authenticate', capturedImage );
    }
  }
  return (
    <>
      <Modal onCancel={onClose} onOk={captureImage} open={open} okText='Capture'>
        <Webcam
          ref={webcamRef}
          style={{ width: '90%', height: 'auto' }}
        ></Webcam>
      </Modal>
    </>
  );
}

export default FaceAuthentication;
