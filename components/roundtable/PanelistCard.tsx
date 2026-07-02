import React, { useState } from 'react';
import { Linkedin } from 'lucide-react';
import { Panelist } from '../../hooks/usePanelistData';

interface PanelistCardProps {
  panelist: Panelist;
}

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

export const PanelistCard: React.FC<PanelistCardProps> = ({ panelist }) => {
  const [imgError, setImgError] = useState(false);

  const initials = getInitials(panelist.name);
  const showFallback = imgError || !panelist.imageUrl;

  return (
    <div className="group h-full flex flex-col bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-purple-500/30 transition-all duration-300">
      {/* Profile Photo Area */}
      <div className="aspect-[4/3] bg-purple-950/20 border-b border-gray-100 dark:border-zinc-800/80 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#2E0052]/20 to-purple-800/10" />
        
        {showFallback ? (
          <div className="w-[120px] h-[120px] rounded-full bg-[#7C3AED] flex items-center justify-center border-4 border-white dark:border-zinc-800 shadow-md">
            <span className="text-3xl font-black text-white select-none">
              {initials}
            </span>
          </div>
        ) : (
          <img 
            src={panelist.imageUrl} 
            alt={panelist.name}
            onError={() => setImgError(true)}
            className="w-[120px] h-[120px] rounded-full object-cover border-4 border-white dark:border-zinc-800 shadow-md transition-transform duration-500 group-hover:scale-105"
          />
        )}

        {/* Glowing role/tag badge */}
        <div className="absolute top-4 right-4 bg-[#4B0082] text-white text-[8px] font-bold tracking-widest uppercase px-3 py-1 rounded-full border border-purple-500/20 shadow-sm max-w-[80%] truncate">
          {panelist.tag || 'PANELIST'}
        </div>
      </div>

      {/* Info details */}
      <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
        <div className="space-y-1">
          <h4 className="text-base font-bold text-black dark:text-white group-hover:text-[#4B0082] dark:group-hover:text-purple-400 transition-colors">
            {panelist.name}
          </h4>
          <p className="text-xs font-semibold text-[#4B0082] dark:text-purple-400">
            {panelist.title}
          </p>
        </div>

        <div className="border-t border-gray-100 dark:border-zinc-800/80 pt-3 space-y-3 flex-grow flex flex-col justify-between">
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed flex-grow font-medium">
            {panelist.coreDomain || 'Focusing on strategic HR, digital transformation, and scalable recruitment pipelines.'}
          </p>
          
          {panelist.linkedinUrl && (
            <div className="pt-2 flex justify-start">
              <a 
                href={panelist.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#0077B5] dark:hover:text-[#0077B5] transition-colors"
                aria-label={`${panelist.name}'s LinkedIn`}
              >
                <Linkedin className="w-5 h-5 fill-current" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PanelistCard;
