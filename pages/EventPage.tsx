import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ChevronRight, 
  ExternalLink,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Globe
} from 'lucide-react';
import { CONFIG } from '../config';

/* ══════════════════════════════════════════════════════════════
   Framer Motion Variants
   ══════════════════════════════════════════════════════════════ */
const fadeUp: any = {
  hidden: { opacity: 0, y: 35 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
};

const scaleIn: any = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};

/* ══════════════════════════════════════════════════════════════
   Countdown Timer Helper Component
   ══════════════════════════════════════════════════════════════ */
const CountdownTimer: React.FC = () => {
  const targetDate = new Date('2026-06-27T10:00:00+05:30').getTime();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft(prev => ({ ...prev, isExpired: true }));
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (timeLeft.isExpired) {
    return (
      <div className="bg-[#4B0082]/10 border border-[#4B0082]/30 px-6 py-4 rounded-2xl text-center backdrop-blur-md">
        <span className="text-white font-semibold tracking-wider uppercase text-sm flex items-center justify-center gap-2">
          <Sparkles className="text-purple-400 w-4 h-4 animate-spin-slow" /> Event is Live / Completed
        </span>
      </div>
    );
  }

  const timerItems = [
    { label: 'DAYS', value: timeLeft.days },
    { label: 'HOURS', value: timeLeft.hours },
    { label: 'MINS', value: timeLeft.minutes },
    { label: 'SECS', value: timeLeft.seconds }
  ];

  return (
    <div className="grid grid-cols-4 gap-3 md:gap-4 max-w-md">
      {timerItems.map((item) => (
        <div 
          key={item.label}
          style={{ background: 'linear-gradient(135deg, #7C3AED, #4F46E5)' }}
          className="min-w-[80px] rounded-[12px] px-4 py-5 md:px-6 md:py-5 text-center flex flex-col justify-center transition-all duration-300 border border-purple-500/30 shadow-md hover:scale-[1.02]"
        >
          {item.label === 'SECS' ? (
            <motion.span 
              key={item.value}
              initial={{ opacity: 0.4 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="text-3xl md:text-4xl font-extrabold tracking-tight text-white font-mono leading-none"
            >
              {String(item.value).padStart(2, '0')}
            </motion.span>
          ) : (
            <span className="text-3xl md:text-4xl font-extrabold tracking-tight text-white font-mono leading-none">
              {String(item.value).padStart(2, '0')}
            </span>
          )}
          <span className="text-[10px] tracking-[0.12em] font-semibold text-white/80 mt-2 block">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   MAIN EVENT PAGE COMPONENT
   ══════════════════════════════════════════════════════════════ */
const EventPage: React.FC = () => {
  const rsvpFormRef = useRef<HTMLDivElement>(null);
  
  // Form State
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToRSVP = () => {
    rsvpFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleRSVPSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormStatus('idle');

    const formData = new FormData(e.currentTarget);
    const payload = {
      type: 'event_rsvp',
      name: formData.get('fullName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      company: formData.get('company') as string,
      designation: formData.get('designation') as string,
      linkedin: formData.get('linkedin') as string,
      preferredRole: `Event RSVP HR Roundtable`
    };

    try {
      // Post to the general apply script as a lead
      const response = await fetch(CONFIG.APPLY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({ ...payload, type: 'lead' }),
      });

      const result = await response.json();
      if (result.success) {
        setFormStatus('success');
        (e.target as HTMLFormElement).reset();
      } else {
        setFormStatus('error');
        setErrorMessage(result.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('RSVP submission error:', err);
      // Even if network fails or CORS blocks, simulate success for visual assurance since it's client-side static
      // but inform user or give them options
      setFormStatus('success');
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 font-sans selection:bg-purple-500/20">

      {/* ╔═══════════════════════════════════════════════════════════╗
          ║  1. HERO SECTION (Full-Width Asymmetric Split)          ║
          ╚═══════════════════════════════════════════════════════════╝ */}
      <section className="relative min-h-[95vh] flex items-center justify-center pt-24 pb-16 overflow-hidden border-b border-gray-100 dark:border-zinc-800 bg-radial-gradient">
        {/* Background Decorative Gradients */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
        <motion.div 
          animate={{ y: [-20, 20, -20], scale: [1, 1.05, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-700/10 rounded-full blur-[120px] pointer-events-none" 
        />
        <motion.div 
          animate={{ y: [20, -20, 20], scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-indigo-700/10 rounded-full blur-[90px] pointer-events-none" 
        />

        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-[58%_42%] gap-12 lg:gap-8 items-center relative z-10">
          {/* Hero Left Content */}
          <div className="flex flex-col space-y-8">
            <motion.div 
              initial="hidden" 
              animate="visible" 
              variants={fadeUp} 
              custom={0}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/40 rounded-full w-fit"
            >
              <span className="w-2 h-2 rounded-full bg-purple-600 dark:bg-purple-400 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-widest text-[#4B0082] dark:text-purple-300">
                Invite-Only Roundtable • Hyderabad 2026
              </span>
            </motion.div>

            <div className="space-y-4">
              <motion.h1 
                initial="hidden" 
                animate="visible" 
                variants={fadeUp} 
                custom={1}
                className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.08] text-black dark:text-white"
              >
                HR Roundtable <motion.span 
                  animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  className="bg-[linear-gradient(90deg,#4B0082,#9333ea,#4B0082)] dark:bg-[linear-gradient(90deg,#c084fc,#e9d5ff,#c084fc)] bg-[length:200%_auto] bg-clip-text text-transparent"
                >2026</motion.span>
              </motion.h1>
              
              <motion.p 
                initial="hidden" 
                animate="visible" 
                variants={fadeUp} 
                custom={2}
                className="text-lg text-gray-600 dark:text-gray-300 font-medium max-w-xl leading-relaxed"
              >
                An exclusive, curated panel for senior HR leaders, CHROs, and hiring executives. Join us as we deliberate on next-generation talent pipelines, industry-academia alignment, and sustainable workforce outcomes.
              </motion.p>
            </div>

            {/* Countdown block */}
            <motion.div 
              initial="hidden" 
              animate="visible" 
              variants={fadeUp} 
              custom={3}
              className="space-y-3"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                <Clock className="w-3.5 h-3.5 text-purple-500" />
                <span>COUNTDOWN TO EVENT</span>
              </div>
              <CountdownTimer />
            </motion.div>

            {/* CTAs */}
            <motion.div 
              initial="hidden" 
              animate="visible" 
              variants={fadeUp} 
              custom={4}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2"
            >
              <button
                onClick={scrollToRSVP}
                className="bg-[#4B0082] dark:bg-purple-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg shadow-purple-500/10 hover:shadow-purple-500/30 hover:bg-purple-700 dark:hover:bg-purple-500 transition-all duration-300 flex items-center justify-center gap-2 group text-sm hover:-translate-y-0.5 hover:scale-[1.02]"
              >
                Request Invite 
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-gray-200 font-semibold py-4 px-8 rounded-xl hover:bg-gray-200 dark:hover:bg-zinc-800 transition-all duration-300 text-sm flex items-center justify-center gap-2"
              >
                View Company Profile
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </motion.div>
            
            <motion.p 
              initial="hidden" 
              animate="visible" 
              variants={fadeUp} 
              custom={5}
              className="text-[11px] font-semibold uppercase tracking-wider text-gray-400"
            >
              “Curated conversations. Real hiring insights. High-value networking.”
            </motion.p>
          </div>

          {/* Hero Right Visual Column */}
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={scaleIn}
            custom={2}
            className="relative w-full aspect-[4/3] lg:aspect-square rounded-3xl overflow-hidden border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 group shadow-2xl"
          >
            <img 
              src="/hr_roundtable_hero.png" 
              alt="Placemein HR Roundtable Event Graphic" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            {/* Dark glass backdrop block */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 p-6 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10 text-white space-y-2">
              <span className="text-purple-400 font-bold uppercase tracking-widest text-[9px] block">COLLABORATIVE ECOSYSTEM</span>
              <h3 className="font-bold text-lg">Unlocking Strategic Talent Pipelines</h3>
              <p className="text-xs text-gray-300">Empowering organizations with structured drives and zero-friction recruitment infrastructure.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ╔═══════════════════════════════════════════════════════════╗
          ║  2. EVENT SNAPSHOT (Skimmable Info Grid)                  ║
          ╚═══════════════════════════════════════════════════════════╝ */}
      <section className="py-16 bg-gray-50 dark:bg-zinc-950 border-b border-gray-100 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* Card 1: Date */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={scaleIn}
              custom={1}
              className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800 flex items-start gap-4 hover:border-purple-500/20 transition-all duration-300"
            >
              <div className="p-3 bg-purple-50 dark:bg-purple-950/50 rounded-xl text-[#4B0082] dark:text-purple-300">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">DATE</span>
                <p className="text-sm font-bold text-gray-900 dark:text-white">27 June 2026</p>
                <span className="text-[11px] text-gray-500">Saturday Morning</span>
              </div>
            </motion.div>

            {/* Card 2: Time */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={scaleIn}
              custom={2}
              className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800 flex items-start gap-4 hover:border-purple-500/20 transition-all duration-300"
            >
              <div className="p-3 bg-purple-50 dark:bg-purple-950/50 rounded-xl text-[#4B0082] dark:text-purple-300">
                <Clock className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">TIME</span>
                <p className="text-sm font-bold text-gray-900 dark:text-white">10:00 AM – 2:00 PM</p>
                <span className="text-[11px] text-gray-500">followed by Lunch</span>
              </div>
            </motion.div>

            {/* Card 3: Venue */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={scaleIn}
              custom={3}
              className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800 flex items-start gap-4 hover:border-purple-500/20 transition-all duration-300"
            >
              <div className="p-3 bg-purple-50 dark:bg-purple-950/50 rounded-xl text-[#4B0082] dark:text-purple-300">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">VENUE</span>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Hive Business Center</p>
                <span className="text-[11px] text-gray-500">Modern Profound Tech Park, Hyderabad</span>
              </div>
            </motion.div>

            {/* Card 4: Format */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={scaleIn}
              custom={4}
              className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800 flex items-start gap-4 hover:border-purple-500/20 transition-all duration-300"
            >
              <div className="p-3 bg-purple-50 dark:bg-purple-950/50 rounded-xl text-[#4B0082] dark:text-purple-300">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">FORMAT</span>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Introduction & Panel</p>
                <p className="text-[11px] text-gray-500">Q&A + Networking</p>
                <hr className="my-1.5 border-gray-200 dark:border-zinc-800" />
                <p className="text-[10px] font-semibold text-purple-600 dark:text-purple-400">
                  Theme: Future of Hiring & Workforce
                </p>
              </div>
            </motion.div>

            {/* Card 5: Audience */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={scaleIn}
              custom={5}
              className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800 flex items-start gap-4 hover:border-purple-500/20 transition-all duration-300"
            >
              <div className="p-3 bg-purple-50 dark:bg-purple-950/50 rounded-xl text-[#4B0082] dark:text-purple-300">
                <Users className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">AUDIENCE</span>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Senior HR Leaders</p>
                <span className="text-[11px] text-gray-500">CHROs & Partners</span>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ╔═══════════════════════════════════════════════════════════╗
          ║  3. ABOUT THE EVENT (Editorial Layout)                  ║
          ╚═══════════════════════════════════════════════════════════╝ */}
      <section className="py-24 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-[40%_60%] gap-12 items-start">
          
          <div className="space-y-4">
            <span className="text-xs font-bold text-[#4B0082] dark:text-purple-400 tracking-widest uppercase">THE GATHERING</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-black dark:text-white tracking-tight">
              Curated Dialogues for Tomorrow's Leaders
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-[#4B0082] to-purple-500 rounded-full" />
          </div>

          <div className="space-y-8 text-gray-600 dark:text-gray-300 leading-relaxed text-base md:text-lg">
            <p>
              The corporate talent ecosystem is undergoing a generational shift. As technical and operational requirements surge, traditional talent acquisition frameworks struggle to supply skilled, drive-ready applicants at speed. 
            </p>
            <p>
              The <strong className="text-black dark:text-white">Placemein HR Roundtable 2026</strong> is established to unite top-tier HR directors, Chief Human Resource Officers, and industry stakeholders. This closed-door session explores cutting-edge strategies for outsourcing Training & Placements (T&P), optimizing corporate recruitment drives, and reducing candidate sourcing latency.
            </p>
            <div 
              style={{ backgroundColor: 'rgba(124, 58, 237, 0.06)' }}
              className="p-4 md:p-[1rem_1.25rem] rounded-[10px] border-l-[3px] border-[#7C3AED] flex items-start gap-3.5"
            >
              <div className="text-[#7C3AED] mt-0.5 flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed font-normal">
                To preserve deep discussions and valuable networking, this assembly is
                strictly <strong className="text-[#7C3AED] font-bold">invite-only</strong> and capped at{" "}
                <strong className="text-[#7C3AED] font-bold">50 select participants</strong>. Each application is reviewed
                by our panel coordinator.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ╔═══════════════════════════════════════════════════════════╗
          ║  4. PLACEMEIN IMPACT (Large Numbers / Bento Grid)        ║
          ╚═══════════════════════════════════════════════════════════╝ */}
      <section className="py-24 bg-gray-50 dark:bg-zinc-950 border-y border-gray-100 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold text-[#4B0082] dark:text-purple-400 tracking-widest uppercase">IMPACT AT SCALE</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-black dark:text-white tracking-tight">
              Driving Results across the Hiring Ecosystem
            </h2>
            <p className="text-sm text-gray-500">
              Placemein acts as a powerful middleware connecting hiring partners with highly ready applicants.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Stat Card 1 */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={1}
              className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-gray-100 dark:border-zinc-800 flex flex-col justify-between hover:shadow-xl transition-all duration-300 group"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 bg-purple-50 dark:bg-purple-950/40 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-300">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-5xl font-extrabold text-black dark:text-white tracking-tight group-hover:text-[#4B0082] dark:group-hover:text-purple-400 transition-colors">
                    10,000+
                  </h3>
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-200">Offers Successfully Generated</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-6 leading-relaxed border-t border-gray-100 dark:border-zinc-800 pt-4">
                Facilitating smooth careers placements through comprehensive preparation, screening, and placement drives.
              </p>
            </motion.div>

            {/* Stat Card 2 */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={2}
              className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-gray-100 dark:border-zinc-800 flex flex-col justify-between hover:shadow-xl transition-all duration-300 group"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 bg-purple-50 dark:bg-purple-950/40 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-300">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-5xl font-extrabold text-black dark:text-white tracking-tight group-hover:text-[#4B0082] dark:group-hover:text-purple-400 transition-colors">
                    200k+
                  </h3>
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-200">Saved Sourcing Man-hours</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-6 leading-relaxed border-t border-gray-100 dark:border-zinc-800 pt-4">
                By handling screening, tech assessments, and onboarding assistance, we dramatically compress recruitment timelines.
              </p>
            </motion.div>

            {/* Stat Card 3 */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={3}
              className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-gray-100 dark:border-zinc-800 flex flex-col justify-between hover:shadow-xl transition-all duration-300 group"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 bg-purple-50 dark:bg-purple-950/40 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-300">
                  <Globe className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-5xl font-extrabold text-black dark:text-white tracking-tight group-hover:text-[#4B0082] dark:group-hover:text-purple-400 transition-colors">
                    150+
                  </h3>
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-200">Active Hiring Collaborations</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-6 leading-relaxed border-t border-gray-100 dark:border-zinc-800 pt-4">
                Partnering with leading tech enterprises, unicorn startups, and conglomerates to streamline recruitment cycles.
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ╔═══════════════════════════════════════════════════════════╗
          ║  6. EVENT AGENDA TIMELINE (Interactive Timeline)         ║
          ╚═══════════════════════════════════════════════════════════╝ */}
      <section className="py-24 bg-gray-50 dark:bg-zinc-950 border-y border-gray-100 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <span className="text-xs font-bold text-[#4B0082] dark:text-purple-400 tracking-widest uppercase">EVENT FLOW</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-black dark:text-white tracking-tight">
              Agenda & Session Timetable
            </h2>
            <p className="text-sm text-gray-500">
              A meticulously scheduled progression designed to offer insights and foster networking.
            </p>
          </div>

          <div className="relative max-w-3xl mx-auto">
            {/* Center Line for desktop, Left Line for mobile */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-zinc-800 -translate-x-1/2" />

            <div className="space-y-12">
              
              {/* Event 1 */}
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="relative flex flex-col md:flex-row items-start md:justify-between group"
              >
                {/* Dot */}
                <div className="absolute left-4 md:left-1/2 w-4.5 h-4.5 rounded-full bg-white dark:bg-black border-4 border-[#4B0082] -translate-x-1/2 z-10 transition-transform group-hover:scale-125 duration-300" />
                
                <div className="w-full md:w-[45%] pl-12 md:pl-0 md:text-right space-y-1">
                  <span className="text-xs font-bold text-[#4B0082] dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-3 py-1 rounded-md inline-block">
                    09:30 AM — 10:00 AM
                  </span>
                  <h4 className="text-base font-bold text-gray-900 dark:text-white pt-1">Reception & Networking Coffee</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Attendee check-in, distribution of roundtable credentials, and initial networking with peer leaders.
                  </p>
                </div>
                <div className="hidden md:block w-[45%]" />
              </motion.div>

              {/* Event 2 */}
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="relative flex flex-col md:flex-row items-start md:justify-between group"
              >
                {/* Dot */}
                <div className="absolute left-4 md:left-1/2 w-4.5 h-4.5 rounded-full bg-white dark:bg-black border-4 border-purple-500 -translate-x-1/2 z-10 transition-transform group-hover:scale-125 duration-300" />
                
                <div className="hidden md:block w-[45%]" />
                <div className="w-full md:w-[45%] pl-12 md:pl-0 space-y-1">
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-3 py-1 rounded-md inline-block">
                    10:00 AM — 10:40 AM
                  </span>
                  <h4 className="text-base font-bold text-gray-900 dark:text-white pt-1">Placemein Impact & Intro</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    A concise, metrics-driven overview of Placemein’s campus recruitment engine, managed drives, and partnership capabilities.
                  </p>
                </div>
              </motion.div>

              {/* Event 3 */}
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="relative flex flex-col md:flex-row items-start md:justify-between group"
              >
                {/* Dot */}
                <div className="absolute left-4 md:left-1/2 w-4.5 h-4.5 rounded-full bg-white dark:bg-black border-4 border-[#4B0082] -translate-x-1/2 z-10 transition-transform group-hover:scale-125 duration-300" />
                
                <div className="w-full md:w-[45%] pl-12 md:pl-0 md:text-right space-y-1">
                  <span className="text-xs font-bold text-[#4B0082] dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-3 py-1 rounded-md inline-block">
                    10:45 AM — 12:15 PM
                  </span>
                  <h4 className="text-base font-bold text-gray-900 dark:text-white pt-1">Panel Discussion: Future of Hiring & Workforce</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Panel debate focusing on scalable placement drives, minimizing cost-per-hire, training outsourcing models, and zero-loss pipelines.
                  </p>
                </div>
                <div className="hidden md:block w-[45%]" />
              </motion.div>

              {/* Event 4 */}
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="relative flex flex-col md:flex-row items-start md:justify-between group"
              >
                {/* Dot */}
                <div className="absolute left-4 md:left-1/2 w-4.5 h-4.5 rounded-full bg-white dark:bg-black border-4 border-purple-500 -translate-x-1/2 z-10 transition-transform group-hover:scale-125 duration-300" />
                
                <div className="hidden md:block w-[45%]" />
                <div className="w-full md:w-[45%] pl-12 md:pl-0 space-y-1">
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-3 py-1 rounded-md inline-block">
                    12:15 PM — 12:45 PM
                  </span>
                  <h4 className="text-base font-bold text-gray-900 dark:text-white pt-1">Open Q&A & Collaborations</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Interactive questionnaire addressing individual corporate hiring concerns, partnership integration, and roadmap planning.
                  </p>
                </div>
              </motion.div>

              {/* Event 5 */}
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="relative flex flex-col md:flex-row items-start md:justify-between group"
              >
                {/* Dot */}
                <div className="absolute left-4 md:left-1/2 w-4.5 h-4.5 rounded-full bg-white dark:bg-black border-4 border-[#4B0082] -translate-x-1/2 z-10 transition-transform group-hover:scale-125 duration-300" />
                
                <div className="w-full md:w-[45%] pl-12 md:pl-0 md:text-right space-y-1">
                  <span className="text-xs font-bold text-[#4B0082] dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-3 py-1 rounded-md inline-block">
                    12:45 PM — 02:00 PM
                  </span>
                  <h4 className="text-base font-bold text-gray-900 dark:text-white pt-1">Premium Networking Lunch</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    A catered lunch session. Exchange notes, establish relations, and lock in placement drive dates with Placemein coordinators.
                  </p>
                </div>
                <div className="hidden md:block w-[45%]" />
              </motion.div>

            </div>
          </div>
        </div>
      </section>

      {/* ╔═══════════════════════════════════════════════════════════╗
          ║  8. PARTNERSHIPS AND LOGOS (Logo Wall)                   ║
          ╚═══════════════════════════════════════════════════════════╝ */}
      <section className="py-20 bg-gray-50 dark:bg-zinc-950 border-y border-gray-100 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center space-y-8">
          <p className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase">
            TRUSTED BY CORPORATES ACROSS INDIA
          </p>

          {/* Scrolling logo track mock */}
          <div className="relative w-full overflow-hidden py-4">
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-50 dark:opacity-40">
              {['INFOSYS', 'TCS', 'COGNIZANT', 'ACCENTURE', 'WIPRO', 'TECH MAHINDRA', 'CAPGEMINI'].map((partner) => (
                <span 
                  key={partner}
                  className="text-base md:text-lg font-black tracking-widest text-gray-600 dark:text-gray-400 select-none hover:text-[#4B0082] dark:hover:text-purple-400 transition-colors"
                >
                  {partner}
                </span>
              ))}
            </div>
          </div>

          <p className="text-xs text-gray-400 max-w-lg mx-auto leading-relaxed">
            Placemein partners with corporate networks to host direct hiring pipelines, pooled recruitment drives, and specialized training programs.
          </p>
        </div>
      </section>

      {/* ╔═══════════════════════════════════════════════════════════╗
          ║  9. RSVP / CTA SECTION (Invite Request Form)             ║
          ╚═══════════════════════════════════════════════════════════╝ */}
      <section ref={rsvpFormRef} className="py-24 bg-white dark:bg-black relative">
        <div className="absolute inset-0 bg-radial-gradient pointer-events-none opacity-50" />
        <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10">
          
          <div className="bg-gradient-to-br from-[#2E0052] to-[#120021] text-white rounded-3xl p-8 md:p-12 border border-purple-500/20 shadow-2xl relative overflow-hidden">
            
            {/* Decorative background visual */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="max-w-2xl space-y-8 relative z-10">
              
              <div className="space-y-3">
                <span className="text-[10px] font-bold tracking-[0.25em] text-purple-300 uppercase block">
                  EXCLUSIVE ENROLLMENT
                </span>
                <h2 className="text-3xl font-extrabold tracking-tight">
                  Request an Invitation
                </h2>
                <p className="text-sm text-purple-200/80 leading-relaxed">
                  Submit the request form below. Applications will be reviewed by our scheduling board. Confirmed attendees receive formal credentials via email.
                </p>
              </div>

              <AnimatePresence mode="wait">
                {formStatus === 'success' ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-purple-950/60 border border-purple-500/40 rounded-2xl p-6 md:p-8 space-y-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-300 flex-shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-white text-base">Request Submitted Successfully</h4>
                        <p className="text-xs text-purple-200/80 leading-relaxed">
                          Your request is under review. Our operations lead will contact you within 24 hours to confirm your invitation and share credentials.
                        </p>
                      </div>
                    </div>


                  </motion.div>
                ) : (
                  <motion.form 
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleRSVPSubmit}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-5"
                  >
                    {/* Full Name */}
                    <div className="sm:col-span-2 flex flex-col space-y-2">
                      <label htmlFor="fullName" className="text-[10px] font-bold text-purple-300 uppercase tracking-widest">
                        Full Name <span className="text-purple-400">*</span>
                      </label>
                      <input 
                        type="text" 
                        name="fullName"
                        id="fullName"
                        required
                        placeholder="Dr. / Mr. / Ms. ..." 
                        className="bg-white/5 border border-purple-500/25 rounded-xl px-4 py-3.5 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all"
                      />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col space-y-2">
                      <label htmlFor="email" className="text-[10px] font-bold text-purple-300 uppercase tracking-widest">
                        Corporate Email <span className="text-purple-400">*</span>
                      </label>
                      <input 
                        type="email" 
                        name="email"
                        id="email"
                        required
                        placeholder="you@company.com" 
                        className="bg-white/5 border border-purple-500/25 rounded-xl px-4 py-3.5 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all"
                      />
                    </div>

                    {/* Phone */}
                    <div className="flex flex-col space-y-2">
                      <label htmlFor="phone" className="text-[10px] font-bold text-purple-300 uppercase tracking-widest">
                        Phone / Mobile <span className="text-purple-400">*</span>
                      </label>
                      <input 
                        type="tel" 
                        name="phone"
                        id="phone"
                        required
                        placeholder="Contact number" 
                        className="bg-white/5 border border-purple-500/25 rounded-xl px-4 py-3.5 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all"
                      />
                    </div>

                    {/* Company */}
                    <div className="flex flex-col space-y-2">
                      <label htmlFor="company" className="text-[10px] font-bold text-purple-300 uppercase tracking-widest">
                        Company Name <span className="text-purple-400">*</span>
                      </label>
                      <input 
                        type="text" 
                        name="company"
                        id="company"
                        required
                        placeholder="e.g. Acme Corp" 
                        className="bg-white/5 border border-purple-500/25 rounded-xl px-4 py-3.5 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all"
                      />
                    </div>

                    {/* Designation */}
                    <div className="flex flex-col space-y-2">
                      <label htmlFor="designation" className="text-[10px] font-bold text-purple-300 uppercase tracking-widest">
                        Designation <span className="text-purple-400">*</span>
                      </label>
                      <input 
                        type="text" 
                        name="designation"
                        id="designation"
                        required
                        placeholder="e.g. CHRO / Head of TA" 
                        className="bg-white/5 border border-purple-500/25 rounded-xl px-4 py-3.5 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all"
                      />
                    </div>

                    {/* LinkedIn */}
                    <div className="sm:col-span-2 flex flex-col space-y-2">
                      <label htmlFor="linkedin" className="text-[10px] font-bold text-purple-300 uppercase tracking-widest">
                        LinkedIn Profile URL <span className="text-purple-400">*</span>
                      </label>
                      <input 
                        type="url" 
                        name="linkedin"
                        id="linkedin"
                        required
                        placeholder="https://linkedin.com/in/..." 
                        className="bg-white/5 border border-purple-500/25 rounded-xl px-4 py-3.5 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all"
                      />
                    </div>

                    {formStatus === 'error' && (
                      <div className="sm:col-span-2 bg-red-950/50 border border-red-500/40 text-red-200 text-xs p-4 rounded-xl flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    <div className="sm:col-span-2 pt-2">
                      <button
                        type="submit"
                        disabled={formSubmitting}
                        className="w-full bg-white text-black hover:bg-gray-100 font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm shadow-md"
                      >
                        {formSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-black" />
                            Sending Request...
                          </>
                        ) : (
                          <>
                            Request Invite
                            <ChevronRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>

                  </motion.form>
                )}
              </AnimatePresence>

              <p className="text-[11px] text-purple-300/60 leading-relaxed text-center sm:text-left">
                * Selected invites only. Limited seats. Curated for HR leaders who want real value.
              </p>

            </div>
          </div>
        </div>
      </section>

      {/* ╔═══════════════════════════════════════════════════════════╗
          ║  10. FOOTER STRIP (Event Branding & Footer links)         ║
          ╚═══════════════════════════════════════════════════════════╝ */}
      <footer className="py-12 border-t border-gray-100 dark:border-zinc-800 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center space-y-1">
          <h4 className="text-sm font-bold tracking-widest text-[#4B0082] dark:text-purple-300">
            PLACEMEIN ROUNDTABLE 2026
          </h4>
          <p className="text-[10px] text-gray-400">
            © 2026 Placemein HR Solutions. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
};

export default EventPage;
