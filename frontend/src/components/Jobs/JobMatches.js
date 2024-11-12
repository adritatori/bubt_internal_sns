import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../utils/api';

const JobMatches = ({ jobId }) => {
  const { user } = useContext(AuthContext);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/jobs/${jobId}/matches`);
        setMatches(res.data);
      } catch (err) {
        setError('Error fetching matches');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (jobId && user?.role === 'alumni') {
      fetchMatches();
    }
  }, [jobId, user]);

  if (!user?.role === 'alumni') {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Potential Candidates</h2>
      <div className="space-y-4">
        {matches.map(({ student, matchScore }) => (
          <div 
            key={student._id} 
            className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={student.profileImage || '/default-avatar.png'}
                  alt={student.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-medium text-gray-900">{student.name}</h3>
                  <p className="text-sm text-gray-500">{student.department}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  Match Score
                </div>
                <div className="text-lg font-bold text-blue-600">
                  {(matchScore * 100).toFixed(1)}%
                </div>
              </div>
            </div>
            
            {student.skills.length > 0 && (
              <div className="mt-2">
                <div className="text-sm font-medium text-gray-700">Skills</div>
                <div className="flex flex-wrap gap-1 mt-1">
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

            {student.achievements.length > 0 && (
              <div className="mt-2">
                <div className="text-sm font-medium text-gray-700">Achievements</div>
                <ul className="text-sm text-gray-600 list-disc list-inside">
                  {student.achievements.map((achievement, index) => (
                    <li key={index}>{achievement}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobMatches;