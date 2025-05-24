import { FormData } from '../types';

const STORAGE_KEY = 'study_schedule_form_data';

export const saveFormData = (data: FormData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving form data to localStorage:', error);
  }
};

export const loadFormData = (): FormData | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading form data from localStorage:', error);
    return null;
  }
};

export const clearFormData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing form data from localStorage:', error);
  }
};