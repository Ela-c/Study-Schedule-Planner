export interface Subject {
  id: string;
  name: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface FormData {
  subjects: Subject[];
  hoursPerDay: number;
}

export interface ScheduleItem {
  id: string; // Add unique ID for each item
  subject: string;
  priority: string;
  timeBlock: string;
  duration: number;
  completed: boolean; // Add completion status
}

export interface DailySchedule {
  day: string;
  items: ScheduleItem[];
}

export interface ScheduleResponse {
  dailySchedules: DailySchedule[];
  totalHours: Record<string, number>;
  message?: string;
}

export interface ScheduleProgress {
  totalSessions: number;
  completedSessions: number;
  totalHours: number;
  completedHours: number;
  subjectProgress: Record<string, {
    completed: number;
    total: number;
    hours: number;
  }>;
}

export interface ApiError {
  message: string;
  details?: string;
}