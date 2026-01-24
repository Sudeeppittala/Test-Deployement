
import React from 'react';
import Logo from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-white py-20 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
          <div className="md:col-span-5">
            {/* Increased height: h-12 (48px) on mobile, h-16 (64px) on desktop */}
            <Logo variant="footer" className="h-25 md:h-40 w-auto mb-8 opacity-90" />
            <p className="text-slate-400 font-medium text-lg leading-relaxed max-w-sm">
              The infrastructure for placement excellence. We bridge the gap between human potential and corporate demand.
            </p>
          </div>
          
          <div className="md:col-span-2">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Solutions</h4>
            <ul className="space-y-4 text-slate-500 font-medium text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Managed Drives</a></li>
              <li><a href="#" className="hover:text-white transition-colors">T&P Outsourcing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Talent Pipelines</a></li>
              <li><a href="#" className="hover:text-white transition-colors">90-Day Sprint</a></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Company</h4>
            <ul className="space-y-4 text-slate-500 font-medium text-sm">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Philosophy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white hover:text-slate-950 transition-all">
                <IconLinkedin />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white hover:text-slate-950 transition-all">
                <IconTwitter />
              </a>
            </div>
            <div className="mt-8">
               <div className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mb-2">Office Headquarters</div>
               <a 
                 href="https://maps.app.goo.gl/hNT14MfyUd1co1R89" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-sm text-slate-400 font-medium hover:text-white transition-colors block leading-relaxed"
               >
                 Placemein, 5th Floor, APHB Colony, Indira Nagar, Gachibowli, Hyderabad, Telangana 500032
               </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em]">
            &copy; {new Date().getFullYear()} PLACEMEIN OPERATIONS.
          </div>
          <div className="flex gap-8 text-[10px] text-slate-600 font-bold uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Compliance</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const IconLinkedin = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
);

const IconTwitter = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
);

export default Footer;
