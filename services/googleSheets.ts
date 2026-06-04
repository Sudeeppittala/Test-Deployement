import { CONFIG } from '../config';
import { Job, Application, LeadFormData } from '../types';

const CACHE_KEY = 'placemein_jobs_cache';
const CACHE_DURATION = 0; // Disabled cache so jobs update instantly

interface JobsCache {
  timestamp: number;
  jobs: Job[];
}

export async function fetchOpenJobs(): Promise<Job[]> {
  try {
    // Check cache first
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
      const { timestamp, jobs } = JSON.parse(cachedData) as JobsCache;
      const isValid = Date.now() - timestamp < CACHE_DURATION;
      if (isValid && jobs.length > 0) {
        return jobs;
      }
    }

    const response = await fetch(CONFIG.JOBS_URL);
    const data = await response.json();
    
    if (!data.jobs) return [];

    const jobs = data.jobs.map((job: any) => ({
      jobId: job.job_id || job['Job ID'] || job['jobId'] || '',
      jobTitle: job.job_title || job['Job Title'] || job['jobTitle'] || '',
      jobType: (job.job_type || job['Job Type'] || job['jobType'] || 'Internship') as 'Internship' | 'Full-time',
      location: job.location || job['Location'] || '',
      department: job.department || job['Department'] || '',
      stipend: job.stipend || job['Stipend'] || '',
      duration: job.duration || job['Duration'] || '',
      description: job.description || job['Description'] || '',
      requirements: job.requirements || job['Requirements'] || '',
      deadline: job.application_deadline || job['Application Deadline'] || job['deadline'] || '',
      status: job.status || job['Status'] || job['Job Status'] || job['job_status'] || ''
    }));

    // Update cache
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      timestamp: Date.now(),
      jobs
    }));

    return jobs;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    // Fallback to cache if fetch fails, even if expired
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
       return JSON.parse(cachedData).jobs;
    }
    return [];
  }
}

export async function submitApplication(application: Omit<Application, 'timestamp' | 'status'>): Promise<{ success: boolean; message: string }> {
  try {
    const payload = {
      job_id: application.jobId,
      job_title: application.jobTitle,
      full_name: application.fullName,
      email: application.email,
      phone: application.phone,
      highest_qualification: application.qualification,
      college_university: application.college,
      year_of_graduation: application.gradYear,
      current_location: application.location,
      linkedin_url: application.linkedin,
      why_you: application.whyYou,
      resume_link: application.resumeLink
    };

    const response = await fetch(CONFIG.APPLY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', // Apps Script often handles text/plain better for CORS
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error submitting application:', error);
    return { success: false, message: 'Failed to submit application. Please try again.' };
  }
}

export async function fetchApplications(): Promise<Application[]> {
  try {
    // Assuming the backend supports ?type=applications as hinted
    // If not, this might fail or return jobs. 
    // Given the prompt "Fetch from same jobs endpoint Show all applications (you can add a ?type=applications endpoint later)"
    // I will try ?type=applications.
    const url = CONFIG.JOBS_URL.replace('type=jobs', 'type=applications');
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.applications) return [];

    return data.applications.map((app: any) => ({
      timestamp: app.timestamp || new Date().toISOString(),
      jobId: app.job_id,
      jobTitle: app.job_title,
      fullName: app.full_name,
      email: app.email,
      phone: app.phone,
      qualification: app.highest_qualification,
      college: app.college_university,
      gradYear: app.year_of_graduation,
      location: app.current_location,
      linkedin: app.linkedin_url,
      whyYou: app.why_you,
      resumeLink: app.resume_link,
      status: app.status || 'New'
    }));
  } catch (error) {
    console.error('Error fetching applications:', error);
    return [];
  }
}

export async function submitLead(data: LeadFormData): Promise<{ success: boolean; leadId?: string }> {
  try {
    const response = await fetch(CONFIG.APPLY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', // Apps Script CORS compatibility
      },
      body: JSON.stringify({ ...data, type: 'lead' }),
    });
    const result = await response.json();
    return result;
  } catch (err) {
    console.error('Lead submission error:', err);
    return { success: false };
  }
}
