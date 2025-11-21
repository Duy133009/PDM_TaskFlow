import React from 'react';
import { Task, User } from '../types';

interface GanttChartProps {
  tasks: Task[];
  users: User[];
}

export const GanttChart: React.FC<GanttChartProps> = ({ tasks, users }) => {
  // Simplified Calendar Grid Generation
  // Assuming a range around current date
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 5); // Start 5 days ago

  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    return d;
  });

  const getTaskPosition = (task: Task) => {
    if (!task.start_date || !task.due_date) return { left: 0, width: 0 };

    const start = new Date(task.start_date);
    const end = new Date(task.due_date);

    const totalDays = 14;
    const dayWidth = 100 / totalDays;

    const diffStart = Math.max(0, (start.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const duration = Math.max(1, (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    return {
      left: `${diffStart * dayWidth}%`,
      width: `${Math.min(duration, totalDays - diffStart) * dayWidth}%`
    };
  };

  return (
    <div className="p-8 h-full flex flex-col">
      <header className="mb-6 shrink-0">
        <h2 className="text-2xl font-bold text-white">Gantt Timeline</h2>
        <p className="text-gray-400">Project schedule and dependencies</p>
      </header>

      <div className="flex-1 bg-gray-900 rounded-xl border border-gray-800 overflow-hidden flex flex-col">
        {/* Timeline Header */}
        <div className="flex border-b border-gray-800 bg-gray-950">
          <div className="w-64 p-4 border-r border-gray-800 font-semibold text-gray-400 shrink-0">
            Task
          </div>
          <div className="flex-1 flex">
            {dates.map((date, i) => (
              <div key={i} className="flex-1 border-r border-gray-800 p-2 text-center min-w-[40px]">
                <div className="text-xs text-gray-500">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                <div className={`text-sm font-bold ${date.getDate() === today.getDate() ? 'text-cyan-400' : 'text-gray-300'}`}>
                  {date.getDate()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Body */}
        <div className="flex-1 overflow-y-auto">
          {tasks.map(task => {
            const assignee = users.find(u => u.id === task.assignee_id);
            const { left, width } = getTaskPosition(task);

            return (
              <div key={task.id} className="flex border-b border-gray-800 hover:bg-gray-800/30 transition-colors group">
                <div className="w-64 p-4 border-r border-gray-800 shrink-0 flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${task.priority === 'High' ? 'bg-red-500' :
                      task.priority === 'Medium' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`} />
                  <span className="text-sm text-gray-200 truncate">{task.title}</span>
                </div>
                <div className="flex-1 relative h-14">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 flex pointer-events-none">
                    {dates.map((_, i) => (
                      <div key={i} className="flex-1 border-r border-gray-800/50" />
                    ))}
                  </div>

                  {/* Task Bar */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 h-8 rounded-lg bg-cyan-600/20 border border-cyan-500/50 flex items-center px-3 group-hover:bg-cyan-600/30 transition-colors cursor-pointer"
                    style={{ left, width }}
                  >
                    {assignee && (
                      <img
                        src={assignee.avatar_url}
                        alt={assignee.full_name}
                        className="w-5 h-5 rounded-full border border-cyan-400 mr-2"
                        title={assignee.full_name}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};