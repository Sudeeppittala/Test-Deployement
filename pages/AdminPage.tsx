import React, { useState, useEffect } from 'react';
import { fetchApplications } from '../services/googleSheets';
import { Application } from '../types';
import { CONFIG } from '../config';
import Button from '../components/ui/Button';
import { Loader2, Search, Filter, Download, ExternalLink } from 'lucide-react';

const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterJobId, setFilterJobId] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === CONFIG.ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      loadApplications();
    } else {
      setError('Invalid credentials');
    }
  };

  const loadApplications = async () => {
    setLoading(true);
    try {
      const data = await fetchApplications();
      // Sort by timestamp desc
      data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setApplications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredApps = applications.filter(app => {
    const matchesJob = filterJobId ? app.jobId.toLowerCase().includes(filterJobId.toLowerCase()) : true;
    const matchesStatus = filterStatus ? app.status === filterStatus : true;
    return matchesJob && matchesStatus;
  });

  const exportToCSV = () => {
    const headers = ['Timestamp', 'Job ID', 'Name', 'Email', 'Phone', 'Qualification', 'College', 'Grad Year', 'Location', 'LinkedIn', 'Why You', 'Resume', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredApps.map(app => [
        `"${app.timestamp}"`,
        `"${app.jobId}"`,
        `"${app.fullName}"`,
        `"${app.email}"`,
        `"${app.phone}"`,
        `"${app.qualification}"`,
        `"${app.college}"`,
        `"${app.gradYear}"`,
        `"${app.location}"`,
        `"${app.linkedin}"`,
        `"${app.whyYou.replace(/"/g, '""')}"`,
        `"${app.resumeLink}"`,
        `"${app.status}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'applications_export.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full">Login</Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-6 pb-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Application Dashboard</h1>
            <p className="text-gray-500">Manage and track candidate applications</p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={loadApplications} disabled={loading}>
              Refresh
            </Button>
            <Button onClick={exportToCSV} className="flex items-center gap-2">
              <Download className="w-4 h-4" /> Export CSV
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              placeholder="Filter by Job ID..." 
              value={filterJobId}
              onChange={(e) => setFilterJobId(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
          <div className="w-full md:w-48 relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none appearance-none bg-white"
            >
              <option value="">All Statuses</option>
              <option value="New">New</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interviewed">Interviewed</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-20 flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Candidate</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Qualification</th>
                    <th className="px-6 py-4">Resume</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredApps.length > 0 ? (
                    filteredApps.map((app, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {new Date(app.timestamp).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{app.fullName}</div>
                          <div className="text-gray-500 text-xs">{app.email}</div>
                          <div className="text-gray-500 text-xs">{app.phone}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-gray-900">{app.jobTitle}</div>
                          <div className="text-xs text-gray-500 font-mono bg-gray-100 inline-block px-1 rounded mt-1">{app.jobId}</div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {app.qualification} <br/>
                          <span className="text-xs text-gray-400">{app.gradYear}</span>
                        </td>
                        <td className="px-6 py-4">
                          {app.resumeLink ? (
                            <a href={app.resumeLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                              View <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-gray-400">No link</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                            app.status === 'New' ? 'bg-primary-light text-primary border-primary/20' :
                            app.status === 'Shortlisted' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                            app.status === 'Selected' ? 'bg-green-50 text-green-700 border-green-100' :
                            app.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-100' :
                            'bg-gray-50 text-gray-700 border-gray-100'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        No applications found matching your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
