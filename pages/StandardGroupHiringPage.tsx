/**
 * ============================================================================
 * GOOGLE APPS SCRIPT BOILERPLATE
 * ============================================================================
 * Project Name: Standard Group of Companies Hiring - Applications
 * Connected Google Sheet: https://docs.google.com/spreadsheets/d/1Po911i8GBvIeJzjzZ2I5vo5wUtAYP1o9swbY4FSz_XQ/edit?usp=sharing
 * 
 * Instructions:
 * 1. Open your Apps Script editor connected to the Google Sheet above.
 * 2. Paste this code.
 * 3. Deploy as a Web App (Execute as: "Me", Who has access: "Anyone").
 * 4. Update the "APPS_SCRIPT_WEB_APP_URL" constant below with your deployed Web App URL.
 * 
 * ----------------------------------------------------------------------------
 * 
 * function doPost(e) {
 *   try {
 *     var data = JSON.parse(e.postData.contents);
 *     
 *     // Get or create "Raw Applications" sheet
 *     var ss = SpreadsheetApp.getActiveSpreadsheet();
 *     var rawSheet = ss.getSheetByName("Raw Applications");
 *     if (!rawSheet) {
 *       rawSheet = ss.insertSheet("Raw Applications");
 *       var headers = [
 *         "Application ID", "Timestamp", "Source", "Candidate Name", "Mobile", "WhatsApp", 
 *         "Email", "City", "State", "Interested Confirmation", "Track", "Qualification", 
 *         "Trade/Branch", "Institution", "University/Board", "Pass-out Year", "Percentage/CGPA", 
 *         "Backlogs", "Experience", "Shop-floor Willingness", "Telangana Relocation Willingness", 
 *         "Contract Acceptance", "Training Needed", "Joining Availability", "Resume Link", 
 *         "Photo Link", "LinkedIn", "Portfolio", "Declaration Accepted", "Consent Accepted", 
 *         "Status", "Remarks"
 *       ];
 *       rawSheet.appendRow(headers);
 *       rawSheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#F3F4F6");
 *     }
 *     
 *     // Save Resume to Google Drive (Base64)
 *     var resumeUrl = "";
 *     if (data.resumeBase64 && data.resumeName) {
 *       resumeUrl = saveFileToDrive(data.resumeBase64, data.resumeName, "Standard Group - Resumes");
 *     }
 *     
 *     // Save Photo to Google Drive (Base64)
 *     var photoUrl = "";
 *     if (data.photoBase64 && data.photoName) {
 *       photoUrl = saveFileToDrive(data.photoBase64, data.photoName, "Standard Group - Photos");
 *     }
 *     
 *     var timestamp = new Date();
 *     var appId = data.appId || "SG-" + timestamp.getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000);
 *     var source = data.source || "Direct";
 *     
 *     var row = [
 *       appId,
 *       timestamp,
 *       source,
 *       data.name,
 *       data.phone,
 *       data.whatsapp,
 *       data.email,
 *       data.city,
 *       data.state,
 *       data.interestedConfirmation ? "Yes" : "No",
 *       data.track,
 *       data.qualification,
 *       data.tradeOrBranch,
 *       data.institution,
 *       data.universityOrBoard,
 *       data.passoutYear,
 *       data.percentageOrCgpa,
 *       data.backlogs,
 *       data.experience,
 *       data.shopfloorWillingness ? "Yes" : "No",
 *       data.telanganaRelocation ? "Yes" : "No",
 *       data.contractAcceptance ? "Yes" : "No",
 *       data.trainingNeeded ? "Yes" : "No",
 *       data.joiningAvailability,
 *       resumeUrl || data.resumeLink || "",
 *       photoUrl || data.photoLink || "",
 *       data.linkedin || "",
 *       data.portfolio || "",
 *       data.declarationAccepted ? "Yes" : "No",
 *       data.consentAccepted ? "Yes" : "No",
 *       "New",
 *       data.remarks || ""
 *     ];
 *     
 *     // Append to Raw sheet
 *     rawSheet.appendRow(row);
 *     
 *     // Segment to specific sheets based on Track
 *     var trackSheetName = (data.track === "B.Tech") ? "BTech" : "ITI-Diploma";
 *     var trackSheet = ss.getSheetByName(trackSheetName);
 *     if (!trackSheet) {
 *       trackSheet = ss.insertSheet(trackSheetName);
 *       trackSheet.appendRow(rawSheet.getRange(1, 1, 1, 32).getValues()[0]);
 *       trackSheet.getRange(1, 1, 1, 32).setFontWeight("bold").setBackground("#F3E8FF");
 *     }
 *     trackSheet.appendRow(row);
 *     
 *     return ContentService.createTextOutput(JSON.stringify({ success: true, appId: appId }))
 *       .setMimeType(ContentService.MimeType.JSON);
 *       
 *   } catch (error) {
 *     return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
 *       .setMimeType(ContentService.MimeType.JSON);
 *   }
 * }
 * 
 * function saveFileToDrive(base64Data, filename, folderName) {
 *   try {
 *     var folder;
 *     var folders = DriveApp.getFoldersByName(folderName);
 *     if (folders.hasNext()) {
 *       folder = folders.next();
 *     } else {
 *       folder = DriveApp.createFolder(folderName);
 *     }
 *     
 *     var parts = base64Data.split(",");
 *     var contentType = parts[0].split(";")[0].split(":")[1];
 *     var rawData = parts[1];
 *     var decoded = Utilities.base64Decode(rawData);
 *     var blob = Utilities.newBlob(decoded, contentType, filename);
 *     
 *     var file = folder.createFile(blob);
 *     file.setSharing(DriveApp.Access.ANYONE, DriveApp.Permission.VIEW);
 *     return file.getUrl();
 *   } catch (e) {
 *     return "Error: " + e.toString();
 *   }
 * }
 * ============================================================================
 */

import React, { useState, useRef } from 'react';
import { 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Clock, 
  Coins, 
  Users, 
  Menu, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Building2, 
  Phone, 
  Mail, 
  ArrowRight,
  ShieldCheck,
  Check,
  Calendar
} from 'lucide-react';
import Button from '../components/ui/Button';
import StandardGroupApplicationForm from '../components/StandardGroupApplicationForm';

// Dedicated Sheets & Apps Script Integration Configuration
const INTEGRATION_CONFIG = {
  companyName: "Standard Group of Companies",
  googleSheetUrl: "https://docs.google.com/spreadsheets/d/1Po911i8GBvIeJzjzZ2I5vo5wUtAYP1o9swbY4FSz_XQ/edit?usp=sharing",
  appsScriptProjectName: "Standard Group of Companies Hiring - Applications",
  appsScriptWebAppUrl: "https://script.google.com/macros/s/AKfycbwyfAXb-1ACMuyKHbtx21aCiWAxV7A2G_JewwS-nXOWyRLoY0j1YFjQimAnAFjSmSLZ/exec",
  supportEmail: "support@placemein.com",
  supportContact: "+91 80088 12345",
  deadline: "July 25, 2026"
};

const STANDARD_GROUP_ROLES = [
  'Standard Group - B.Tech Track',
  'Standard Group - ITI / Diploma Track'
];

