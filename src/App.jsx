import { useEffect, useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import ChatInterface from './components/ChatInterface';
import './index.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FingerPrintJS from '@fingerprintjs/fingerprintjs';
import ProfileCompletionPage from './components/Profile';

function App() {
  const [isOnboarded, setIsOnboarded] = useState(false);

  const handleStartChat = () => {
    setIsOnboarded(true);
  };

  useEffect(() => {
    async function loadFingerPrint() {
      const fp = await FingerPrintJS.load();
      const result = await fp.get();
      console.log(result);
    }
    loadFingerPrint();
  }, []);

  return (
    <div className='App'>
      <ToastContainer />
      {!isOnboarded ? (
        <WelcomeScreen onStartChat={handleStartChat} />
      ) : (
        <ChatInterface />
      )}
    </div>
  );
}

export default App;
