import { Application, ApplicationStatus } from '@/lib/types/application';
import Link from 'next/link';

interface ApplicationCardProps {
  application: Application;
}

// Helper to get status badge styling
const getStatusStyle = (status?: ApplicationStatus) => {
  switch (status) {
    case ApplicationStatus.RECRUITER:
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case ApplicationStatus.ONGOING:
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case ApplicationStatus.REJECTED:
      return 'bg-red-100 text-red-800 border-red-300';
    case ApplicationStatus.SUCCESS:
      return 'bg-green-100 text-green-800 border-green-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

// Helper to format status text
const formatStatus = (status?: ApplicationStatus) => {
  if (!status) return 'No Status';
  return status.charAt(0).toUpperCase() + status.slice(1);
};

// Helper to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export default function ApplicationCard({ application }: ApplicationCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow bg-white">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">{application.company}</h2>
          <p className="text-lg text-gray-600 mt-1">{application.role}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusStyle(application.status)}`}>
          {formatStatus(application.status)}
        </span>
      </div>

      <div className="flex items-center text-sm text-gray-500 mb-4">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Callback received: {formatDate(application.dateReceived)}
      </div>

      {application.currentStage && (
        <div className="mb-4">
          <span className="text-sm font-medium text-gray-700">Current Stage: </span>
          <span className="text-sm text-gray-600">{application.currentStage}</span>
        </div>
      )}

      <div className="mb-4">
        <p className="text-sm text-gray-700 line-clamp-3">
          {application.jobDescription.substring(0, 200)}...
        </p>
      </div>

      <div className="flex gap-3 mt-4">
        <Link
          href={`/applications/${application.id}`}
          className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          View Details
        </Link>
        <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-gray-700 font-medium">
          Edit
        </button>
      </div>
    </div>
  );
}
