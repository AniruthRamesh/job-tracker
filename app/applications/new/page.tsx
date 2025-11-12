'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApplicationStatus } from '@/lib/types/application';
import Link from 'next/link';

export default function NewApplication() {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Form state - initialize with today's date
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    company: '',
    role: '',
    dateReceived: getTodayDate(),
    jobDescription: '',
    status: '',
    currentStage: '',
    culture: '',
    mission: '',
    interviewProcess: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // Prepare data (remove empty strings for optional fields)
      const dataToSubmit = {
        ...formData,
        status: formData.status || undefined,
        currentStage: formData.currentStage || undefined,
        culture: formData.culture || undefined,
        mission: formData.mission || undefined,
        interviewProcess: formData.interviewProcess || undefined,
        notes: formData.notes || undefined
      };

      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSubmit),
      });

      if (!response.ok) {
        throw new Error('Failed to create application');
      }

      const result = await response.json();

      // Redirect to the newly created application's detail page
      router.push(`/applications/${result.application.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create application');
      setSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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
          <h1 className="text-4xl font-bold text-gray-900">Add New Application</h1>
          <p className="text-gray-600 mt-2">Track a new job application received via callback</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Create Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
          {/* Company */}
          <div className="mb-6">
            <label htmlFor="company" className="block text-sm font-semibold text-gray-900 mb-2">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
              placeholder="e.g., Google, Microsoft, Amazon"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Role */}
          <div className="mb-6">
            <label htmlFor="role" className="block text-sm font-semibold text-gray-900 mb-2">
              Role <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              placeholder="e.g., Software Engineer, Product Manager"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Date Received */}
          <div className="mb-6">
            <label htmlFor="dateReceived" className="block text-sm font-semibold text-gray-900 mb-2">
              Date Received <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="dateReceived"
              name="dateReceived"
              value={formData.dateReceived}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status */}
          <div className="mb-6">
            <label htmlFor="status" className="block text-sm font-semibold text-gray-900 mb-2">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">No Status</option>
              <option value={ApplicationStatus.RECRUITER}>Recruiter</option>
              <option value={ApplicationStatus.ONGOING}>Ongoing</option>
              <option value={ApplicationStatus.REJECTED}>Rejected</option>
              <option value={ApplicationStatus.SUCCESS}>Success</option>
            </select>
          </div>

          {/* Current Stage */}
          <div className="mb-6">
            <label htmlFor="currentStage" className="block text-sm font-semibold text-gray-900 mb-2">
              Current Stage
            </label>
            <input
              type="text"
              id="currentStage"
              name="currentStage"
              value={formData.currentStage}
              onChange={handleChange}
              placeholder="e.g., Phone Screen, Technical Interview, Final Round"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Job Description */}
          <div className="mb-6">
            <label htmlFor="jobDescription" className="block text-sm font-semibold text-gray-900 mb-2">
              Job Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="jobDescription"
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleChange}
              required
              rows={6}
              placeholder="Paste the job description here..."
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Culture */}
          <div className="mb-6">
            <label htmlFor="culture" className="block text-sm font-semibold text-gray-900 mb-2">
              Company Culture
            </label>
            <textarea
              id="culture"
              name="culture"
              value={formData.culture}
              onChange={handleChange}
              rows={3}
              placeholder="Describe the company culture..."
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Mission */}
          <div className="mb-6">
            <label htmlFor="mission" className="block text-sm font-semibold text-gray-900 mb-2">
              Company Mission
            </label>
            <textarea
              id="mission"
              name="mission"
              value={formData.mission}
              onChange={handleChange}
              rows={3}
              placeholder="What is the company's mission or vision?"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Interview Process */}
          <div className="mb-6">
            <label htmlFor="interviewProcess" className="block text-sm font-semibold text-gray-900 mb-2">
              Interview Process
            </label>
            <textarea
              id="interviewProcess"
              name="interviewProcess"
              value={formData.interviewProcess}
              onChange={handleChange}
              rows={4}
              placeholder="Describe the interview stages and process..."
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label htmlFor="notes" className="block text-sm font-semibold text-gray-900 mb-2">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              placeholder="Additional notes or comments..."
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {saving ? 'Creating...' : 'Create Application'}
            </button>
            <Link
              href="/"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
