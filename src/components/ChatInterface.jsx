import { useEffect, useState } from 'react';
import { SpeakerIcon, SendIcon } from 'lucide-react';
import '../styles/ChatInterface.css';
import { io } from 'socket.io-client';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    const socket = io('http://localhost:8000/onboarding');
    socket.on('welcome', msg => {
      setMessages([{ text: msg, sender: 'ai' }]);
    });

    socket.on('ai', msg => {
      setMessages([...messages, { text: msg, sender: 'ai' }]);
    });
  }, []);

  const handleSendMessage = () => {
    if (inputText.trim()) {
      setMessages([...messages, { text: inputText, sender: 'user' }]);
      setInputText('');
      // Simulate AI response
      setTimeout(() => {
        setMessages(prev => [...prev, { text: 'AI Response', sender: 'ai' }]);
      }, 1000);
    }
  };

  const handleVoiceRecording = () => {
    // Implement voice recording functionality
    console.log('Voice recording started');
  };

  return (
    <div className='chat-interface'>
      <div className='messages-container'>
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}-message`}>
            {msg.text}
          </div>
        ))}
      </div>

      <div className='input-container'>
        <div className='text-input-group'>
          <input
            type='text'
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder='Type your message...'
            className={inputText.trim() ? 'has-text' : ''}
          />
          {inputText.trim() ? (
            <button onClick={handleSendMessage}>
              <SendIcon />
            </button>
          ) : (
            <button onClick={handleVoiceRecording}>
              <SpeakerIcon />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
