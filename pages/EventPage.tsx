import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Building2, 
  ArrowRight, 
  ExternalLink,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Globe,
  Quote,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Award,
  Zap,
  ShieldCheck,
  BookOpen,
  BrainCircuit,
  Rocket
} from 'lucide-react';
import { usePanelistData, Panelist } from '../hooks/usePanelistData';
import { useAttendeeData, Attendee } from '../hooks/useAttendeeData';
import PanelistCard from '../components/roundtable/PanelistCard';
import AttendeeCard from '../components/roundtable/AttendeeCard';
import PanelistSkeleton from '../components/roundtable/PanelistSkeleton';

/* ══════════════════════════════════════════════════════════════
   Framer Motion Animation Variants
   ══════════════════════════════════════════════════════════════ */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] },
  }),
};

/* Mock data for gallery */
const GALLERY_PHOTOS = [
  {
    id: 1,
    url: 'https://res.cloudinary.com/dp9jnvstr/image/upload/v1783007065/VK601377_nslnvg.jpg',
    title: 'Panel Insights & Keynotes',
    description: 'Distinguished speakers presenting alignment strategies.',
    tag: 'Panel'
  },
  {
    id: 2,
    url: 'https://res.cloudinary.com/dp9jnvstr/image/upload/v1783007064/VK601337_bso00j.jpg',
    title: 'CHRO Deliberations',
    description: 'Executive roundtable focusing on skill-based recruiting.',
    tag: 'Discussion'
  },
  {
    id: 3,
    url: 'https://res.cloudinary.com/dp9jnvstr/image/upload/v1783007063/VK601277_wom1ba.jpg',
    title: 'Talent Pipeline Strategy',
    description: 'Audience interacting during the Q&A segment.',
    tag: 'Q&A'
  },
  {
    id: 4,
    url: 'https://res.cloudinary.com/dp9jnvstr/image/upload/v1783007063/VK601258_vh47q3.jpg',
    title: 'Audience Exchange',
    description: 'Senior recruiters discussing regional placements.',
    tag: 'Networking'
  },
  {
    id: 5,
    url: 'https://res.cloudinary.com/dp9jnvstr/image/upload/v1783007062/VK601038_zed1b6.jpg',
    title: 'Opening Keynote',
    description: 'Inaugural remarks explaining the opportunity gap.',
    tag: 'Presentation'
  },
  {
    id: 6,
    url: 'https://res.cloudinary.com/dp9jnvstr/image/upload/v1783007063/VK601058_oc7bol.jpg',
    title: 'Delegate Roundtables',
    description: 'Focused group alignments on campus drives.',
    tag: 'Discussion'
  },
  {
    id: 7,
    url: 'https://res.cloudinary.com/dp9jnvstr/image/upload/v1783007061/VK600907_ons4ip.jpg',
    title: 'Interactive Q&A Session',
    description: 'Participants asking details on diagnostic assessments.',
    tag: 'Q&A'
  },
  {
    id: 8,
    url: 'https://res.cloudinary.com/dp9jnvstr/image/upload/v1783007062/VK600931_hhzwke.jpg',
    title: 'Networking & Collaborations',
    description: 'Post-session dialogue between delegates and organizers.',
    tag: 'Networking'
  },
  {
    id: 9,
    url: 'https://res.cloudinary.com/dp9jnvstr/image/upload/v1783007061/VK600902_mmc8et.jpg',
    title: 'Coordinating Initiatives',
    description: 'Discussing student prep and pooled campus logistics.',
    tag: 'Discussion'
  },
  {
    id: 10,
    url: 'https://res.cloudinary.com/dp9jnvstr/image/upload/v1783007061/VK600880_hnmttu.jpg',
    title: 'Strategy Briefings',
    description: 'Exchanging notes on technical assessment platforms.',
    tag: 'Discussion'
  },
  {
    id: 11,
    url: 'https://res.cloudinary.com/dp9jnvstr/image/upload/v1783007061/VK600892_sn8qxp.jpg',
    title: 'Regional Leadership Alignment',
    description: 'Coordinating training modules with engineering heads.',
    tag: 'Panel'
  },
  {
    id: 12,
    url: 'https://res.cloudinary.com/dp9jnvstr/image/upload/v1783007060/VK600765_dstl9f.jpg',
    title: 'Collaborative Dialogues',
    description: 'Discussing soft skills prep and professional grooming.',
    tag: 'Networking'
  },
  {
    id: 13,
    url: 'https://res.cloudinary.com/dp9jnvstr/image/upload/v1783007060/VK600719_uvyluc.jpg',
    title: 'Audience Engagement',
    description: 'Capturing reactions during the keynote addresses.',
    tag: 'Audience'
  },
  {
    id: 14,
    url: 'https://res.cloudinary.com/dp9jnvstr/image/upload/v1783007060/VK600692_o1v0vy.jpg',
    title: 'Interactive Panels',
    description: 'Speakers responding to recruitment scaling queries.',
    tag: 'Q&A'
  },
  {
    id: 15,
    url: 'https://res.cloudinary.com/dp9jnvstr/image/upload/v1783007060/VK600661_jyhsh6.jpg',
    title: 'Delegate Briefing',
    description: 'Sharing documentation on the Opportunity Guarantee.',
    tag: 'Presentation'
  },
  {
    id: 16,
    url: 'https://res.cloudinary.com/dp9jnvstr/image/upload/v1783007059/VK600338_tgm7fh.jpg',
    title: 'Executive Networking',
    description: 'Senior HR directors planning campus visit calendars.',
    tag: 'Networking'
  }
];

