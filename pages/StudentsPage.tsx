import React from 'react';
import PersonaPage from '../components/PersonaPage';
import { PERSONA_PAGES } from '../personaData';
import { Audience } from '../types';

const StudentsPage: React.FC = () => {
  return (
    <PersonaPage 
      content={PERSONA_PAGES.students} 
      audience={Audience.Students} 
    />
  );
};

export default StudentsPage;