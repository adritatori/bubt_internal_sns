import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register, error, isAuthenticated, clearError } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    role: 'student', // Default role
    profileImage: null,

    // Group the role-specific information in objects
    studentInfo: {
      studentId: '',
      intake: '',
      section: '',
      department: '',
      passingYear: null 
    },
    teacherInfo: {
      teacherCode: '',
      department: ''
    },
    alumniInfo: {
      id: '',
      section: '',
      intake: '',
      department: '',
      passingYear: null
    }
  });

  const [formError, setFormError] = useState('');

  const {
    name,
    email,
    password,
    password2,
    role,
    profileImage,
    studentInfo,
    teacherInfo,
    alumniInfo 
  } = formData;

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    if (error) {
      setFormError(error);
      clearError();
    }
  }, [isAuthenticated, error, navigate, clearError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Handle nested objects
    if (name.includes('.')) {
      const [field, subField] = name.split('.');
      setFormData(prevData => ({
        ...prevData,
        [field]: { ...prevData[field], [subField]: value }
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setFormError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Add basic validation
      if (!file.type.startsWith('image/')) {
        setFormError('Please select a valid image file');
        return;
      }
      // Optional: Add size validation (e.g., 5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setFormError('Image size should be less than 5MB');
        return;
      }
      setFormData(prevData => ({
        ...prevData,
        profileImage: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      setFormError('Passwords do not match');
      return;
    }
  
    try {
      const formDataToSend = new FormData();
      
      // Append basic fields
      formDataToSend.append('name', name);
      formDataToSend.append('email', email);
      formDataToSend.append('password', password);
      formDataToSend.append('role', role);
      
      // Append role-specific info
      formDataToSend.append('studentInfo', JSON.stringify(studentInfo));
      formDataToSend.append('teacherInfo', JSON.stringify(teacherInfo));
      formDataToSend.append('alumniInfo', JSON.stringify(alumniInfo));
      
      // Append the file with the correct field name
      if (profileImage) {
        formDataToSend.append('profileImage', profileImage);
        console.log('Profile image being appended:', profileImage.name);
      }
  
      // Log FormData contents for debugging
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
      }
  
      const success = await register(formDataToSend);
      if (success) {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setFormError(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        {formError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {formError}
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                name="name"
                type="text"
                required
                value={name}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Full Name"
              />
            </div>
            <div>
              <input
                name="email"
                type="email"
                required
                value={email}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <input
                name="password"
                type="password"
                required
                value={password}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
            <div>
              <input
                name="password2"
                type="password"
                required
                value={password2}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Confirm Password"
              />
            </div>
            <div>
              <select
                name="role"
                value={role}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="alumni">Alumni</option>
              </select>
            </div>

            {/* Conditional Input Fields based on Role */}
            {role === 'student' && (
              <div>
                <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">Student ID</label>
                <input
                  type="text"
                  name="studentInfo.studentId"
                  value={studentInfo.studentId}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            )}
            {role === 'student' && (
              <div>
                <label htmlFor="intake" className="block text-sm font-medium text-gray-700">Intake</label>
                <input
                  type="text"
                  name="studentInfo.intake"
                  value={studentInfo.intake}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            )}
            {role === 'student' && (
              <div>
                <label htmlFor="section" className="block text-sm font-medium text-gray-700">Section</label>
                <input
                  type="text"
                  name="studentInfo.section"
                  value={studentInfo.section}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            )}
            {role === 'student' && (
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
                <input
                  type="text"
                  name="studentInfo.department"
                  value={studentInfo.department}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            )}
            {role === 'student' && (
              <div>
                <label htmlFor="passingYear" className="block text-sm font-medium text-gray-700">Passing Year</label>
                <input
                  type="number"
                  name="studentInfo.passingYear"
                  value={studentInfo.passingYear}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            )}

            {role === 'teacher' && (
              <div>
                <label htmlFor="teacherCode" className="block text-sm font-medium text-gray-700">Teacher Code</label>
                <input
                  type="text"
                  name="teacherInfo.teacherCode"
                  value={teacherInfo.teacherCode}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            )}
            {role === 'teacher' && (
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
                <input
                  type="text"
                  name="teacherInfo.department"
                  value={teacherInfo.department}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            )}

            {role === 'alumni' && (
              <div>
                <label htmlFor="id" className="block text-sm font-medium text-gray-700">Alumni ID</label>
                <input
                  type="text"
                  name="alumniInfo.id"
                  value={alumniInfo.id}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            )}
            {role === 'alumni' && (
              <div>
                <label htmlFor="section" className="block text-sm font-medium text-gray-700">Section</label>
                <input
                  type="text"
                  name="alumniInfo.section"
                  value={alumniInfo.section}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            )}
            {role === 'alumni' && (
              <div>
                <label htmlFor="intake" className="block text-sm font-medium text-gray-700">Intake</label>
                <input
                  type="text"
                  name="alumniInfo.intake"
                  value={alumniInfo.intake}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            )}
            {role === 'alumni' && (
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
                <input
                  type="text"
                  name="alumniInfo.department"
                  value={alumniInfo.department}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            )}
            {role === 'alumni' && (
              <div>
                <label htmlFor="passingYear" className="block text-sm font-medium text-gray-700">Passing Year</label>
                <input
                  type="number"
                  name="alumniInfo.passingYear"
                  value={alumniInfo.passingYear}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            )}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Profile Image
            </label>
            <div className="mt-1 flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  type="file"
                  name="profileImage"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="sr-only"
                  id="profile-image"
                />
                <label
                  htmlFor="profile-image"
                  className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Choose Image
                </label>
              </div>
              {profileImage && (
                <div className="h-12 w-12 rounded-full overflow-hidden">
                  <img
                    src={URL.createObjectURL(profileImage)}
                    alt="Profile preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Register
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
