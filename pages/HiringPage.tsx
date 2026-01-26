import React from 'react';
import PersonaPage from '../components/PersonaPage';
import { PERSONA_PAGES as SHARED_PAGES } from '../personaData';
import { Audience } from '../types';

const HiringPage: React.FC = () => {
  return (
    <PersonaPage 
      content={SHARED_PAGES.hiring} 
      audience={Audience.Corporates} 
    />
  );
};

export default HiringPage;