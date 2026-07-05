import React, { useEffect, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Zap, TrendingUp, ChevronDown, Users, Clock, Award, Briefcase, ArrowRight, Star, CheckCircle2, GraduationCap } from 'lucide-react';
import { fetchOpenJobs } from '../services/googleSheets';
import { Job } from '../types';
import SharedApplicationForm from '../components/SharedApplicationForm';

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
            className="w-full font-sans text-white"
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
          ║  SECTION — APPLICATION FORM                             ║
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
          <SharedApplicationForm source="CareersPage" />
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



    </div>
  );
};

export default CareersPage;