import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Loader2, Briefcase, MapPin, Clock, IndianRupee, GraduationCap } from 'lucide-react';
import Button from '../components/ui/Button';
import { fetchOpenJobs, submitApplication } from '../services/googleSheets';
import { Job } from '../types';

const CareersPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    window.scrollTo(0, 0);
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const data = await fetchOpenJobs();
      setJobs(data);
    } catch (err) {
      setError('Failed to load jobs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (job: Job) => {
    setSelectedJob(job);
    setSubmitStatus('idle');
  };

  const closeApplication = () => {
    setSelectedJob(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedJob) return;

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    const applicationData = {
      jobId: selectedJob.jobId,
      jobTitle: selectedJob.jobTitle,
      fullName: formData.get('fullName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      qualification: formData.get('qualification') as string,
      college: formData.get('college') as string,
      gradYear: formData.get('gradYear') as string,
      location: formData.get('location') as string,
      linkedin: formData.get('linkedin') as string,
      whyYou: formData.get('whyYou') as string,
      resumeLink: formData.get('resumeLink') as string,
    };

    try {
      const result = await submitApplication(applicationData);
      
      if (result.success) {
        setSubmitStatus('success');
        setTimeout(() => {
          closeApplication();
          setSubmitStatus('idle');
        }, 3000);
      } else {
        setSubmitStatus('error');
      }
    } catch (err) {
      console.error(err);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const internships = jobs.filter(j => j.jobType === 'Internship');
  const fullTimeRoles = jobs.filter(j => j.jobType === 'Full-time');

  return (
    <div className="pt-24 min-h-screen bg-gray-50 font-sans">
      {/* Header / Hero */}
      <section className="py-20 px-6 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-primary-light text-primary text-sm font-semibold mb-4 tracking-wide">
              PLACEMENIN CAREERS
            </span>
            <h1 className="font-bold text-4xl md:text-6xl text-gray-900 mb-6 leading-tight">
              1-Year Paid <span className="text-primary">Internship Program</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Join our high-performance operations team. Earn while you learn.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              <div className="bg-gray-50 px-6 py-3 rounded-xl border border-gray-200">
                <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Stipend</p>
                <p className="text-2xl font-bold text-gray-900">₹15,000<span className="text-sm font-normal text-gray-500">/mo</span></p>
              </div>
              <div className="bg-gray-50 px-6 py-3 rounded-xl border border-gray-200">
                <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">PPO Potential</p>
                <p className="text-2xl font-bold text-gray-900">Up to 7 LPA</p>
              </div>
              <div className="bg-gray-50 px-6 py-3 rounded-xl border border-gray-200">
                <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Duration</p>
                <p className="text-2xl font-bold text-gray-900">1 Year</p>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <Button onClick={() => document.getElementById('openings')?.scrollIntoView({ behavior: 'smooth' })}>
                View Open Roles
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Program Overview */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Join Us?</h2>
              <ul className="space-y-4">
                {[
                  "Real-world operational experience",
                  "Mentorship from industry leaders",
                  "Fast-track career growth",
                  "Performance-based incentives"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-primary-light/30 p-8 rounded-2xl border border-primary/10">
              <h3 className="text-xl font-bold text-primary-dark mb-4">Program Highlights</h3>
              <p className="text-primary-dark/80 mb-4 leading-relaxed">
                This isn't just an internship. It's a launchpad for your career in EdTech and Operations. 
                We're looking for driven individuals who are ready to take ownership from Day 1.
              </p>
              <div className="flex items-center gap-2 text-primary font-medium">
                <GraduationCap className="w-5 h-5" />
                <span>Open to recent graduates (2024-2026)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Openings */}
      <section id="openings" className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-20 text-primary font-medium">
              <AlertCircle className="w-8 h-8 mx-auto mb-2" />
              {error}
            </div>
          ) : (
            <>
              {/* Internships */}
              <div className="mb-16">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                  <Briefcase className="w-6 h-6 text-primary" />
                  Open Internships
                </h2>
                {internships.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {internships.map((job) => (
                      <JobCard key={job.jobId} job={job} onApply={handleApply} />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No internship positions currently open.</p>
                )}
              </div>

              {/* Full-time Roles */}
              {fullTimeRoles.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                    <Briefcase className="w-6 h-6 text-primary" />
                    Full-time Opportunities
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {fullTimeRoles.map((job) => (
                      <JobCard key={job.jobId} job={job} onApply={handleApply} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* How to Apply */}
      <section className="py-20 px-6 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">How to Apply</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "1. Select Role", desc: "Browse open positions and find your fit." },
              { title: "2. Submit Application", desc: "Fill out the form and attach your resume link." },
              { title: "3. Interview", desc: "Shortlisted candidates will be contacted for interviews." }
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="w-12 h-12 bg-primary-light text-primary rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {i + 1}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Modal */}
      <AnimatePresence>
        {selectedJob && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary-dark/20 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-100"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Apply for {selectedJob.jobTitle}</h3>
                  <p className="text-sm text-gray-500">{selectedJob.jobId} • {selectedJob.location}</p>
                </div>
                <button onClick={closeApplication} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
              
              <div className="p-6">
                {submitStatus === 'success' ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-primary-light text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-2">Application Received!</h4>
                    <p className="text-gray-600">Thank you for applying. We will review your application and get back to you shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Full Name *</label>
                        <input name="fullName" required className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Email Address *</label>
                        <input name="email" type="email" required className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Phone Number *</label>
                        <input name="phone" type="tel" required className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Current Location *</label>
                        <input name="location" required className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Highest Qualification *</label>
                        <select name="qualification" required className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all">
                          <option value="">Select...</option>
                          <option value="B.Tech">B.Tech</option>
                          <option value="M.Tech">M.Tech</option>
                          <option value="MBA">MBA</option>
                          <option value="BBA">BBA</option>
                          <option value="B.Sc">B.Sc</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Year of Graduation *</label>
                        <select name="gradYear" required className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all">
                          <option value="">Select...</option>
                          <option value="2026">2026</option>
                          <option value="2025">2025</option>
                          <option value="2024">2024</option>
                          <option value="2023">2023</option>
                          <option value="Earlier">Earlier</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">College / University *</label>
                      <input name="college" required className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">LinkedIn Profile URL</label>
                      <input name="linkedin" type="url" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="https://linkedin.com/in/..." />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Why are you a good fit for this role? *</label>
                      <textarea name="whyYou" rows={3} required className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"></textarea>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Resume Link (Google Drive / Dropbox) *</label>
                      <input name="resumeLink" type="url" required className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="Ensure the link is publicly accessible" />
                      <p className="text-xs text-gray-500">Please upload your resume to Google Drive or Dropbox and paste the shareable link here.</p>
                    </div>

                    {submitStatus === 'error' && (
                      <div className="p-3 bg-primary-light text-primary rounded-lg text-sm flex items-center gap-2 font-medium">
                        <AlertCircle className="w-4 h-4" />
                        Something went wrong. Please try again.
                      </div>
                    )}

                    <div className="pt-4">
                      <Button type="submit" className="w-full py-3" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <span className="flex items-center justify-center gap-2">
                            <Loader2 className="w-5 h-5 animate-spin" /> Submitting...
                          </span>
                        ) : 'Submit Application'}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const JobCard: React.FC<{ job: Job; onApply: (job: Job) => void }> = ({ job, onApply }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col h-full"
  >
    <div className="mb-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-lg text-gray-900 line-clamp-2">{job.jobTitle}</h3>
        <span className="bg-primary-light text-primary text-xs px-2 py-1 rounded font-medium whitespace-nowrap">{job.department}</span>
      </div>
      <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-4">
        <div className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" /> {job.location}
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" /> {job.duration}
        </div>
        <div className="flex items-center gap-1">
          <IndianRupee className="w-3.5 h-3.5" /> {job.stipend}
        </div>
      </div>
      <p className="text-gray-600 text-sm line-clamp-3 mb-4">{job.description}</p>
    </div>
    <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
      <span className="text-xs text-gray-400">Deadline: {job.deadline}</span>
      <Button onClick={() => onApply(job)} size="sm">Apply Now</Button>
    </div>
  </motion.div>
);

export default CareersPage;