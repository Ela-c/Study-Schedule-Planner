import React from 'react';
import { Subject } from '../types';
import { Trash2 } from 'lucide-react';

interface SubjectFieldProps {
  subject: Subject;
  index: number;
  onChange: (id: string, field: keyof Subject, value: string) => void;
  onRemove: (id: string) => void;
  isRemovable: boolean;
}

const SubjectField: React.FC<SubjectFieldProps> = ({
  subject,
  index,
  onChange,
  onRemove,
  isRemovable
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-100 transition-all hover:shadow-md">
      <div className="flex-1">
        <label 
          htmlFor={`subject-${subject.id}`} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Subject {index + 1}
        </label>
        <input
          id={`subject-${subject.id}`}
          type="text"
          value={subject.name}
          onChange={(e) => onChange(subject.id, 'name', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="e.g., Mathematics"
          required
        />
      </div>
      
      <div className="w-full md:w-40">
        <label 
          htmlFor={`priority-${subject.id}`} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Priority
        </label>
        <select
          id={`priority-${subject.id}`}
          value={subject.priority}
          onChange={(e) => onChange(subject.id, 'priority', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>
      
      <div className="flex items-end">
        <button
          type="button"
          onClick={() => onRemove(subject.id)}
          disabled={!isRemovable}
          className={`p-2 rounded-md transition-all ${
            isRemovable 
              ? 'text-red-500 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500' 
              : 'text-gray-300 cursor-not-allowed'
          }`}
          aria-label="Remove subject"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
};

export default SubjectField;