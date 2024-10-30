import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../utils/api';

const JobBoard = () => {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    requirements: '',
    location: '',
    type: 'full-time'
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get('/posts?type=job');
      setJobs(res.data);
    } catch (err) {
      setError('Error fetching jobs');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/posts', {
        ...formData,
        postType: 'job',
        content: JSON.stringify({
          ...formData,
          postedBy: user.name,
          postedAt: new Date()
        })
      });
      setJobs([res.data, ...jobs]);
      setFormData({
        title: '',
        company: '',
        description: '',
        requirements: '',
        location: '',
        type: 'full-time'
      });
    } catch (err) {
      setError('Error posting job');
    }
  };

  return (
    <div>
      {(user.role === 'teacher' || user.role === 'alumni') && (
        <div>
          <h2>Post a Job</h2>
          {error && <div>{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Job Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <input
              type="text"
              placeholder="Company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            />
            <textarea
              placeholder="Job Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <textarea
              placeholder="Requirements"
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
            />
            <input
              type="text"
              placeholder="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="internship">Internship</option>
            </select>
            <button type="submit">Post Job</button>
          </form>
        </div>
      )}

      <div>
        <h2>Available Jobs</h2>
        {jobs.map(job => {
          const jobDetails = JSON.parse(job.content);
          return (
            <div key={job._id}>
              <h3>{jobDetails.title}</h3>
              <h4>{jobDetails.company}</h4>
              <p>Location: {jobDetails.location}</p>
              <p>Type: {jobDetails.type}</p>
              <p>Description: {jobDetails.description}</p>
              <p>Requirements: {jobDetails.requirements}</p>
              <p>Posted by: {job.user.name}</p>
              <p>Posted: {new Date(job.createdAt).toLocaleDateString()}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default JobBoard;