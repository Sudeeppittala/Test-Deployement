
import React, { useState } from 'react';
import RoleChatModal from './RoleChatModal';

const rolesData = [
  {
    category: 'Development',
    roles: ['Full-Stack', 'Backend', 'Frontend', 'Mobile', 'SDET'],
  },
  {
    category: 'Data Science',
    roles: ['Analyst', 'Data Scientist', 'BI Analyst', 'ML Engineer', 'Data Engineer'],
  },
  {
    category: 'Cloud',
    roles: ['DevOps', 'Cloud Engineer', 'SRE', 'Platform Engineer'],
  },
  {
    category: 'Security',
    roles: ['Analyst', 'Pen Tester', 'Consultant', 'Responder'],
  },
];

interface PillProps {
  children: React.ReactNode;
  onClick: () => void;
}

const Pill: React.FC<PillProps> = ({ children, onClick }) => (
  <button 
    onClick={onClick}
    className="inline-block bg-white border border-gray-200 text-slate-600 rounded-full px-5 py-2 text-sm font-medium hover:border-primary hover:text-primary hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer active:scale-95"
  >
    {children}
  </button>
);


const Roles: React.FC = () => {
  // Store both category and role to handle duplicate role names (like "Analyst")
  const [selectedRole, setSelectedRole] = useState<{category: string, role: string} | null>(null);

  return (
    <section className="py-32 px-6 bg-slate-50 border-y border-gray-200 relative">
      <div className="container mx-auto text-center">
        <h2 className="font-sans font-bold tracking-tight text-4xl md:text-5xl text-slate-900 mb-6">Roles We Source</h2>
        <p className="text-xl text-gray-500 mb-16 max-w-2xl mx-auto font-medium">
          Tap on any role to see what it takes to get hired.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 text-left max-w-6xl mx-auto">
          {rolesData.map((category) => (
            <div key={category.category}>
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-primary mb-6 border-b border-primary/10 pb-2">{category.category}</h3>
              <div className="flex flex-wrap gap-2">
                {category.roles.map((role) => (
                  <Pill key={role} onClick={() => setSelectedRole({ category: category.category, role: role })}>
                    {role}
                  </Pill>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedRole && (
        <RoleChatModal 
          role={selectedRole.role}
          category={selectedRole.category}
          onClose={() => setSelectedRole(null)} 
        />
      )}
    </section>
  );
};

export default Roles;
