import { useState, useEffect } from 'react';
import { FormSubmission } from '../types/forms';

const SUBMISSIONS_KEY = 'restaurant-builder-form-submissions';

export function useFormSubmissions() {
  const [submissions, setSubmissions] = useState<FormSubmission[]>(() => {
    try {
      const saved = localStorage.getItem(SUBMISSIONS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(submissions));
    } catch (error) {
      console.error('Failed to save submissions:', error);
    }
  }, [submissions]);

  const addSubmission = (submission: Omit<FormSubmission, 'id' | 'submittedAt'>) => {
    const newSubmission: FormSubmission = {
      ...submission,
      id: `submission-${Date.now()}`,
      submittedAt: Date.now(),
      userAgent: navigator.userAgent,
    };

    setSubmissions((prev) => [newSubmission, ...prev]);
    return newSubmission;
  };

  const deleteSubmission = (id: string) => {
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
  };

  const deleteAllSubmissions = () => {
    setSubmissions([]);
  };

  const getSubmissionsByFormId = (formId: string) => {
    return submissions.filter((s) => s.formId === formId);
  };

  const exportSubmissions = (formId?: string) => {
    const toExport = formId ? getSubmissionsByFormId(formId) : submissions;
    
    if (toExport.length === 0) {
      return null;
    }

    // Convert to CSV
    const headers = ['Submission ID', 'Form Name', 'Submitted At', ...Object.keys(toExport[0].data)];
    const rows = toExport.map((s) => [
      s.id,
      s.formName,
      new Date(s.submittedAt).toLocaleString(),
      ...Object.values(s.data),
    ]);

    const csv = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    return csv;
  };

  return {
    submissions,
    addSubmission,
    deleteSubmission,
    deleteAllSubmissions,
    getSubmissionsByFormId,
    exportSubmissions,
  };
}
