import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../utils/api';

const UserSearch = () => {
  const { user } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await api.get(`/users/search?term=${searchTerm}`);
      setSearchResults(res.data);
      setError('');
    } catch (err) {
      console.error('Error searching users:', err);
      setError('Error searching users. Please try again.');
    }
  };

  const handleFollow = async (userId) => {
    try {
      await api.post(`/users/${userId}/follow`);
      setSearchResults(searchResults.map(result => 
        result._id === userId ? { ...result, isFollowing: true } : result
      ));
    } catch (err) {
      console.error('Error following user:', err);
      setError('Error following user. Please try again.');
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      await api.post(`/users/${userId}/unfollow`);
      setSearchResults(searchResults.map(result => 
        result._id === userId ? { ...result, isFollowing: false } : result
      ));
    } catch (err) {
      console.error('Error unfollowing user:', err);
      setError('Error unfollowing user. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Search Users</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSearch} className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search users..."
          className="w-full px-3 py-2 border rounded-md"
        />
        <button type="submit" className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Search
        </button>
      </form>
      <ul className="space-y-4">
        {searchResults.map((result) => (
          <li key={result._id} className="border-b pb-4">
            <p className="font-semibold">{result.name}</p>
            <p className="text-sm text-gray-500">{result.email}</p>
            {result._id !== user._id && (
              result.isFollowing ? (
                <button 
                  onClick={() => handleUnfollow(result._id)}
                  className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
                >
                  Unfollow
                </button>
              ) : (
                <button 
                  onClick={() => handleFollow(result._id)}
                  className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-sm"
                >
                  Follow
                </button>
              )
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserSearch;
