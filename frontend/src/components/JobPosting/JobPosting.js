import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../utils/api';

const JobPosting = ({ onJobPosted }) => {
  const { user } = useContext(AuthContext);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    location: '',
    type: 'full-time',
    requirements: [],
    requiredSkills: [],
    preferredSkills: [],
    education: 'Bachelors',
    experienceLevel: 'Entry Level',
    salary: {
      range: {
        min: '',
        max: ''
      },
      type: 'monthly',
      negotiable: true
    },
    applicationDeadline: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const jobData = {
        title: formData.title,
        company: formData.company,
        location: formData.location,
        description: formData.description,
        type: formData.type,
        education: formData.education,
        experienceLevel: formData.experienceLevel,
        applicationDeadline: formData.applicationDeadline,
        requirements: Array.isArray(formData.requirements) 
          ? formData.requirements 
          : formData.requirements.split(',').map(req => req.trim()).filter(Boolean),
        requiredSkills: Array.isArray(formData.requiredSkills)
          ? formData.requiredSkills
          : formData.requiredSkills.split(',').map(skill => skill.trim()).filter(Boolean),
        preferredSkills: Array.isArray(formData.preferredSkills)
          ? formData.preferredSkills
          : formData.preferredSkills.split(',').map(skill => skill.trim()).filter(Boolean),
        salary: {
          range: {
            min: parseInt(formData.salary.range.min) || 0,
            max: parseInt(formData.salary.range.max) || 0
          },
          type: formData.salary.type,
          negotiable: formData.salary.negotiable
        },
        status: 'open'
      };

      const res = await api.post('/jobs', jobData);
      
      if (onJobPosted) {
        onJobPosted(res.data);
      }

      // Reset form
      setFormData({
        title: '',
        company: '',
        description: '',
        location: '',
        type: 'full-time',
        requirements: [],
        requiredSkills: [],
        preferredSkills: [],
        education: 'Bachelors',
        experienceLevel: 'Entry Level',
        salary: {
          range: { min: '', max: '' },
          type: 'monthly',
          negotiable: true
        },
        applicationDeadline: ''
      });

    } catch (err) {
      console.error('Error details:', err.response?.data || err.message);
      setError(
        err.response?.data?.message || 
        'Error posting job. Please make sure all required fields are filled correctly.'
      );
    } finally {
      setLoading(false);
    }
  };

  // if (user.role !== 'alumni') {
  //   return null;
  // }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-6">Post a New Job</h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Job Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Company</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Description and Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Job Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        {/* Skills and Requirements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Required Skills (comma-separated)</label>
            <input
              type="text"
              value={Array.isArray(formData.requiredSkills) ? formData.requiredSkills.join(', ') : formData.requiredSkills}
              onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Preferred Skills (comma-separated)</label>
            <input
              type="text"
              value={Array.isArray(formData.preferredSkills) ? formData.preferredSkills.join(', ') : formData.preferredSkills}
              onChange={(e) => setFormData({ ...formData, preferredSkills: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Additional Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Education Level</label>
            <select
              value={formData.education}
              onChange={(e) => setFormData({ ...formData, education: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="Bachelors">Bachelor's Degree</option>
              <option value="Masters">Master's Degree</option>
              <option value="PhD">PhD</option>
              <option value="Any">Any</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Experience Level</label>
            <select
              value={formData.experienceLevel}
              onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="Entry Level">Entry Level</option>
              <option value="Mid Level">Mid Level</option>
              <option value="Senior Level">Senior Level</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Job Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="internship">Internship</option>
              <option value="contract">Contract</option>
              <option value="remote">Remote</option>
            </select>
          </div>
        </div>

        {/* Salary Range */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Minimum Salary</label>
            <input
              type="number"
              value={formData.salary.range.min}
              onChange={(e) => setFormData({
                ...formData,
                salary: {
                  ...formData.salary,
                  range: { ...formData.salary.range, min: e.target.value }
                }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Maximum Salary</label>
            <input
              type="number"
              value={formData.salary.range.max}
              onChange={(e) => setFormData({
                ...formData,
                salary: {
                  ...formData.salary,
                  range: { ...formData.salary.range, max: e.target.value }
                }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Salary Type</label>
            <select
              value={formData.salary.type}
              onChange={(e) => setFormData({
                ...formData,
                salary: { ...formData.salary, type: e.target.value }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Application Deadline</label>
          <input
            type="date"
            value={formData.applicationDeadline}
            onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full ${
            loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
        >
          {loading ? 'Posting...' : 'Post Job'}
        </button>
      </form>
    </div>
  );
};

export default JobPosting;