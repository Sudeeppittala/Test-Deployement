/**
 * ============================================================================
 * GOOGLE APPS SCRIPT BOILERPLATE - NEXT IT SOLUTIONS LEADS & PROFILES
 * ============================================================================
 * Connected Google Sheet Backend Handler
 * 
 * Add/Update this function in your Apps Script connected to the Google Sheet:
 * 
 * function doPost(e) {
 *   try {
 *     var data = JSON.parse(e.postData.contents);
 *     var ss = SpreadsheetApp.getActiveSpreadsheet();
 *     
 *     // Determine target sheet tab name (creates "Next IT Solutions" tab if not existing)
 *     var targetSheetName = data.sheetName || data.source || "Next IT Solutions";
 *     var sheet = ss.getSheetByName(targetSheetName);
 *     if (!sheet) {
 *       sheet = ss.insertSheet(targetSheetName);
 *       var headers = [
 *         "Lead ID", "Timestamp", "Source", "Client", "Preferred Role", "Candidate Name", "Email", 
 *         "Student Phone", "Parent Phone", "Gender", "Experience Level", "Work Mode", 
 *         "Department", "College Name", "TPO Name", "TPO Mobile", "Qualification", 
 *         "Grad Score", "Year of Passing", "10th Year", "10th %", "12th Year", "12th %", 
 *         "Active Arrears", "Skills", "Location", "LinkedIn URL", "Resume Link", "Why You"
 *       ];
 *       sheet.appendRow(headers);
 *       sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#4B0082").setFontColor("#FFFFFF");
 *     }
 *     
 *     var timestamp = new Date();
 *     var leadId = "NIT-" + timestamp.getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000);
 *     
 *     var row = [
 *       leadId,
 *       timestamp,
 *       data.source || "Next IT Solutions",
 *       data.client || "Next IT Solutions",
 *       data.preferredRole || "",
 *       data.name || "",
 *       data.email || "",
 *       data.studentPhNumber || "",
 *       data.parentNumber || "",
 *       data.gender || "",
 *       data.experienceLevel || "",
 *       data.internshipType || "",
 *       data.department || "",
 *       data.collegeName || "",
 *       data.tpoName || "",
 *       data.tpoMobileNumber || "",
 *       data.qualification || "",
 *       data.highestGraduationPercentage || "",
 *       data.yearOfPassing || "",
 *       data.tenthPassoutYear || "",
 *       data.tenthStandard || "",
 *       data.twelfthPassoutYear || "",
 *       data.twelfthStandard || "",
 *       data.ArrearsCount || "",
 *       data.studentSkills || "",
 *       data.location || "",
 *       data.linkedinUrl || "",
 *       data.resumeLink || "",
 *       data.whyYou || ""
 *     ];
 *     
 *     sheet.appendRow(row);
 *     
 *     return ContentService.createTextOutput(JSON.stringify({ success: true, leadId: leadId }))
 *       .setMimeType(ContentService.MimeType.JSON);
 *   } catch (error) {
 *     return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
 *       .setMimeType(ContentService.MimeType.JSON);
 *   }
 * }
 * ============================================================================
 */

