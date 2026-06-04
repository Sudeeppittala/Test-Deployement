import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, type Variants } from 'framer-motion';
import { CheckCircle, AlertCircle, Loader2, Zap, TrendingUp, Send, ChevronDown, Users, Clock, Award, Briefcase, ArrowRight, Star, CheckCircle2, GraduationCap, ToggleLeft, ToggleRight, Linkedin, X } from 'lucide-react';
import { fetchOpenJobs, submitLead } from '../services/googleSheets';
import { Job } from '../types';
import type { LeadFormData } from '../types';

/* ══════════════════════════════════════════════════════════════
   Validated Field Helper — shows inline error / success state
   ══════════════════════════════════════════════════════════════ */
type FieldState = 'idle' | 'valid' | 'error';

const ValidatedField: React.FC<{
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  min?: string;
  max?: string;
  step?: string;
  className?: string;
  errorMsg?: string;
  validate?: (val: string) => boolean;
  hint?: string;
}> = ({ name, label, type = 'text', placeholder, required = false, min, max, step, className = '', errorMsg, validate, hint }) => {
  const [state, setState] = useState<FieldState>('idle');
  const [msg, setMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!val) { setState('idle'); setMsg(''); return; }
    if (validate) {
      const ok = validate(val);
      setState(ok ? 'valid' : 'error');
      setMsg(ok ? '' : (errorMsg || 'Invalid value'));
    } else {
      setState('valid');
    }
  };

  const borderClass =
    state === 'valid' ? 'border-green-400 focus:border-green-500 focus:ring-green-400/30' :
      state === 'error' ? 'border-red-400  focus:border-red-500  focus:ring-red-400/30' :
        'border-gray-200 dark:border-gray-700 focus:border-[#4B0082] focus:ring-[#4B0082]/30';

  return (
    <div className={className}>
      <label htmlFor={name} className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        step={step}
        onChange={handleChange}
        className={`bg-gray-50 dark:bg-gray-800 border rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all duration-150 w-full ${borderClass}`}
      />
      {state === 'error' && msg && (
        <p className="text-red-500 text-[10px] mt-1 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />{msg}
        </p>
      )}
      {hint && state === 'idle' && <p className="text-[10px] text-gray-400 mt-1">{hint}</p>}
    </div>
  );
};

