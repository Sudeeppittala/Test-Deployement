
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
