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
      <DeviceInfoContext.Provider value={{ machineId }}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<WelcomeScreen />} />
            <Route path='/onboarding' element={<ChatInterface />} />
            <Route
              path='/profile'
              element={<ProfileCompletionPage />}
            />
          </Routes>
        </BrowserRouter>
      </DeviceInfoContext.Provider>
      <ToastContainer />
    </div>
  );
}

export default App;
