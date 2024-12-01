import { useEffect, useState, useRef } from 'react';
import { SpeakerIcon, SendIcon } from 'lucide-react';
import '../styles/ChatInterface.css';
import { io } from 'socket.io-client';
import GlassmorphicSpinner from './Spinner';

const ChatInterface = () => {
  const [messages, setMessages] = useState([{sender: 'ai'}]);
  const [inputText, setInputText] = useState('');
  const [socket, setSocket] = useState(null);
  const [msgLoading, setMsgLoading] = useState(true)
  const [speakAloud, setSpeakAloud] = useState(null);

  const audioChunks = useRef([]);
  const mediaRecorder = useRef(null);
  useEffect(() => {
    const socket = io(import.meta.env.VITE_SERVICE_URL);
    setSocket(socket);
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('welcome', msg => {
        setMsgLoading(false);
        setMessages(() => [
          { text: msg, sender: 'ai' },
        ]);
      });

      socket.on('ai', msg => {
        receiveSocketMessage(msg);
      });

      socket.on('tts', async arrayBuffer => {
        speakAloud?.pause();
        const blob = new Blob([arrayBuffer], { type: 'audio/mp3' });
        const audio = new Audio(URL.createObjectURL(blob));
        audio
          .play()
          .then(valu => console.log(valu))
          .catch(err => console.log(err));
        setSpeakAloud(audio);
        
      });

      socket.on('transcribe', (msg) => {
        setMessages(prevMessages => [...prevMessages, { text: msg, sender: 'user' }]);
      })
    }
  }, [socket]);

  function receiveSocketMessage(msg) {

    setMessages(prevMessages => [...prevMessages.slice(0, prevMessages.length -1), { text: msg, sender: 'ai' }]);
  }

  const handleSendMessage = () => {
    if (inputText.trim()) {
      setMessages(prevMessages => [
        ...prevMessages,
        { text: inputText, sender: 'user' },
      ]);
      setInputText('');
      socket.emit('message', inputText);
      setMessages((prev) => [...prev, {sender: 'ai'}])
      setMsgLoading(true);
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
            {msgLoading && !msg.text ?<GlassmorphicSpinner/>: msg.text }
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
