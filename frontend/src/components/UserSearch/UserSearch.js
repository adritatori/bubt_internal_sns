import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../utils/api';

const UserSearch = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.get(`/users/search?term=${searchTerm}`);
      setSearchResults(res.data);
      setError('');
    } catch (err) {
      console.error('Error searching users:', err);
      setError('Error searching users. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollow = async (userId) => {
    try {
      const res = await api.put(`/users/follow/${userId}`);
      setSearchResults(searchResults.map(result => 
        result._id === userId ? { ...result, isFollowing: res.data.isFollowing } : result
      ));
    } catch (err) {
      console.error('Error following user:', err);
      setError('Error updating follow status. Please try again.');
    }
  };

  const handleProfileClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Search Users</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      <form onSubmit={handleSearch} className="mb-4">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full px-4 py-2 border rounded-md pr-10"
            disabled={isLoading}
          />
          {isLoading && (
            <div className="absolute right-3 top-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
        <button
          type="submit"
          className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={isLoading}
        >
          Search
        </button>
      </form>

      <ul className="space-y-4">
        {searchResults.map((result) => (
          <li key={result._id} className="border rounded-lg p-4 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div
                className="flex-grow cursor-pointer"
                onClick={() => handleProfileClick(result._id)}
              >
                <div className="flex items-center">
                  <img
                    src={result.profileImage || '/default-avatar.png'}
                    alt={result.name}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <p className="font-semibold">{result.name}</p>
                    <p className="text-sm text-gray-500">{result.email}</p>
                  </div>
                </div>
              </div>
              
              {result._id !== user._id && (
                <button
                  onClick={() => handleFollow(result._id)}
                  className={`ml-4 px-4 py-2 rounded-full text-sm font-medium ${
                    result.isFollowing
                      ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  {result.isFollowing ? 'Following' : 'Follow'}
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserSearch;