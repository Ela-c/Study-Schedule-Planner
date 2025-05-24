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
  subject: string;
  priority: string;
  timeBlock: string;
  duration: number;
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

export interface ApiError {
  message: string;
  details?: string;
}