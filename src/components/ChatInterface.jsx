import { useEffect, useState, useRef } from 'react';
import { SpeakerIcon, SendIcon } from 'lucide-react';
import '../styles/ChatInterface.css';
import { io } from 'socket.io-client';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [socket, setSocket] = useState(null);

  const audioChunks = useRef([]);
  const mediaRecorder = useRef(null);
  useEffect(() => {
    const socket = io('http://localhost:8000/onboarding');
    setSocket(socket);
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('welcome', msg => {
        setMessages(prevMessages => [
          ...prevMessages,
          { text: msg, sender: 'ai' },
        ]);
      });

      socket.on('ai', msg => {
        receiveSocketMessage(msg);
      });

      socket.on('tts', async arrayBuffer => {
        const blob = new Blob([arrayBuffer], { type: 'audio/mp3' });
        const audio = new Audio(URL.createObjectURL(blob));
        audio
          .play()
          .then(valu => console.log(valu))
          .catch(err => console.log(err));
      });

      socket.on('transcribe', (msg) => {
        setMessages(prevMessages => [...prevMessages, { text: msg, sender: 'user' }]);
      })
    }
  }, [socket]);

  function receiveSocketMessage(msg) {
    setMessages(prevMessages => [...prevMessages, { text: msg, sender: 'ai' }]);
  }

  const handleSendMessage = () => {
    if (inputText.trim()) {
      setMessages(prevMessages => [
        ...prevMessages,
        { text: inputText, sender: 'user' },
      ]);
      setInputText('');
      socket.emit('message', inputText);
    }
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);

    mediaRecorder.current.ondataavailable = event => {
      if (event.data.size > 0) {
        audioChunks.current.push(event.data);
      }
    };

    mediaRecorder.current.start();
  };

  const stopRecording = () => {
    mediaRecorder.current.stop();

    mediaRecorder.current.onstop = () => {
      const blob = new Blob(audioChunks.current, { type: 'audio/mp3' });
      const reader = new FileReader();

      reader.onloadend = () => {
        const buffer = new Uint8Array(reader.result);
        socket.emit('audio', buffer); // Send buffer to backend
      };

      reader.readAsArrayBuffer(blob);

      // Reset audio chunks
      audioChunks.current = [];
    };
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
            <button
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
            >
              <SpeakerIcon />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
