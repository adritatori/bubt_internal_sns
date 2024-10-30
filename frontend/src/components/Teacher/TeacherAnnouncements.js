import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../utils/api';

const TeacherAnnouncements = () => {
  const { user } = useContext(AuthContext);
  //  // Redirect if not a teacher
  //  if (user?.role !== 'teacher') {
  //   return <div>Only teachers can access this page.</div>;
  // }
  
  const [announcements, setAnnouncements] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    department: '',
    targetGroups: []
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await api.get('/announcements');
      setAnnouncements(res.data);
    } catch (err) {
      setError('Error fetching announcements');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/announcements', formData);
      setAnnouncements([res.data, ...announcements]);
      setFormData({ title: '', content: '', department: '', targetGroups: [] });
    } catch (err) {
      setError('Error creating announcement');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/announcements/${id}`);
      setAnnouncements(announcements.filter(ann => ann._id !== id));
    } catch (err) {
      setError('Error deleting announcement');
    }
  };

  return (
    <div>
      <h2>Create Announcement</h2>
      {error && <div>{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <textarea
          placeholder="Content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
        />
        <input
          type="text"
          placeholder="Department"
          value={formData.department}
          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
        />
        <input
          type="text"
          placeholder="Target Groups (comma separated)"
          value={formData.targetGroups.join(', ')}
          onChange={(e) => setFormData({ 
            ...formData, 
            targetGroups: e.target.value.split(',').map(g => g.trim())
          })}
        />
        <button type="submit">Create Announcement</button>
      </form>

      <h3>Your Announcements</h3>
      <div>
        {announcements.map(announcement => (
          <div key={announcement._id}>
            <h4>{announcement.title}</h4>
            <p>{announcement.content}</p>
            <p>Department: {announcement.department}</p>
            <p>Target Groups: {announcement.targetGroups.join(', ')}</p>
            <button onClick={() => handleDelete(announcement._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherAnnouncements;