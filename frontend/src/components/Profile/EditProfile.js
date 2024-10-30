import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../utils/api';

const EditProfile = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bio: '',
    department: '',
    skills: '',
    socialLinks: {
      linkedin: '',
      github: '',
      website: ''
    },
    studentInfo: {
      studentId: '',
      batch: '',
      cgpa: ''
    },
    teacherInfo: {
      designation: '',
      courses: '',
      researchInterests: '',
      officeHours: ''
    },
    alumniInfo: {
      graduationYear: '',
      currentCompany: '',
      jobTitle: ''
    }
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile/me');
        const profile = res.data;
        console.log('Fetched profile data:', profile);

        setFormData({
          bio: profile.bio || '',
          department: profile.department || '',
          skills: profile.skills.join(', ') || '',
          socialLinks: {
            linkedin: profile.socialLinks?.linkedin || '',
            github: profile.socialLinks?.github || '',
            website: profile.socialLinks?.website || ''
          },
          studentInfo: {
            studentId: profile.studentInfo?.studentId || '',
            batch: profile.studentInfo?.batch || '',
            cgpa: profile.studentInfo?.cgpa || ''
          },
          teacherInfo: {
            designation: profile.teacherInfo?.designation || '',
            courses: profile.teacherInfo?.courses?.join(', ') || '',
            researchInterests: profile.teacherInfo?.researchInterests?.join(', ') || '',
            officeHours: profile.teacherInfo?.officeHours || ''
          },
          alumniInfo: {
            graduationYear: profile.alumniInfo?.graduationYear || '',
            currentCompany: profile.alumniInfo?.currentCompany || '',
            jobTitle: profile.alumniInfo?.jobTitle || ''
          }
        });
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSocialLinksChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      socialLinks: {
        ...prevState.socialLinks,
        [name]: value
      }
    }));
  };

  const handleRoleSpecificChange = (e) => {
    const { name, value } = e.target;
    const [section, field] = name.split('.');
    console.log('Updating:', section, field, value);
    setFormData(prevState => ({
      ...prevState,
      [section]: {
        ...prevState[section],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const profileData = {
        bio: formData.bio,
        department: formData.department,
        skills: formData.skills.split(',').map(skill => skill.trim()),
        socialLinks: formData.socialLinks,
        studentInfo: formData.studentInfo,
        teacherInfo: formData.teacherInfo,
        alumniInfo: formData.alumniInfo
      };

      console.log('Current user role:', user.role);
      console.log('Form Data before submission:', formData);
      console.log('Profile Data being sent:', profileData);

      const response = await api.post('/profile', profileData);
      console.log('Profile update response:', response.data);
      navigate('/profile');
    } catch (err) {
      console.error('Error updating profile:', err.response ? err.response.data : err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        {/* Common fields */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bio">
            Bio
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="3"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="department">
            Department
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="department"
            name="department"
            type="text"
            value={formData.department}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="skills">
            Skills (comma-separated)
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="skills"
            name="skills"
            type="text"
            value={formData.skills}
            onChange={handleChange}
          />
        </div>
        
        {/* Social Links */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Social Links</h3>
          {['linkedin', 'github', 'website'].map((platform) => (
            <div key={platform} className="mb-2">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={platform}>
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id={platform}
                name={platform}
                type="text"
                value={formData.socialLinks[platform]}
                onChange={handleSocialLinksChange}
              />
            </div>
          ))}
        </div>

        {/* Role-specific fields */}
        {user.role === 'student' && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Student Information</h3>
            {['studentId', 'batch', 'cgpa'].map((field) => (
              <div key={field} className="mb-2">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`studentInfo.${field}`}>
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id={`studentInfo.${field}`}
                  name={`studentInfo.${field}`}
                  type={field === 'cgpa' ? 'number' : 'text'}
                  step={field === 'cgpa' ? '0.01' : undefined}
                  value={formData.studentInfo[field]}
                  onChange={handleRoleSpecificChange}
                />
              </div>
            ))}
          </div>
        )}

        {user.role === 'teacher' && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Teacher Information</h3>
            {['designation', 'courses', 'researchInterests', 'officeHours'].map((field) => (
              <div key={field} className="mb-2">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`teacherInfo.${field}`}>
                  {field.split(/(?=[A-Z])/).join(' ').charAt(0).toUpperCase() + field.split(/(?=[A-Z])/).join(' ').slice(1)}
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id={`teacherInfo.${field}`}
                  name={`teacherInfo.${field}`}
                  type="text"
                  value={formData.teacherInfo[field]}
                  onChange={handleRoleSpecificChange}
                />
              </div>
            ))}
          </div>
        )}

        {user.role === 'alumni' && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Alumni Information</h3>
            {['graduationYear', 'currentCompany', 'jobTitle'].map((field) => (
              <div key={field} className="mb-2">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`alumniInfo.${field}`}>
                  {field.split(/(?=[A-Z])/).join(' ').charAt(0).toUpperCase() + field.split(/(?=[A-Z])/).join(' ').slice(1)}
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id={`alumniInfo.${field}`}
                  name={`alumniInfo.${field}`}
                  type={field === 'graduationYear' ? 'number' : 'text'}
                  value={formData.alumniInfo[field]}
                  onChange={handleRoleSpecificChange}
                />
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
