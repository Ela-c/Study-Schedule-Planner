import { FormData, ScheduleResponse } from '../types';

const FORM_DATA_KEY = 'study_schedule_form_data';
const COMPLETION_DATA_KEY = 'study_schedule_completion_data';

export const saveFormData = (data: FormData): void => {
  try {
    localStorage.setItem(FORM_DATA_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving form data to localStorage:', error);
  }
};

export const loadFormData = (): FormData | null => {
  try {
    const data = localStorage.getItem(FORM_DATA_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading form data from localStorage:', error);
    return null;
  }
};

export const clearFormData = (): void => {
  try {
    localStorage.removeItem(FORM_DATA_KEY);
  } catch (error) {
    console.error('Error clearing form data from localStorage:', error);
  }
};

// New functions for handling completion status
export const saveCompletionData = (schedule: ScheduleResponse): void => {
  try {
    const completionData = schedule.dailySchedules.reduce((acc, day) => {
      day.items.forEach(item => {
        if (item.completed) {
          acc[item.id] = true;
        }
      });
      return acc;
    }, {} as Record<string, boolean>);
    
    localStorage.setItem(COMPLETION_DATA_KEY, JSON.stringify(completionData));
  } catch (error) {
    console.error('Error saving completion data to localStorage:', error);
  }
};

export const loadCompletionData = (): Record<string, boolean> => {
  try {
    const data = localStorage.getItem(COMPLETION_DATA_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error loading completion data from localStorage:', error);
    return {};
  }
};

export const clearCompletionData = (): void => {
  try {
    localStorage.removeItem(COMPLETION_DATA_KEY);
  } catch (error) {
    console.error('Error clearing completion data from localStorage:', error);
  }
};