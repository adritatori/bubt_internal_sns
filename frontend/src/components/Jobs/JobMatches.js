// components/Jobs/JobMatchesPage.js
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import pythonApi from '../../utils/api';

const JobMatchesPage = () => {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAlumniJobs();
  }, []);

  const fetchAlumniJobs = async () => {
    try {
      const res = await pythonApi.get('/jobs?user=' + user._id);
      setJobs(res.data);
    } catch (err) {
      setError(`Error fetching your jobs: ${err.message}`);
      console.error("Error in fetchAlumniJobs:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMatches = async (jobId) => {
    try {
      setLoading(true);
      console.log(`Fetching matches for job ID: ${jobId}`);
      
      const res = await pythonApi.get(`/jobs/${jobId}/matches`); // Updated endpoint
      
      if (res.data) {
        setMatches(res.data);
        setSelectedJob(jobId);
      } else {
        throw new Error('Invalid response data from server');
      }
    } catch (err) {
      setError(`Error fetching matches: ${err.message}`);
      console.error("Error in fetchMatches:", err);
    } finally {
      setLoading(false);
    }
  };


  if (!user) {
    return <div>Access denied. Alumni only.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Job Matches</h1>
      
      {/* Job Selection */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Select a Job to View Matches</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <button
              key={job._id}
              onClick={() => fetchMatches(job._id)}
              className={`p-4 rounded-lg border ${
                selectedJob === job._id 
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              <h3 className="font-medium">{job.title}</h3>
              <p className="text-sm text-gray-500">{job.company}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Matches Display or Message */}
      {selectedJob ? (
        <div className="mt-8">
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : matches.length > 0 ? (
            <div>
              <h2 className="text-xl font-semibold mb-4">Matching Candidates</h2>
              <div className="space-y-4">
                {matches.map(({ student, matchScore }) => (
                  <div key={student._id} className="bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{student.name}</h3>
                    <p className="text-sm text-gray-500">{student.department}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">Match Score</div>
                    <div className="text-lg font-bold text-blue-600">
                      {(matchScore * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
                
                {student.skills?.length > 0 && (
                  <div className="mt-2">
                    <div className="text-sm font-medium">Skills</div>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {student.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
          ) : (
            <div className="text-gray-500">No students matched with this job.</div>
      )}
    </div>
      ) : null}
    </div>
  );
};

export default JobMatchesPage;