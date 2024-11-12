// components/Jobs/JobBoard.js
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import JobCard from './JobCard';
import JobMatches from './JobMatches';
import JobPosting from '../JobPosting/JobPosting';
import api from '../../utils/api';

const JobBoard = () => {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/jobs');
      setJobs(res.data);
    } catch (err) {
      setError('Error fetching jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId) => {
    try {
      await api.put(`/jobs/${jobId}/apply`);
      // Refresh jobs list after applying
      fetchJobs();
    } catch (err) {
      setError('Error applying for job');
    }
  };

  const handleViewMatches = (jobId) => {
    setSelectedJob(jobId);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {user.role === 'alumni' && <JobPosting onJobPosted={fetchJobs} />}
      
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Available Jobs</h2>
        <div className="space-y-4">
          {jobs.map(job => (
            <JobCard
              key={job._id}
              job={job}
              currentUser={user}
              onApply={handleApply}
              onViewMatches={handleViewMatches}
            />
          ))}
        </div>
      </div>

      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full m-4 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Matching Candidates</h2>
              <button onClick={() => setSelectedJob(null)}>Close</button>
            </div>
            <JobMatches jobId={selectedJob} />
          </div>
        </div>
      )}
    </div>
  );
};

export default JobBoard;