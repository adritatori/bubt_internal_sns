import React from 'react';

const JobCard = ({ job, onViewMatches, onApply, currentUser }) => {
  const isDeadlinePassed = new Date(job.applicationDeadline) < new Date();
  const isOwner = job.user === currentUser._id;
  
  // Format relative time
  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
      }
    }
    return 'just now';
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
          <p className="text-gray-600">{job.company}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge type="blue" text={job.type} />
            <Badge type="green" text={job.education} />
            <Badge type="purple" text={job.experienceLevel} />
          </div>
        </div>
        <div className="text-right">
          <SalaryDisplay salary={job.salary} />
          <p className="text-sm text-gray-500">
            Posted {formatTimeAgo(job.createdAt)}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-gray-700 line-clamp-3">{job.description}</p>
      </div>

      <SkillsList title="Required Skills" skills={job.requiredSkills} />
      {job.preferredSkills?.length > 0 && (
        <SkillsList title="Preferred Skills" skills={job.preferredSkills} variant="light" />
      )}

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          <DeadlineDisplay deadline={job.applicationDeadline} />
        </div>
        <div className="space-x-2">
          {isOwner && (
            <button
              onClick={() => onViewMatches(job._id)}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              View Matches
            </button>
          )}
          {currentUser.role === 'student' && (
            <button
              onClick={() => onApply(job._id)}
              className={`px-4 py-2 text-sm rounded-md ${
                isDeadlinePassed 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
              disabled={isDeadlinePassed}
            >
              {isDeadlinePassed ? 'Deadline Passed' : 'Apply Now'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const Badge = ({ type, text }) => (
  <span className={`px-2 py-1 text-sm rounded-full
    ${type === 'blue' ? 'bg-blue-100 text-blue-800' :
      type === 'green' ? 'bg-green-100 text-green-800' :
      'bg-purple-100 text-purple-800'}`}
  >
    {text}
  </span>
);

const SalaryDisplay = ({ salary }) => (
  <p className="text-gray-600">
    {salary.range.min && salary.range.max ? (
      <>
        ${salary.range.min.toLocaleString()} - ${salary.range.max.toLocaleString()} /{' '}
        {salary.type}
      </>
    ) : (
      'Salary Negotiable'
    )}
  </p>
);

const SkillsList = ({ title, skills, variant = 'default' }) => (
  <div className="mt-4">
    <h4 className="font-medium text-gray-900">{title}:</h4>
    <div className="flex flex-wrap gap-2 mt-2">
      {skills.map((skill, index) => (
        <span
          key={index}
          className={`px-2 py-1 text-sm rounded-full ${
            variant === 'light' 
              ? 'bg-gray-50 text-gray-600' 
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          {skill}
        </span>
      ))}
    </div>
  </div>
);

const DeadlineDisplay = ({ deadline }) => {
  const isExpired = new Date(deadline) < new Date();
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <span className={isExpired ? 'text-red-600' : 'text-gray-600'}>
      {isExpired ? 'Deadline Passed' : `Deadline: ${formatDate(deadline)}`}
    </span>
  );
};

export default JobCard;