/* Bento Field — plain (no validation) */
const BentoField: React.FC<{
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  min?: string;
  max?: string;
  step?: string;
  className?: string;
}> = ({ name, label, type = 'text', placeholder, required = false, min, max, step, className = '' }) => (
  <div className={className}>
    <label htmlFor={name} className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
      {label}{required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      placeholder={placeholder}
      required={required}
      min={min}
      max={max}
      step={step}
      className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4B0082]/30 focus:border-[#4B0082] transition-all duration-150 w-full"
    />
  </div>
);

/* ══════════════════════════════════════════════════════════════
   Framer Motion Helpers
   ══════════════════════════════════════════════════════════════ */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

/* ══════════════════════════════════════════════════════════════
   CAREERS PAGE — Main Component
   ══════════════════════════════════════════════════════════════ */
const CareersPage: React.FC = () => {
  /* ─── State ─── */
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadStatus, setLeadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submittedLeadId, setSubmittedLeadId] = useState<string>('');
  const [gradMode, setGradMode] = useState<'percentage' | 'cgpa'>('percentage');
  const [selectedJobTitle, setSelectedJobTitle] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  /* ─── Validators ─── */
  const isPhone = (v: string) => /^[+]?[0-9]{10,13}$/.test(v.replace(/\s/g, ''));
  const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const isPercent = (v: string) => { const n = parseFloat(v); return !isNaN(n) && n >= 0 && n <= 100; };
  const isCGPA = (v: string) => { const n = parseFloat(v); return !isNaN(n) && n >= 0 && n <= 10; };
  const isYear = (v: string) => { const n = parseInt(v); return !isNaN(n) && n >= 2000 && n <= 2035; };
  const isLinkedin = (v: string) => v === '' || /^https?:\/\/(www\.)?linkedin\.com\/in\//.test(v);
  const isName = (v: string) => v.trim().length >= 2;

  /* ─── Auto Fill ─── */
  const handleAutoFill = useCallback(() => {
    if (!formRef.current) return;
    const form = formRef.current;

    const preferredRoleSelect = form.querySelector('#preferredRole') as HTMLSelectElement;
    if (preferredRoleSelect && preferredRoleSelect.options.length > 1) {
      for (let i = 0; i < preferredRoleSelect.options.length; i++) {
        if (preferredRoleSelect.options[i].value !== '') { 
          preferredRoleSelect.selectedIndex = i; 
          setSelectedJobTitle(preferredRoleSelect.options[i].value);
          break; 
        }
      }
    }

    const setVal = (name: string, val: string) => {
      const el = form.querySelector(`[name="${name}"]`) as HTMLInputElement | HTMLSelectElement;
      if (el) {
        el.value = val;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }
    };

    setGradMode('percentage');
    setVal('name', 'Priya Sharma');
    setVal('email', 'priya.sharma@example.com');
    setVal('studentPhNumber', '9876543210');
    setVal('parentNumber', '9876543211');
    setVal('location', 'Hyderabad');
    setVal('department', 'CSE');
    setVal('collegeName', 'VNR VJIET, Hyderabad');
    setVal('tpoName', 'Mr. Srinivasa Rao');
    setVal('tpoMobileNumber', '9876543212');
    setVal('qualification', 'B.Tech');
    setVal('highestGraduationPercentage', '82.5');
    setVal('yearOfPassing', '2025');
    setVal('tenthPassoutYear', '2019');
    setVal('tenthStandard', '92');
    setVal('twelfthPassoutYear', '2021');
    setVal('twelfthStandard', '89.5');
    setVal('ArrearsCount', '0');
    setVal('studentSkills', 'React, TypeScript, Excel, Communication, Leadership');
    setVal('linkedinUrl', 'https://www.linkedin.com/in/priya-sharma-demo');
    setVal('gender', 'Female');
    setVal('experienceLevel', 'Fresher');
    setVal('internshipType', 'Hybrid');
    setVal('referralSource', 'College Notice Board');
    setVal('resumeLink', 'https://drive.google.com/file/d/demo/view');
    setVal('whyYou', 'I have built multiple React projects, have strong foundational skills in Frontend engineering, and have worked with Google Sheet integrations before. I would love to contribute to Placemein!');
  }, []);

  /* ─── Effects ─── */
  useEffect(() => {
    window.scrollTo(0, 0);
    loadJobs();
  }, []);

  /* ─── Data Fetching ─── */
  const loadJobs = async () => {
    setLoading(true);
    try {
      const data = await fetchOpenJobs();
      setJobs(data);
    } catch (err) {
      console.error('Failed to load jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  /* ─── Form Submit Handler ─── */
  const handleLeadSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLeadSubmitting(true);

    const formData = new FormData(e.currentTarget);

    const leadData: LeadFormData = {
      type: 'lead',
      preferredRole: formData.get('preferredRole') as string,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      studentPhNumber: formData.get('studentPhNumber') as string,
      parentNumber: formData.get('parentNumber') as string,
      department: formData.get('department') as string,
      collegeName: formData.get('collegeName') as string,
      tpoName: formData.get('tpoName') as string,
      tpoMobileNumber: formData.get('tpoMobileNumber') as string,
      qualification: formData.get('qualification') as string,
      gradMode,
      highestGraduationPercentage: `${formData.get('highestGraduationPercentage')} (${gradMode === 'cgpa' ? 'CGPA' : '%'})`,
      yearOfPassing: formData.get('yearOfPassing') as string,
      tenthPassoutYear: formData.get('tenthPassoutYear') as string,
      tenthStandard: formData.get('tenthStandard') as string,
      twelfthPassoutYear: formData.get('twelfthPassoutYear') as string,
      twelfthStandard: formData.get('twelfthStandard') as string,
      studentSkills: formData.get('studentSkills') as string,
      ArrearsCount: formData.get('ArrearsCount') as string,
      location: formData.get('location') as string,
      linkedinUrl: formData.get('linkedinUrl') as string,
      gender: formData.get('gender') as string,
      experienceLevel: formData.get('experienceLevel') as string,
      internshipType: formData.get('internshipType') as string,
      referralSource: formData.get('referralSource') as string,
      resumeLink: formData.get('resumeLink') as string,
      whyYou: formData.get('whyYou') as string,
    };

    try {
      const result = await submitLead(leadData);
      if (result.success) {
        setLeadStatus('success');
        setSubmittedLeadId(result.leadId || '');
        (e.target as HTMLFormElement).reset();
        setGradMode('percentage');
      } else {
        setLeadStatus('error');
      }
    } catch {
      setLeadStatus('error');
    } finally {
      setLeadSubmitting(false);
      setTimeout(() => setLeadStatus('idle'), 6000);
    }
  };

  /* ═══════════════════════════════════════════════════════════
     JSX
     ═══════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-white dark:bg-black font-sans">

      {/* ╔═══════════════════════════════════════════════════════════╗
          ║  SECTION A — HERO  (Full Asymmetric Split)              ║
          ╚═══════════════════════════════════════════════════════════╝ */}
      <section className="min-h-screen grid grid-cols-1 lg:grid-cols-[55%_45%] gap-0 overflow-hidden">

        {/* ─── LEFT PANEL ─── */}
        <div className="bg-white dark:bg-black px-10 md:px-20 py-24 flex flex-col justify-between">

          {/* TOP BLOCK */}
          <div>
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
              {/* Overline with pulsing dot */}
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
                <span className="text-xs tracking-[0.2em] text-gray-400 font-medium uppercase">
                  ACTIVELY HIRING • 2026
                </span>
              </div>

              {/* H1 — massive, left-aligned */}
              <h1 className="mt-8 text-[clamp(3.5rem,8vw,6rem)] font-black leading-[1.0] tracking-tight">
                <span className="block text-gray-900 dark:text-white">Your Next</span>
                <span className="block text-gray-900 dark:text-white">Role Starts</span>
                <span className="block text-[#4B0082]">Here.</span>
              </h1>
            </motion.div>

            {/* Subtext */}
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1} className="mt-6">
              <span className="bg-[#F3E8FF] dark:bg-purple-950/60 px-2 py-0.5 rounded text-gray-900 dark:text-purple-100 text-lg font-medium inline">
                One application. Multiple opportunities.
              </span>
              <p className="text-gray-500 mt-2 text-lg leading-relaxed max-w-md">
                We match you to the role that fits your skills, not the other way around.
              </p>
            </motion.div>
          </div>

          {/* BOTTOM BLOCK */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2} className="pt-16">
            {/* Stat strip */}
            <div className="flex items-center border-t border-gray-100 dark:border-gray-800 pt-8">
              <div className="flex flex-col">
                <span className="text-4xl font-black text-[#4B0082]">{loading ? '…' : `${jobs.length}+`}</span>
                <span className="text-[10px] tracking-widest text-gray-400 mt-1 uppercase">Open Roles</span>
              </div>
              <div className="w-px h-10 bg-gray-200 dark:bg-gray-700 self-center mx-8" />
              <div className="flex flex-col">
                <span className="text-4xl font-black text-[#4B0082]">5–7</span>
                <span className="text-[10px] tracking-widest text-gray-400 mt-1 uppercase">Day Callback</span>
              </div>
              <div className="w-px h-10 bg-gray-200 dark:bg-gray-700 self-center mx-8" />
              <div className="flex flex-col">
                <span className="text-4xl font-black text-[#4B0082]">1K+</span>
                <span className="text-[10px] tracking-widest text-gray-400 mt-1 uppercase">Students Placed</span>
              </div>
            </div>

            {/* Scroll CTA */}
            <div className="mt-8 flex items-center gap-2 text-gray-400 text-sm">
              <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}>
                <ChevronDown className="w-4 h-4" />
              </motion.div>
              <span>Scroll to apply</span>
            </div>
          </motion.div>
        </div>

        {/* ─── RIGHT PANEL ─── */}
        <div className="bg-[#4B0082] px-8 py-16 flex flex-col justify-center gap-5">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="w-full"
          >
            {/* Overline */}
            <p className="text-purple-300 text-[10px] tracking-[0.25em] uppercase mb-2 font-semibold">
              WHY PLACEMEIN
            </p>

            {/* CARD 1 — Large */}
            <motion.div variants={fadeUp} custom={1} className="bg-white/15 rounded-3xl p-7 mt-4">
              <div className="flex justify-between items-start">
                <Zap className="text-yellow-300 w-5 h-5" />
                <span className="bg-yellow-400/20 text-yellow-300 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide font-semibold">
                  MOST POPULAR
                </span>
              </div>
              <h3 className="text-white font-bold text-xl mt-4">Real Ownership</h3>
              <p className="text-purple-200 text-sm mt-2 leading-relaxed">
                Run drives. Manage accounts. Sit in strategy meetings from day one.
              </p>
              <div className="mt-5 flex gap-2 flex-wrap">
                {['HR', 'Sales', 'Ops', 'Tech'].map(tag => (
                  <span key={tag} className="bg-white/10 text-white/80 text-[11px] px-3 py-1 rounded-full">{tag}</span>
                ))}
              </div>
            </motion.div>

            {/* CARD 2 — Medium */}
            <motion.div variants={fadeUp} custom={2} className="bg-white/10 rounded-2xl p-6 mt-4">
              <div className="flex items-center justify-between">
                <div>
                  <TrendingUp className="text-green-300 w-5 h-5" />
                  <h3 className="text-white font-semibold text-base mt-2">PPO up to 7 LPA</h3>
                  <p className="text-purple-200 text-xs mt-1">For top performers.</p>
                </div>
                <div className="text-right">
                  <span className="text-5xl font-black text-white/20 leading-none">7</span>
                  <p className="text-purple-300 text-xs -mt-1">LPA</p>
                </div>
              </div>
            </motion.div>

            {/* CARD 3 — Small */}
            <motion.div variants={fadeUp} custom={3} className="bg-white/[0.08] rounded-2xl p-5 flex items-center gap-4 mt-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-blue-300" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">Founding Team Access</h3>
                <p className="text-purple-300 text-xs mt-0.5">Direct mentorship. No layers.</p>
              </div>
            </motion.div>

            {/* Trust bar */}
            <div className="mt-auto pt-6 border-t border-white/10 mt-8">
              <div className="flex items-center gap-1 justify-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="text-yellow-400 w-3 h-3 fill-yellow-400" />
                ))}
              </div>
              <p className="text-purple-300 text-xs text-center mt-1">
                Trusted by 40+ colleges across AP & Telangana
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ╔═══════════════════════════════════════════════════════════╗
          ║  SECTION — APPLICATION FORM (Bento Card — UNCHANGED)    ║
          ╚═══════════════════════════════════════════════════════════╝ */}
      <section id="apply-form" className="bg-[#FAFAFA] dark:bg-gray-950 py-20 px-6">

        {/* Section header — left-aligned */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
          className="max-w-5xl mx-auto mb-12"
        >
          <p className="text-xs text-gray-400 tracking-widest uppercase font-medium">01 — APPLICATION</p>
          <h2 className="text-4xl font-black text-gray-900 dark:text-white mt-2">Tell us about yourself.</h2>
          <p className="text-gray-400 text-base mt-2">Fill this out once. We do the matching.</p>
        </motion.div>

        {/* BENTO FORM CARD */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={1}
          className="max-w-5xl mx-auto"
        >
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden">
            <div className="p-8 md:p-12">

              {leadStatus === 'success' ? (
                /* ─── SUCCESS STATE ─── */
                <div className="py-20 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center mx-auto">
                    <CheckCircle className="text-green-500 w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Submission received!</h3>
                  <p className="text-gray-500 text-sm mt-3 max-w-sm mx-auto">
                    We will respond back to you shortly.
                  </p>
                  <button
                    onClick={() => { setLeadStatus('idle'); setSubmittedLeadId(''); }}
                    className="mt-6 px-6 py-2.5 rounded-xl border-2 border-[#4B0082] text-[#4B0082] font-semibold text-sm hover:bg-[#F3E8FF] transition-colors"
                  >
                    Apply for Another Role
                  </button>
                </div>
              ) : (
                /* ─── FORM ─── */
                <div className="relative">
                  <div className="flex justify-end mb-6">
                    <button
                      type="button"
                      onClick={handleAutoFill}
                      className="text-xs text-[#4B0082] dark:text-purple-300 hover:text-white dark:hover:text-black hover:bg-[#4B0082] dark:hover:bg-white border border-[#4B0082]/30 dark:border-white/30 px-4 py-2 rounded-xl font-bold transition-all duration-200 shadow-sm"
                    >
                      🧪 Auto-fill Demo Data
                    </button>
                  </div>
                  <form ref={formRef} onSubmit={handleLeadSubmit}>

                    {/* PREFERRED ROLE — Hero Input (Full Width) */}
                    <div className="flex gap-4 mb-6">
                      <select
                        id="preferredRole"
                        name="preferredRole"
                        required
                        value={selectedJobTitle}
                        onChange={(e) => setSelectedJobTitle(e.target.value)}
                        className="flex-1 border-2 border-[#4B0082] bg-[#F3E8FF] dark:bg-purple-950 text-[#4B0082] dark:text-purple-200 font-semibold text-base py-4 px-5 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#4B0082]/20 transition-all appearance-none cursor-pointer"
                      >
                        {loading ? (
                          <option value="" disabled>Loading roles...</option>
                        ) : jobs.filter(j => j.status?.toLowerCase() === 'open' || !j.status).length === 0 ? (
                          <option value="" disabled>No open roles available currently</option>
                        ) : (
                          <>
                            <option value="" disabled>Select your preferred role →</option>
                            {jobs.filter(j => j.status?.toLowerCase() === 'open' || !j.status).map((job) => (
                              <option key={job.jobId} value={job.jobTitle}>
                                {job.jobTitle}
                              </option>
                            ))}
                          </>
                        )}
                      </select>

                      <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        disabled={!selectedJobTitle || selectedJobTitle === ''}
                        className="whitespace-nowrap px-6 py-4 bg-[#4B0082]/10 hover:bg-[#4B0082]/20 text-[#4B0082] dark:text-purple-300 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 font-bold rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        View JD
                      </button>
                    </div>

                    {/* BENTO GRID — 6-column system */}
                    <div className="grid grid-cols-6 gap-x-4 gap-y-5">

                      {/* ROW 1: Name + Email */}
                      <ValidatedField
                        name="name"
                        label="Full Name"
                        placeholder="e.g. Priya Sharma"
                        required
                        validate={isName}
                        errorMsg="Please enter your full name (min 2 chars)"
                        className="col-span-6 md:col-span-3"
                      />
                      <ValidatedField
                        name="email"
                        label="Email Address"
                        type="email"
                        placeholder="your@email.com"
                        required
                        validate={isEmail}
                        errorMsg="Enter a valid email address"
                        className="col-span-6 md:col-span-3"
                      />

                      {/* ROW 2: Student Phone + Parent Phone + Location */}
                      <ValidatedField
                        name="studentPhNumber"
                        label="Student Phone"
                        type="tel"
                        placeholder="e.g. 9876543210"
                        required
                        validate={isPhone}
                        errorMsg="Enter a valid 10-digit mobile number"
                        className="col-span-6 md:col-span-2"
                      />
                      <ValidatedField
                        name="parentNumber"
                        label="Parent Phone"
                        type="tel"
                        placeholder="e.g. 9876543210"
                        validate={isPhone}
                        errorMsg="Enter a valid 10-digit mobile number"
                        className="col-span-6 md:col-span-2"
                      />
                      <BentoField
                        name="location"
                        label="Current Location"
                        placeholder="e.g. Hyderabad"
                        className="col-span-6 md:col-span-2"
                      />

                      {/* ROW 3: Gender + Experience Level + Internship Preference */}
                      <div className="col-span-6 md:col-span-2">
                        <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Gender</label>
                        <select name="gender" className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4B0082]/30 focus:border-[#4B0082] transition-all w-full">
                          <option value="">Select…</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                      </div>
                      <div className="col-span-6 md:col-span-2">
                        <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Experience Level</label>
                        <select name="experienceLevel" className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4B0082]/30 focus:border-[#4B0082] transition-all w-full">
                          <option value="">Select…</option>
                          <option value="Fresher">Fresher (0 years)</option>
                          <option value="0-1 yr">0–1 Year</option>
                          <option value="1-2 yrs">1–2 Years</option>
                          <option value="2+ yrs">2+ Years</option>
                        </select>
                      </div>
                      <div className="col-span-6 md:col-span-2">
                        <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Work Mode Preference</label>
                        <select name="internshipType" className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4B0082]/30 focus:border-[#4B0082] transition-all w-full">
                          <option value="">Select…</option>
                          <option value="Remote">Remote</option>
                          <option value="In-Office">In-Office</option>
                          <option value="Hybrid">Hybrid</option>
                        </select>
                      </div>

                      {/* ROW 4: Department + College */}
                      <BentoField
                        name="department"
                        label="Department"
                        placeholder="e.g. CSE, MCA, MBA"
                        required
                        className="col-span-6 md:col-span-3"
                      />
                      <BentoField
                        name="collegeName"
                        label="College Name"
                        placeholder="Full college name"
                        required
                        className="col-span-6 md:col-span-3"
                      />

                      {/* ROW 5: TPO Details */}
                      <BentoField
                        name="tpoName"
                        label="Training and Placement Officer Name"
                        placeholder="Enter Training & Placement Officer's full name"
                        required
                        className="col-span-6 md:col-span-3"
                      />
                      <ValidatedField
                        name="tpoMobileNumber"
                        label="Training and Placement Officer Mobile"
                        type="tel"
                        placeholder="Enter Training & Placement Officer's mobile number"
                        required
                        validate={isPhone}
                        errorMsg="Enter a valid 10-digit number"
                        className="col-span-6 md:col-span-3"
                      />

                      {/* ROW 6: Qualification + Grad Score (with CGPA/% toggle) + Year */}
                      <BentoField
                        name="qualification"
                        label="Qualification"
                        placeholder="e.g. B.Tech, MCA, MBA"
                        className="col-span-6 md:col-span-2"
                      />

                      {/* Graduation Score with Toggle */}
                      <div className="col-span-6 md:col-span-2">
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                            Graduation {gradMode === 'percentage' ? 'Percentage' : 'CGPA'}
                          </label>
                          <button
                            type="button"
                            onClick={() => setGradMode(m => m === 'percentage' ? 'cgpa' : 'percentage')}
                            className="flex items-center gap-1.5 text-[10px] font-bold text-[#4B0082] dark:text-purple-300 bg-[#F3E8FF] dark:bg-purple-950/60 px-2.5 py-1 rounded-full hover:bg-[#e9d5ff] transition-colors"
                          >
                            {gradMode === 'percentage'
                              ? <><ToggleLeft className="w-3.5 h-3.5" /> Switch to CGPA</>
                              : <><ToggleRight className="w-3.5 h-3.5" /> Switch to %</>}
                          </button>
                        </div>
                        <div className="relative">
                          <input
                            id="highestGraduationPercentage"
                            name="highestGraduationPercentage"
                            type="number"
                            placeholder={gradMode === 'percentage' ? 'e.g. 72.5' : 'e.g. 7.8'}
                            min="0"
                            max={gradMode === 'percentage' ? '100' : '10'}
                            step="0.01"
                            onChange={(e) => {
                              const v = e.target.value;
                              const ok = gradMode === 'percentage' ? isPercent(v) : isCGPA(v);
                              e.target.setCustomValidity(ok || !v ? '' : `Enter a valid ${gradMode === 'percentage' ? '0–100' : '0–10'} value`);
                            }}
                            className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4B0082]/30 focus:border-[#4B0082] transition-all duration-150 w-full pr-16"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-bold text-[#4B0082]/60 dark:text-purple-400/60 pointer-events-none">
                            {gradMode === 'percentage' ? '%' : '/10'}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1">
                          {gradMode === 'percentage' ? 'Enter your graduation percentage (0–100)' : 'Enter your CGPA on a scale of 10'}
                        </p>
                      </div>

                      <ValidatedField
                        name="yearOfPassing"
                        label="Year of Passing"
                        type="number"
                        placeholder="e.g. 2025"
                        min="2000"
                        max="2035"
                        validate={isYear}
                        errorMsg="Enter a valid year between 2000–2035"
                        className="col-span-6 md:col-span-2"
                      />

                      {/* ROW 7: 10th Year + 10th % + 12th Year + 12th % */}
                      <ValidatedField
                        name="tenthPassoutYear"
                        label="10th Year"
                        type="number"
                        placeholder="e.g. 2018"
                        validate={isYear}
                        errorMsg="Enter a valid year"
                        className="col-span-3 md:col-span-2"
                      />
                      <ValidatedField
                        name="tenthStandard"
                        label="10th %"
                        type="number"
                        placeholder="85"
                        min="0"
                        max="100"
                        step="0.01"
                        validate={isPercent}
                        errorMsg="Enter 0–100"
                        className="col-span-3 md:col-span-1"
                      />
                      <ValidatedField
                        name="twelfthPassoutYear"
                        label="12th Year"
                        type="number"
                        placeholder="e.g. 2020"
                        validate={isYear}
                        errorMsg="Enter a valid year"
                        className="col-span-3 md:col-span-2"
                      />
                      <ValidatedField
                        name="twelfthStandard"
                        label="12th %"
                        type="number"
                        placeholder="78"
                        min="0"
                        max="100"
                        step="0.01"
                        validate={isPercent}
                        errorMsg="Enter 0–100"
                        className="col-span-3 md:col-span-1"
                      />

                      {/* ROW 8: Arrears + Skills */}
                      <BentoField
                        name="ArrearsCount"
                        label="Active Arrears"
                        type="number"
                        placeholder="0"
                        min="0"
                        className="col-span-6 md:col-span-2"
                      />
                      <div className="col-span-6 md:col-span-4">
                        <label htmlFor="studentSkills" className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                          Skills
                        </label>
                        <input
                          id="studentSkills"
                          name="studentSkills"
                          type="text"
                          placeholder="e.g. Python, HTML, CSS, Excel, Communication"
                          className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4B0082]/30 focus:border-[#4B0082] transition-all duration-150 w-full"
                        />
                        <p className="text-[10px] text-gray-400 mt-1">Separate with commas</p>
                      </div>

                      {/* ROW 9: LinkedIn + Resume Link */}
                      <ValidatedField
                        name="linkedinUrl"
                        label="LinkedIn Profile URL"
                        type="url"
                        placeholder="https://www.linkedin.com/in/yourname"
                        validate={isLinkedin}
                        errorMsg="Must be a valid linkedin.com/in/ URL"
                        hint="Optional — helps us learn more about you"
                        className="col-span-6 md:col-span-3"
                      />
                      <ValidatedField
                        name="resumeLink"
                        label="Resume Link"
                        type="url"
                        placeholder="e.g. Google Drive or Portfolio link"
                        required
                        className="col-span-6 md:col-span-3"
                      />

                      {/* ROW 10: Why You + How did you hear about us */}
                      <div className="col-span-6 md:col-span-4">
                        <label htmlFor="whyYou" className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                          Why should we hire you?
                        </label>
                        <textarea
                          id="whyYou"
                          name="whyYou"
                          rows={3}
                          placeholder="Tell us what makes you a great fit..."
                          className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4B0082]/30 focus:border-[#4B0082] transition-all duration-150 w-full"
                        ></textarea>
                      </div>
                      <div className="col-span-6 md:col-span-2">
                        <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">How did you hear about us?</label>
                        <select name="referralSource" className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4B0082]/30 focus:border-[#4B0082] transition-all w-full">
                          <option value="">Select…</option>
                          <option value="College Notice Board">College Notice Board</option>
                          <option value="TPO / Placement Cell">TPO / Placement Cell</option>
                          <option value="Friend / Peer Referral">Friend / Peer Referral</option>
                          <option value="Instagram">Instagram</option>
                          <option value="LinkedIn">LinkedIn</option>
                          <option value="Google Search">Google Search</option>
                          <option value="WhatsApp">WhatsApp</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      {/* ERROR STATE */}
                      {leadStatus === 'error' && (
                        <div className="col-span-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-xl px-4 py-3 text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          Something went wrong. Please try again.
                        </div>
                      )}

                      {/* SUBMIT BUTTON */}
                      <div className="col-span-6 mt-4">
                        <button
                          type="submit"
                          disabled={leadSubmitting}
                          className="w-full py-4 bg-[#4B0082] hover:bg-[#2E0052] text-white font-bold text-base tracking-wide rounded-2xl transition-all duration-200 flex items-center justify-center gap-2.5 disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-[#4B0082]/30"
                        >
                          {leadSubmitting ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              Submit Application
                            </>
                          )}
                        </button>
                      </div>

                    </div>
                  </form>
                </div>
              )}

            </div>
          </div>
        </motion.div>
      </section>

      {/* ╔═══════════════════════════════════════════════════════════╗
          ║  SECTION B — "WHY US" BENTO GRID                        ║
          ╚═══════════════════════════════════════════════════════════╝ */}
      <section className="bg-[#FAFAFA] dark:bg-gray-950 py-24 px-6">
        <div className="max-w-6xl mx-auto">

          {/* Header — split layout */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="flex flex-col md:flex-row md:items-end md:justify-between mb-14"
          >
            <div>
              <p className="text-[10px] tracking-[0.2em] text-gray-400 uppercase font-medium">01 — THE DIFFERENCE</p>
              <h2 className="text-5xl font-black text-gray-900 dark:text-white mt-2">Built different.</h2>
            </div>
            <p className="text-gray-400 text-sm max-w-xs md:text-right mt-4 md:mt-0 hidden md:block">
              Not just another internship. A real career launchpad.
            </p>
          </motion.div>

          {/* BENTO GRID */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

            {/* ══ CARD 1 — Big Purple Statement ══ */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={1}
              className="col-span-12 md:col-span-7 bg-[#4B0082] rounded-3xl p-10 relative overflow-hidden"
            >
              {/* Background decoration */}
              <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />

              <p className="text-purple-300 text-[10px] tracking-widest uppercase font-semibold relative z-10">REAL EXPERIENCE</p>
              <h3 className="text-3xl font-black mt-3 leading-snug relative z-10">
                <span className="text-white">You won't be an intern.</span><br />
                <span className="text-[#C4B5FD]">You'll be a contributor.</span>
              </h3>
              <p className="text-purple-200 text-sm mt-4 leading-relaxed max-w-sm relative z-10">
                From day one, you run campaigns, handle accounts, and sit in on strategy meetings. Flat hierarchy. No bureaucracy.
              </p>
              <div className="mt-8 flex items-center justify-between relative z-10">
                <div className="flex gap-2 flex-wrap">
                  {['HR', 'Sales', 'Operations', 'Tech'].map(tag => (
                    <span key={tag} className="bg-white/10 text-white text-[11px] px-3 py-1.5 rounded-full">{tag}</span>
                  ))}
                </div>
                <ArrowRight className="text-white/40 w-5 h-5" />
              </div>
            </motion.div>

            {/* ══ CARD 2 — PPO Number Card ══ */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={2}
              className="col-span-12 md:col-span-5 bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 flex flex-col justify-between"
            >
              <div className="w-12 h-12 bg-[#F3E8FF] dark:bg-purple-950 rounded-2xl flex items-center justify-center">
                <Award className="text-[#4B0082] dark:text-purple-300 w-6 h-6" />
              </div>
              <div className="mt-6">
                <p className="text-5xl font-black text-gray-900 dark:text-white">₹7 LPA</p>
                <p className="text-[#4B0082] dark:text-purple-400 text-sm font-semibold mt-1">PPO Potential</p>
                <p className="text-gray-400 text-xs mt-2 leading-relaxed">Pre-placement offers for every standout performer.</p>
              </div>
              <div className="flex items-center gap-1.5 mt-6">
                <CheckCircle2 className="text-green-500 w-3.5 h-3.5" />
                <span className="text-gray-400 text-xs">Performance reviewed monthly</span>
              </div>
            </motion.div>

            {/* ══ CARD 3 — Counter Card (Dark) ══ */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={3}
              className="col-span-12 md:col-span-4 bg-gray-900 dark:bg-white rounded-3xl p-8"
            >
              <p className="text-6xl font-black text-white dark:text-gray-900 leading-none">40+</p>
              <p className="text-gray-400 dark:text-gray-600 text-sm mt-2">College Partners</p>
              <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">Across AP & Telangana</p>
              <div className="mt-8 flex gap-2 flex-wrap">
                {['Hyderabad', 'Vijayawada', 'Guntur', '+37 more'].map(chip => (
                  <span key={chip} className="bg-white/10 dark:bg-gray-900/10 text-white/60 dark:text-gray-500 text-[10px] px-2 py-1 rounded-full">{chip}</span>
                ))}
              </div>
            </motion.div>

            {/* ══ CARD 4 — Mentorship Card ══ */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={4}
              className="col-span-12 md:col-span-4 bg-[#F3E8FF] dark:bg-purple-950 rounded-3xl p-8"
            >
              <GraduationCap className="text-[#4B0082] dark:text-purple-300 w-8 h-8" />
              <h4 className="text-[#4B0082] dark:text-purple-200 font-bold text-xl mt-4">Founding Team Mentorship</h4>
              <p className="text-[#4B0082]/60 dark:text-purple-300/60 text-sm mt-3 leading-relaxed">
                Work directly with Samuel and the leadership team. No layers. No HR chain. Real access.
              </p>
              <p className="text-[#4B0082]/40 dark:text-purple-400/40 text-xs mt-6 italic">Weekly 1:1 check-ins</p>
            </motion.div>

            {/* ══ CARD 5 — Speed Card ══ */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={5}
              className="col-span-12 md:col-span-4 bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 flex flex-col"
            >
              <div className="flex justify-between items-start">
                <Clock className="text-gray-300 dark:text-gray-600 w-5 h-5" />
                <span className="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase">FAST TRACK</span>
              </div>
              <p className="text-6xl font-black text-gray-900 dark:text-white mt-4 leading-none">5–7</p>
              <p className="text-gray-400 text-sm mt-1">Day Callback</p>
              <div className="border-t border-gray-100 dark:border-gray-800 my-4" />
              <p className="text-gray-400 text-xs leading-relaxed">Shortlisted candidates hear back fast. No ghosting.</p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ╔═══════════════════════════════════════════════════════════╗
          ║  SECTION C — HOW TO APPLY (Horizontal Bento Timeline)   ║
          ╚═══════════════════════════════════════════════════════════╝ */}
      <section className="bg-white dark:bg-black py-24 px-6">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <p className="text-[10px] tracking-[0.2em] text-gray-400 uppercase font-medium">02 — THE PROCESS</p>
            <h2 className="text-5xl font-black text-gray-900 dark:text-white mt-2">Three steps. That's it.</h2>
          </motion.div>

          {/* Bento Timeline Grid */}
          <div className="grid grid-cols-12 gap-4 mt-14">

            {/* ══ STEP 1 — Large Purple Card ══ */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={1}
              className="col-span-12 md:col-span-5 bg-[#4B0082] rounded-3xl p-10 relative overflow-hidden"
            >
              {/* Step badge */}
              <span className="absolute top-6 right-6 text-8xl font-black text-white/10 leading-none select-none pointer-events-none">01</span>

              <Briefcase className="text-purple-300 w-7 h-7 relative z-10" />
              <h3 className="text-white text-2xl font-bold mt-6 relative z-10">Browse Open Roles</h3>
              <p className="text-purple-200 text-sm mt-3 leading-relaxed relative z-10">
                Filter by department or role type. Find where you naturally fit.
              </p>
              <ArrowRight className="text-white/30 w-5 h-5 mt-8 relative z-10" />
            </motion.div>

            {/* ══ STEP 2 — Medium Card ══ */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={2}
              className="col-span-12 md:col-span-4 bg-gray-50 dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 relative overflow-hidden"
            >
              {/* Step badge */}
              <span className="absolute top-4 right-5 text-7xl font-black text-gray-900/5 dark:text-white/5 leading-none select-none pointer-events-none">02</span>

              <div className="w-12 h-12 bg-[#F3E8FF] dark:bg-purple-950 rounded-2xl flex items-center justify-center relative z-10">
                <Star className="text-[#4B0082] dark:text-purple-300 w-6 h-6" />
              </div>
              <h3 className="text-gray-900 dark:text-white text-xl font-bold mt-5 relative z-10">Submit Your Application</h3>
              <p className="text-gray-400 text-sm mt-2 leading-relaxed relative z-10">
                Fill out the form with your details. Under 3 minutes. One form covers all roles.
              </p>
            </motion.div>

            {/* ══ STEP 3 — Completion Card ══ */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={3}
              className="col-span-12 md:col-span-3 bg-gray-900 dark:bg-white rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between"
            >
              {/* Step badge */}
              <span className="absolute top-4 right-5 text-7xl font-black text-white/5 dark:text-gray-900/5 leading-none select-none pointer-events-none">03</span>

              <div className="relative z-10">
                <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center">
                  <CheckCircle2 className="text-green-400 w-6 h-6" />
                </div>
                <h3 className="text-white dark:text-gray-900 text-xl font-bold mt-5">Get Hired</h3>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-2 leading-relaxed">
                  Shortlisted candidates are contacted within 5–7 working days. No ghosting.
                </p>
              </div>

              <div className="flex items-center gap-2 mt-6 relative z-10">
                <div className="flex -space-x-2">
                  {['S', 'V', 'R'].map(init => (
                    <div key={init} className="w-7 h-7 rounded-full bg-[#4B0082] dark:bg-[#F3E8FF] flex items-center justify-center text-white dark:text-[#4B0082] text-[10px] font-bold border-2 border-gray-900 dark:border-white">
                      {init}
                    </div>
                  ))}
                </div>
                <span className="text-gray-500 dark:text-gray-400 text-[10px]">Team reviews every application</span>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ══ JD MODAL ══ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
          {(() => {
            const selectedJob = jobs.find(j => j.jobTitle === selectedJobTitle);
            if (!selectedJob) return null;
            return (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white dark:bg-gray-900 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
              >
                <div className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center z-10">
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white">{selectedJob.jobTitle}</h2>
                    <p className="text-sm text-gray-500 font-medium mt-1">{selectedJob.department} • {selectedJob.location}</p>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-8">
                  <div className="flex flex-wrap gap-3 mb-8">
                    <span className="px-4 py-2 bg-purple-50 dark:bg-purple-900/30 text-[#4B0082] dark:text-purple-300 rounded-xl text-sm font-semibold flex items-center gap-2">
                      <Briefcase className="w-4 h-4" /> {selectedJob.jobType}
                    </span>
                    {selectedJob.stipend && (
                      <span className="px-4 py-2 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-xl text-sm font-semibold flex items-center gap-2">
                        <Award className="w-4 h-4" /> {selectedJob.stipend}
                      </span>
                    )}
                    {selectedJob.duration && (
                      <span className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-xl text-sm font-semibold flex items-center gap-2">
                        <Clock className="w-4 h-4" /> {selectedJob.duration}
                      </span>
                    )}
                  </div>

                  <div className="prose prose-purple dark:prose-invert max-w-none">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">About the Role</h3>
                    <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed mb-8">{selectedJob.description || 'No description provided.'}</p>
                    
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Requirements</h3>
                    <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed mb-8">{selectedJob.requirements || 'No specific requirements listed.'}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full py-4 bg-[#4B0082] hover:bg-[#2E0052] text-white font-bold text-base tracking-wide rounded-2xl transition-all duration-200 shadow-xl shadow-purple-900/20"
                  >
                    Apply for this Role
                  </button>
                </div>
              </motion.div>
            );
          })()}
        </div>
      )}

    </div>
  );
};

export default CareersPage;