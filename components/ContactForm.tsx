import React, { useState, forwardRef, useEffect } from 'react';
import { Audience } from '../types';
import Button from './ui/Button';
import ScrollReveal from './ui/ScrollReveal';

// TODO: REPLACE THIS WITH YOUR DEPLOYED GOOGLE APPS SCRIPT WEB APP URL
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzNEdcyqesyKfUWbapM8Uff9jhnRpylH6ywnbCRejLeFWOK5LVUA9YzFY2Z680kTbBdGA/exec";

interface ContactFormProps {
  selectedAudience?: Audience;
}

const ContactForm = forwardRef<HTMLElement, ContactFormProps>(({ selectedAudience = Audience.Students }, ref) => {
  const [audience, setAudience] = useState<Audience>(selectedAudience);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  useEffect(() => {
    setAudience(selectedAudience);
  }, [selectedAudience]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget; 
    setStatus('submitting');
    
    const formData = new FormData(form);
    const payload = {
      audience: audience,
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      organization: formData.get('organization'),
      created_at: new Date().toISOString()
    };

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      setStatus('success');
      form.reset(); 
      
      console.log("Payload sent to Google Sheet:", payload);

    } catch (error) {
      console.error("Submission error:", error);
      setStatus('error');
    }
  };

  return (
    <section className="py-32 px-6 bg-white dark:bg-black" ref={ref} id="main-contact-form">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="font-sans font-bold tracking-tighter text-5xl md:text-6xl text-slate-900 dark:text-white mb-6 leading-tight">
              Let's get started.
            </h2>
            <p className="text-xl text-gray-500 dark:text-gray-400 font-medium">
              Tell us who you are. We'll handle the rest.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal animation="scale-up" delay={0.2}>
          <div className="bg-slate-50 dark:bg-zinc-900 p-10 md:p-16 rounded-[2rem] border border-gray-100 dark:border-zinc-800 relative overflow-hidden shadow-sm">
            
            {/* Success Overlay - Animated */}
            <div 
              className={`absolute inset-0 bg-slate-50 dark:bg-zinc-900 flex flex-col items-center justify-center z-20 text-center p-8 transition-all duration-500 ease-out-expo ${
                status === 'success' ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-95'
              }`}
            >
                 <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mb-6 animate-pulse-slow">
                   <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                 </div>
                 <h3 className="text-3xl font-sans font-bold text-slate-900 dark:text-white mb-4">Request Received!</h3>
                 <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8 font-medium">
                   Thanks for reaching out. Our operations team has been notified and will contact you within 4 hours.
                 </p>
                 <Button onClick={() => setStatus('idle')} variant="secondary" className="px-8">
                   Send Another
                 </Button>
            </div>

            <form onSubmit={handleSubmit} className={`space-y-10 transition-all duration-500 ${status === 'submitting' ? 'opacity-50 scale-[0.98] pointer-events-none grayscale' : ''}`}>
              <div className="flex flex-wrap justify-center gap-4">
                {Object.values(Audience).map((type) => (
                  <button
                    type="button"
                    key={type}
                    onClick={() => setAudience(type)}
                    className={`font-sans px-8 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 ease-out-expo active:scale-95 ${
                      audience === type 
                      ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                      : 'bg-white dark:bg-zinc-900 text-gray-400 dark:text-gray-500 hover:text-primary dark:hover:text-primary-light border border-gray-200 dark:border-zinc-800 hover:border-primary/30 dark:hover:border-primary-light/30'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-8 relative">
                {/* Subtle loading overlay for submit state */}
                {status === 'submitting' && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <label className="font-sans text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Name</label>
                  <input required name="name" type="text" placeholder="Jane Doe" className="font-sans w-full px-5 py-4 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 focus:border-primary dark:focus:border-primary-light focus:ring-4 focus:ring-primary/10 dark:focus:ring-primary-light/10 outline-none transition-all font-medium dark:text-white" />
                </div>
                <div className="space-y-2">
                  <label className="font-sans text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Email</label>
                  <input required name="email" type="email" placeholder="jane@example.com" className="font-sans w-full px-5 py-4 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 focus:border-primary dark:focus:border-primary-light focus:ring-4 focus:ring-primary/10 dark:focus:ring-primary-light/10 outline-none transition-all font-medium dark:text-white" />
                </div>

                <div className="space-y-2">
                  <label className="font-sans text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Mobile Number</label>
                  <input required name="phone" type="tel" placeholder="+91 98765 43210" className="font-sans w-full px-5 py-4 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 focus:border-primary dark:focus:border-primary-light focus:ring-4 focus:ring-primary/10 dark:focus:ring-primary-light/10 outline-none transition-all font-medium dark:text-white" />
                </div>
                
                <div className="space-y-2">
                   <label className="font-sans text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">
                      {audience === Audience.Students ? "College Name" : "Organization"}
                   </label>
                   <input required name="organization" type="text" placeholder="Start typing..." className="font-sans w-full px-5 py-4 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 focus:border-primary dark:focus:border-primary-light focus:ring-4 focus:ring-primary/10 dark:focus:ring-primary-light/10 outline-none transition-all font-medium dark:text-white" />
                </div>
              </div>

              <div className="text-center">
                <Button disabled={status === 'submitting'} type="submit" className="font-sans w-full md:w-auto px-16 py-4 text-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-black dark:hover:bg-gray-200 rounded-xl disabled:opacity-70 disabled:cursor-not-allowed font-bold">
                  {status === 'submitting' ? 'Sending Request...' : 'Submit Request'}
                </Button>
                {status === 'error' && (
                  <p className="font-sans mt-4 text-red-500 text-sm font-medium animate-fade-in">Something went wrong. Please try again.</p>
                )}
              </div>
            </form>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
});

ContactForm.displayName = 'ContactForm';

export default ContactForm;