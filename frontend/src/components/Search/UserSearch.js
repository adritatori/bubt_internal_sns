import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const UserSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    try {
      const res = await api.get(`/users/search?q=${searchTerm}`);
      setSearchResults(res.data);
    } catch (err) {
      setError('Error searching users');
    }
  };

  const handleFollow = async (userId) => {
    try {
      await api.put(`/users/follow/${userId}`);
      // Update local state to reflect follow status
      setSearchResults(searchResults.map(user => 
        user._id === userId 
          ? { ...user, isFollowing: !user.isFollowing }
          : user
      ));
    } catch (err) {
      setError('Error following user');
    }
  };

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {error && <div>{error}</div>}

      <div>
        {searchResults.map(user => (
          <div key={user._id}>
            <Link to={`/profile/${user._id}`}>
              <h3>{user.name}</h3>
            </Link>
            <p>Role: {user.role}</p>
            <p>Department: {user.department}</p>
            <button onClick={() => handleFollow(user._id)}>
              {user.isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserSearch;