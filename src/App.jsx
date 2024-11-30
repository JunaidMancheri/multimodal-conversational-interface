import { useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import ChatInterface from './components/ChatInterface';
import './index.css';

function App() {
  const [isOnboarded, setIsOnboarded] = useState(false);

  const handleStartChat = () => {
    setIsOnboarded(true);
  };

  return (
    <div className="App">
      {!isOnboarded ? (
        <WelcomeScreen onStartChat={handleStartChat} />
      ) : (
        <ChatInterface />
      )}
    </div>
  );
}

export default App;