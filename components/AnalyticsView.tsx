import React from 'react';
import { Task, TimeEntry } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Clock, CheckCircle, AlertTriangle, ListTodo } from 'lucide-react';

interface AnalyticsViewProps {
  tasks: Task[];
  timeEntries: TimeEntry[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ tasks, timeEntries }) => {
  // Group completed tasks by date (completed_at or today as fallback)
  const completedByDate: Record<string, number> = {};
  const today = new Date().toISOString().split('T')[0];
  
  tasks.forEach(task => {
    if (task.status === 'Done') {
      // Use completed_at if available, otherwise use today
      const completionDate = task.completed_at 
        ? task.completed_at.split('T')[0] 
        : today;
      completedByDate[completionDate] = (completedByDate[completionDate] || 0) + 1;
    }
  });

  // Convert to array and sort by date
  const chartData = Object.entries(completedByDate)
    .map(([date, count]) => ({
      date: new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
      fullDate: date,
      Completed: count
    }))
    .sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime())
    .slice(-14); // Show last 14 days with data

  // Calculate meaningful metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Done').length;
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);
  const overdueTasks = tasks.filter(t => {
    if (t.status === 'Done') return false;
    if (!t.due_date) return false;
    const dueDate = new Date(t.due_date);
    return dueDate < todayDate;
  }).length;
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;

  return (
    <div className="p-8">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
        <p className="text-gray-400">Performance metrics and task overview</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-400 text-sm">Total Tasks</p>
              <h3 className="text-3xl font-bold text-white mt-1">{totalTasks}</h3>
            </div>
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <ListTodo className="text-blue-500" size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500">All tasks in system</p>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-400 text-sm">Completed</p>
              <h3 className="text-3xl font-bold text-white mt-1">{completedTasks}</h3>
            </div>
            <div className="p-2 bg-green-500/10 rounded-lg">
              <CheckCircle className="text-green-500" size={24} />
            </div>
          </div>
          <p className="text-sm text-green-500">
            {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}% completion rate
          </p>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-400 text-sm">In Progress</p>
              <h3 className="text-3xl font-bold text-white mt-1">{inProgressTasks}</h3>
            </div>
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <Clock className="text-yellow-500" size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500">Currently being worked on</p>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-400 text-sm">Overdue</p>
              <h3 className={`text-3xl font-bold mt-1 ${overdueTasks > 0 ? 'text-red-400' : 'text-white'}`}>
                {overdueTasks}
              </h3>
            </div>
            <div className="p-2 bg-red-500/10 rounded-lg">
              <AlertTriangle className="text-red-500" size={24} />
            </div>
          </div>
          <p className={`text-sm ${overdueTasks > 0 ? 'text-red-400' : 'text-gray-500'}`}>
            {overdueTasks > 0 ? 'Needs attention!' : 'All on track'}
          </p>
        </div>
      </div>

      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 h-[400px]">
        <h3 className="text-lg font-semibold text-white mb-6">Tasks Completed by Date</h3>
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={chartData} barSize={40}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#9CA3AF" 
              tick={{ fill: '#E5E7EB', fontSize: 12 }}
              label={{ value: 'Date', position: 'insideBottom', fill: '#9CA3AF', dy: 10, fontSize: 13 }}
            />
            <YAxis 
              stroke="#9CA3AF" 
              tick={{ fill: '#E5E7EB', fontSize: 12 }} 
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ fill: 'transparent' }}
              contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#F3F4F6' }}
              itemStyle={{ color: '#F3F4F6' }}
            />
            <Bar dataKey="Completed" fill="#10B981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};