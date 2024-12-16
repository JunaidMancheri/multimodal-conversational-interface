import { Input, Modal } from 'antd';
import { useState } from 'react';

export default function EmailModal({ open, onSubmit, onClose }) {
  const [email, setEmail] = useState();

  return (
    <>
      <Modal
        open={open}
        onOk={() => onSubmit(email)}
        onClose={onClose}
        onCancel={onClose}
      >
        <Input onChange={e => setEmail(e.target.value)}></Input>
      </Modal>
    </>
  );
}
