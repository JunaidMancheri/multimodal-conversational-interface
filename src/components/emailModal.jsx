import { Input, Modal, Space } from 'antd';
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
        <div style={{paddingTop: '2rem'}}>

        <Input placeholder='Email Or UID' onChange={e => setEmail(e.target.value)}></Input>
        </div>
      </Modal>
    </>
  );
}
