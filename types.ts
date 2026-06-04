
export interface Job {
  jobId: string;
  jobTitle: string;
  jobType: 'Internship' | 'Full-time';
  location: string;
  department: string;
  stipend: string;
  duration: string;
  description: string;
  requirements: string;
  deadline: string;
  status?: string;
}

export interface Application {
  timestamp: string;
  jobId: string;
  jobTitle: string;
  fullName: string;
  email: string;
  phone: string;
  qualification: string;
  college: string;
  gradYear: string;
  location: string;
  linkedin: string;
  whyYou: string;
  resumeLink: string;
  status: 'New' | 'Shortlisted' | 'Interviewed' | 'Selected' | 'Rejected';
}

export interface LeadFormData {
  type: 'lead';
  preferredRole: string;
  name: string;
  email: string;
  studentPhNumber: string;
  parentNumber: string;
  department: string;
  collegeName: string;
  tpoName?: string;
  tpoMobileNumber?: string;
  qualification: string;
  gradMode: 'percentage' | 'cgpa';          // Toggle: Percentage or CGPA
  highestGraduationPercentage: string;       // Stores value in the selected mode
  yearOfPassing: string;
  tenthPassoutYear: string;
  tenthStandard: string;
  twelfthPassoutYear: string;
  twelfthStandard: string;
  studentSkills: string;   // comma-separated string e.g. "Python, HTML, CSS"
  ArrearsCount: string;
  location: string;
  linkedinUrl?: string;              // LinkedIn profile URL
  gender?: string;                   // Male / Female / Prefer not to say
  experienceLevel?: string;          // Fresher / 0-1 yr / 1-3 yrs etc.
  internshipType?: string;           // Remote / In-Office / Hybrid
  referralSource?: string;           // How they heard about Placemein
  resumeLink?: string;
  whyYou?: string;
}

export enum Audience {
  Colleges = 'Colleges',
  Students = 'Students',
  Corporates = 'Corporates',
  Institutes = 'Institutes',
}

export type PageId = 'home' | 'students' | 'colleges' | 'hiring' | 'partners';

export interface PersonaContent {
  id: PageId;
  hero: {
    headline: string;
    subheadline: string;
    cta: string;
  };
  whoThisIsFor: string[];
  howWeHelp: string[];
  connectivity: {
    title: string;
    bullets: { label: string; text: string }[];
  };
  howItWorks: { title: string; desc: string; num: string }[];
  proof: string[];
  faq: { question: string; answer: string }[];
}
