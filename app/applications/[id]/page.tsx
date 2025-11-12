'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Application, ApplicationStatus, InterviewQuestion } from '@/lib/types/application';
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

type TabType = 'prep' | 'interview';

export default function ApplicationDetail({ params }: { params: { id: string } }) {
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('prep');
  const router = useRouter();

  // Prep questions state
  const [prepQuestions, setPrepQuestions] = useState<Record<string, string>>({});
  const [newPrepQuestion, setNewPrepQuestion] = useState('');
  const [newPrepAnswer, setNewPrepAnswer] = useState('');

  // Interview questions state
  const [interviewQuestions, setInterviewQuestions] = useState<InterviewQuestion[]>([]);
  const [newIntQuestion, setNewIntQuestion] = useState('');
  const [newIntAnswer, setNewIntAnswer] = useState('');
  const [newIntRound, setNewIntRound] = useState('');
  const [newIntDate, setNewIntDate] = useState('');

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
        setPrepQuestions(data.application.prepQuestions || {});
        setInterviewQuestions(data.application.interviewQuestions || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [params.id]);

  const handleSavePrepQuestions = async () => {
    if (!application) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/applications/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prepQuestions: prepQuestions
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save prep questions');
      }

      alert('Prep questions saved successfully!');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleAddPrepQuestion = () => {
    if (!newPrepQuestion.trim()) {
      alert('Please enter a question');
      return;
    }

    setPrepQuestions(prev => ({
      ...prev,
      [newPrepQuestion]: newPrepAnswer
    }));

    setNewPrepQuestion('');
    setNewPrepAnswer('');
  };

  const handleDeletePrepQuestion = (question: string) => {
    setPrepQuestions(prev => {
      const updated = { ...prev };
      delete updated[question];
      return updated;
    });
  };

  const handleSaveInterviewQuestions = async () => {
    if (!application) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/applications/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interviewQuestions: interviewQuestions
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save interview questions');
      }

      alert('Interview questions saved successfully!');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleAddInterviewQuestion = () => {
    if (!newIntQuestion.trim()) {
      alert('Please enter a question');
      return;
    }

    const newQuestion: InterviewQuestion = {
      question: newIntQuestion,
      myAnswer: newIntAnswer || undefined,
      round: newIntRound || undefined,
      date: newIntDate || undefined
    };

    setInterviewQuestions(prev => [...prev, newQuestion]);

    setNewIntQuestion('');
    setNewIntAnswer('');
    setNewIntRound('');
    setNewIntDate('');
  };

  const handleDeleteInterviewQuestion = (index: number) => {
    setInterviewQuestions(prev => prev.filter((_, i) => i !== index));
  };

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
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Applications
          </Link>
          <Link
            href={`/applications/${application.id}/edit`}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Edit Application
          </Link>
        </div>

        {/* Two-Pane Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Pane - Company Details & Prep Questions */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-8">
            {/* Company and Role */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{application.company}</h1>
                <p className="text-xl text-gray-600">{application.role}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(application.status)}`}>
                {formatStatus(application.status)}
              </span>
            </div>

            {/* Date Received */}
            <div className="mb-4 pb-4 border-b border-gray-200">
              <div className="flex items-center text-gray-600 text-sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-medium">Callback:</span>
                <span className="ml-2">{formatDate(application.dateReceived)}</span>
              </div>
            </div>

            {/* Current Stage */}
            {application.currentStage && (
              <div className="mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold bg-purple-100 text-purple-800 border border-purple-300">
                    {application.currentStage}
                  </span>
                </div>
              </div>
            )}

            {/* Job Description */}
            <div className="mb-4">
              <h2 className="text-base font-semibold text-gray-900 mb-2">Job Description</h2>
              <div className="text-sm text-gray-700 whitespace-pre-wrap max-h-64 overflow-y-auto">{application.jobDescription}</div>
            </div>

            {/* Culture */}
            {application.culture && (
              <div className="mb-4">
                <h2 className="text-base font-semibold text-gray-900 mb-2">Culture</h2>
                <p className="text-sm text-gray-700">{application.culture}</p>
              </div>
            )}

            {/* Mission */}
            {application.mission && (
              <div className="mb-4">
                <h2 className="text-base font-semibold text-gray-900 mb-2">Mission</h2>
                <p className="text-sm text-gray-700">{application.mission}</p>
              </div>
            )}

            {/* Values */}
            {application.values && application.values.length > 0 && (
              <div className="mb-4">
                <h2 className="text-base font-semibold text-gray-900 mb-2">Values</h2>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {application.values.map((value, index) => (
                    <li key={index}>{value}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Interview Process */}
            {application.interviewProcess && (
              <div className="mb-4">
                <h2 className="text-base font-semibold text-gray-900 mb-2">Interview Process</h2>
                <p className="text-sm text-gray-700">{application.interviewProcess}</p>
              </div>
            )}

            {/* Notes */}
            {application.notes && (
              <div className="mb-4">
                <h2 className="text-base font-semibold text-gray-900 mb-2">Notes</h2>
                <p className="text-sm text-gray-700">{application.notes}</p>
              </div>
            )}

            {/* Separator */}
            <div className="my-6 border-t-2 border-gray-300"></div>

            {/* Prep Questions Display Section */}
            <div>
              <div className="flex items-center mb-4">
                <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-xl font-bold text-gray-900">Interview Prep</h2>
              </div>

              {Object.entries(prepQuestions).length === 0 ? (
                <p className="text-gray-500 text-sm italic py-4">No prep questions yet. Add them using the panel on the right →</p>
              ) : (
                <div className="space-y-4">
                  {Object.entries(prepQuestions).map(([question, answer], index) => (
                    <div key={index} className="border-l-4 border-green-500 pl-4 py-2">
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">{question}</h4>
                      <p className="text-gray-700 text-sm">{answer || 'No answer provided'}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Pane - Questions Management */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                onClick={() => setActiveTab('prep')}
                className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'prep'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Prep Questions
              </button>
              <button
                onClick={() => setActiveTab('interview')}
                className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'interview'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Interview Questions
              </button>
            </div>

            {/* Prep Questions Tab */}
            {activeTab === 'prep' && (
              <div>
                <h2 className="text-base font-bold text-gray-900 mb-3">Manage Prep Questions</h2>

                {/* Add New Prep Question */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="text-xs font-semibold text-gray-900 mb-2">Add New</h3>
                  <input
                    type="text"
                    placeholder="Question"
                    value={newPrepQuestion}
                    onChange={(e) => setNewPrepQuestion(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-xs mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <textarea
                    placeholder="Your answer..."
                    value={newPrepAnswer}
                    onChange={(e) => setNewPrepAnswer(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-xs mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleAddPrepQuestion}
                    className="w-full bg-green-600 text-white py-1.5 px-3 rounded-md hover:bg-green-700 transition-colors text-xs font-medium"
                  >
                    Add Question
                  </button>
                </div>

                {/* Edit/Delete Existing Questions */}
                <div className="mb-4">
                  <h3 className="text-xs font-semibold text-gray-900 mb-2">Existing Questions ({Object.entries(prepQuestions).length})</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {Object.entries(prepQuestions).length === 0 ? (
                      <p className="text-gray-400 text-xs text-center py-4">No questions yet</p>
                    ) : (
                      Object.entries(prepQuestions).map(([question, answer], index) => (
                        <div key={index} className="border border-gray-200 rounded p-2 bg-white">
                          <div className="flex justify-between items-start mb-1">
                            <p className="font-medium text-gray-900 text-xs flex-1">{question}</p>
                            <button
                              onClick={() => handleDeletePrepQuestion(question)}
                              className="text-red-600 hover:text-red-800 ml-1"
                              title="Delete"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Save Button */}
                <button
                  onClick={handleSavePrepQuestions}
                  disabled={saving}
                  className="w-full bg-blue-600 text-white py-2 px-3 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium disabled:bg-blue-400"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}

            {/* Interview Questions Tab */}
            {activeTab === 'interview' && (
              <div>
                <h2 className="text-base font-bold text-gray-900 mb-3">Manage Interview Questions</h2>

                {/* Add New Interview Question */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="text-xs font-semibold text-gray-900 mb-2">Add New</h3>
                  <input
                    type="text"
                    placeholder="Question *"
                    value={newIntQuestion}
                    onChange={(e) => setNewIntQuestion(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-xs mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <textarea
                    placeholder="Your answer (optional)"
                    value={newIntAnswer}
                    onChange={(e) => setNewIntAnswer(e.target.value)}
                    rows={2}
                    className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-xs mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Round"
                      value={newIntRound}
                      onChange={(e) => setNewIntRound(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="date"
                      value={newIntDate}
                      onChange={(e) => setNewIntDate(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    onClick={handleAddInterviewQuestion}
                    className="w-full bg-green-600 text-white py-1.5 px-3 rounded-md hover:bg-green-700 transition-colors text-xs font-medium"
                  >
                    Add Question
                  </button>
                </div>

                {/* Display Interview Questions */}
                <div className="mb-4">
                  <h3 className="text-xs font-semibold text-gray-900 mb-2">Existing Questions ({interviewQuestions.length})</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {interviewQuestions.length === 0 ? (
                      <p className="text-gray-400 text-xs text-center py-4">No questions yet</p>
                    ) : (
                      interviewQuestions.map((q, index) => (
                        <div key={index} className="border border-gray-200 rounded p-2 bg-white">
                          <div className="flex justify-between items-start mb-1">
                            <p className="font-medium text-gray-900 text-xs flex-1">{q.question}</p>
                            <button
                              onClick={() => handleDeleteInterviewQuestion(index)}
                              className="text-red-600 hover:text-red-800 ml-1"
                              title="Delete"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                          <div className="flex gap-1 text-xs text-gray-500 mt-1">
                            {q.round && <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">{q.round}</span>}
                            {q.date && <span className="px-1.5 py-0.5 bg-gray-100 text-gray-800 rounded text-xs">{formatDate(q.date)}</span>}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Save Button */}
                <button
                  onClick={handleSaveInterviewQuestions}
                  disabled={saving}
                  className="w-full bg-blue-600 text-white py-2 px-3 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium disabled:bg-blue-400"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