/* Panel discussion insights tabs data */
const DISCUSSION_TOPICS = [
  {
    id: "tab-1",
    tabTitle: "Future of Hiring (2030)",
    header: "What Will Talent Acquisition Look Like in 2030?",
    overview: "The panel explored the intersection of AI capabilities and human judgment in talent acquisition. As AI accelerates candidate matching and automates screening, the consensus highlighted a permanent shift towards skill-based hiring, real-world simulations, and assessing learning agility over traditional credentials. While AI drives efficiency in volume hiring, human oversight remains the critical anchor for ensuring fairness, quality, and cultural alignment.",
    keyTakeaways: [
      "Human-in-the-loop AI adoption",
      "Shift from credentials to proven capabilities",
      "Rise of simulation-based assessments"
    ]
  },
  {
    id: "tab-2",
    tabTitle: "Future-Ready Talent",
    header: "Building Future-Ready Talent: AI, Skills & Human Potential",
    overview: "Discussions centered on what makes human talent indispensable as AI commoditizes routine tasks. Leaders emphasized that critical thinking, emotional intelligence, creativity, and leadership will become the ultimate premium differentiators. The panel advocated for dynamic, targeted upskilling programs and organizational structures where career progression is driven by continuous learning and adaptability rather than mere tenure.",
    keyTakeaways: [
      "Emotional intelligence as a premium skill",
      "Learning agility over fixed expertise",
      "Targeted upskilling aligned with AI integration"
    ]
  }
];

/* Fallback local panelists if sheet data is empty or still holds placeholder text */
const FALLBACK_PANELISTS: Panelist[] = [
  {
    id: "host-1",
    name: "Pittala Sai Sudeep",
    title: "Chief Operations Officer (COO), Placemein HR Solutions",
    linkedinUrl: "https://in.linkedin.com/in/saisudeeppittala",
    imageUrl: "",
    tag: "Roundtable Moderator & Event Ideator",
    coreDomain: "Event Moderator (Hiring, skills, and human potential in an AI-first world)"
  },
  {
    id: "panelist-1",
    name: "Venkat Ramana Kuruhuri",
    title: "Industry-Academia Expert & Corporate HR Leader",
    linkedinUrl: "https://www.linkedin.com/in/venkatramanakuruhuri/",
    imageUrl: "https://res.cloudinary.com/dp9jnvstr/image/upload/v1782998384/Venkata_Ramana_Kuruhuri_2_cfrlnk.jpg",
    tag: "Talent Pipelines",
    coreDomain: "Talent Pipelines & Academic Mentorship"
  },
  {
    id: "panelist-2",
    name: "Dr. Maddela Goud Ramchander (Dr. MGR)",
    title: "Academic Leader & Strategic HR Thought Leader",
    linkedinUrl: "https://www.linkedin.com/in/rcmaddela/",
    imageUrl: "https://res.cloudinary.com/dp9jnvstr/image/upload/v1782998384/Dr.MGR_dsw6tm.jpg",
    tag: "AI & Skills Education",
    coreDomain: "Future of Skills & Applied AI Education"
  }
];

/* Fallback local attendees if sheet data is empty */
const FALLBACK_ATTENDEES: Attendee[] = [
  {
    id: "1",
    name: "Rajesh Kannan",
    designation: "Head of Campus Recruitment",
    company: "Infratech Systems",
    quote: "The roundtable highlighted key structural issues in college placements. Seeing how Placemein bridges this gaps with pre-screened drives was eye-opening.",
    profile_pic_url: "",
    linkedin_url: "https://www.linkedin.com/company/placemein",
    verified: "TRUE",
    visible: "TRUE"
  },
  {
    id: "2",
    name: "Sneha Reddy",
    designation: "Senior HR Manager",
    company: "Cognitive AI",
    quote: "A fantastic, curated session. Meeting other CHROs and talking about outsourced training gave us concrete ideas to restructure our 2026 hiring calendar.",
    profile_pic_url: "",
    linkedin_url: "https://www.linkedin.com/company/placemein",
    verified: "TRUE",
    visible: "TRUE"
  },
  {
    id: "3",
    name: "Manoj Kumar",
    designation: "VP People & Culture",
    company: "AeroDynamics India",
    quote: "The zero-latency sourcing pipeline discussed here is exactly what fast-growing tech companies need. I look forward to participating in Edition 2.",
    profile_pic_url: "",
    linkedin_url: "https://www.linkedin.com/company/placemein",
    verified: "TRUE",
    visible: "TRUE"
  }
];

const getTeamInitials = (name: string) => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

const TeamMemberCard: React.FC<{ member: { name: string; role: string; imageUrl?: string }; index: number }> = ({ member, index }) => {
  const [imgError, setImgError] = useState(false);
  const showFallback = imgError || !member.imageUrl;
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={scaleIn}
      custom={index}
      className="bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/80 p-6 rounded-2xl flex flex-col items-center text-center space-y-4 hover:shadow-lg hover:border-purple-500/25 transition-all duration-300"
    >
      <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center shadow-md select-none relative bg-purple-950/10">
        {showFallback ? (
          <div className="w-full h-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-black text-lg">
            {getTeamInitials(member.name)}
          </div>
        ) : (
          <img 
            src={member.imageUrl} 
            alt={member.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="space-y-1">
        <h4 className="font-bold text-sm text-black dark:text-white leading-tight">{member.name}</h4>
        <p className="text-xs font-semibold text-[#4B0082] dark:text-purple-400 leading-tight">{member.role}</p>
      </div>
    </motion.div>
  );
};

const EventPage: React.FC = () => {
  // Page load positioning
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch Panelist and Attendee data using hooks
  const { panelists, loading: loadingPanelists } = usePanelistData();
  const { attendees, loading: loadingAttendees } = useAttendeeData();

  // State hooks for interactive UI
  const [activeTab, setActiveTab] = useState('tab-1');
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);
  const [hoveredMetric, setHoveredMetric] = useState<number | null>(null);

  // Compute final lists, utilizing fallback data if live sheet data is empty or generic
  const finalPanelists = React.useMemo(() => {
    const isPlaceholder = panelists.length === 0 || 
      (panelists.length === 3 && panelists.some(p => p.name.includes("Panelist Name Here")));
    return isPlaceholder ? FALLBACK_PANELISTS : panelists;
  }, [panelists]);

  const finalAttendees = React.useMemo(() => {
    const isPlaceholder = attendees.length === 0 || 
      (attendees.length > 0 && attendees.some(a => a.name.includes("HR Leader Name")));
    return isPlaceholder ? FALLBACK_ATTENDEES : attendees;
  }, [attendees]);

  // Testimonial Navigation
  const nextTestimonial = () => {
    setActiveTestimonialIndex((prev) => (prev + 1) % finalAttendees.length);
  };
  const prevTestimonial = () => {
    setActiveTestimonialIndex((prev) => (prev - 1 + finalAttendees.length) % finalAttendees.length);
  };

  const activeTopic = DISCUSSION_TOPICS.find(t => t.id === activeTab) || DISCUSSION_TOPICS[0];

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 font-sans selection:bg-purple-500/20">

      {/* ╔═══════════════════════════════════════════════════════════╗
          ║  1. HERO SECTION (Edition 1 Recap)                      ║
          ╚═══════════════════════════════════════════════════════════╝ */}
      <section 
        className="relative min-h-[90vh] flex items-center justify-center pt-28 pb-16 overflow-hidden border-b border-gray-100 dark:border-zinc-800 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('https://res.cloudinary.com/dp9jnvstr/image/upload/v1783001121/VK601260_s1xfy3.jpg')" 
        }}
      >
        {/* Dark linear gradient overlay with brightness filter */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a]/85 to-[#0b0f19] backdrop-brightness-50 pointer-events-none" />
        
        {/* Decorative subtle light accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-purple-700/10 rounded-full blur-[130px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 md:px-12 w-full text-center relative z-10 flex flex-col items-center space-y-8">
          
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={fadeUp} 
            custom={0}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-purple-500/10 backdrop-blur-md border border-purple-400/30 rounded-full w-fit"
          >
            <Award className="text-purple-400 w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-widest text-purple-200">
              Edition 1 Retrospective • Hyderabad
            </span>
          </motion.div>

          <div className="space-y-4">
            <motion.h1 
              initial="hidden" 
              animate="visible" 
              variants={fadeUp} 
              custom={1}
              className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.08] text-white"
            >
              HR Roundtable <br />
              <span className="bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent">Edition 1 Recap</span>
            </motion.h1>
            
            <motion.p 
              initial="hidden" 
              animate="visible" 
              variants={fadeUp} 
              custom={2}
              className="text-base md:text-lg text-slate-200 font-medium max-w-2xl leading-relaxed"
            >
              On June 27, 2026, senior HR leaders, CHROs, and talent executives gathered in Hyderabad to dissect the industry-academia gap, evaluate managed campus drive frameworks, and unlock scalable placement strategies.
            </motion.p>
          </div>

          {/* Showcase Floating Alert */}
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={fadeUp} 
            custom={3}
            className="p-5 rounded-2xl bg-[#0f172a]/60 border border-purple-500/30 backdrop-blur-md max-w-lg text-left"
          >
            <div className="flex items-start gap-4">
              <div className="p-2 bg-purple-600/30 rounded-xl text-purple-300 mt-1">
                <Clock className="w-5 h-5 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                  Edition 2 Announced
                  <span className="text-[9px] bg-purple-500/25 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Stay Tuned</span>
                </h4>
                <p className="text-xs text-slate-300">
                  Stay tuned for announcements and registration details for the next Roundtable edition.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={fadeUp} 
            custom={4}
            className="flex flex-col sm:flex-row items-center gap-4 pt-2"
          >
            <a
              href="#takeaways"
              className="bg-purple-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:bg-purple-50 transition-all duration-300 flex items-center justify-center gap-2 group text-sm hover:-translate-y-0.5"
            >
              Browse Insights 
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#edition-2-section"
              className="bg-white/10 border border-white/20 text-white font-semibold py-4 px-8 rounded-xl hover:bg-white/25 transition-all duration-300 text-sm flex items-center justify-center gap-2 backdrop-blur-sm"
            >
              Stay Tuned for Edition 2
              <ArrowRight className="w-3.5 h-3.5 rotate-90" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ╔═══════════════════════════════════════════════════════════╗
          ║  2. INTERACTIVE METRIC HUB (Interactive Scroll/Hover)     ║
          ╚═══════════════════════════════════════════════════════════╝ */}
      <section className="py-20 bg-gray-50 dark:bg-zinc-950 border-b border-gray-100 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold text-[#4B0082] dark:text-purple-400 tracking-widest uppercase">IMPACT IN REAL NUMBERS</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-black dark:text-white tracking-tight">
              Ecosystem Outcomes Achieved
            </h2>
            <p className="text-xs text-gray-500">
              Hover over each metric card to unlock deeper placement statistics and partner outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Stat Card 1: Placements */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={scaleIn}
              custom={1}
              onMouseEnter={() => setHoveredMetric(1)}
              onMouseLeave={() => setHoveredMetric(null)}
              className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-gray-100 dark:border-zinc-800/80 flex flex-col justify-between hover:shadow-xl hover:border-purple-500/30 transition-all duration-300 relative overflow-hidden group cursor-default min-h-[220px]"
            >
              <div className="space-y-4 z-10 relative">
                <div className="w-12 h-12 bg-purple-50 dark:bg-purple-950/40 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-300">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-5xl font-black text-black dark:text-white tracking-tight group-hover:text-[#4B0082] dark:group-hover:text-purple-400 transition-colors">
                    23,374
                  </h3>
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Total Offers Generated</p>
                </div>
              </div>

              {/* Dynamic tooltip area within card */}
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800/80 z-10 relative h-12 flex items-center">
                <AnimatePresence mode="wait">
                  {hoveredMetric === 1 ? (
                    <motion.p 
                      key="hover-1"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-xs text-[#4B0082] dark:text-purple-400 font-semibold leading-relaxed"
                    >
                      * Across key industries including tech, manufacturing, operations, and services.
                    </motion.p>
                  ) : (
                    <motion.p 
                      key="default-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-gray-550 dark:text-gray-400 leading-relaxed font-medium"
                    >
                      Verified career offers released and actively accepted by students.
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              <div className="absolute right-0 bottom-0 w-24 h-24 bg-purple-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />
            </motion.div>

            {/* Stat Card 2: Sourcing Hours */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={scaleIn}
              custom={2}
              onMouseEnter={() => setHoveredMetric(2)}
              onMouseLeave={() => setHoveredMetric(null)}
              className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-gray-100 dark:border-zinc-800/80 flex flex-col justify-between hover:shadow-xl hover:border-purple-500/30 transition-all duration-300 relative overflow-hidden group cursor-default min-h-[220px]"
            >
              <div className="space-y-4 z-10 relative">
                <div className="w-12 h-12 bg-purple-50 dark:bg-purple-950/40 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-300">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-5xl font-black text-black dark:text-white tracking-tight group-hover:text-[#4B0082] dark:group-hover:text-purple-400 transition-colors">
                    4,732
                  </h3>
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Technical Placements</p>
                </div>
              </div>

              {/* Dynamic tooltip area / Chart */}
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800/80 z-10 relative h-12 flex items-center justify-between">
                <div className="flex items-end gap-1.5 h-8">
                  <div className="w-2.5 bg-purple-500/30 rounded-t h-[30%]" />
                  <div className="w-2.5 bg-purple-500/45 rounded-t h-[45%]" />
                  <div className="w-2.5 bg-purple-500/65 rounded-t h-[65%]" />
                  <div className="w-2.5 bg-purple-500/80 rounded-t h-[80%]" />
                  <div className="w-2.5 bg-purple-600 rounded-t h-full relative">
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[6px] font-black text-purple-600 dark:text-purple-300 uppercase tracking-tighter">NOW</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-wide font-mono">Consistent Growth Trajectory</span>
              </div>
              <div className="absolute right-0 bottom-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />
            </motion.div>

            {/* Stat Card 3: Core Industries */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={scaleIn}
              custom={3}
              onMouseEnter={() => setHoveredMetric(3)}
              onMouseLeave={() => setHoveredMetric(null)}
              className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-gray-100 dark:border-zinc-800/80 flex flex-col justify-between hover:shadow-xl hover:border-purple-500/30 transition-all duration-300 relative overflow-hidden group cursor-default min-h-[220px]"
            >
              <div className="space-y-4 z-10 relative w-full">
                <div className="w-12 h-12 bg-purple-50 dark:bg-purple-950/40 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-300">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">Core Industries</p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    {[
                      { name: "IT / Tech Services", iconColor: "bg-blue-500/15 text-blue-600 dark:text-blue-300" },
                      { name: "Data & Analytics", iconColor: "bg-purple-500/15 text-purple-600 dark:text-purple-300" },
                      { name: "Medical & Pharma", iconColor: "bg-green-500/15 text-green-600 dark:text-green-300" },
                      { name: "Biosciences", iconColor: "bg-teal-500/15 text-teal-600 dark:text-teal-300" }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <div className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[7px] font-black ${item.iconColor}`}>
                          {idx + 1}
                        </div>
                        <span className="text-[10px] font-extrabold text-gray-700 dark:text-gray-300 truncate">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tooltip placeholder for same heights */}
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800/80 z-10 relative h-12 flex items-center">
                <span className="text-[10px] font-bold text-[#4B0082] dark:text-purple-400">* Direct pipelines into primary growth markets.</span>
              </div>
              <div className="absolute right-0 bottom-0 w-24 h-24 bg-fuchsia-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />
            </motion.div>

          </div>
        </div>
      </section>

      {/* ╔═══════════════════════════════════════════════════════════╗
          ║  3. INTERACTIVE INSIGHTS HUB (Takeaways Tab Section)      ║
          ╚═══════════════════════════════════════════════════════════╝ */}
      <section id="takeaways" className="py-24 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-[38%_62%] gap-12 items-start">
            
            {/* Left Block: Interactive Tab selectors */}
            <div className="space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-bold text-[#4B0082] dark:text-purple-400 tracking-widest uppercase">CONVERSATION RECAP</span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-black dark:text-white tracking-tight leading-tight">
                  Core Discussion <br />Themes
                </h2>
                <p className="text-sm text-gray-500 max-w-sm">
                  Select a discussion category to explore key panels, strategic takeaways, and recommendations from the speakers.
                </p>
              </div>

              {/* Tab List */}
              <div className="flex flex-col space-y-3 pt-4 border-t border-gray-100 dark:border-zinc-800">
                {DISCUSSION_TOPICS.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => setActiveTab(topic.id)}
                    className={`text-left px-5 py-4 rounded-2xl border text-sm font-bold tracking-wide transition-all duration-300 flex items-center justify-between group ${
                      activeTab === topic.id 
                      ? 'bg-purple-50 dark:bg-purple-950/30 border-purple-500/30 text-[#4B0082] dark:text-purple-300 shadow-sm'
                      : 'bg-transparent border-gray-100 dark:border-zinc-900 text-gray-500 dark:text-gray-400 hover:border-gray-200 dark:hover:border-zinc-800'
                    }`}
                  >
                    <span>{topic.tabTitle}</span>
                    <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${
                      activeTab === topic.id ? 'translate-x-1 text-[#4B0082] dark:text-purple-300' : 'text-gray-400 group-hover:translate-x-0.5'
                    }`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Block: Content Display with Transitions */}
            <div className="bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/80 rounded-3xl p-8 md:p-10 shadow-lg min-h-[380px] flex flex-col justify-between">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTopic.id}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest bg-purple-500/5 dark:bg-purple-500/10 px-3.5 py-1.5 rounded-full w-fit">
                    <Sparkles className="w-3.5 h-3.5" /> Topic: Executive Consensus
                  </div>

                  <h3 className="text-xl font-bold text-black dark:text-white leading-snug">
                    {activeTopic.header}
                  </h3>

                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                    {activeTopic.overview}
                  </p>

                  {/* Bullet Takeaways */}
                  <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
                    <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">KEY TAKEAWAYS</h4>
                    <div className="flex flex-wrap gap-2.5">
                      {activeTopic.keyTakeaways?.map((takeaway, idx) => (
                        <span 
                          key={idx} 
                          className="px-3.5 py-1.5 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900/50 rounded-full text-xs font-bold tracking-wide shadow-sm"
                        >
                          {takeaway}
                        </span>
                      ))}
                    </div>
                  </div>

                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>
      </section>

      {/* ╔═══════════════════════════════════════════════════════════╗
          ║  3.5 OPPORTUNITY GUARANTEE SECTION (Bento Grid)           ║
          ╚═══════════════════════════════════════════════════════════╝ */}
      <section className="py-24 bg-gray-50 dark:bg-zinc-950 border-t border-b border-gray-100 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-[#4B0082] dark:text-purple-400 tracking-widest uppercase">BRIDGING THE GAP</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-black dark:text-white tracking-tight leading-tight">
              The Opportunity Guarantee (OG) Model
            </h2>
            <p className="text-sm text-gray-500 max-w-2xl mx-auto">
              Translating high-level roundtable strategy into actionable, outcome-driven career placement programs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* training card */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={scaleIn}
              custom={1}
              className="bg-white dark:bg-zinc-900/50 p-8 rounded-3xl border border-purple-500/10 dark:bg-white/[0.02] flex flex-col justify-between hover:shadow-xl hover:border-purple-500/35 transition-all duration-300 relative overflow-hidden group min-h-[280px]"
            >
              <div className="space-y-6 z-10 relative">
                <div className="w-12 h-12 bg-purple-50 dark:bg-purple-950/40 rounded-2xl flex items-center justify-center text-[#4B0082] dark:text-purple-300 border border-purple-100 dark:border-purple-900/30">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest font-mono">01. Training</span>
                  <h3 className="text-xl font-bold text-black dark:text-white">Domain Upskilling</h3>
                  <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                    High-impact, domain-specific upskilling tracks mapped explicitly across Data Science, Full-Stack Web Development, SAP, Pharma, Biosciences, and Medical Coding.
                  </p>
                </div>
              </div>
              <div className="absolute right-0 bottom-0 w-24 h-24 bg-purple-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />
            </motion.div>

            {/* preparation card */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={scaleIn}
              custom={2}
              className="bg-white dark:bg-zinc-900/50 p-8 rounded-3xl border border-purple-500/10 dark:bg-white/[0.02] flex flex-col justify-between hover:shadow-xl hover:border-purple-500/35 transition-all duration-300 relative overflow-hidden group min-h-[280px]"
            >
              <div className="space-y-6 z-10 relative">
                <div className="w-12 h-12 bg-purple-50 dark:bg-purple-950/40 rounded-2xl flex items-center justify-center text-[#4B0082] dark:text-purple-300 border border-purple-100 dark:border-purple-900/30">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest font-mono">02. Preparation</span>
                  <h3 className="text-xl font-bold text-black dark:text-white">Professional Styling</h3>
                  <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                    Structural mock evaluations, intensive professional soft-skill styling, and mindset shifts to transform fresh graduates into day-one-ready corporate contributors.
                  </p>
                </div>
              </div>
              <div className="absolute right-0 bottom-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />
            </motion.div>

            {/* opportunity card */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={scaleIn}
              custom={3}
              className="bg-white dark:bg-zinc-900/50 p-8 rounded-3xl border border-purple-500/10 dark:bg-white/[0.02] flex flex-col justify-between hover:shadow-xl hover:border-purple-500/35 transition-all duration-300 relative overflow-hidden group min-h-[280px]"
            >
              <div className="space-y-6 z-10 relative">
                <div className="w-12 h-12 bg-purple-50 dark:bg-purple-950/40 rounded-2xl flex items-center justify-center text-[#4B0082] dark:text-purple-300 border border-purple-100 dark:border-purple-900/30">
                  <Rocket className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest font-mono">03. Opportunity</span>
                  <h3 className="text-xl font-bold text-black dark:text-white">Direct Pathways</h3>
                  <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                    Unlocking immediate, friction-free access to interview pathways directly with synchronized industry hiring entities.
                  </p>
                </div>
              </div>
              <div className="absolute right-0 bottom-0 w-24 h-24 bg-fuchsia-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />
            </motion.div>

          </div>
        </div>
      </section>

      {/* ╔═══════════════════════════════════════════════════════════╗
          ║  4. DYNAMIC PANELISTS SECTION (Live data + Fallback)     ║
          ╚═══════════════════════════════════════════════════════════╝ */}
      <section className="py-24 bg-gray-50 dark:bg-zinc-950 border-t border-b border-gray-100 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-[#4B0082] dark:text-purple-400 tracking-widest uppercase">THE DISTINGUISHED PANEL</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-black dark:text-white tracking-tight">
              Edition 1 Speakers
            </h2>
            <p className="text-sm text-gray-500">
              Meet the leadership panel who drove the discussions and shared insights in our inaugural roundtable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loadingPanelists ? (
              <PanelistSkeleton />
            ) : (
              finalPanelists.map((panelist) => (
                <motion.div
                  key={panelist.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={scaleIn}
                >
                  <PanelistCard panelist={panelist} />
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ╔═══════════════════════════════════════════════════════════╗
          ║  4.5 THE ARCHITECTS OF EDITION 1 (Team Section)           ║
          ╚═══════════════════════════════════════════════════════════╝ */}
      <section className="py-24 bg-white dark:bg-black border-b border-gray-100 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-16">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-[#4B0082] dark:text-purple-400 tracking-widest uppercase font-mono">THE ARCHITECTS OF EDITION 1</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-black dark:text-white tracking-tight font-sans">
              Organizing Leadership & Execution Team
            </h2>
            <p className="text-sm text-gray-500 font-medium">
              The dedicated minds behind the conceptualization, execution, and success of the first roundtable edition.
            </p>
          </div>

          {/* Tier A: Executive Leadership Cards */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 tracking-widest uppercase border-b border-gray-100 dark:border-zinc-800/80 pb-2 font-mono">
              Executive Leadership
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { 
                  name: "Chetti Rakesh", 
                  role: "Founder of Placemein, Chairman of the Company", 
                  imageUrl: "https://res.cloudinary.com/dp9jnvstr/image/upload/v1783005329/Rakesh_x8rl7b.jpg" 
                },
                { 
                  name: "Kathija Shaik", 
                  role: "Co-Founder and Managing Director", 
                  imageUrl: "https://res.cloudinary.com/dp9jnvstr/image/upload/v1783005329/Katija_atgim0.jpg" 
                },
                { 
                  name: "Y Thejo Samuel Paul", 
                  role: "Co-Founder and CEO", 
                  imageUrl: "https://res.cloudinary.com/dp9jnvstr/image/upload/v1783005329/SAM_tmagru.jpg" 
                },
                { 
                  name: "Pittala Sai Sudeep", 
                  role: "Co-Founder and COO", 
                  imageUrl: "https://res.cloudinary.com/dp9jnvstr/image/upload/v1783005662/Sudeep_apcfsy.jpg" 
                }
              ].map((member, idx) => (
                <TeamMemberCard key={idx} member={member} index={idx} />
              ))}
            </div>
          </div>

          {/* Tier B: Operations & Execution Grid */}
          <div className="space-y-10">
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 tracking-widest uppercase border-b border-gray-100 dark:border-zinc-800/80 pb-2 font-mono">
                Operations & Execution
              </h3>
              
              {/* Group Photo Banner */}
              <div className="w-full max-h-[380px] overflow-hidden rounded-3xl border border-gray-150 dark:border-zinc-800 shadow-md">
                <img 
                  src="https://res.cloudinary.com/dp9jnvstr/image/upload/v1783008176/VK601446_ohlgbt.jpg" 
                  alt="Operations & Execution Group Photo" 
                  className="w-full h-full object-cover hover:scale-[1.01] transition-transform duration-500"
                />
              </div>
            </div>

            {/* Lead Execution Positions */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-[#4B0082] dark:text-purple-400 uppercase tracking-widest font-mono">Execution Leads</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
                {[
                  { name: "Vishal Madhav", role: "Execution & Operations Lead" },
                  { name: "Vineela Bathula", role: "Execution & Operations Lead" }
                ].map((lead, idx) => (
                  <div key={idx} className="bg-gray-50/50 dark:bg-zinc-900/50 border border-gray-150 dark:border-zinc-800/80 p-5 rounded-2xl flex items-center gap-4 hover:border-purple-500/20 transition-all duration-300">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-black text-base shadow-sm select-none">
                      {getTeamInitials(lead.name)}
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-black dark:text-white leading-tight">{lead.name}</h5>
                      <p className="text-[11px] font-semibold text-[#4B0082] dark:text-purple-400 mt-0.5">{lead.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Execution Team Grid */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest font-mono">Execution Team</h4>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-8 gap-6 justify-center">
                {[
                  "Vanajyothi Ajmeera", "Mansi Peddi", "Aasritha Sudini", 
                  "Aliya Anjum", "Pothula Pavan", "Venkata Akhila Vajrala", 
                  "Bhargavi Dasari", "Madu Preethi"
                ].map((name, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.08 }}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={scaleIn}
                    custom={idx}
                    className="flex flex-col items-center space-y-2.5 cursor-default group"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/10 flex items-center justify-center text-[#4B0082] dark:text-purple-300 font-bold text-sm shadow-sm group-hover:from-purple-600 group-hover:to-indigo-600 group-hover:text-white group-hover:border-transparent transition-all duration-300 select-none">
                      {getTeamInitials(name)}
                    </div>
                    <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white text-center leading-tight truncate max-w-full">
                      {name.split(" ")[0]} <br />
                      <span className="text-[8.5px] font-normal text-gray-400">{name.split(" ").slice(1).join(" ")}</span>
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ╔═══════════════════════════════════════════════════════════╗
          ║  6. PHOTO GALLERY SECTION (Bento Grid)                   ║
          ╚═══════════════════════════════════════════════════════════╝ */}
      <section className="py-24 bg-gray-50 dark:bg-zinc-950 border-t border-b border-gray-100 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-[#4B0082] dark:text-purple-400 tracking-widest uppercase">GALLERY IN FOCUS</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-black dark:text-white tracking-tight">
              Event Highlights Gallery
            </h2>
            <p className="text-sm text-gray-500">
              A premium visual overview capturing key moments and interactions from the first edition.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[160px] md:auto-rows-[200px]">
            {GALLERY_PHOTOS.map((photo, index) => {
              const bentoClasses = [
                "md:col-span-2 md:row-span-2 col-span-2 row-span-2",
                "md:col-span-1 md:row-span-1 col-span-1 row-span-1",
                "md:col-span-1 md:row-span-1 col-span-1 row-span-1",
                "md:col-span-1 md:row-span-2 col-span-1 row-span-2",
                "md:col-span-1 md:row-span-1 col-span-1 row-span-1",
                "md:col-span-2 md:row-span-1 col-span-2 row-span-1",
                "md:col-span-1 md:row-span-1 col-span-1 row-span-1",
                "md:col-span-1 md:row-span-2 col-span-1 row-span-2",
                "md:col-span-1 md:row-span-1 col-span-1 row-span-1",
                "md:col-span-2 md:row-span-2 col-span-2 row-span-2",
                "md:col-span-1 md:row-span-1 col-span-1 row-span-1",
                "md:col-span-1 md:row-span-1 col-span-1 row-span-1",
                "md:col-span-2 md:row-span-1 col-span-2 row-span-1",
                "md:col-span-1 md:row-span-1 col-span-1 row-span-1",
                "md:col-span-2 md:row-span-1 col-span-2 row-span-1",
                "md:col-span-2 md:row-span-1 col-span-2 row-span-1"
              ];
              const bentoClass = bentoClasses[index] || "md:col-span-1 md:row-span-1 col-span-1 row-span-1";

              return (
                <motion.div
                  key={photo.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={scaleIn}
                  custom={index}
                  className={`group relative rounded-3xl overflow-hidden border border-gray-100 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 shadow-md hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 ${bentoClass}`}
                >
                  <img 
                    src={photo.url} 
                    alt="Event highlight"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out filter grayscale group-hover:grayscale-0 contrast-110 brightness-95 group-hover:brightness-100"
                  />
                  {/* Glassmorphic border ring effect on hover */}
                  <div className="absolute inset-0 border border-purple-500/0 group-hover:border-purple-500/35 rounded-3xl transition-colors duration-500 pointer-events-none" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ╔═══════════════════════════════════════════════════════════╗
          ║  7. REDIRECTION CALLOUT CARD FOR EDITION 2                ║
          ╚═══════════════════════════════════════════════════════════╝ */}
      <section className="py-24 bg-white dark:bg-black relative">
        <div className="absolute inset-0 bg-radial-gradient pointer-events-none opacity-50" />
        <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-10 space-y-8 text-center">
          
          {/* Geographic coverage banner */}
          <div className="bg-purple-900/40 text-purple-200 border border-purple-500/30 backdrop-blur-md px-6 py-2 rounded-full mx-auto inline-block text-xs font-semibold tracking-wide shadow-sm select-none">
            100% Telangana District Coverage • Expanding into AP, Tamil Nadu, and Kerala in Q4 2026.
          </div>

          <div className="bg-gradient-to-br from-[#2E0052] to-[#120021] text-white rounded-3xl p-10 md:p-14 border border-purple-500/20 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10 text-left">
            
            {/* Background design */}
            <div className="absolute -top-10 -right-10 w-44 h-44 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-4 max-w-xl z-10">
              <span className="text-[10px] font-bold tracking-[0.25em] text-purple-300 uppercase block">
                ANNOUNCEMENT & UPDATES
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Align Your Talent Pipeline: Edition 2 Coming Soon
              </h2>
              <p className="text-sm text-purple-200/80 leading-relaxed">
                Nominations and agenda requests are being compiled for the next Placemein HR Roundtable. Request an alert to be notified when registrations officially open.
              </p>
            </div>

            <div className="flex flex-col gap-4 w-full md:w-auto z-10">
              <a
                href="mailto:contact@placemein.com?subject=Inquiry%20about%20Roundtable%20Edition%202"
                className="bg-white text-black hover:bg-gray-100 font-extrabold py-4 px-8 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm text-center"
              >
                Request Invitation Alert
                <ArrowRight className="w-4 h-4" />
              </a>
              
              <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-purple-300 uppercase tracking-widest select-none">
                <Clock className="w-4 h-4 text-purple-400" /> Stay Tuned For Updates
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ╔═══════════════════════════════════════════════════════════╗
          ║  8. FOOTER STRIP                                        ║
          ╚═══════════════════════════════════════════════════════════╝ */}
      <footer className="py-12 border-t border-gray-100 dark:border-zinc-800 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center space-y-1">
          <h4 className="text-sm font-bold tracking-widest text-[#4B0082] dark:text-purple-300">
            PLACEMEIN ROUNDTABLE SHOWCASE
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
