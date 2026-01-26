import React, { useState, forwardRef, useEffect } from 'react';
import { Audience } from '../types';
import Button from './ui/Button';

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
    <section className="py-32 px-6 bg-white" ref={ref} id="main-contact-form">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-sans font-bold tracking-tighter text-5xl md:text-6xl text-slate-900 mb-6 leading-tight">
            Let's get started.
          </h2>
          <p className="text-xl text-gray-500 font-medium">
            Tell us who you are. We'll handle the rest.
          </p>
        </div>

        <div className="bg-slate-50 p-10 md:p-16 rounded-[2rem] border border-gray-100 relative overflow-hidden">
          
          {/* Success Overlay */}
          {status === 'success' ? (
            <div className="absolute inset-0 bg-slate-50 flex flex-col items-center justify-center z-10 animate-fade-in text-center p-8">
               <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6">
                 <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
               </div>
               <h3 className="text-3xl font-sans font-bold text-slate-900 mb-4">Request Received!</h3>
               <p className="text-gray-500 max-w-md mb-8 font-medium">
                 Thanks for reaching out. Our operations team has been notified and will contact you within 4 hours.
               </p>
               <Button onClick={() => setStatus('idle')} variant="secondary" className="px-8">
                 Send Another
               </Button>
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className={`space-y-10 transition-opacity duration-300 ${status === 'submitting' ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="flex flex-wrap justify-center gap-4">
              {Object.values(Audience).map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setAudience(type)}
                  className={`font-sans px-8 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                    audience === type 
                    ? 'bg-primary text-white shadow-lg' 
                    : 'bg-white text-gray-400 hover:text-primary border border-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-8" key={audience}>
              <div className="space-y-2">
                <label className="font-sans text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Name</label>
                <input required name="name" type="text" placeholder="Jane Doe" className="font-sans w-full px-5 py-4 rounded-xl bg-white border border-gray-200 focus:border-primary outline-none transition-all font-medium" />
              </div>
              <div className="space-y-2">
                <label className="font-sans text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Email</label>
                <input required name="email" type="email" placeholder="jane@example.com" className="font-sans w-full px-5 py-4 rounded-xl bg-white border border-gray-200 focus:border-primary outline-none transition-all font-medium" />
              </div>

              <div className="space-y-2">
                <label className="font-sans text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Mobile Number</label>
                <input required name="phone" type="tel" placeholder="+91 98765 43210" className="font-sans w-full px-5 py-4 rounded-xl bg-white border border-gray-200 focus:border-primary outline-none transition-all font-medium" />
              </div>
              
              <div className="space-y-2">
                 <label className="font-sans text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">
                    {audience === Audience.Students ? "College Name" : "Organization"}
                 </label>
                 <input required name="organization" type="text" placeholder="Start typing..." className="font-sans w-full px-5 py-4 rounded-xl bg-white border border-gray-200 focus:border-primary outline-none transition-all font-medium" />
              </div>
            </div>

            <div className="text-center">
              <Button disabled={status === 'submitting'} type="submit" className="font-sans w-full md:w-auto px-16 py-4 text-lg bg-slate-900 text-white hover:bg-black rounded-xl disabled:opacity-70 disabled:cursor-not-allowed font-bold">
                {status === 'submitting' ? 'Sending Request...' : 'Submit Request'}
              </Button>
              {status === 'error' && (
                <p className="font-sans mt-4 text-red-500 text-sm font-medium">Something went wrong. Please try again.</p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
});

ContactForm.displayName = 'ContactForm';

export default ContactForm;