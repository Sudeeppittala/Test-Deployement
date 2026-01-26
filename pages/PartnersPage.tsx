import React from 'react';
import PersonaPage from '../components/PersonaPage';
import { PERSONA_PAGES } from '../personaData';
import { Audience } from '../types';

const PartnersPage: React.FC = () => {
  return (
    <PersonaPage 
      content={PERSONA_PAGES.partners} 
      audience={Audience.Institutes} 
    />
  );
};

export default PartnersPage;