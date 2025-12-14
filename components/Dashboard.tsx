import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, Clock, PlayCircle, Trash2, Check, ArrowUpDown } from 'lucide-react';
import { Task, TaskStatus, Project, Priority } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  tasks: Task[];
  projects: Project[];
  onDeleteTask: (taskId: string) => void;
  onUpdateTask: (task: Task) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ tasks, projects, onDeleteTask, onUpdateTask }) => {
  const completedTasks = tasks.filter(t => t.status === TaskStatus.DONE).length;
  const inProgressTasks = tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length;
  const todoTasks = tasks.filter(t => t.status === TaskStatus.TODO).length;
  const overdueTasks = tasks.filter(t => {
    if (!t.due_date || t.status === TaskStatus.DONE) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(t.due_date);
    return dueDate < today;
  }).length;

  const activeTasksList = tasks.filter(t => t.status === TaskStatus.TODO || t.status === TaskStatus.IN_PROGRESS);
  const [sortByPriority, setSortByPriority] = useState(true);

  // Priority order for sorting
  const priorityOrder: Record<string, number> = {
    [Priority.CRITICAL]: 0,
    [Priority.HIGH]: 1,
    [Priority.MEDIUM]: 2,
    [Priority.LOW]: 3,
  };

  const sortedActiveTasks = [...activeTasksList].sort((a, b) => {
    if (sortByPriority) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return 0;
  });

  const data = [
    { name: 'Todo', value: todoTasks, color: '#94a3b8' },
    { name: 'In Progress', value: inProgressTasks, color: '#06b6d4' },
    { name: 'Review', value: tasks.filter(t => t.status === TaskStatus.REVIEW).length, color: '#a855f7' },
    { name: 'Done', value: completedTasks, color: '#22c55e' },
  ];

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-50">Dashboard</h2>
          <p className="text-slate-400">Project overview and key metrics</p>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Stats + Chart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 card-premium hover:border-slate-700 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                  <CheckCircle2 size={20} />
                </div>
                <span className="text-xs text-slate-400">Total Tasks</span>
              </div>
              <h3 className="text-3xl font-bold text-slate-50 mb-1">{tasks.length}</h3>
              <p className="text-sm text-slate-400">{completedTasks} completed</p>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 card-premium hover:border-slate-700 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-cyan-500/20 rounded-lg text-cyan-400">
                  <PlayCircle size={20} />
                </div>
                <span className="text-xs text-slate-400">Active</span>
              </div>
              <h3 className="text-3xl font-bold text-slate-50 mb-1">{activeTasksList.length}</h3>
              <p className="text-sm text-slate-400">Active work items</p>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 card-premium">
            <h3 className="text-lg font-semibold text-slate-50 mb-6">Task Distribution</h3>
            <div style={{ width: '100%', height: '256px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <XAxis dataKey="name" stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }}
                    itemStyle={{ color: '#FFFFFF' }}
                    labelStyle={{ color: '#FFFFFF' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column - Active Tasks (Full Height) */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 flex flex-col card-elevated">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-50">Active Tasks</h3>
            <button
              onClick={() => setSortByPriority(!sortByPriority)}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                sortByPriority ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
              title="Sort by priority"
            >
              <ArrowUpDown size={14} />
              Priority
            </button>
          </div>
          <div className="space-y-3 flex-1 overflow-y-auto">
            {sortedActiveTasks.length === 0 ? (
              <p className="text-slate-500 text-center py-4">No active tasks</p>
            ) : (
              sortedActiveTasks.map(task => {
                // Check if task is overdue
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const dueDate = task.due_date ? new Date(task.due_date) : null;
                const isOverdue = dueDate && dueDate < today && task.status !== TaskStatus.DONE;

                return (
                <div key={task.id} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-slate-600 hover:bg-slate-800 transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className={`font-medium line-clamp-1 ${isOverdue ? 'text-red-500 font-bold' : 'text-slate-100'}`}>{task.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ml-2 ${task.status === TaskStatus.IN_PROGRESS
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'bg-slate-700/50 text-slate-300'
                      }`}>
                      {task.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-3 text-xs text-slate-400">
                    <span className={`px-2 py-1 rounded font-medium ${task.priority === 'High' || task.priority === 'Critical' ? 'text-red-300 bg-red-500/20 border border-red-500/30' :
                      task.priority === 'Medium' ? 'text-yellow-300 bg-yellow-500/20 border border-yellow-500/30' :
                        'text-blue-300 bg-blue-500/20 border border-blue-500/30'
                      }`}>
                      {task.priority}
                    </span>
                    <span className="text-slate-400">Due: {new Date(task.due_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onUpdateTask({ ...task, status: TaskStatus.DONE })}
                      className="p-1.5 text-green-400 hover:bg-green-400/10 rounded transition-colors"
                      title="Mark as Done"
                    >
                      <Check size={14} />
                    </button>
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-1.5 text-red-400 hover:bg-red-400/10 rounded transition-colors"
                      title="Delete Task"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )})
            )}
          </div>
        </div>
      </div>
    </div>
  );
};