const StandardGroupHiringPage: React.FC = () => {
  const [defaultRole, setDefaultRole] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const formSectionRef = useRef<HTMLDivElement>(null);

  const selectTrackAndScroll = (selectedTrack: 'ITI / Diploma' | 'B.Tech' | '') => {
    if (selectedTrack === 'B.Tech') {
      setDefaultRole('Standard Group - B.Tech Track');
    } else if (selectedTrack === 'ITI / Diploma') {
      setDefaultRole('Standard Group - ITI / Diploma Track');
    } else {
      setDefaultRole('');
    }
    setIsMobileMenuOpen(false);
    setTimeout(() => {
      formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // In-Page Smooth Scroll Helper
  const scrollToId = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const FAQ_ITEMS = [
    {
      q: "Who can apply for this hiring drive?",
      a: "B.Tech graduates (Mechanical, Electronics, Automobile, Civil branches), Diploma holders, and ITI graduates from pass-out batches of 2024, 2025, and earlier years are fully eligible to apply."
    },
    {
      q: "Is there any prior advanced technical experience required?",
      a: "No prior advanced experience or specialized tech skills are required. The hiring focus is on foundational engineering/trade knowledge, practical orientation, willingness to learn, and basic communication skills."
    },
    {
      q: "What is the work environment like?",
      a: "These roles are shop-floor, plant-unit, and manufacturing-floor roles. Candidates will be actively working in production, assembly, quality control testing, operations support, and engineering installation environments in Telangana."
    },
    {
      q: "Is this a contract role? What are the contract terms?",
      a: "Yes, this opportunity includes a standard 2-year contract with the company. The contract structure guarantees professional corporate stability and offers practical entry into high-value manufacturing processes."
    },
    {
      q: "What is the starting salary package?",
      a: "The starting salary ranges between ₹2.0 LPA to ₹2.5 LPA, determined based on the applicant's educational track and performance in structural screening and interviews."
    },
    {
      q: "Will any training support be provided to candidates?",
      a: "Yes. Basic training support and interview readiness assistance are available through Placemein for shortlisted candidates who request help to clear their final selection rounds."
    },
    {
      q: "Where will the manufacturing job locations be?",
      a: "The openings are located across Standard Group of Companies' active manufacturing and production divisions located in Telangana state, India."
    },
    {
      q: "How will applications be processed and evaluated?",
      a: "All submissions go directly to our dedicated Google Sheet database. Placemein's team conducts the initial academic and willingness verification, conducts preliminary screening, and shares candidates with Standard Group for final interviews."
    },
    {
      q: "Can college TPOs / Placement Officers coordinate directly?",
      a: "Absolutely. We encourage TPOs, placement cells, and principals to coordinate batch applications. Reach out using the Placemein coordinator details in the TPO section below."
    },
    {
      q: "How will shortlisted candidates receive updates?",
      a: "Candidates will be notified of shortlists, screening assessments, and final interview schedules directly via WhatsApp, Phone call, and Email coordinates submitted in the form."
    }
  ];

  return (
    <div className="bg-slate-50 text-slate-800 font-sans min-h-screen selection:bg-purple-100 selection:text-purple-800">
      
      {/* 1. STICKY HEADER */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 transition-all">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Placemein Logo Wrapper */}
            <div className="font-sans font-extrabold text-2xl tracking-tighter text-[#4B0082]">
              PLACEMEIN
            </div>
            
            <div className="h-6 w-[1px] bg-slate-200"></div>
            
            {/* Hiring Partner Logo / Identity */}
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Hiring Partner</span>
              <span className="text-xs font-bold text-slate-700 tracking-tight leading-normal">Standard Group</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-500">
            <button onClick={() => scrollToId('overview')} className="hover:text-[#4B0082] transition-colors">Overview</button>
            <button onClick={() => scrollToId('eligibility')} className="hover:text-[#4B0082] transition-colors">Eligibility</button>
            <button onClick={() => scrollToId('tracks')} className="hover:text-[#4B0082] transition-colors">Tracks</button>
            <button onClick={() => scrollToId('faq')} className="hover:text-[#4B0082] transition-colors">FAQ</button>
            <button onClick={() => scrollToId('tpo')} className="hover:text-[#4B0082] transition-colors">Colleges & TPOs</button>
          </nav>

          <div className="flex items-center gap-4">
            <Button 
              onClick={() => scrollToId('apply')} 
              variant="primary" 
              className="hidden md:block bg-[#4B0082] hover:bg-[#2E0052] text-white font-bold py-2.5 px-6 rounded-lg text-sm transition-all shadow-sm"
            >
              Apply Now
            </Button>
            
            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="md:hidden p-1 text-slate-500 hover:text-slate-900"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white py-4 px-6 absolute top-full left-0 right-0 shadow-lg flex flex-col gap-4">
            <button onClick={() => scrollToId('overview')} className="text-left py-2 font-semibold text-slate-600 hover:text-[#4B0082]">Overview</button>
            <button onClick={() => scrollToId('eligibility')} className="text-left py-2 font-semibold text-slate-600 hover:text-[#4B0082]">Eligibility</button>
            <button onClick={() => scrollToId('tracks')} className="text-left py-2 font-semibold text-slate-600 hover:text-[#4B0082]">Tracks</button>
            <button onClick={() => scrollToId('faq')} className="text-left py-2 font-semibold text-slate-600 hover:text-[#4B0082]">FAQ</button>
            <button onClick={() => scrollToId('tpo')} className="text-left py-2 font-semibold text-slate-600 hover:text-[#4B0082]">Colleges & TPOs</button>
            <Button 
              onClick={() => scrollToId('apply')} 
              variant="primary" 
              className="w-full bg-[#4B0082] hover:bg-[#2E0052] text-white font-bold py-3 rounded-lg text-center"
            >
              Apply Now
            </Button>
          </div>
        )}
      </header>


      {/* 2. HERO SECTION */}
      <section id="overview" className="relative py-20 px-6 bg-gradient-to-br from-slate-900 via-slate-800 to-[#2E0052] text-white overflow-hidden">
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-300 text-xs font-bold uppercase tracking-widest">
            <Sparkles size={14} className="animate-spin-y" /> Now Accepting Applications
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight text-white max-w-4xl mx-auto">
            Manufacturing & Shop-Floor Career Opportunities in Telangana
          </h1>
          
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-medium">
            Standard Group of Companies is hiring for <strong className="text-white">100+ positions</strong>. Launch your technical career with a trusted, Hyderabad-headquartered process equipment turnkey provider.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <button 
              onClick={() => selectTrackAndScroll('')} 
              className="w-full sm:w-auto bg-white hover:bg-slate-100 text-slate-900 font-bold px-8 py-4 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
            >
              Start Application <ArrowRight size={16} />
            </button>
            <button 
              onClick={() => scrollToId('eligibility')} 
              className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white font-semibold px-8 py-4 rounded-xl transition-all border border-slate-700"
            >
              View Eligibility Details
            </button>
          </div>

          {/* Trust Labels */}
          <div className="pt-12 border-t border-slate-700/50 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-xs font-semibold text-slate-400">
            <div className="space-y-1">
              <span className="block text-white font-bold">Hiring Partner</span>
              <span>Standard Group of Companies</span>
            </div>
            <div className="space-y-1">
              <span className="block text-white font-bold">Managed Process</span>
              <span>Facilitated by Placemein</span>
            </div>
            <div className="space-y-1">
              <span className="block text-white font-bold">Fair Assessment</span>
              <span>Transparent Verification</span>
            </div>
            <div className="space-y-1">
              <span className="block text-white font-bold">Verification Method</span>
              <span>Credential & Resume check</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. OPPORTUNITY SNAPSHOT */}
      <section id="eligibility" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Opportunity Snapshot
          </h2>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto">
            Clear, upfront facts about the active vacancies, requirements, and job terms.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Openings', val: '100+ Vacancies', icon: <Users className="text-purple-600" />, desc: 'Across plants' },
            { label: 'Work Locations', val: 'Telangana', icon: <MapPin className="text-purple-600" />, desc: 'Manufacturing units' },
            { label: 'Qualifications', val: 'ITI / Diploma / B.Tech', icon: <GraduationCap className="text-purple-600" />, desc: 'Mechanical, Electronics, etc.' },
            { label: 'Salary Offered', val: '₹2.0 – ₹2.5 LPA', icon: <Coins className="text-purple-600" />, desc: 'Based on assessment' },
            { label: 'Contract Term', val: '2-Year Agreement', icon: <Clock className="text-purple-600" />, desc: 'Professional stability' },
            { label: 'Eligible Batches', val: '2024, 2025 & earlier', icon: <Calendar className="text-purple-600" />, desc: 'Freshers & passouts' },
            { label: 'Industry Vertical', val: 'Process Equipment', icon: <Building2 className="text-purple-600" />, desc: 'Turnkey Solutions' },
            { label: 'Training Support', val: 'Available', icon: <Sparkles className="text-purple-600" />, desc: 'Interview readiness' },
          ].map((card, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/20 flex items-center justify-center">
                {card.icon}
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">{card.label}</span>
                <span className="text-base md:text-lg font-bold text-slate-800 block leading-tight">{card.val}</span>
                <span className="text-xs text-slate-500 block">{card.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. ABOUT THE EMPLOYER */}
      <section className="py-20 px-6 bg-slate-100 border-y border-slate-200/50">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block px-3 py-1 bg-white border border-slate-200 rounded-full text-slate-600 text-xs font-bold uppercase tracking-wider">
              Employer Profile
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              About Standard Group of Companies
            </h2>
            <p className="text-slate-600 leading-relaxed font-medium">
              Headquartered in Hyderabad, Standard Group of Companies is a premier, turnkey process equipment solutions provider. They serve a wide range of industries including Pharmaceutical, API & Bulk Drugs, Chemical, Agrochemical, Biotechnology, Life Science, and Food sectors.
            </p>
            <p className="text-slate-600 leading-relaxed font-medium">
              Their capabilities encompass the complete lifecycle of heavy process plants: design, manufacturing, structural assembly, rigorous testing, on-site installation, and final commissioning.
            </p>
            <div className="pt-2">
              <a 
                href="https://www.stangroupco.com/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-1.5 text-[#4B0082] hover:text-[#2E0052] font-bold text-sm border-b-2 border-purple-200 hover:border-[#4B0082] transition-all pb-0.5"
              >
                Visit Official Website: stangroupco.com
              </a>
            </div>
          </div>
          <div className="space-y-6">
            {/* Facility Image */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-white">
              <img 
                src="https://res.cloudinary.com/dp9jnvstr/image/upload/v1783259534/e1552eaa-b7d1-56e6-a296-59dbf0e1db7d_sel8oi.jpg" 
                alt="Standard Group of Companies Facility" 
                className="w-full h-56 object-contain p-4 hover:scale-105 transition-transform duration-500" 
              />
            </div>
            
            {/* Application Management Note Card */}
            <div className="bg-white p-8 rounded-[2rem] border border-slate-200/60 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-slate-900">Application Management Note</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                <strong>Placemein</strong> is the authorized hiring facilitation partner for this drive. We manage the centralized application intake, initial verification, readiness coaching, and shortlist co-ordination.
              </p>
              <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 flex items-start gap-3">
                <ShieldCheck className="text-[#4B0082] shrink-0" size={20} />
                <div className="text-xs text-purple-950 font-semibold space-y-1">
                  <p>Direct Candidate Support:</p>
                  <p className="font-normal text-purple-900">There are zero recruitment charges or training fees for candidates. The entire screening process is fair, transparent, and direct.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHY THIS OPPORTUNITY MATTERS */}
      <section className="py-20 px-6 max-w-5xl mx-auto text-center space-y-12">
        <div className="space-y-4">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Why this Opportunity Matters
          </h2>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto">
            Build a solid, practical foundation for your industrial engineering career.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 text-left">
          {[
            {
              title: "Practical Core Exposure",
              desc: "Skip basic clerical work. Gain high-value shop-floor experience operating, building, assembling, and commissioning complex industrial process reactors and filters."
            },
            {
              title: "Earn and Learn Model",
              desc: "Get paid regular salary while acquiring direct domain expertise. A standard stipend / salary structure starting at ₹2.0L - ₹2.5L PA provides secure early earnings."
            },
            {
              title: "Readiness Support",
              desc: "Unsure about technical face-to-face interviews? Placemein offers targeted basic training support to ensure candidates can present their trade knowledge with confidence."
            }
          ].map((item, index) => (
            <div key={index} className="space-y-3 p-6 bg-white rounded-xl border border-slate-100 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-[#4B0082] font-extrabold">
                {index + 1}
              </div>
              <h3 className="font-bold text-slate-900 text-lg">{item.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. TWO-TRACK HIRING SECTION */}
      <section id="tracks" className="py-20 px-6 bg-slate-100 border-t border-slate-200/50">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Select Your Hiring Track
            </h2>
            <p className="text-slate-500 font-medium max-w-xl mx-auto">
              Our recruitment flow is divided into two distinct tracks based on your education. Choose the track matching your qualification.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Track A: ITI / Diploma */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/60 shadow-sm flex flex-col justify-between hover:border-purple-300 transition-colors">
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold uppercase rounded-full border border-emerald-100">Track A</span>
                  <GraduationCap className="text-slate-400" size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-800">ITI / Diploma Graduates</h3>
                  <p className="text-sm text-slate-500 mt-2 font-medium">For candidates looking for hands-on operational and assembly roles.</p>
                </div>
                
                <hr className="border-slate-100" />
                
                <div className="space-y-4">
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Key Roles & Focus Areas</h4>
                  <ul className="text-sm text-slate-600 space-y-3 font-semibold">
                    <li className="flex items-center gap-2"><Check size={16} className="text-emerald-500 shrink-0" /> Manufacturing floor execution</li>
                    <li className="flex items-center gap-2"><Check size={16} className="text-emerald-500 shrink-0" /> Equipment assembly & structure rigging</li>
                    <li className="flex items-center gap-2"><Check size={16} className="text-emerald-500 shrink-0" /> Production operational support</li>
                    <li className="flex items-center gap-2"><Check size={16} className="text-emerald-500 shrink-0" /> Focus on discipline, diligence, and learning</li>
                  </ul>
                </div>
              </div>

              <div className="pt-8">
                <button 
                  onClick={() => selectTrackAndScroll('ITI / Diploma')} 
                  className="w-full bg-slate-900 hover:bg-black text-white font-bold py-3 px-6 rounded-xl transition-all text-center flex items-center justify-center gap-2 active:scale-95"
                >
                  Apply for ITI / Diploma Track <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Track B: B.Tech */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/60 shadow-sm flex flex-col justify-between hover:border-purple-300 transition-colors">
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold uppercase rounded-full border border-blue-100">Track B</span>
                  <Briefcase className="text-slate-400" size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-800">B.Tech Graduates</h3>
                  <p className="text-sm text-slate-500 mt-2 font-medium">For engineering graduates in Mechanical, Electronics, Automobile, or Civil.</p>
                </div>
                
                <hr className="border-slate-100" />
                
                <div className="space-y-4">
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Key Roles & Focus Areas</h4>
                  <ul className="text-sm text-slate-600 space-y-3 font-semibold">
                    <li className="flex items-center gap-2"><Check size={16} className="text-blue-500 shrink-0" /> Plant unit coordination</li>
                    <li className="flex items-center gap-2"><Check size={16} className="text-blue-500 shrink-0" /> Engineering support & drawing compliance</li>
                    <li className="flex items-center gap-2"><Check size={16} className="text-blue-500 shrink-0" /> Technical operational planning</li>
                    <li className="flex items-center gap-2"><Check size={16} className="text-blue-500 shrink-0" /> Focus on technical education & adaptability</li>
                  </ul>
                </div>
              </div>

              <div className="pt-8">
                <button 
                  onClick={() => selectTrackAndScroll('B.Tech')} 
                  className="w-full bg-[#4B0082] hover:bg-[#2E0052] text-white font-bold py-3 px-6 rounded-xl transition-all text-center flex items-center justify-center gap-2 active:scale-95"
                >
                  Apply for B.Tech Track <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CUSTOM APPLICATION FORM */}
      <section id="apply" ref={formSectionRef} className="py-24 px-6 max-w-4xl mx-auto scroll-mt-20">
        <StandardGroupApplicationForm 
          appsScriptWebAppUrl={INTEGRATION_CONFIG.appsScriptWebAppUrl}
          defaultRole={defaultRole}
          successTitle="Application Submitted!"
          successSubtitle="Your candidate data has been logged into the dedicated Standard Group hiring database."
          successDetails={
            <div className="space-y-4">
              <div className="p-6 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-100 dark:border-slate-700 max-w-md mx-auto space-y-3 text-left">
                <div className="flex justify-between items-center text-sm border-b border-slate-200/50 pb-2">
                  <span className="text-slate-400 font-bold uppercase text-[11px]">Selected Company</span>
                  <span className="font-bold text-slate-800">Standard Group of Companies</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 font-bold uppercase text-[11px]">Status</span>
                  <span className="px-2.5 py-0.5 bg-purple-50 text-[#4B0082] border border-purple-100 text-xs font-bold rounded-full">New Application</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed text-center max-w-md mx-auto">
                ⚠️ <strong>Next Steps:</strong> Placemein will verify your qualifications and shop-floor willingness. Shortlisted candidates will be contacted via WhatsApp/Phone for interview slot coordination within 3–5 working days.
              </p>
            </div>
          }
        />
      </section>

      {/* 8. TPO / COLLEGE COORDINATION */}
      <section id="tpo" className="py-20 px-6 bg-slate-900 text-white scroll-mt-20">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-300 text-xs font-bold uppercase tracking-wider">
              For Institutions
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
              Colleges, Principals, & Placement Officers (TPOs)
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed font-medium">
              We welcome batch registrations and coordinate campus-level placement references. If you are a placement director, officer, or principal, you can share this URL directly with your student databases or contact us to organize structured batch screening events.
            </p>
            <ul className="text-xs text-slate-400 space-y-2.5">
              <li className="flex items-center gap-2">✓ Verified engineering shop-floor career opportunity</li>
              <li className="flex items-center gap-2">✓ Zero cost to college or student at any stage</li>
              <li className="flex items-center gap-2">✓ Standardized Apps Script submission ensures data integrity</li>
              <li className="flex items-center gap-2">✓ Custom pre-interview readiness training support available</li>
            </ul>
          </div>

          <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 space-y-6">
            <h3 className="text-lg font-bold text-white">Institutional Support Desk</h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              Placemein coordinates with colleges across India to streamline bulk applications and track selection status reports for participating students.
            </p>
            <div className="space-y-3 pt-2">
              <a 
                href={`mailto:${INTEGRATION_CONFIG.supportEmail}?subject=Standard%20Group%20Drive%20-%20TPO%20Coordination`} 
                className="flex items-center gap-3 p-3 bg-slate-900 rounded-xl hover:bg-black transition-colors"
              >
                <Mail className="text-[#6A0DAD]" size={20} />
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">Email Coordinator</span>
                  <span className="text-xs font-bold text-white">{INTEGRATION_CONFIG.supportEmail}</span>
                </div>
              </a>

              <a 
                href={`https://wa.me/${INTEGRATION_CONFIG.supportContact.replace(/[+\s]/g, '')}`} 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-slate-900 rounded-xl hover:bg-black transition-colors"
              >
                <Phone className="text-emerald-500" size={20} />
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">WhatsApp / Call Hotline</span>
                  <span className="text-xs font-bold text-white">{INTEGRATION_CONFIG.supportContact}</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 9. TRANSPARENCY SECTION */}
      <section className="py-20 px-6 max-w-5xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Clear and Transparent Hiring Process
          </h2>
          <p className="text-slate-500 font-medium max-w-xl mx-auto">
            No hidden clauses. We ensure full structural transparency so candidates know exactly what to expect.
          </p>
        </div>

        {/* Process Map */}
        <div className="grid md:grid-cols-6 gap-6 relative">
          {[
            { step: '1', title: 'Apply Online', desc: 'Complete form and upload resume.' },
            { step: '2', title: 'Screening', desc: 'Placemein verifies profile parameters.' },
            { step: '3', title: 'Shortlist', desc: 'Eligible profiles shared with company.' },
            { step: '4', title: 'Interview', desc: 'Structural interview at plant or regional hub.' },
            { step: '5', title: 'Selection', desc: 'Formal offer letters issued to selected pools.' },
            { step: '6', title: 'Onboarding', desc: 'Induction training and onsite deployment.' },
          ].map((item, i) => (
            <div key={i} className="space-y-3 relative p-4 bg-white rounded-xl border border-slate-100 shadow-sm text-center md:text-left">
              <span className="w-7 h-7 bg-purple-50 border border-purple-100 text-[#4B0082] text-xs font-extrabold rounded-full flex items-center justify-center mx-auto md:mx-0">
                {item.step}
              </span>
              <h3 className="text-sm font-bold text-slate-800">{item.title}</h3>
              <p className="text-[11px] text-slate-400 leading-normal">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Fairness Commitments */}
        <div className="p-6 bg-slate-100 border border-slate-200/50 rounded-2xl max-w-3xl mx-auto space-y-4 text-xs font-semibold text-slate-500">
          <h4 className="text-slate-800 text-sm font-extrabold block">Our Fairness Commitments:</h4>
          <p className="font-normal text-slate-600 leading-relaxed">
            • <strong>No Guarantees:</strong> Submission of an application registers you in the database but does not guarantee shortlisting. Profile matching and willingness are the primary criteria.
          </p>
          <p className="font-normal text-slate-600 leading-relaxed">
            • <strong>Data Security:</strong> Submissions are locked directly to the specific sheet and Apps Script endpoint requested by Standard Group. Candidates details are never sold or leaked.
          </p>
          <p className="font-normal text-slate-600 leading-relaxed">
            • <strong>Respectful Communication:</strong> If an application does not qualify, candidates will be treated with absolute respect. No spam notifications will be sent.
          </p>
        </div>
      </section>

      {/* 10. FAQ SECTION */}
      <section id="faq" className="py-20 px-6 bg-slate-100 border-t border-slate-200/50 scroll-mt-20">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-slate-500 font-medium">Quick answers regarding the application process, requirements, and job conditions.</p>
          </div>

          <div className="space-y-4">
            {FAQ_ITEMS.map((faq, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-xl border border-slate-200/50 overflow-hidden shadow-sm transition-all"
              >
                <button 
                  onClick={() => toggleFaq(idx)}
                  className="w-full py-4 px-6 text-left flex justify-between items-center font-bold text-slate-800 hover:text-[#4B0082] transition-colors"
                >
                  <span className="text-sm md:text-base pr-4">{faq.q}</span>
                  {openFaqIndex === idx ? (
                    <ChevronUp className="text-slate-400 shrink-0" size={18} />
                  ) : (
                    <ChevronDown className="text-slate-400 shrink-0" size={18} />
                  )}
                </button>
                
                <div 
                  className={`transition-all duration-300 ease-in-out ${
                    openFaqIndex === idx ? 'max-h-60 border-t border-slate-100 opacity-100 p-6' : 'max-h-0 opacity-0 overflow-hidden'
                  }`}
                >
                  <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-semibold">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col gap-2">
            <span className="font-sans font-extrabold text-white text-lg tracking-tighter">PLACEMEIN</span>
            <p className="text-[10px] text-slate-500">The Hiring Engine © 2026. All rights reserved.</p>
          </div>
          
          <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-white transition-colors">Terms of Use</a>
            <a href="/compliance" className="hover:text-white transition-colors">Compliance</a>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default StandardGroupHiringPage;
