import { useEffect, useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import ChatInterface from './components/ChatInterface';
import './index.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FingerPrintJS from '@fingerprintjs/fingerprintjs';
import ProfileCompletionPage from './components/Profile';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DeviceInfoContext from './contexts/DeviceInfoContext';

function App() {
  const [machineId, setMachineId] = useState(null);
  useEffect(() => {
    async function loadFingerPrint() {
      const fp = await FingerPrintJS.load();
      const result = await fp.get();
      setMachineId(result.visitorId);
    }
    loadFingerPrint();
  }, []);

  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <DeviceInfoContext.Provider value={{machineId}}>
            <Route path='/' element={<WelcomeScreen />} />
            <Route path='/onboarding' element={<ChatInterface />} />
            <Route
              path='/profile-completion'
              element={<ProfileCompletionPage />}
            />
          </DeviceInfoContext.Provider>
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </div>
  );
}

export default App;
