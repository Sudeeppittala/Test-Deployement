import React from 'react';
import PersonaPage from '../components/PersonaPage';
import { PERSONA_PAGES } from '../personaData';
import { Audience } from '../types';

const CollegesPage: React.FC = () => {
  return (
    <PersonaPage 
      content={PERSONA_PAGES.colleges} 
      audience={Audience.Colleges} 
    />
  );
};

export default CollegesPage;