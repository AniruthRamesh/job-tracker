'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Application, ApplicationStatus } from '@/lib/types/application';
import Link from 'next/link';

interface ApiResponse {
  success: boolean;
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

// Helper to format date (avoid timezone issues)
const formatDate = (dateString: string) => {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export default function ApplicationDetail({ params }: { params: { id: string } }) {
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/applications/${params.id}`);

        if (!response.ok) {
          throw new Error('Application not found');
        }

        const data: ApiResponse = await response.json();
        setApplication(data.application);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading application...</p>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-red-800 font-bold text-lg mb-2">Error</h2>
          <p className="text-red-600">{error || 'Application not found'}</p>
          <Link
            href="/"
            className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Applications
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center mb-4"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Applications
          </Link>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Company and Role */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{application.company}</h1>
              <p className="text-2xl text-gray-600">{application.role}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusStyle(application.status)}`}>
              {formatStatus(application.status)}
            </span>
          </div>

          {/* Date Received */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-center text-gray-600">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-medium">Callback received:</span>
              <span className="ml-2">{formatDate(application.dateReceived)}</span>
            </div>
          </div>

          {/* Current Stage */}
          {application.currentStage && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Current Stage</h2>
              <p className="text-gray-700">{application.currentStage}</p>
            </div>
          )}

          {/* Job Description */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Job Description</h2>
            <div className="text-gray-700 whitespace-pre-wrap">{application.jobDescription}</div>
          </div>

          {/* Culture */}
          {application.culture && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Culture</h2>
              <p className="text-gray-700">{application.culture}</p>
            </div>
          )}

          {/* Mission */}
          {application.mission && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Mission</h2>
              <p className="text-gray-700">{application.mission}</p>
            </div>
          )}

          {/* Values */}
          {application.values && application.values.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Values</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {application.values.map((value, index) => (
                  <li key={index}>{value}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Interview Process */}
          {application.interviewProcess && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Interview Process</h2>
              <p className="text-gray-700">{application.interviewProcess}</p>
            </div>
          )}

          {/* Notes */}
          {application.notes && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Notes</h2>
              <p className="text-gray-700">{application.notes}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
            <Link
              href={`/applications/${application.id}/edit`}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium text-center"
            >
              Edit Application
            </Link>
            <button className="px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors font-medium">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
