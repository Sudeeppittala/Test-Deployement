import React, { useState } from 'react';
import { Linkedin } from 'lucide-react';
import { Attendee } from '../../hooks/useAttendeeData';

interface AttendeeCardProps {
  attendee: Attendee;
}

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

export const AttendeeCard: React.FC<AttendeeCardProps> = ({ attendee }) => {
  const [imgError, setImgError] = useState(false);

  const initials = getInitials(attendee.name);
  const showFallback = imgError || !attendee.profile_pic_url;

  return (
    <div className="h-full bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-6 rounded-3xl space-y-4 hover:border-purple-500/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
      <div className="space-y-4">
        {/* Attendee Header */}
        <div className="flex items-center gap-3">
          {showFallback ? (
            <div className="w-12 h-12 rounded-full bg-[#7C3AED] flex items-center justify-center border border-gray-200 dark:border-zinc-700 flex-shrink-0 text-white font-bold text-sm select-none">
              {initials}
            </div>
          ) : (
            <img 
              src={attendee.profile_pic_url} 
              alt={attendee.name}
              onError={() => setImgError(true)}
              className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-zinc-700 flex-shrink-0"
            />
          )}

          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h5 className="text-sm font-bold text-black dark:text-white leading-tight">
                {attendee.name}
              </h5>
              
              {attendee.verified === 'TRUE' && (
                <span className="inline-block text-[9px] font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 px-2 py-0.5 rounded-md border border-purple-200/20">
                  Verified Partner
                </span>
              )}
            </div>
            
            <p className="text-[11px] text-gray-500 leading-tight">
              {attendee.designation} <span className="mx-0.5 font-normal text-gray-400">·</span> {attendee.company}
            </p>
          </div>
        </div>

        {/* Quote text in italics */}
        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-medium italic">
          “{attendee.quote}”
        </p>
      </div>

      {attendee.linkedin_url && (
        <div className="pt-3 border-t border-gray-100 dark:border-zinc-800/80 flex justify-start">
          <a 
            href={attendee.linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-[#0077B5] dark:hover:text-[#0077B5] transition-colors"
            aria-label={`${attendee.name}'s LinkedIn`}
          >
            <Linkedin className="w-4 h-4 fill-current" />
          </a>
        </div>
      )}
    </div>
  );
};

export default AttendeeCard;
