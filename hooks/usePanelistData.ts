/*
 * GOOGLE SHEET SETUP — ROUNDTABLE PANELISTS & ATTENDEES
 * -------------------------------------------------------
 * 1. Open Google Sheets and create a new sheet.
 * 2. Create two tabs named exactly: "Panelists" and "Attendees"
 * 3. Add column headers exactly as defined below.
 * 4. File → Share → Publish to web
 *    → Select "Panelists" tab → Format: CSV → Publish → Copy URL
 *    → Repeat for "Attendees" tab → Copy URL
 * 5. Add both URLs to your .env file:
 *    VITE_PANELISTS_SHEET_URL=<URL here>
 *    VITE_ATTENDEES_SHEET_URL=<URL here>
 * 6. Restart dev server. Live sheet data will now render.
 * 7. To update a panelist: edit the row → changes appear in ~1–2 minutes.
 * 8. To hide someone without deleting: set visible to FALSE.
 * 9. To add someone new: add a new row → card appears automatically.
 */

import { useState, useEffect } from 'react';

export interface Panelist {
  id: string;
  name: string;
  designation: string;
  company: string;
  role: string;
  bio: string;
  profile_pic_url: string;
  linkedin_url: string;
  visible: string;
}

const PLACEHOLDER_PANELISTS: Panelist[] = [
  {
    id: "1",
    name: "Dr. Mantela Gaud Ramchandar",
    designation: "CHRO & Board Advisor",
    company: "Placemein Advisory Council",
    role: "PANEL HOST",
    bio: "Over 25 years of strategic HR leadership, scaling high-performing global teams and advising corporate boards on workforce transformation.",
    profile_pic_url: "",
    linkedin_url: "",
    visible: "TRUE"
  },
  {
    id: "2",
    name: "Panelist Name Here",
    designation: "Chief People Officer",
    company: "Company Name",
    role: "PANELIST",
    bio: "Short credential bio will appear here once the panelist is confirmed and added to the Google Sheet.",
    profile_pic_url: "",
    linkedin_url: "",
    visible: "TRUE"
  },
  {
    id: "3",
    name: "Panelist Name Here",
    designation: "VP of Talent Acquisition",
    company: "Company Name",
    role: "PANELIST",
    bio: "Short credential bio will appear here once the panelist is confirmed and added to the Google Sheet.",
    profile_pic_url: "",
    linkedin_url: "",
    visible: "TRUE"
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
  const [panelists, setPanelists] = useState<Panelist[]>(PLACEHOLDER_PANELISTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchPanelists = async () => {
      const sheetUrl = (import.meta as any).env.VITE_PANELISTS_SHEET_URL;
      
      if (!sheetUrl) {
        // Silently use placeholders if env variable is not set
        setPanelists(PLACEHOLDER_PANELISTS.filter(p => p.visible === "TRUE"));
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

        // Normalize visible field and filter
        const visibleList = parsed
          .map((item: any) => ({
            id: String(item.id || ''),
            name: String(item.name || ''),
            designation: String(item.designation || ''),
            company: String(item.company || ''),
            role: String(item.role || 'PANELIST'),
            bio: String(item.bio || ''),
            profile_pic_url: String(item.profile_pic_url || ''),
            linkedin_url: String(item.linkedin_url || ''),
            visible: String(item.visible || 'FALSE').toUpperCase()
          }))
          .filter((item: any) => item.visible === "TRUE");

        setPanelists(visibleList);
      } catch (err) {
        console.error("Failed to load panelists from sheet, falling back to placeholders:", err);
        setError(err);
        setPanelists(PLACEHOLDER_PANELISTS.filter(p => p.visible === "TRUE"));
      } finally {
        setLoading(false);
      }
    };

    fetchPanelists();
  }, []);

  return { panelists, loading, error };
}
