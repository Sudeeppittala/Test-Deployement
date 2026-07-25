import React, { useEffect, useState, useRef } from 'react';
import { motion, type Variants } from 'framer-motion';
import { CheckCircle, AlertCircle, Loader2, Send, ChevronDown, Clock, Award, Briefcase, ArrowRight, Star, CheckCircle2, ToggleLeft, ToggleRight, X } from 'lucide-react';
import { fetchOpenJobs, submitLead } from '../services/googleSheets';
import { Job } from '../types';

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
  defaultValue?: string;
}> = ({ name, label, type = 'text', placeholder, required = false, min, max, step, className = '', errorMsg, validate, hint, defaultValue }) => {
  const [state, setState] = useState<FieldState>('idle');
  const [msg, setMsg] = useState('');
  const [value, setValue] = useState(defaultValue || '');

  useEffect(() => {
    if (defaultValue !== undefined) {
      setValue(defaultValue);
    }
  }, [defaultValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue(val);
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
        value={value}
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
  defaultValue?: string;
}> = ({ name, label, type = 'text', placeholder, required = false, min, max, step, className = '', defaultValue }) => {
  const [value, setValue] = useState(defaultValue || '');

  useEffect(() => {
    if (defaultValue !== undefined) {
      setValue(defaultValue);
    }
  }, [defaultValue]);

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
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4B0082]/30 focus:border-[#4B0082] transition-all duration-150 w-full"
      />
    </div>
  );
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const PREDEFINED_SKILLS = [
  'Python', 'Java', 'JavaScript', 'React.js', 'Node.js', 
  'SQL / Databases', 'C++', 'HTML5 / CSS3', 'Git / GitHub', 
  'AWS Cloud', 'Data Analysis', 'QA & Testing', 
  'Excel / Advanced Excel', 'Figma / UI UX', 'Communication'
];

const PREDEFINED_LEARNING_SKILLS = [
  'AI & Machine Learning', 'Data Science', 'Docker & Containers', 
  'Next.js', 'Kubernetes', 'System Design', 'Power BI / Tableau', 
  'Cybersecurity', 'Cloud Architecture', 'DevOps & CI/CD', 'Tailwind CSS'
];

interface SharedApplicationFormProps {
  customRoles?: string[];
  defaultRole?: string;
  source: string;
  sheetName?: string;
  client?: string;
  formTitle?: string;
  formSubtitle?: string;
  successTitle?: string;
  successSubtitle?: string;
  successDetails?: React.ReactNode;
}

const SharedApplicationForm: React.FC<SharedApplicationFormProps> = ({
  customRoles,
  defaultRole = '',
  source,
  sheetName,
  client,
  formTitle,
  formSubtitle,
  successTitle = 'Submission received!',
  successSubtitle = 'We will respond back to you shortly.',
  successDetails
}) => {
  const [actualSource, setActualSource] = useState(source);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadStatus, setLeadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submittedLeadId, setSubmittedLeadId] = useState<string>('');
  const [gradMode, setGradMode] = useState<'percentage' | 'cgpa'>('percentage');
  const [selectedJobTitle, setSelectedJobTitle] = useState<string>(defaultRole);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /* ─── Categorized Skills State ─── */
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Python', 'JavaScript']);
  const [customSkill, setCustomSkill] = useState<string>('');

  const [learningSkills, setLearningSkills] = useState<string[]>(['AI & Machine Learning', 'System Design']);
  const [customLearningSkill, setCustomLearningSkill] = useState<string>('');

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const addCustomSkill = () => {
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
      setSelectedSkills(prev => [...prev, customSkill.trim()]);
      setCustomSkill('');
    }
  };

  const toggleLearningSkill = (skill: string) => {
    setLearningSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const addCustomLearningSkill = () => {
    if (customLearningSkill.trim() && !learningSkills.includes(customLearningSkill.trim())) {
      setLearningSkills(prev => [...prev, customLearningSkill.trim()]);
      setCustomLearningSkill('');
    }
  };

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const utmSource = params.get('utm_source') || params.get('source');
    if (utmSource) {
      setActualSource(`${source} - ${utmSource}`);
    } else {
      setActualSource(source);
    }
  }, [source]);

  useEffect(() => {
    if (defaultRole) {
      setSelectedJobTitle(defaultRole);
    }
  }, [defaultRole]);

  // Load jobs if customRoles is not provided
  useEffect(() => {
    if (!customRoles) {
      loadJobs();
    }
  }, [customRoles]);

  const loadJobs = async () => {
    setLoadingRoles(true);
    try {
      const data = await fetchOpenJobs();
      setJobs(data);
    } catch (err) {
      console.error('Failed to load jobs:', err);
    } finally {
      setLoadingRoles(false);
    }
  };

  /* ─── Validators ─── */
  const isPhone = (v: string) => /^[+]?[0-9]{10,13}$/.test(v.replace(/\s/g, ''));
  const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const isPercent = (v: string) => { const n = parseFloat(v); return !isNaN(n) && n >= 0 && n <= 100; };
  const isCGPA = (v: string) => { const n = parseFloat(v); return !isNaN(n) && n >= 0 && n <= 10; };
  const isYear = (v: string) => { const n = parseInt(v); return !isNaN(n) && n >= 2000 && n <= 2035; };
  const isLinkedin = (v: string) => v === '' || /^https?:\/\/(www\.)?linkedin\.com\/in\//.test(v);
  const isName = (v: string) => v.trim().length >= 2;

  const handleLeadSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLeadSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const skillsHaveStr = selectedSkills.join(', ') || (formData.get('studentSkills') as string || '');
    const skillsLearnStr = learningSkills.join(', ');
    const combinedSkills = skillsLearnStr 
      ? `${skillsHaveStr} | Learning: ${skillsLearnStr}`
      : skillsHaveStr;

    const leadData: any = {
      type: 'lead',
      source: actualSource,
      sheetName: sheetName || actualSource,
      client: client || actualSource,
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
      studentSkills: combinedSkills,
      skillsLearning: skillsLearnStr,
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
        setSubmittedLeadId(result.leadId || `SG-2026-${Math.floor(1000 + Math.random() * 9000)}`);
        if (formRef.current) {
          formRef.current.reset();
        }
        setGradMode('percentage');
      } else {
        setLeadStatus('error');
      }
    } catch (err) {
      console.error(err);
      setLeadStatus('error');
    } finally {
      setLeadSubmitting(false);
    }
  };

  const selectedJob = jobs.find(j => j.jobTitle === selectedJobTitle);

  return (
    <div className="bg-[#F8FAFC] dark:bg-gray-900 rounded-3xl border border-white/80 dark:border-gray-800 shadow-[16px_16px_36px_rgba(0,0,0,0.06),-16px_-16px_36px_rgba(255,255,255,0.9)] dark:shadow-[16px_16px_36px_rgba(0,0,0,0.5)] overflow-hidden text-left">
      <div className="p-8 md:p-12">
        {leadStatus === 'success' ? (
          /* ─── SUCCESS STATE ─── */
          <div className="py-20 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="text-green-500 w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-6">{successTitle}</h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto">{successSubtitle}</p>
            
            {successDetails ? (
              <div className="mt-4">{successDetails}</div>
            ) : (
              submittedLeadId && (
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl max-w-sm mx-auto border border-gray-100 dark:border-gray-700 flex justify-between items-center text-sm">
                  <span className="text-gray-400 font-bold uppercase text-[10px]">Reference ID</span>
                  <span className="font-extrabold text-[#4B0082] dark:text-purple-400 text-base">{submittedLeadId}</span>
                </div>
              )
            )}

            <div className="pt-4">
              <button
                onClick={() => { setLeadStatus('idle'); setSubmittedLeadId(''); }}
                className="px-6 py-2.5 rounded-xl border-2 border-[#4B0082] text-[#4B0082] dark:border-purple-400 dark:text-purple-400 font-semibold text-sm hover:bg-[#F3E8FF] dark:hover:bg-purple-950/30 transition-colors"
              >
                Submit Another Application
              </button>
            </div>
          </div>
        ) : (
          /* ─── FORM ─── */
          <div className="relative">
            <form ref={formRef} onSubmit={handleLeadSubmit}>
              {formTitle && (
                <div className="mb-8 border-b border-gray-100 dark:border-gray-800 pb-6">
                  <h3 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">
                    {formTitle}
                  </h3>
                  {formSubtitle && (
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 leading-relaxed">
                      {formSubtitle}
                    </p>
                  )}
                </div>
              )}

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
                  <option value="" disabled>Select your preferred role →</option>
                  {customRoles ? (
                    customRoles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))
                  ) : loadingRoles ? (
                    <option value="" disabled>Loading roles...</option>
                  ) : jobs.filter(j => j.status?.toLowerCase() === 'open' || !j.status).length === 0 ? (
                    <option value="" disabled>No open roles available currently</option>
                  ) : (
                    jobs.filter(j => j.status?.toLowerCase() === 'open' || !j.status).map((job) => (
                      <option key={job.jobId} value={job.jobTitle}>
                        {job.jobTitle}
                      </option>
                    ))
                  )}
                </select>

                {!customRoles && (
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    disabled={!selectedJobTitle || selectedJobTitle === ''}
                    className="whitespace-nowrap px-6 py-4 bg-[#4B0082]/10 hover:bg-[#4B0082]/20 text-[#4B0082] dark:text-purple-300 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 font-bold rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    View JD
                  </button>
                )}
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
                  required
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
                  label="Department / Specialization"
                  placeholder="e.g. CSE, Mechanical, MCA"
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
                  placeholder="Enter T&P Officer's full name"
                  required
                  className="col-span-6 md:col-span-3"
                />
                <ValidatedField
                  name="tpoMobileNumber"
                  label="Training and Placement Officer Mobile"
                  type="tel"
                  placeholder="Enter T&P Officer's mobile number"
                  required
                  validate={isPhone}
                  errorMsg="Enter a valid 10-digit number"
                  className="col-span-6 md:col-span-3"
                />

                {/* ROW 6: Qualification + Grad Score (with CGPA/% toggle) + Year */}
                <BentoField
                  name="qualification"
                  label="Qualification"
                  placeholder="e.g. B.Tech, Diploma, ITI"
                  required
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
                        ? 'Switch to CGPA'
                        : 'Switch to %'}
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
                      required
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
                </div>

                <ValidatedField
                  name="yearOfPassing"
                  label="Year of Passing"
                  type="number"
                  placeholder="e.g. 2025"
                  min="2000"
                  max="2035"
                  required
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
                  required
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
                  required
                  validate={isPercent}
                  errorMsg="Enter 0–100"
                  className="col-span-3 md:col-span-1"
                />
                <ValidatedField
                  name="twelfthPassoutYear"
                  label="12th / Diploma Year"
                  type="number"
                  placeholder="e.g. 2020"
                  required
                  validate={isYear}
                  errorMsg="Enter a valid year"
                  className="col-span-3 md:col-span-2"
                />
                <ValidatedField
                  name="twelfthStandard"
                  label="12th / Diploma %"
                  type="number"
                  placeholder="78"
                  min="0"
                  max="100"
                  step="0.01"
                  required
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
                  required
                  defaultValue="0"
                  className="col-span-6 md:col-span-2"
                />
                {/* SKILLS CATEGORIES — NEUMORPHIC SELECTION */}
                <div className="col-span-6 md:col-span-4 space-y-4 bg-slate-50/80 dark:bg-gray-800/50 p-5 rounded-2xl border border-gray-200/70 dark:border-gray-700/60 shadow-[inset_2px_2px_6px_rgba(0,0,0,0.03)]">
                  
                  {/* Category 1: Skills You Currently Have */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-[11px] font-extrabold text-[#4B0082] dark:text-purple-300 uppercase tracking-wider">
                        Skills You Currently Have <span className="text-red-400">*</span>
                      </label>
                      <span className="text-[10px] text-gray-400 font-medium">Click to select/unselect</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {PREDEFINED_SKILLS.map(skill => {
                        const active = selectedSkills.includes(skill);
                        return (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => toggleSkill(skill)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                              active 
                                ? 'bg-[#4B0082] text-white shadow-[0_4px_12px_rgba(75,0,130,0.3)] scale-[1.02]' 
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200/80 dark:border-gray-700/80 shadow-[2px_2px_5px_rgba(0,0,0,0.04),-2px_-2px_5px_rgba(255,255,255,0.9)] hover:border-purple-300'
                            }`}
                          >
                            {active ? '✓ ' : '+ '} {skill}
                          </button>
                        );
                      })}
                    </div>
                    
                    {/* Custom Skill Input */}
                    <div className="flex gap-2 mt-2">
                      <input
                        type="text"
                        placeholder="Add another skill you have..."
                        value={customSkill}
                        onChange={(e) => setCustomSkill(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomSkill(); } }}
                        className="flex-1 bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700/80 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4B0082]/30 shadow-[inset_1px_1px_3px_rgba(0,0,0,0.05)]"
                      />
                      <button
                        type="button"
                        onClick={addCustomSkill}
                        className="px-4 py-2 bg-[#4B0082]/10 dark:bg-purple-900/30 text-[#4B0082] dark:text-purple-300 text-xs font-bold rounded-xl hover:bg-[#4B0082]/20 transition-all shadow-[2px_2px_5px_rgba(0,0,0,0.05)]"
                      >
                        + Add
                      </button>
                    </div>
                  </div>

                  {/* Category 2: Skills Currently Learning / Want to Learn */}
                  <div className="pt-3 border-t border-gray-200/60 dark:border-gray-700/60">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-[11px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                        Skills Currently Learning / Want to Learn
                      </label>
                      <span className="text-[10px] text-gray-400 font-medium">Optional target skills</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {PREDEFINED_LEARNING_SKILLS.map(skill => {
                        const active = learningSkills.includes(skill);
                        return (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => toggleLearningSkill(skill)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                              active 
                                ? 'bg-blue-600 text-white shadow-[0_4px_12px_rgba(37,99,235,0.3)] scale-[1.02]' 
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200/80 dark:border-gray-700/80 shadow-[2px_2px_5px_rgba(0,0,0,0.04),-2px_-2px_5px_rgba(255,255,255,0.9)] hover:border-blue-300'
                            }`}
                          >
                            {active ? '✓ ' : '+ '} {skill}
                          </button>
                        );
                      })}
                    </div>

                    {/* Custom Learning Skill Input */}
                    <div className="flex gap-2 mt-2">
                      <input
                        type="text"
                        placeholder="Add target skill you are learning..."
                        value={customLearningSkill}
                        onChange={(e) => setCustomLearningSkill(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomLearningSkill(); } }}
                        className="flex-1 bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700/80 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 shadow-[inset_1px_1px_3px_rgba(0,0,0,0.05)]"
                      />
                      <button
                        type="button"
                        onClick={addCustomLearningSkill}
                        className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-xs font-bold rounded-xl hover:bg-blue-100 transition-all shadow-[2px_2px_5px_rgba(0,0,0,0.05)]"
                      >
                        + Add
                      </button>
                    </div>
                  </div>

                  {/* Hidden Input for standard form submission */}
                  <input
                    type="hidden"
                    name="studentSkills"
                    value={selectedSkills.join(', ')}
                  />
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
                    required
                    placeholder="Tell us what makes you a great fit..."
                    className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4B0082]/30 focus:border-[#4B0082] transition-all duration-150 w-full"
                  ></textarea>
                </div>
                <div className="col-span-6 md:col-span-2">
                  <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">How did you hear about us?</label>
                  <select name="referralSource" required className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4B0082]/30 focus:border-[#4B0082] transition-all w-full">
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

      {/* JD Modal (Only rendered when customRoles is NOT used) */}
      {isModalOpen && !customRoles && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
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
                type="button"
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
                onClick={() => setIsModalOpen(false)}
                className="w-full py-4 bg-[#4B0082] hover:bg-[#2E0052] text-white font-bold text-base tracking-wide rounded-2xl transition-all duration-200 shadow-xl shadow-purple-900/20"
              >
                Close and Apply
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SharedApplicationForm;
