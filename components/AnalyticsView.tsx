import React from 'react';
import { Task, TimeEntry } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

interface AnalyticsViewProps {
  tasks: Task[];
  timeEntries: TimeEntry[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ tasks, timeEntries }) => {
  // Prepare data for Estimated vs Actual
  const chartData = tasks.slice(0, 10).map(task => {
    const actualHours = timeEntries
      .filter(entry => entry.task_id === task.id)
      .reduce((sum, entry) => sum + entry.hours, 0);

    return {
      name: task.title.substring(0, 15) + '...',
      Estimated: task.estimated_time,
      Actual: actualHours
    };
  });

  const totalEstimated = tasks.reduce((sum, t) => sum + t.estimated_time, 0);
  const totalActual = timeEntries.reduce((sum, e) => sum + e.hours, 0);
  const efficiency = totalActual > 0 ? Math.round((totalEstimated / totalActual) * 100) : 0;

  return (
    <div className="p-8">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
        <p className="text-gray-400">Performance metrics and time tracking analysis</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-400 text-sm">Total Hours Logged</p>
              <h3 className="text-3xl font-bold text-white mt-1">{totalActual}h</h3>
            </div>
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Clock className="text-blue-500" size={24} />
            </div>
          </div>
          <div className="flex items-center text-sm text-green-500">
            <ArrowUpRight size={16} className="mr-1" />
            <span>+12.5% from last week</span>
          </div>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-400 text-sm">Task Completion Rate</p>
              <h3 className="text-3xl font-bold text-white mt-1">
                {tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'Done').length / tasks.length) * 100) : 0}%
              </h3>
            </div>
            <div className="p-2 bg-green-500/10 rounded-lg">
              <CheckCircle className="text-green-500" size={24} />
            </div>
          </div>
          <div className="flex items-center text-sm text-green-500">
            <ArrowUpRight size={16} className="mr-1" />
            <span>+5.2% from last week</span>
          </div>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-400 text-sm">Efficiency Score</p>
              <h3 className="text-3xl font-bold text-white mt-1">{efficiency}%</h3>
            </div>
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <AlertTriangle className="text-purple-500" size={24} />
            </div>
          </div>
          <div className="flex items-center text-sm text-red-500">
            <ArrowDownRight size={16} className="mr-1" />
            <span>-2.1% from last week</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 h-[400px]">
        <h3 className="text-lg font-semibold text-white mb-6">Estimated vs Actual Time</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#F3F4F6' }}
              itemStyle={{ color: '#F3F4F6' }}
            />
            <Legend />
            <Line type="monotone" dataKey="Estimated" stroke="#3B82F6" strokeWidth={2} />
            <Line type="monotone" dataKey="Actual" stroke="#10B981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};