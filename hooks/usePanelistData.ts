import { useState, useEffect } from 'react';

export interface Panelist {
  id: string;
  name: string;
  title: string;
  linkedinUrl: string;
  imageUrl: string;
  tag: string;
  coreDomain: string;
}

const PRODUCTION_PANELISTS: Panelist[] = [
  {
    id: "host-1",
    name: "Pittala Sai Sudeep",
    title: "Chief Operations Officer (COO), Placemein HR Solutions",
    linkedinUrl: "https://in.linkedin.com/in/saisudeeppittala",
    imageUrl: "https://res.cloudinary.com/dp9jnvstr/image/upload/v1783003641/Sudeep_udmpsr.jpg",
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
  },
  {
    id: "panelist-3",
    name: "Radha Gayathri M",
    title: "Senior HR Executive & Talent Acquisition Leader",
    linkedinUrl: "https://www.linkedin.com/in/radha-gayathri-m/",
    imageUrl: "https://res.cloudinary.com/dp9jnvstr/image/upload/v1782998383/Radha_k6upbf.jpg",
    tag: "Workforce Scaling",
    coreDomain: "Corporate Talent Strategy & Workforce Scaling"
  },
  {
    id: "panelist-4",
    name: "Sreedhar Ellentala",
    title: "Global Head of IT & Human Resources",
    linkedinUrl: "https://www.linkedin.com/in/sreedhar-ellentala-7b04681b2/",
    imageUrl: "https://res.cloudinary.com/dp9jnvstr/image/upload/v1782998384/Sreedhar_nmru5v.jpg",
    tag: "HR Technology",
    coreDomain: "Technology-HR Infrastructure Overhaul"
  },
  {
    id: "panelist-5",
    name: "Dr. Mruthyanjaya Rao Mangipudi",
    title: "Head of Corporate HR, Renowned Academic & Author",
    linkedinUrl: "https://www.linkedin.com/in/mruthyanjayarao/",
    imageUrl: "https://res.cloudinary.com/dp9jnvstr/image/upload/v1782998384/Mruthyajaya_cdsxkl.jpg",
    tag: "Human Potential",
    coreDomain: "Human Potential & Organizational Dynamics"
  },
  {
    id: "panelist-6",
    name: "Vedavathy G",
    title: "HR Leader & Talent Management Strategist",
    linkedinUrl: "https://www.linkedin.com/in/vedavathy-g-90443a28/",
    imageUrl: "https://res.cloudinary.com/dp9jnvstr/image/upload/v1782998384/Vedavathy_uwmgsa.jpg",
    tag: "Capability Frameworks",
    coreDomain: "Capability Frameworks & Mindset Transitions"
  },
  {
    id: "panelist-7",
    name: "Sarvani Vutukuri, SHRM-SCP",
    title: "Senior Certified HR Professional & Strategic TA Partner",
    linkedinUrl: "https://www.linkedin.com/in/sarvani-vutukuri-shrm-scp/",
    imageUrl: "https://res.cloudinary.com/dp9jnvstr/image/upload/v1782998383/Sarvani_apof2q.jpg",
    tag: "AI Recruiting & SHRM",
    coreDomain: "Zero-Latency Recruiting & AI Governance in Hiring"
  }
];

function parseCSV(csvText: string): any[] {
  const result: string[][] = [];
  let row: string[] = [''];
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        row[row.length - 1] += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push('');
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      if (row.length > 1 || row[0] !== '') {
        result.push(row);
      }
      row = [''];
    } else {
      row[row.length - 1] += char;
    }
  }
  if (row.length > 1 || row[0] !== '') {
    result.push(row);
  }

  if (result.length < 2) return [];

  const headers = result[0].map(h => h.trim().toLowerCase().replace(/"/g, ''));
  const dataRows = result.slice(1);

  return dataRows.map(row => {
    const obj: any = {};
    headers.forEach((header, index) => {
      obj[header] = (row[index] || '').trim();
    });
    return obj;
  });
}

export function usePanelistData() {
  const [panelists, setPanelists] = useState<Panelist[]>(PRODUCTION_PANELISTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchPanelists = async () => {
      const sheetUrl = (import.meta as any).env.VITE_PANELISTS_SHEET_URL;
      
      if (!sheetUrl) {
        setPanelists(PRODUCTION_PANELISTS);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(sheetUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch sheet: ${response.statusText}`);
        }
        const text = await response.text();
        const parsed = parseCSV(text);

        // Normalize sheet headers dynamically supporting both old and new layouts
        const visibleList = parsed
          .map((item: any) => ({
            id: String(item.id || ''),
            name: String(item.name || ''),
            title: String(item.title || item.designation || ''),
            linkedinUrl: String(item.linkedinurl || item.linkedin_url || ''),
            imageUrl: String(item.imageurl || item.profile_pic_url || ''),
            tag: String(item.tag || item.role || 'PANELIST'),
            coreDomain: String(item.coredomain || item.bio || ''),
            visible: String(item.visible || 'TRUE').toUpperCase()
          }))
          .filter((item: any) => item.visible === "TRUE");

        setPanelists(visibleList.length > 0 ? visibleList : PRODUCTION_PANELISTS);
      } catch (err) {
        console.error("Failed to load panelists from sheet, falling back to static production list:", err);
        setError(err);
        setPanelists(PRODUCTION_PANELISTS);
      } finally {
        setLoading(false);
      }
    };

    fetchPanelists();
  }, []);

  return { panelists, loading, error };
}
