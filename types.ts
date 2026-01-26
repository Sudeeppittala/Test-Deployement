
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
