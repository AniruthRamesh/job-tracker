// Common types for job applications

export enum ApplicationStatus {
  RECRUITER = 'recruiter',
  ONGOING = 'ongoing',
  REJECTED = 'rejected',
  SUCCESS = 'success'
}

export interface Application {
  id: string;
  dateReceived: string;
  company: string;
  role: string;
  jobDescription: string;
  // Optional fields to be added later
  culture?: string;
  mission?: string;
  values?: string[];
  interviewProcess?: string;
  currentStage?: string;
  status?: ApplicationStatus;
  metadata?: Record<string, any>;
  prepQuestions?: Record<string, string>;
  interviewQuestions?: InterviewQuestion[];
  notes?: string;
  [key: string]: any; // Allow for flexible additional fields
}

export interface InterviewQuestion {
  question: string;
  myAnswer?: string;
  round?: string;
  date?: string;
}

export interface ApplicationsData {
  applications: Application[];
}
