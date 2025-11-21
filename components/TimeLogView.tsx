import React, { useState } from 'react';
import { Task, TimeEntry } from '../types';
import { Clock, Save, Trash2 } from 'lucide-react';

interface TimeLogViewProps {
  tasks: Task[];
  timeEntries: TimeEntry[];
  addTimeEntry: (entry: Omit<TimeEntry, 'id'>) => void;
}

export const TimeLogView: React.FC<TimeLogViewProps> = ({ tasks, timeEntries, addTimeEntry }) => {
  const [selectedTask, setSelectedTask] = useState('');
  const [hours, setHours] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [desc, setDesc] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !hours) return;

    addTimeEntry({
      task_id: selectedTask,
      user_id: 'u1', // Mocking current user
      hours: parseFloat(hours),
      date: date,
      description: desc
    });

    // Reset
    setHours('');
    setDesc('');
    alert("Time logged successfully!");
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-white">Time Logging</h2>
        <p className="text-gray-400">Track hours spent on tasks and projects</p>
      </header>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 flex items-center gap-4">
          <div className="bg-cyan-500/10 p-3 rounded-full text-cyan-500">
            <Clock size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">16h</div>
            <div className="text-xs text-gray-500">This Week</div>
          </div>
        </div>
        {/* Placeholders for other stats */}
      </div>

      <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-xl border border-gray-800 mb-8 shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Log Time Entry</h3>

        <div className="grid grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1 uppercase font-semibold">Date *</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-gray-950 border border-gray-700 rounded-lg p-2.5 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1 uppercase font-semibold">Hours *</label>
            <input
              type="number"
              min="0.1"
              step="0.1"
              required
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="0"
              className="w-full bg-gray-950 border border-gray-700 rounded-lg p-2.5 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs text-gray-400 mb-1 uppercase font-semibold">Task *</label>
          <select
            value={selectedTask}
            onChange={(e) => setSelectedTask(e.target.value)}
            required
            className="w-full bg-gray-950 border border-gray-700 rounded-lg p-2.5 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
          >
            <option value="">Select a task...</option>
            {tasks.map(t => (
              <option key={t.id} value={t.id}>{t.title}</option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-xs text-gray-400 mb-1 uppercase font-semibold">Description (Optional)</label>
          <textarea
            rows={3}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Add notes about this time entry..."
            className="w-full bg-gray-950 border border-gray-700 rounded-lg p-2.5 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all resize-none"
          />
        </div>

        <div className="flex justify-end">
          <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors">
            <Save size={18} />
            Log Time
          </button>
        </div>
      </form>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-300">Recent Entries</h3>
        {timeEntries.slice().reverse().map(entry => {
          const task = tasks.find(t => t.id === entry.task_id);
          return (
            <div key={entry.id} className="bg-gray-900 p-4 rounded-lg border border-gray-800 flex justify-between items-center group hover:border-gray-700 transition-colors">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-white">{task?.title || 'Unknown Task'}</h4>
                  <span className="bg-gray-800 text-gray-400 text-xs px-2 py-0.5 rounded-full">{entry.hours}h</span>
                </div>
                <p className="text-xs text-gray-500">{new Date(entry.date).toLocaleDateString()} • {entry.description || 'No description'}</p>
              </div>
              <button className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 size={18} />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  );
};