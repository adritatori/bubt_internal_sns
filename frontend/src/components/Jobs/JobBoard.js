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
  const [showMatches, setShowMatches] = useState(false);
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

  const handleViewMatches = (jobId) => {
    setSelectedJob(jobId);
    setShowMatches(true);
  };

  const handleCloseMatches = () => {
    setShowMatches(false);
    setSelectedJob(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Job Posting Form for Alumni */}
      {user.role === 'alumni' && (
        <JobPosting onJobPosted={fetchJobs} />
      )}

      {/* Jobs List */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6">Available Jobs</h2>
        <div className="space-y-6">
          {jobs.map(job => (
            <JobCard
              key={job._id}
              job={job}
              currentUser={user}
              onViewMatches={() => handleViewMatches(job._id)}
            />
          ))}
        </div>
      </div>

      {/* Matches Modal */}
      {showMatches && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <JobMatches 
              jobId={selectedJob} 
              onClose={handleCloseMatches}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default JobBoard;