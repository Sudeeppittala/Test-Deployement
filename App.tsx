import React, { useState, useEffect } from 'react';
import { Gate } from './components/Gate';
import { Sanctuary } from './components/Sanctuary';
import { UserMode } from './types';

const ALIYA_KEY = "Bunnylovesme";
const ADMIN_KEY = "Aliyalovesme";
const SESSION_KEY = "sanctuary_session_v1";

const App: React.FC = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [userMode, setUserMode] = useState<UserMode>('Aliya');
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const savedSession = localStorage.getItem(SESSION_KEY);
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        if (parsed.mode) {
          setUserMode(parsed.mode);
          setIsUnlocked(true);
        }
      } catch (e) {
        localStorage.removeItem(SESSION_KEY);
      }
    }
    setCheckingSession(false);
  }, []);

  const handleUnlock = (password: string) => {
    let mode: UserMode | null = null;

    if (password.toLowerCase() === ALIYA_KEY.toLowerCase()) {
      mode = 'Aliya';
    } else if (password.toLowerCase() === ADMIN_KEY.toLowerCase()) {
      mode = 'Admin';
    }

    if (mode) {
      setUserMode(mode);
      setIsUnlocked(true);
      localStorage.setItem(SESSION_KEY, JSON.stringify({ mode }));
    }
  };

  if (checkingSession) return null;

  return (
    <>
      {!isUnlocked && <Gate onUnlock={handleUnlock} />}
      {isUnlocked && <Sanctuary userMode={userMode} />}
    </>
  );
};

export default App;