import { Modal } from 'antd';
import { useRef, useState } from 'react';
import Webcam from 'react-webcam';

export function WebcamModal({ open, onClose, onCapture }) {
  const webcamRef = useRef(null);

  function captureImage() {
    const capturedImage = webcamRef.current.getScreenshot();
    onCapture(capturedImage);
    onClose();
  }
  return (
    <>
      <Modal onCancel={onClose} onOk={captureImage} open={open} okText='Capture' closeIcon={false}>
        <Webcam
          ref={webcamRef}
          style={{ width: '90%', height: 'auto' }}
        ></Webcam>
      </Modal>
    </>
  );
}

export default WebcamModal;
