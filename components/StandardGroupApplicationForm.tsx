import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Send, 
  ChevronRight, 
  ChevronLeft, 
  Upload, 
  FileText, 
  Image as ImageIcon,
  User, 
  GraduationCap, 
  Sliders, 
  ShieldCheck 
} from 'lucide-react';

interface StandardGroupApplicationFormProps {
  appsScriptWebAppUrl: string;
  defaultRole?: string;
  successTitle?: string;
  successSubtitle?: string;
  successDetails?: React.ReactNode;
}

interface FormState {
  // Step 1: Personal Details
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  city: string;
  state: string;
  gender: string;
  
  // Step 2: Academic Details
  qualification: string;
  tradeOrBranch: string;
  institution: string;
  universityOrBoard: string;
  passoutYear: string;
  percentageOrCgpa: string;
  backlogs: string;
  experience: string;

  // Step 3: Willingness & Job Preferences
  track: 'B.Tech' | 'ITI / Diploma' | '';
  shopfloorWillingness: boolean;
  telanganaRelocation: boolean;
  contractAcceptance: boolean;
  trainingNeeded: boolean;
  joiningAvailability: string;
  interestedConfirmation: boolean;

  // Step 4: Documents & Links
  resumeLink: string;
  photoLink: string;
  linkedin: string;
  portfolio: string;
  remarks: string;

  // Step 5: Declarations
  declarationAccepted: boolean;
  consentAccepted: boolean;
}

const INITIAL_FORM_STATE: FormState = {
  name: '',
  phone: '',
  whatsapp: '',
  email: '',
  city: '',
  state: '',
  gender: '',
  qualification: '',
  tradeOrBranch: '',
  institution: '',
  universityOrBoard: '',
  passoutYear: '',
  percentageOrCgpa: '',
  backlogs: '0',
  experience: 'Fresher',
  track: '',
  shopfloorWillingness: false,
  telanganaRelocation: false,
  contractAcceptance: false,
  trainingNeeded: false,
  joiningAvailability: 'Immediate',
  interestedConfirmation: false,
  resumeLink: '',
  photoLink: '',
  linkedin: '',
  portfolio: '',
  remarks: '',
  declarationAccepted: false,
  consentAccepted: false,
};

export const StandardGroupApplicationForm: React.FC<StandardGroupApplicationFormProps> = ({
  appsScriptWebAppUrl,
  defaultRole = '',
  successTitle = 'Application Submitted!',
  successSubtitle = 'Your candidate details have been successfully saved.',
  successDetails,
}) => {
  const [formData, setFormData] = useState<FormState>(INITIAL_FORM_STATE);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [generatedAppId, setGeneratedAppId] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  // File Upload State (for Base64 processing)
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeBase64, setResumeBase64] = useState<string>('');
  const [resumeName, setResumeName] = useState<string>('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string>('');
  const [photoName, setPhotoName] = useState<string>('');

  const [scoreType, setScoreType] = useState<'percentage' | 'cgpa'>('percentage');

  useEffect(() => {
    // Set default track based on the default role passed down
    if (defaultRole.includes('B.Tech')) {
      setFormData(prev => ({ ...prev, track: 'B.Tech', qualification: 'B.Tech' }));
    } else if (defaultRole.includes('ITI') || defaultRole.includes('Diploma')) {
      setFormData(prev => ({ ...prev, track: 'ITI / Diploma' }));
    }
  }, [defaultRole]);

  // Handle Text/Checkbox Inputs
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: val
    }));

    // Clear error for that field when user types
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  // Convert files to Base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'resume' | 'photo') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      setErrors(prev => ({
        ...prev,
        [fileType]: 'File size must be under 2MB'
      }));
      return;
    } else {
      setErrors(prev => {
        const next = { ...prev };
        delete next[fileType];
        return next;
      });
    }

    if (fileType === 'resume') {
      setResumeFile(file);
      setResumeName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setResumeBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPhotoFile(file);
      setPhotoName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Step Validation
  const validateStep = (step: number): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Full name is required';
      if (!formData.phone.trim()) {
        newErrors.phone = 'Mobile number is required';
      } else if (!/^[+]?[0-9]{10,12}$/.test(formData.phone.replace(/\s/g, ''))) {
        newErrors.phone = 'Enter a valid 10-12 digit mobile number';
      }
      if (!formData.whatsapp.trim()) {
        newErrors.whatsapp = 'WhatsApp number is required';
      } else if (!/^[+]?[0-9]{10,12}$/.test(formData.whatsapp.replace(/\s/g, ''))) {
        newErrors.whatsapp = 'Enter a valid 10-12 digit WhatsApp number';
      }
      if (!formData.email.trim()) {
        newErrors.email = 'Email address is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Enter a valid email address';
      }
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.state.trim()) newErrors.state = 'State is required';
      if (!formData.gender) newErrors.gender = 'Gender selection is required';
    }

    if (step === 2) {
      if (!formData.qualification.trim()) newErrors.qualification = 'Qualification is required';
      if (!formData.tradeOrBranch.trim()) newErrors.tradeOrBranch = 'Trade or branch is required';
      if (!formData.institution.trim()) newErrors.institution = 'Institution name is required';
      if (!formData.universityOrBoard.trim()) newErrors.universityOrBoard = 'University/Board is required';
      if (!formData.passoutYear.trim()) {
        newErrors.passoutYear = 'Pass-out year is required';
      } else {
        const year = parseInt(formData.passoutYear);
        if (isNaN(year) || year < 2000 || year > 2035) {
          newErrors.passoutYear = 'Enter a valid year between 2000 and 2035';
        }
      }
      if (!formData.percentageOrCgpa.trim()) {
        newErrors.percentageOrCgpa = 'Graduation score is required';
      } else {
        const score = parseFloat(formData.percentageOrCgpa);
        if (isNaN(score) || score < 0 || (scoreType === 'percentage' && score > 100) || (scoreType === 'cgpa' && score > 10)) {
          newErrors.percentageOrCgpa = `Enter a valid score (0-${scoreType === 'percentage' ? '100' : '10'})`;
        }
      }
    }

    if (step === 3) {
      if (!formData.track) newErrors.track = 'Please select a hiring track';
      if (!formData.joiningAvailability) newErrors.joiningAvailability = 'Please select your availability';
      if (!formData.interestedConfirmation) newErrors.interestedConfirmation = 'Please confirm your interest in shop-floor roles';
      if (!formData.shopfloorWillingness) newErrors.shopfloorWillingness = 'You must confirm willingness to work on manufacturing shop-floors';
      if (!formData.telanganaRelocation) newErrors.telanganaRelocation = 'You must confirm willingness to relocate to Telangana';
      if (!formData.contractAcceptance) newErrors.contractAcceptance = 'You must accept the 2-year contract terms';
    }

    if (step === 4) {
      if (!resumeBase64 && !formData.resumeLink.trim()) {
        newErrors.resume = 'Please upload your Resume or provide a direct Resume Link';
      }
      if (formData.linkedin && !/^https?:\/\/(www\.)?linkedin\.com\/in\//.test(formData.linkedin)) {
        newErrors.linkedin = 'LinkedIn URL must be valid (e.g. https://linkedin.com/in/username)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    if (!formData.declarationAccepted || !formData.consentAccepted) {
      setErrors(prev => ({
        ...prev,
        declarations: 'You must accept both the declaration and consent terms to submit.'
      }));
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Setup source with potential UTM parameters
    const params = new URLSearchParams(window.location.search);
    const utmSource = params.get('utm_source') || params.get('source');
    const finalSource = utmSource ? `StandardGroup - ${utmSource}` : 'StandardGroup';

    // Format score label
    const formattedScore = `${formData.percentageOrCgpa} (${scoreType === 'cgpa' ? 'CGPA' : '%'})`;

    const payload = {
      source: finalSource,
      name: formData.name,
      phone: formData.phone,
      whatsapp: formData.whatsapp,
      email: formData.email,
      city: formData.city,
      state: formData.state,
      gender: formData.gender,
      interestedConfirmation: formData.interestedConfirmation,
      track: formData.track,
      qualification: formData.qualification,
      tradeOrBranch: formData.tradeOrBranch,
      institution: formData.institution,
      universityOrBoard: formData.universityOrBoard,
      passoutYear: formData.passoutYear,
      percentageOrCgpa: formattedScore,
      backlogs: formData.backlogs,
      experience: formData.experience,
      shopfloorWillingness: formData.shopfloorWillingness,
      telanganaRelocation: formData.telanganaRelocation,
      contractAcceptance: formData.contractAcceptance,
      trainingNeeded: formData.trainingNeeded,
      joiningAvailability: formData.joiningAvailability,
      
      // Base64 file objects
      resumeBase64: resumeBase64,
      resumeName: resumeName,
      resumeLink: formData.resumeLink,

      photoBase64: photoBase64,
      photoName: photoName,
      photoLink: formData.photoLink,

      linkedin: formData.linkedin,
      portfolio: formData.portfolio,
      declarationAccepted: formData.declarationAccepted,
      consentAccepted: formData.consentAccepted,
      remarks: formData.remarks,
    };

    try {
      const response = await fetch(appsScriptWebAppUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (result.success) {
        setSubmitStatus('success');
        setGeneratedAppId(result.appId || 'SG-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000));
        setFormData(INITIAL_FORM_STATE);
        setResumeFile(null);
        setResumeBase64('');
        setResumeName('');
        setPhotoFile(null);
        setPhotoBase64('');
        setPhotoName('');
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepsInfo = [
    { title: 'Personal', icon: <User size={16} /> },
    { title: 'Academic', icon: <GraduationCap size={16} /> },
    { title: 'Preferences', icon: <Sliders size={16} /> },
    { title: 'Documents', icon: <Upload size={16} /> },
  ];

  return (
    <div className="bg-white rounded-[2rem] text-slate-800 font-sans border border-slate-100 shadow-xl overflow-hidden relative">
      
      {/* ProgressBar/Stepper */}
      <div className="px-8 pt-8 pb-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          {stepsInfo.map((s, idx) => {
            const stepNum = idx + 1;
            const isCompleted = currentStep > stepNum;
            const isActive = currentStep === stepNum;
            return (
              <React.Fragment key={idx}>
                <div className="flex flex-col items-center relative z-10">
                  <div 
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                      isCompleted 
                        ? 'bg-emerald-500 text-white' 
                        : isActive 
                        ? 'bg-[#4B0082] text-white shadow-md shadow-purple-900/10' 
                        : 'bg-white border-2 border-slate-200 text-slate-400'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 size={16} /> : s.icon}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider mt-2 transition-colors ${isActive ? 'text-[#4B0082]' : 'text-slate-400'}`}>
                    {s.title}
                  </span>
                </div>
                {idx < stepsInfo.length - 1 && (
                  <div className="flex-1 h-[2px] mx-2 -mt-6 bg-slate-200">
                    <div 
                      className="h-full bg-emerald-500 transition-all duration-300"
                      style={{ width: currentStep > stepNum ? '100%' : '0%' }}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="p-8 md:p-12">
        <AnimatePresence mode="wait">
          {submitStatus === 'success' ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-16 text-center space-y-6"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto shadow-inner border border-emerald-100">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{successTitle}</h3>
              <p className="text-slate-500 font-medium max-w-md mx-auto">{successSubtitle}</p>
              
              {successDetails ? (
                <div className="mt-4">{successDetails}</div>
              ) : (
                generatedAppId && (
                  <div className="p-4 bg-slate-50 border border-slate-200/50 rounded-2xl max-w-sm mx-auto flex justify-between items-center text-sm font-semibold">
                    <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">Application Reference ID</span>
                    <span className="font-extrabold text-[#4B0082] text-lg">{generatedAppId}</span>
                  </div>
                )
              )}

              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setSubmitStatus('idle');
                    setCurrentStep(1);
                    setGeneratedAppId('');
                  }}
                  className="px-8 py-3 bg-[#4B0082] hover:bg-[#2E0052] text-white font-bold rounded-xl transition-all shadow-md active:scale-95 text-sm"
                >
                  Submit Another Application
                </button>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* STEP 1: PERSONAL DETAILS */}
              {currentStep === 1 && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-xl font-bold text-slate-950">Profile & Contact Information</h3>
                    <p className="text-xs text-slate-400 mt-1">Please enter your basic communication details exactly matching your identification documents.</p>
                  </div>
                  
                  <div className="grid grid-cols-6 gap-x-4 gap-y-5">
                    <div className="col-span-6 md:col-span-3">
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Candidate Full Name <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Rahul Sharma"
                        className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                          errors.name ? 'border-red-400 focus:ring-red-400/20' : 'border-slate-200 focus:border-[#4B0082] focus:ring-[#4B0082]/20'
                        }`}
                      />
                      {errors.name && <p className="text-red-500 text-[10px] mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.name}</p>}
                    </div>

                    <div className="col-span-6 md:col-span-3">
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Gender <span className="text-red-500">*</span></label>
                      <select 
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                          errors.gender ? 'border-red-400 focus:ring-red-400/20' : 'border-slate-200 focus:border-[#4B0082] focus:ring-[#4B0082]/20'
                        }`}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                      {errors.gender && <p className="text-red-500 text-[10px] mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.gender}</p>}
                    </div>

                    <div className="col-span-6 md:col-span-3">
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email Address <span className="text-red-500">*</span></label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="rahul@example.com"
                        className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                          errors.email ? 'border-red-400 focus:ring-red-400/20' : 'border-slate-200 focus:border-[#4B0082] focus:ring-[#4B0082]/20'
                        }`}
                      />
                      {errors.email && <p className="text-red-500 text-[10px] mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.email}</p>}
                    </div>

                    <div className="col-span-6 md:col-span-3">
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Mobile Number <span className="text-red-500">*</span></label>
                      <input 
                        type="tel" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="e.g. 9876543210"
                        className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                          errors.phone ? 'border-red-400 focus:ring-red-400/20' : 'border-slate-200 focus:border-[#4B0082] focus:ring-[#4B0082]/20'
                        }`}
                      />
                      {errors.phone && <p className="text-red-500 text-[10px] mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.phone}</p>}
                    </div>

                    <div className="col-span-6 md:col-span-3">
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">WhatsApp Number <span className="text-red-500">*</span></label>
                      <input 
                        type="tel" 
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleInputChange}
                        placeholder="e.g. 9876543210"
                        className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                          errors.whatsapp ? 'border-red-400 focus:ring-red-400/20' : 'border-slate-200 focus:border-[#4B0082] focus:ring-[#4B0082]/20'
                        }`}
                      />
                      {errors.whatsapp && <p className="text-red-500 text-[10px] mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.whatsapp}</p>}
                    </div>

                    <div className="col-span-6 md:col-span-3">
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Current City <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="e.g. Hyderabad"
                        className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                          errors.city ? 'border-red-400 focus:ring-red-400/20' : 'border-slate-200 focus:border-[#4B0082] focus:ring-[#4B0082]/20'
                        }`}
                      />
                      {errors.city && <p className="text-red-500 text-[10px] mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.city}</p>}
                    </div>

                    <div className="col-span-6">
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Current State <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="e.g. Telangana"
                        className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                          errors.state ? 'border-red-400 focus:ring-red-400/20' : 'border-slate-200 focus:border-[#4B0082] focus:ring-[#4B0082]/20'
                        }`}
                      />
                      {errors.state && <p className="text-red-500 text-[10px] mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.state}</p>}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: ACADEMIC DETAILS */}
              {currentStep === 2 && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-xl font-bold text-slate-950">Academic Qualifications</h3>
                    <p className="text-xs text-slate-400 mt-1">Provide details of your highest academic credentials.</p>
                  </div>

                  <div className="grid grid-cols-6 gap-x-4 gap-y-5">
                    <div className="col-span-6 md:col-span-3">
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Qualification <span className="text-red-500">*</span></label>
                      <select 
                        name="qualification"
                        value={formData.qualification}
                        onChange={handleInputChange}
                        className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                          errors.qualification ? 'border-red-400 focus:ring-red-400/20' : 'border-slate-200 focus:border-[#4B0082] focus:ring-[#4B0082]/20'
                        }`}
                      >
                        <option value="">Select Qualification</option>
                        <option value="B.Tech">B.Tech</option>
                        <option value="Diploma">Diploma</option>
                        <option value="ITI">ITI</option>
                        <option value="Other">Other Graduate</option>
                      </select>
                      {errors.qualification && <p className="text-red-500 text-[10px] mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.qualification}</p>}
                    </div>

                    <div className="col-span-6 md:col-span-3">
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Trade / Branch <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        name="tradeOrBranch"
                        value={formData.tradeOrBranch}
                        onChange={handleInputChange}
                        placeholder="e.g. Mechanical Engineering"
                        className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                          errors.tradeOrBranch ? 'border-red-400 focus:ring-red-400/20' : 'border-slate-200 focus:border-[#4B0082] focus:ring-[#4B0082]/20'
                        }`}
                      />
                      {errors.tradeOrBranch && <p className="text-red-500 text-[10px] mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.tradeOrBranch}</p>}
                    </div>

                    <div className="col-span-6 md:col-span-3">
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Institution / College Name <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        name="institution"
                        value={formData.institution}
                        onChange={handleInputChange}
                        placeholder="e.g. Hyderabad Institute of Technology"
                        className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                          errors.institution ? 'border-red-400 focus:ring-red-400/20' : 'border-slate-200 focus:border-[#4B0082] focus:ring-[#4B0082]/20'
                        }`}
                      />
                      {errors.institution && <p className="text-red-500 text-[10px] mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.institution}</p>}
                    </div>

                    <div className="col-span-6 md:col-span-3">
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">University / Board <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        name="universityOrBoard"
                        value={formData.universityOrBoard}
                        onChange={handleInputChange}
                        placeholder="e.g. JNTUH / SBTET"
                        className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                          errors.universityOrBoard ? 'border-red-400 focus:ring-red-400/20' : 'border-slate-200 focus:border-[#4B0082] focus:ring-[#4B0082]/20'
                        }`}
                      />
                      {errors.universityOrBoard && <p className="text-red-500 text-[10px] mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.universityOrBoard}</p>}
                    </div>

                    <div className="col-span-6 md:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Pass-out Year <span className="text-red-500">*</span></label>
                      <input 
                        type="number" 
                        name="passoutYear"
                        value={formData.passoutYear}
                        onChange={handleInputChange}
                        placeholder="e.g. 2025"
                        min="2000"
                        max="2035"
                        className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                          errors.passoutYear ? 'border-red-400 focus:ring-red-400/20' : 'border-slate-200 focus:border-[#4B0082] focus:ring-[#4B0082]/20'
                        }`}
                      />
                      {errors.passoutYear && <p className="text-red-500 text-[10px] mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.passoutYear}</p>}
                    </div>

                    {/* Graduation Score with Switch */}
                    <div className="col-span-6 md:col-span-2">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Graduation Score <span className="text-red-500">*</span></label>
                        <button
                          type="button"
                          onClick={() => setScoreType(t => t === 'percentage' ? 'cgpa' : 'percentage')}
                          className="text-[9px] font-bold text-[#4B0082] bg-purple-50 px-2 py-0.5 rounded-full hover:bg-purple-100 transition-colors"
                        >
                          Use {scoreType === 'percentage' ? 'CGPA' : '%'}
                        </button>
                      </div>
                      <div className="relative">
                        <input 
                          type="number" 
                          name="percentageOrCgpa"
                          value={formData.percentageOrCgpa}
                          onChange={handleInputChange}
                          placeholder={scoreType === 'percentage' ? 'e.g. 78.5' : 'e.g. 8.2'}
                          step="0.01"
                          className={`w-full bg-slate-50 border rounded-xl pl-4 pr-12 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                            errors.percentageOrCgpa ? 'border-red-400 focus:ring-red-400/20' : 'border-slate-200 focus:border-[#4B0082] focus:ring-[#4B0082]/20'
                          }`}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
                          {scoreType === 'percentage' ? '%' : '/10'}
                        </span>
                      </div>
                      {errors.percentageOrCgpa && <p className="text-red-500 text-[10px] mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.percentageOrCgpa}</p>}
                    </div>

                    <div className="col-span-6 md:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Active Backlogs <span className="text-red-500">*</span></label>
                      <select 
                        name="backlogs"
                        value={formData.backlogs}
                        onChange={handleInputChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:border-[#4B0082] focus:ring-[#4B0082]/20 transition-all"
                      >
                        <option value="0">0 (No Backlogs)</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3+">3 or more</option>
                      </select>
                    </div>

                    <div className="col-span-6">
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Total Experience <span className="text-red-500">*</span></label>
                      <select 
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:border-[#4B0082] focus:ring-[#4B0082]/20 transition-all"
                      >
                        <option value="Fresher">Fresher (0 Years)</option>
                        <option value="0-1 yr">0 to 1 Year</option>
                        <option value="1-2 yrs">1 to 2 Years</option>
                        <option value="2+ yrs">2+ Years</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: PREFERENCES & WILLINGNESS */}
              {currentStep === 3 && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-xl font-bold text-slate-950">Role Preferences & Willingness</h3>
                    <p className="text-xs text-slate-400 mt-1">Please clarify your willingness details. Standard Group hiring is plant-focused and manufacturing-heavy.</p>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Hiring Track <span className="text-red-500">*</span></label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, track: 'B.Tech', qualification: prev.qualification || 'B.Tech' }))}
                          className={`p-4 rounded-xl border text-left transition-all ${
                            formData.track === 'B.Tech'
                              ? 'border-[#4B0082] bg-purple-50/50 text-[#4B0082] font-semibold'
                              : 'border-slate-200 hover:border-slate-300 text-slate-600'
                          }`}
                        >
                          <span className="block text-sm font-bold">B.Tech Track</span>
                          <span className="block text-[10px] text-slate-400 mt-1 font-normal">For B.Tech Mechanical, Electronics, Auto, Civil graduates.</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, track: 'ITI / Diploma' }))}
                          className={`p-4 rounded-xl border text-left transition-all ${
                            formData.track === 'ITI / Diploma'
                              ? 'border-[#4B0082] bg-purple-50/50 text-[#4B0082] font-semibold'
                              : 'border-slate-200 hover:border-slate-300 text-slate-600'
                          }`}
                        >
                          <span className="block text-sm font-bold">ITI / Diploma Track</span>
                          <span className="block text-[10px] text-slate-400 mt-1 font-normal">For ITI / Diploma engineering candidates.</span>
                        </button>
                      </div>
                      {errors.track && <p className="text-red-500 text-[10px] mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.track}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Joining Availability <span className="text-red-500">*</span></label>
                        <select 
                          name="joiningAvailability"
                          value={formData.joiningAvailability}
                          onChange={handleInputChange}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:border-[#4B0082] focus:ring-[#4B0082]/20 transition-all"
                        >
                          <option value="Immediate">Immediate Joining</option>
                          <option value="Within 15 days">Within 15 days</option>
                          <option value="Within 30 days">Within 30 days</option>
                          <option value="After College Completion">After final examinations</option>
                        </select>
                      </div>

                      <div className="flex flex-col justify-end">
                        <label className="flex items-start gap-2.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100/50 transition-colors">
                          <input 
                            type="checkbox" 
                            name="interestedConfirmation"
                            checked={formData.interestedConfirmation}
                            onChange={handleInputChange}
                            className="mt-1 h-4 w-4 rounded border-slate-300 text-[#4B0082] focus:ring-[#4B0082]"
                          />
                          <span className="text-[11px] font-bold text-slate-700 leading-normal">
                            I confirm my active interest in applying for Standard Group shop-floor vacancies <span className="text-red-500">*</span>
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Checkboxes for Willingness */}
                    <div className="space-y-3.5 pt-2">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b pb-1.5">Mandatory Requirements</h4>
                      
                      <label className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer hover:bg-slate-100/30 transition-colors">
                        <input 
                          type="checkbox" 
                          name="shopfloorWillingness"
                          checked={formData.shopfloorWillingness}
                          onChange={handleInputChange}
                          className="mt-1 h-4 w-4 rounded border-slate-300 text-[#4B0082] focus:ring-[#4B0082]"
                        />
                        <div className="text-xs">
                          <span className="font-bold text-slate-800 block">Willingness to work on manufacturing shop-floors / plant-units</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">These roles involve active plant deployment, production oversight, assembly rigging, and testing.</span>
                        </div>
                      </label>
                      {errors.shopfloorWillingness && <p className="text-red-500 text-[10px] mt-0.5 flex items-center gap-1"><AlertCircle size={12} /> {errors.shopfloorWillingness}</p>}

                      <label className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer hover:bg-slate-100/30 transition-colors">
                        <input 
                          type="checkbox" 
                          name="telanganaRelocation"
                          checked={formData.telanganaRelocation}
                          onChange={handleInputChange}
                          className="mt-1 h-4 w-4 rounded border-slate-300 text-[#4B0082] focus:ring-[#4B0082]"
                        />
                        <div className="text-xs">
                          <span className="font-bold text-slate-800 block">Willingness to relocate to Telangana</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">Job locations are across Standard Group active manufacturing hubs in Telangana, India.</span>
                        </div>
                      </label>
                      {errors.telanganaRelocation && <p className="text-red-500 text-[10px] mt-0.5 flex items-center gap-1"><AlertCircle size={12} /> {errors.telanganaRelocation}</p>}

                      <label className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer hover:bg-slate-100/30 transition-colors">
                        <input 
                          type="checkbox" 
                          name="contractAcceptance"
                          checked={formData.contractAcceptance}
                          onChange={handleInputChange}
                          className="mt-1 h-4 w-4 rounded border-slate-300 text-[#4B0082] focus:ring-[#4B0082]"
                        />
                        <div className="text-xs">
                          <span className="font-bold text-slate-800 block">Acceptance of 2-Year Contract Agreement</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">Guarantees professional operational stability, offering entry into heavy process plant design & testing.</span>
                        </div>
                      </label>
                      {errors.contractAcceptance && <p className="text-red-500 text-[10px] mt-0.5 flex items-center gap-1"><AlertCircle size={12} /> {errors.contractAcceptance}</p>}

                      <label className="flex items-start gap-3 p-3 bg-purple-50/30 rounded-xl border border-purple-100/50 cursor-pointer hover:bg-purple-50/50 transition-colors">
                        <input 
                          type="checkbox" 
                          name="trainingNeeded"
                          checked={formData.trainingNeeded}
                          onChange={handleInputChange}
                          className="mt-1 h-4 w-4 rounded border-slate-300 text-[#4B0082] focus:ring-[#4B0082]"
                        />
                        <div className="text-xs">
                          <span className="font-bold text-purple-950 block">Interested in pre-interview readiness training support</span>
                          <span className="text-[10px] text-purple-800/60 block mt-0.5">Placemein offers basic preparation and mock drives to shortlisted candidates to boost confidence. (Optional)</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: UPLOADS & DECLARATIONS */}
              {currentStep === 4 && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-xl font-bold text-slate-950">Documents & Final Declaration</h3>
                    <p className="text-xs text-slate-400 mt-1">Upload your credentials and sign the consent declaration to complete the submission.</p>
                  </div>

                  <div className="grid grid-cols-6 gap-x-4 gap-y-5">
                    {/* Resume Upload Box */}
                    <div className="col-span-6 md:col-span-3">
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Upload Resume (PDF, max 2MB) <span className="text-red-500">*</span></label>
                      <div className="relative border-2 border-dashed border-slate-200 hover:border-[#4B0082] rounded-xl p-4 transition-colors bg-slate-50/50 text-center flex flex-col items-center justify-center min-h-[100px]">
                        <input 
                          type="file" 
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => handleFileChange(e, 'resume')}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                        <div className="space-y-1 text-slate-500">
                          {resumeName ? (
                            <>
                              <FileText className="mx-auto text-emerald-500" size={24} />
                              <p className="text-xs font-bold text-slate-700 truncate max-w-[200px]">{resumeName}</p>
                            </>
                          ) : (
                            <>
                              <Upload className="mx-auto text-slate-400" size={24} />
                              <p className="text-xs font-bold">Click to upload Resume</p>
                              <p className="text-[10px] text-slate-400">PDF, DOC, DOCX up to 2MB</p>
                            </>
                          )}
                        </div>
                      </div>
                      {errors.resume && <p className="text-red-500 text-[10px] mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.resume}</p>}
                    </div>

                    {/* Photo Upload Box */}
                    <div className="col-span-6 md:col-span-3">
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Passport Photo (JPEG/PNG, max 2MB)</label>
                      <div className="relative border-2 border-dashed border-slate-200 hover:border-[#4B0082] rounded-xl p-4 transition-colors bg-slate-50/50 text-center flex flex-col items-center justify-center min-h-[100px]">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'photo')}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                        <div className="space-y-1 text-slate-500">
                          {photoName ? (
                            <>
                              <ImageIcon className="mx-auto text-emerald-500" size={24} />
                              <p className="text-xs font-bold text-slate-700 truncate max-w-[200px]">{photoName}</p>
                            </>
                          ) : (
                            <>
                              <Upload className="mx-auto text-slate-400" size={24} />
                              <p className="text-xs font-bold">Click to upload Photo</p>
                              <p className="text-[10px] text-slate-400">JPG, PNG up to 2MB</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="col-span-6 md:col-span-3">
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Alternate Resume Link (e.g. Google Drive)</label>
                      <input 
                        type="url" 
                        name="resumeLink"
                        value={formData.resumeLink}
                        onChange={handleInputChange}
                        placeholder="https://drive.google.com/..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:border-[#4B0082] focus:ring-[#4B0082]/20 transition-all"
                      />
                    </div>

                    <div className="col-span-6 md:col-span-3">
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Alternate Photo Link (e.g. Google Drive)</label>
                      <input 
                        type="url" 
                        name="photoLink"
                        value={formData.photoLink}
                        onChange={handleInputChange}
                        placeholder="https://drive.google.com/..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:border-[#4B0082] focus:ring-[#4B0082]/20 transition-all"
                      />
                    </div>

                    <div className="col-span-6 md:col-span-3">
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">LinkedIn Profile Link</label>
                      <input 
                        type="url" 
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleInputChange}
                        placeholder="https://linkedin.com/in/rahul"
                        className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                          errors.linkedin ? 'border-red-400 focus:ring-red-400/20' : 'border-slate-200 focus:border-[#4B0082] focus:ring-[#4B0082]/20'
                        }`}
                      />
                      {errors.linkedin && <p className="text-red-500 text-[10px] mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.linkedin}</p>}
                    </div>

                    <div className="col-span-6 md:col-span-3">
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Portfolio / Other link</label>
                      <input 
                        type="url" 
                        name="portfolio"
                        value={formData.portfolio}
                        onChange={handleInputChange}
                        placeholder="https://mywork.com/rahul"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:border-[#4B0082] focus:ring-[#4B0082]/20 transition-all"
                      />
                    </div>

                    <div className="col-span-6">
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Remarks / Additional Notes</label>
                      <textarea 
                        name="remarks"
                        value={formData.remarks}
                        onChange={handleInputChange}
                        placeholder="Tell us anything else about your experience, interests, or profile..."
                        rows={2}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:border-[#4B0082] focus:ring-[#4B0082]/20 transition-all resize-none"
                      />
                    </div>
                  </div>

                  {/* Declaration & Consent Checkboxes */}
                  <div className="p-5 bg-slate-50 border border-slate-200/60 rounded-2xl space-y-4 text-xs font-semibold text-slate-500">
                    <h4 className="text-slate-800 text-sm font-extrabold flex items-center gap-1.5">
                      <ShieldCheck size={16} className="text-[#4B0082]" /> Candidate Declarations
                    </h4>
                    
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="declarationAccepted"
                        checked={formData.declarationAccepted}
                        onChange={handleInputChange}
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#4B0082] focus:ring-[#4B0082]"
                      />
                      <span className="font-normal text-slate-600 leading-relaxed">
                        I hereby declare that all details filled above are true, complete, and accurate. I understand that any false declaration will lead to immediate cancellation of my candidature. <span className="text-red-500">*</span>
                      </span>
                    </label>

                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="consentAccepted"
                        checked={formData.consentAccepted}
                        onChange={handleInputChange}
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#4B0082] focus:ring-[#4B0082]"
                      />
                      <span className="font-normal text-slate-600 leading-relaxed">
                        I consent to Placemein processing my data and sharing it directly with Standard Group of Companies for recruitment and evaluation coordination. <span className="text-red-500">*</span>
                      </span>
                    </label>
                    {errors.declarations && <p className="text-red-500 text-[10px] mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.declarations}</p>}
                  </div>
                </motion.div>
              )}

              {/* ACTION BUTTONS */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={isSubmitting}
                    className="flex items-center gap-1.5 px-5 py-3 text-slate-500 hover:text-slate-800 font-bold text-sm bg-slate-50 border border-slate-200 rounded-xl transition-all disabled:opacity-50 active:scale-95"
                  >
                    <ChevronLeft size={16} /> Back
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-1.5 px-6 py-3 bg-[#4B0082] hover:bg-[#2E0052] text-white font-bold text-sm rounded-xl transition-all shadow-md active:scale-95"
                  >
                    Continue <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                      </>
                    ) : (
                      <>
                        <Send size={14} /> Submit Application
                      </>
                    )}
                  </button>
                )}
              </div>

              {submitStatus === 'error' && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-semibold flex items-start gap-2">
                  <AlertCircle className="shrink-0" size={16} />
                  <div>
                    <span className="block font-bold">Submission Failed</span>
                    <span className="block font-normal mt-0.5">We could not contact the Apps Script server. Please check your network connection and try again.</span>
                  </div>
                </div>
              )}
            </form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StandardGroupApplicationForm;
