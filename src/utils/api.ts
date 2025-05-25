import { FormData, ScheduleResponse, ApiError } from '../types';
import { v4 as uuidv4 } from 'uuid';

// In a real app, this would be set via environment variables
//const API_URL = 'http://localhost:5000/generate_schedule';

export const generateSchedule = async (formData: FormData): Promise<ScheduleResponse> => {
  try {
    // For now, we'll simulate an API response since we don't have a backend
    // Mock API call with a delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock response data
    const mockResponse: ScheduleResponse = createMockSchedule(formData);
    
    return mockResponse;
  } catch (error) {
    console.error('Error generating schedule:', error);
    throw {
      message: 'Failed to generate schedule',
      details: error instanceof Error ? error.message : 'Unknown error'
    } as ApiError;
  }
};

// Helper function to create a mock schedule based on form data
const createMockSchedule = (formData: FormData): ScheduleResponse => {
  const { subjects, hoursPerDay } = formData;
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeBlocks = [
    '8:00 AM - 10:00 AM', 
    '10:30 AM - 12:30 PM', 
    '1:30 PM - 3:30 PM',
    '4:00 PM - 6:00 PM',
    '7:00 PM - 9:00 PM'
  ];
  
  // Sort subjects by priority
  const sortedSubjects = [...subjects].sort((a, b) => {
    const priorityWeight = { 'High': 3, 'Medium': 2, 'Low': 1 };
    return priorityWeight[b.priority] - priorityWeight[a.priority];
  });

  // Create daily schedules
  const dailySchedules: ScheduleResponse['dailySchedules'] = days.map(day => {
    // Randomly select subjects based on priority
    const shuffledSubjects = [...sortedSubjects]
      .sort(() => Math.random() - 0.5);
    
    // Assign time blocks based on hours per day
    const blocksNeeded = Math.min(Math.ceil(hoursPerDay / 2), timeBlocks.length);
    const selectedTimeBlocks = timeBlocks.slice(0, blocksNeeded);
    
    // Create schedule items
    const items = selectedTimeBlocks.map((timeBlock, index) => {
      const subjectIndex = index % shuffledSubjects.length;
      const subject = shuffledSubjects[subjectIndex];
      
      return {
        id: uuidv4(), // Add unique ID for each item
        subject: subject.name,
        priority: subject.priority,
        timeBlock,
        duration: 2, // 2 hours per block
        completed: false // Initialize as not completed
      };
    });
    
    return {
      day,
      items
    };
  });
  
  // Calculate total hours per subject
  const totalHours: Record<string, number> = {};
  dailySchedules.forEach(day => {
    day.items.forEach(item => {
      if (!totalHours[item.subject]) {
        totalHours[item.subject] = 0;
      }
      totalHours[item.subject] += item.duration;
    });
  });
  
  return {
    dailySchedules,
    totalHours
  };
};

// In a real application, we would also have functions for:
// - validateApiResponse
// - handleApiErrors
// etc.