import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register, error, isAuthenticated, clearError } = useContext(AuthContext);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    role: 'student',
    profileImage: null,
    studentInfo: {
      studentId: '',
      intake: '',
      section: '',
      department: '', // Changed: will be a dropdown
      passingYear: null 
    },
    teacherInfo: {
      teacherCode: '',
      department: '' // Changed: will be a dropdown
    },
    alumniInfo: {
      id: '',
      section: '',
      intake: '',
      department: '', // Changed: will be a dropdown
      passingYear: null
    }
  });

  const [formError, setFormError] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');

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
    if (name.includes('.')) {
      const [field, subField] = name.split('.'); // Comma added
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
      if (!file.type.startsWith('image/')) {
        setFormError('Please select a valid image file');
        return;
      }
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
  
    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', name);
      formDataToSend.append('email', email);
      formDataToSend.append('password', password);
      formDataToSend.append('role', role);
      formDataToSend.append('studentInfo', JSON.stringify(studentInfo));
      formDataToSend.append('teacherInfo', JSON.stringify(teacherInfo));
      formDataToSend.append('alumniInfo', JSON.stringify(alumniInfo));
      
      if (profileImage) {
        formDataToSend.append('profileImage', profileImage);
      }
  
      const success = await register(formDataToSend);
      if (success) {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setFormError(err.response?.data?.msg || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderRoleFields = () => {
    const fieldClasses = "mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";
    
    switch(role) {
      case 'student':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">Student ID</label>
              <input
                type="text"
                name="studentInfo.studentId"
                value={studentInfo.studentId}
                onChange={handleChange}
                className={fieldClasses}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="intake" className="block text-sm font-medium text-gray-700">Intake</label>
                <input
                  type="text"
                  name="studentInfo.intake"
                  value={studentInfo.intake}
                  onChange={handleChange}
                  className={fieldClasses}
                />
              </div>
              <div>
                <label htmlFor="section" className="block text-sm font-medium text-gray-700">Section</label>
                <input
                  type="text"
                  name="studentInfo.section"
                  value={studentInfo.section}
                  onChange={handleChange}
                  className={fieldClasses}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
                <select 
                  id="department"
                  name="studentInfo.department"
                  value={selectedDepartment}
                  onChange={(e) => {
                    setSelectedDepartment(e.target.value);
                    setFormData(prevData => ({
                      ...prevData,
                      studentInfo: { 
                        ...prevData.studentInfo,
                        department: e.target.value
                      }
                    }));
                  }}
                  className={fieldClasses}
                >
                  <option value="">Select Department</option>
                  <option value="BBA">BBA</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="English">English</option>
                </select>
            </div>
              <div>
                <label htmlFor="passingYear" className="block text-sm font-medium text-gray-700">Passing Year</label>
                <input
                  type="number"
                  name="studentInfo.passingYear"
                  value={studentInfo.passingYear || ''}
                  onChange={handleChange}
                  className={fieldClasses}
                />
              </div>
            </div>
          </div>
        );
      case 'teacher':
        return (
            <div className="space-y-4">
              <div>
              <label htmlFor="teacherCode" className="block text-sm font-medium text-gray-700">Teacher Code</label>
                <input
                type="text"
                name="teacherInfo.teacherCode"
                value={teacherInfo.teacherCode}
                  onChange={handleChange}
                className={fieldClasses}
                />
              </div>
              <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
              <select
                id="department"
                name="teacherInfo.department"
                value={selectedDepartment}
                onChange={(e) => {
                  setSelectedDepartment(e.target.value);
                  setFormData(prevData => ({
                    ...prevData,
                    teacherInfo: {
                      ...prevData.teacherInfo,
                      department: e.target.value
                    }
                  }));
                }}
                className={fieldClasses}
              >
                <option value="">Select Department</option>
                <option value="BBA">BBA</option>
                <option value="Computer Science">Computer Science</option>
                <option value="English">English</option>
              </select>
                </div>
          </div>
    );
      case 'alumni':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="id" className="block text-sm font-medium text-gray-700">Alumni ID</label>
              <input
                type="text"
                name="alumniInfo.id"
                value={alumniInfo.id}
                onChange={handleChange}
                className={fieldClasses}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="section" className="block text-sm font-medium text-gray-700">Section</label>
                <input
                  type="text"
                  name="alumniInfo.section"
                  value={alumniInfo.section}
                  onChange={handleChange}
                  className={fieldClasses}
                />
              </div>
              <div>
                <label htmlFor="intake" className="block text-sm font-medium text-gray-700">Intake</label>
                <input
                  type="text"
                  name="alumniInfo.intake"
                  value={alumniInfo.intake}
                  onChange={handleChange}
                  className={fieldClasses}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
                <select 
                  id="department"
                  name="alumniInfo.department"
                  value={selectedDepartment}
                  onChange={(e) => {
                    setSelectedDepartment(e.target.value);
                    setFormData(prevData => ({
                      ...prevData,
                      alumniInfo: { 
                        ...prevData.alumniInfo,
                        department: e.target.value
                      }
                    }));
                  }}
                  className={fieldClasses}
                >
                  <option value="">Select Department</option>
                  <option value="BBA">BBA</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="English">English</option>
                </select>
              </div>
              <div>
                <label htmlFor="passingYear" className="block text-sm font-medium text-gray-700">Passing Year</label>
                <input
                  type="number"
                  name="alumniInfo.passingYear"
                  value={alumniInfo.passingYear || ''}
                  onChange={handleChange}
                  className={fieldClasses}
                />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in here
            </Link>
          </p>
        </div>

        {formError && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{formError}</p>
              </div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="password2" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                  <input
                    id="password2"
                    name="password2"
                    type="password"
                    required
                    value={password2}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
              <select
                id="role"
                name="role"
                value={role}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="alumni">Alumni</option>
              </select>
            </div>

            {/* Role-specific fields */}
            {renderRoleFields()}

            {/* Profile Image */}
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
                    className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Choose Image
                    </label>
                  </div>
                  {profileImage && (
                    <div className="relative group">
                      <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-100 border border-gray-300">
                        <img
                          src={URL.createObjectURL(profileImage)}
                          alt="Profile preview"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, profileImage: null }))}
                        className="absolute -top-2 -right-2 hidden group-hover:block bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Recommended: Square image, max 5MB
                </p>
              </div>
  
              {/* Submit Button */}
              <div className="pt-5">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin mr-2 h-4 w-4 border-b-2 border-white rounded-full"></div>
                      Creating account...
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  };
  
  export default Register;