import React, { useEffect, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { 
  Building2, 
  Sparkles, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  Users, 
  Award, 
  Zap, 
  Briefcase, 
  GraduationCap, 
  Clock, 
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import SharedApplicationForm from '../components/SharedApplicationForm';

/* ─── Motion Animations ─── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const NEXT_IT_ROLES = [
  'Software Engineer / Developer',
  'Full Stack Developer (React & Node.js)',
  'Frontend Developer (React.js / Next.js)',
  'Backend Developer (Node.js / Python / Java)',
  'QA & Test Automation Engineer',
  'Data Analyst / Data Engineer',
  'Data Scientist / AI Specialist',
  'Cloud & DevOps Specialist',
  'Business Development & Client Relations',
  'Technical Trainee / Graduate Intern'
];

const FAQS = [
  {
    question: "Who can fill out this Student Data Submission & Profile Creation Form?",
    answer: "Students, recent graduates, and job seekers interested in career opportunities, placement drives, and internships at Next IT Career can complete this form."
  },
  {
    question: "Where will my submitted data be sent?",
    answer: "Your candidate profile and academic details will be securely sent to the Next IT Career candidate database in our central Google Sheet for immediate screening."
  },
  {
    question: "What happens after I submit my application?",
    answer: "Our recruitment team will review your profile against active job openings and internship requirements at Next IT Career. Shortlisted candidates will be contacted via email or phone."
  },
  {
    question: "Is there any fee required for profile registration?",
    answer: "No. Student profile registration and job applications via Placemein for Next IT Career are 100% free of cost."
  }
];

const NextITCareersPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black font-sans selection:bg-[#4B0082]/20">
      
      {/* ╔═══════════════════════════════════════════════════════════╗
          ║  HERO SECTION                                           ║
          ╚═══════════════════════════════════════════════════════════╝ */}
      <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 px-6 overflow-hidden bg-gradient-to-b from-purple-50/60 via-white to-white dark:from-purple-950/20 dark:via-black dark:to-black">
        
        {/* Background Subtle Accent Gradients */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#4B0082]/10 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0} className="text-center max-w-3xl mx-auto">
            
            {/* Client Co-Branding Badge */}
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white dark:bg-gray-900 border border-purple-200 dark:border-purple-800/60 shadow-md mb-8">
              <img 
                src="https://res.cloudinary.com/dp9jnvstr/image/upload/v1784716281/Nextitcareer_logo-New-1a_frb8lw.png" 
                alt="Next IT Career Logo" 
                className="h-7 max-w-[150px] object-contain"
              />
              <span className="w-px h-5 bg-gray-200 dark:bg-gray-700" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#4B0082] dark:text-purple-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                Built for Next IT Career Students
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-gray-900 dark:text-white leading-[1.1]">
              Student Data Submission & <span className="text-[#4B0082] dark:text-purple-400">Profile Creation Form</span>
            </h1>

            {/* Subtext */}
            <p className="mt-5 text-gray-600 dark:text-gray-300 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
              Welcome to the official recruitment and profile creation portal for <span className="font-bold text-[#4B0082] dark:text-purple-300">Next IT Career</span>. Complete your application below to get matched with active tech roles and campus drives.
            </p>

            {/* Highlights Strip */}
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
              <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-[#4B0082] dark:text-purple-400 flex-shrink-0">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">Direct Drives</p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">Next IT Placements</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">All Branches</p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">Engineering & Tech</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">Verified Companies</p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">Secured Careers</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400 flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">Faster Hiring Process</p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">Rapid screening</p>
                </div>
              </div>
            </div>

          </motion.div>
        </div>
      </section>

      {/* ╔═══════════════════════════════════════════════════════════╗
          ║  APPLICATION FORM SECTION                               ║
          ╚═══════════════════════════════════════════════════════════╝ */}
      <section id="application-form" className="py-12 md:py-20 px-6 bg-[#FAFAFA] dark:bg-gray-950">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="mb-8 text-center md:text-left">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#4B0082] dark:text-purple-400">01 — REGISTRATION FORM</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mt-1">
              Submit Your Profile Details
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Fill in your personal, academic, and technical details to submit your candidate profile to Next IT Solutions.
            </p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}>
            {/* Co-Branding Banner Card */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-gray-900 border border-purple-100 dark:border-purple-800/50 shadow-sm">
              <div className="flex items-center gap-3">
                <img 
                  src="https://res.cloudinary.com/dp9jnvstr/image/upload/v1784716281/Nextitcareer_logo-New-1a_frb8lw.png" 
                  alt="Next IT Career" 
                  className="h-8 max-w-[160px] object-contain"
                />
                <span className="w-px h-6 bg-gray-200 dark:bg-gray-700 hidden sm:block" />
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 hidden sm:block">
                  Built exclusively for Next IT Career students
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-[#4B0082] dark:text-purple-300 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-[#4B0082] dark:text-purple-300" />
                Verified Student Application
              </div>
            </div>

            <SharedApplicationForm 
              source="Next IT Solutions"
              sheetName="Next IT Solutions"
              client="Next IT Solutions"
              formTitle="Student Data Submission & Profile Creation Form"
              formSubtitle="Please fill in accurate details below. Your submission will be processed directly into the Next IT Solutions candidate database."
              customRoles={NEXT_IT_ROLES}
              defaultRole="Software Engineer / Developer"
              successTitle="Profile Submitted Successfully!"
              successSubtitle="Your details have been registered into the Next IT Solutions database. Our recruitment team will review your application shortly."
              successDetails={
                <div className="p-4 bg-purple-50 dark:bg-purple-950/40 rounded-xl max-w-md mx-auto border border-purple-100 dark:border-purple-800/50 text-center text-sm space-y-2">
                  <p className="font-bold text-[#4B0082] dark:text-purple-300">
                    Next IT Solutions Recruitment Team
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-xs">
                    Keep your registered mobile number & email active. You will receive updates regarding upcoming technical evaluations and interview schedules.
                  </p>
                </div>
              }
            />
          </motion.div>
        </div>
      </section>

      {/* ╔═══════════════════════════════════════════════════════════╗
          ║  WHY NEXT IT SOLUTIONS                                  ║
          ╚═══════════════════════════════════════════════════════════╝ */}
      <section className="py-20 px-6 bg-white dark:bg-black">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">WHY JOIN NEXT IT SOLUTIONS</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mt-2">
              Accelerate Your Career in Tech
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-base mt-2">
              Join high-performing technical teams working on impactful software engineering and client solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-left">
              <div className="w-12 h-12 rounded-2xl bg-[#4B0082]/10 dark:bg-purple-900/40 flex items-center justify-center text-[#4B0082] dark:text-purple-300 mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Modern Stack</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                Work with modern web technologies, cloud infrastructure, AI integrations, and scalable database architectures.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-left">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-300 mb-6">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">PPO Opportunities</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                Top internship performers are eligible for direct Pre-Placement Offers (PPOs) with competitive CTC packages.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-left">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-300 mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Mentorship & Growth</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                Learn directly from senior architects, project managers, and lead developers in a collaborative culture.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ╔═══════════════════════════════════════════════════════════╗
          ║  FAQ SECTION                                            ║
          ╚═══════════════════════════════════════════════════════════╝ */}
      <section className="py-20 px-6 bg-[#FAFAFA] dark:bg-gray-950">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#4B0082] dark:text-purple-400">FREQUENTLY ASKED QUESTIONS</span>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mt-2">
              Have Questions?
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden text-left">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-6 text-left flex justify-between items-center gap-4 font-semibold text-gray-900 dark:text-white hover:text-[#4B0082] dark:hover:text-purple-300 transition-colors"
                >
                  <span>{faq.question}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-5 h-5 text-[#4B0082] dark:text-purple-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-6 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-50 dark:border-gray-800/50 pt-4 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default NextITCareersPage;
