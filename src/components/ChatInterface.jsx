import { useEffect, useState, useRef } from 'react';
import { MicIcon, SendIcon } from 'lucide-react';
import '../styles/ChatInterface.css';
import { io } from 'socket.io-client';
import GlassmorphicSpinner from './Spinner';
import VoiceRecordingIndicator from './VoiceRecording';

const ChatInterface = () => {
  const [messages, setMessages] = useState([{ sender: 'ai' }]);
  const [inputText, setInputText] = useState('');
  const [socket, setSocket] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  const audioChunks = useRef([]);
  const mediaRecorder = useRef(null);
  const currentAudioRef = useRef(null);
  const isSpaceDownRef = useRef(false);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SERVICE_URL);
    setSocket(socket);
  }, []);

  useEffect(() => {
    const handleKeyDown = e => {
      if (
        e.code === 'Space' &&
        document.activeElement !== document.querySelector('input') &&
        !isRecording &&
        !isSpaceDownRef.current
      ) {
        e.preventDefault();
        isSpaceDownRef.current = true;
        startRecording();
      }
    };

    const handleKeyUp = e => {
      if (e.code === 'Space' && isRecording && isSpaceDownRef.current) {
        e.preventDefault();
        isSpaceDownRef.current = false;
        stopRecording();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isRecording]);

  function stopSpeakAloud() {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
  }

  useEffect(() => {
    if (socket) {
      socket.on('welcome', msg => {
        setMessages(() => [{ text: msg, sender: 'ai' }]);
      });

      socket.on('ai', msg => {
        receiveSocketMessage(msg);
      });

      socket.on('events', event => {
        if (event == 'session_end') {
        }
      });

      socket.on('tts', async arrayBuffer => {
        stopSpeakAloud();
        const blob = new Blob([arrayBuffer], { type: 'audio/mp3' });
        const audio = new Audio(URL.createObjectURL(blob));
        currentAudioRef.current = audio;

        try {
          await audio.play();
        } catch (error) {
          console.error('Error playing audio:', error);
        } finally {
          audio.onended = () => {
            if (currentAudioRef.current === audio) {
              currentAudioRef.current = null;
            }
          };
        }
      });

      socket.on('transcribe', msg => {
        setMessages(prevMessages => [
          ...prevMessages,
          { text: msg, sender: 'user' },
          { sender: 'ai' },
        ]);
      });
    }
  }, [socket]);

  function receiveSocketMessage(msg) {
    setMessages(prevMessages => {
      const lastMessage = prevMessages[prevMessages.length - 1];
      if (lastMessage.text) {
        return [...prevMessages, { text: msg, sender: 'ai' }];
      } else {
        return [
          ...prevMessages.slice(0, prevMessages.length - 1),
          { text: msg, sender: 'ai' },
        ];
      }
    });
  }

  const handleSendMessage = () => {
    if (inputText.trim()) {
      setMessages(prevMessages => [
        ...prevMessages,
        { text: inputText, sender: 'user' },
      ]);
      setInputText('');
      socket.emit('message', inputText);
      setMessages(prev => [...prev, { sender: 'ai' }]);
    }
  };

  const startRecording = async () => {
    stopSpeakAloud();
    setIsRecording(true);
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
    setIsRecording(false);
    mediaRecorder.current.stop();

    mediaRecorder.current.onstop = () => {
      const blob = new Blob(audioChunks.current, { type: 'audio/mp3' });
      const reader = new FileReader();

      reader.onloadend = () => {
        const buffer = new Uint8Array(reader.result);
        socket.emit('audio', buffer);
      };
      reader.readAsArrayBuffer(blob);
      audioChunks.current = [];
    };
  };

  return (
    <div className='chat-interface'>
      <div className='messages-container'>
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}-message`}>
            {!msg.text ? <GlassmorphicSpinner /> : msg.text}
          </div>
        ))}
      </div>
      {isRecording && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <VoiceRecordingIndicator isRecording={isRecording} />
        </div>
      )}
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
              <MicIcon />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
