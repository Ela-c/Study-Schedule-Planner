import React from 'react';
import { ScheduleResponse } from '../types';

interface ScheduleDisplayProps {
  schedule: ScheduleResponse;
}

const ScheduleDisplay: React.FC<ScheduleDisplayProps> = ({ schedule }) => {
  const { dailySchedules, totalHours } = schedule;
  
  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="mt-8 animate-fadeIn">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Study Schedule</h2>
      
      {/* Summary of hours per subject */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Total Study Hours</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(totalHours).map(([subject, hours]) => (
            <div 
              key={subject} 
              className="flex justify-between items-center p-3 bg-white rounded-md shadow-sm"
            >
              <span className="font-medium text-gray-700">{subject}</span>
              <span className="font-semibold text-blue-600">{hours} hours</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Daily schedules */}
      <div className="space-y-6">
        {dailySchedules.map((day) => (
          <div key={day.day} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-indigo-600 text-white p-3">
              <h3 className="text-lg font-semibold">{day.day}</h3>
            </div>
            
            <div className="divide-y divide-gray-100">
              {day.items.length > 0 ? (
                day.items.map((item, index) => (
                  <div key={index} className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{item.subject}</h4>
                        <p className="text-sm text-gray-500">{item.timeBlock}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{item.duration} hours</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(item.priority)}`}>
                          {item.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">No study blocks scheduled</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleDisplay;