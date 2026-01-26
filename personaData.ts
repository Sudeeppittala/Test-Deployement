
import { PersonaContent } from './types';

export const PERSONA_PAGES: Record<string, PersonaContent> = {
  students: {
    id: 'students',
    hero: {
      headline: "Launch your tech career. Fast.",
      subheadline: "Get access to 25+ interview opportunities in 90 days. We bridge the gap between your degree and your first day at work.",
      cta: "Apply for 90-day sprint"
    },
    whoThisIsFor: [
      "Final-year students looking for a head-start.",
      "Recent graduates struggling to land their first role.",
      "Career switchers entering the tech ecosystem.",
      "Professionals with 0–3 years of experience seeking a pivot."
    ],
    howWeHelp: [
      "Interview-Ready Profile: We build your portfolio, not just a resume.",
      "The 90-Day Sprint: Intensive, role-specific technical and soft-skill prep.",
      "Direct Access: Skip the 'Apply' button; get invited to exclusive drives.",
      "Mock Rounds: Real-world interview simulations with industry experts."
    ],
    connectivity: {
      title: "The Connectivity Advantage",
      bullets: [
        { label: "Corporates", text: "Because we work with Corporates, you get access to roles that aren't posted on public job boards." },
        { label: "Colleges", text: "Because we work with Colleges, you gain early access to campus-integrated placement cycles." },
        { label: "Ed-Techs/Institutes", text: "Because we work with Ed-Techs, you can join curated upskilling cohorts to close specific skill gaps." }
      ]
    },
    howItWorks: [
      { num: "01", title: "Join Sprint", desc: "Apply and undergo a 360-degree skill audit." },
      { num: "02", title: "Get Trained & Profiled", desc: "Refine your technical stack and communication through curated drills." },
      { num: "03", title: "Attend Curated Interviews", desc: "Attend back-to-back drives with our 500+ corporate partners." }
    ],
    proof: [
      "25+ interview opportunities in 90 days",
      "Average salary hike of 45% for early-pros",
      "500,000+ verified job seekers in network",
      "Dedicated career coach for every candidate"
    ],
    faq: [
      { question: "Is there a fee?", answer: "We have a transparent program fee for the 90-day sprint which includes all training and interview access." },
      { question: "What roles do you offer?", answer: "Development, Data, Cloud, Security, and high-growth non-tech roles." },
      { question: "Is it remote?", answer: "We support both remote-first and on-site opportunities depending on the corporate partner." },
      { question: "What if I don't get placed?", answer: "We provide continuous support and interview access throughout the cycle until you find the right fit." }
    ]
  },
  colleges: {
    id: 'colleges',
    hero: {
      headline: "We run your placements.",
      subheadline: "The plug-and-play placement cell for modern institutions. Up to 25 interview opportunities per eligible student in 90 days.",
      cta: "Book a pilot drive"
    },
    whoThisIsFor: [
      "Engineering and Degree colleges aiming for 100% placements.",
      "T&P Officers (TPOs) looking to automate operational overhead.",
      "Multi-campus groups needing centralized placement management."
    ],
    howWeHelp: [
      "Managed Drives: We bring the companies to you, from outreach to offers.",
      "Industry-Aligned Prep: We train students based on real-time corporate demand.",
      "Outcome Dashboards: Real-time visibility into student performance and hiring status.",
      "Silent Engine: We work as an extension of your existing T&P cell."
    ],
    connectivity: {
      title: "The Connectivity Advantage",
      bullets: [
        { label: "Corporates", text: "Because we work with Corporates, your placement drives map to live hiring needs and annual talent calendars." },
        { label: "Job Seekers", text: "Because we work with Job Seekers, we know exactly where students fail and fix it before your drives start." },
        { label: "Ed-Techs/Institutes", text: "Because we work with Ed-Techs, your non-CS students can join curated upskilling cohorts." }
      ]
    },
    howItWorks: [
      { num: "01", title: "Diagnose Batches", desc: "Identify placement-ready vs. training-needed students." },
      { num: "02", title: "Train & Pre-screen", desc: "Targeted prep cycles ensure students meet industry bars." },
      { num: "03", title: "Run Drives", desc: "We run pooled and exclusive drives, managing the entire schedule." }
    ],
    proof: [
      "3-month pilot cycles",
      "90% reduction in manual placement ops",
      "Automated T&P reporting dashboards",
      "Pan-India corporate network access"
    ],
    faq: [
      { question: "Do we lose control of our cell?", answer: "No, we act as your operational layer, providing full data transparency while you maintain final authority." },
      { question: "What is the minimum batch size?", answer: "We support both small specialized cohorts and large university-wide batches." },
      { question: "How do you handle reporting?", answer: "You get a dedicated dashboard with real-time offer tracking and student progress analytics." },
      { question: "Is there a setup cost?", answer: "We offer a 3-month pilot to prove value with zero upfront commitment." }
    ]
  },
  hiring: {
    id: 'hiring',
    hero: {
      headline: "Hire talent without the chaos.",
      subheadline: "Your fresher and lateral hiring engine. Access pre-vetted shortlists and managed campus drives with zero friction.",
      cta: "Request talent pipeline"
    },
    whoThisIsFor: [
      "Fast-growing startups needing Day-1 productive talent.",
      "IT Services companies scaling for massive project demands.",
      "HR teams looking to outsource the 'sourcing and screening' noise."
    ],
    howWeHelp: [
      "Demand-Aligned Sourcing: We source based on your specific tech stack and culture.",
      "Pre-Vetted Talent: Every candidate has cleared our rigorous internal audits.",
      "Full Coordination: We handle scheduling, feedback loops, and offer follow-ups.",
      "Lateral & Fresher Mix: A single partner for both entry-level and early-career roles."
    ],
    connectivity: {
      title: "The Connectivity Advantage",
      bullets: [
        { label: "Colleges", text: "Because we work with Colleges, you get a direct, ready-to-hire fresher pipeline from across India." },
        { label: "Job Seekers", text: "Because we work with Job Seekers, you get a pipeline of candidates that is always-on and pre-screened." },
        { label: "Ed-Techs/Institutes", text: "Because we work with Ed-Techs, you get talent trained specifically on the stacks your projects require." }
      ]
    },
    howItWorks: [
      { num: "01", title: "Share Roles", desc: "Define your stack, requirements, and hiring timeline." },
      { num: "02", title: "Get Shortlists", desc: "Receive pre-screened shortlists that meet your Day-1 productive bar." },
      { num: "03", title: "Run Coordinated Drives", desc: "Execute interviews and drives with our HR Ops support." }
    ],
    proof: [
      "Time-to-hire reduced by 60%",
      "Candidate retention rate of 92%",
      "Pre-vetted shortlists in 48 hours",
      "Full HR Ops layer support"
    ],
    faq: [
      { question: "What is the billing model?", answer: "We offer flexible success-based or monthly retainer models depending on your volume." },
      { question: "How fast can we hire?", answer: "Qualified shortlists are typically delivered within 48–72 hours." },
      { question: "Are candidates pre-vetted?", answer: "Yes, they undergo technical assessments, behavioral screens, and background checks." },
      { question: "Can you handle bulk hiring?", answer: "Yes, we specialize in managing large-scale pooled drives for mass hiring needs." }
    ]
  },
  partners: {
    id: 'partners',
    hero: {
      headline: "Plug into our drive network.",
      subheadline: "Plug your learners into our massive drive network. Fulfill your job-assistance promise with shared corporate access.",
      cta: "Partner with us"
    },
    whoThisIsFor: [
      "Coding bootcamps looking to improve their placement percentages.",
      "Training institutes with great curriculum but limited corporate reach.",
      "Ed-Tech platforms offering job-assistance promises."
    ],
    howWeHelp: [
      "Shared Drives: Your students join our existing corporate drive calendar.",
      "Corporate Trust: Leverage our established reputation to get your learners in the door.",
      "Co-branded Events: Host hiring marathons and hackathons powered by our network.",
      "Outcome Reporting: Reliable data to back up your marketing placement claims."
    ],
    connectivity: {
      title: "The Connectivity Advantage",
      bullets: [
        { label: "Colleges", text: "Because we work with Colleges, your learners get access to bulk fresher drives across multiple campuses." },
        { label: "Corporates", text: "Because we work with Corporates, they trust your pipeline through our established vetting standards." },
        { label: "Job Seekers", text: "Because we work with Job Seekers from multiple channels, your overall placement success rate grows." }
      ]
    },
    howItWorks: [
      { num: "01", title: "Sign Partnership", desc: "Map your batches and sync curriculum with our demand segments." },
      { num: "02", title: "Map Your Batches", desc: "Integrate your learners into our placement dashboard for tracking." },
      { num: "03", title: "Plug into Shared Drives", desc: "Students begin attending drives with our 500+ corporate partners." }
    ],
    proof: [
      "Increases placement conversion by up to 2x",
      "Real-time partner dashboard access",
      "25+ interview drives per quarter",
      "Shared placement reporting data"
    ],
    faq: [
      { question: "Do we have to re-train students?", answer: "No, we provide the 'Placement Layer' to complement your existing training." },
      { question: "Is this an exclusive partnership?", answer: "We offer both exclusive and non-exclusive collaboration models." },
      { question: "Which regions do you cover?", answer: "We operate pan-India with a focus on major tech hubs." },
      { question: "How do we share data?", answer: "We provide a secure partner portal for easy candidate data uploads." }
    ]
  }
};
