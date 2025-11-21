import React from 'react';
import { User, Task, TaskStatus } from '../types';
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface ResourceViewProps {
  users: User[];
  tasks: Task[];
}

export const ResourceView: React.FC<ResourceViewProps> = ({ users, tasks }) => {
  // Filter active tasks only for capacity calculation
  const activeTasks = tasks.filter(t => t.status !== TaskStatus.DONE);

  return (
    <div className="p-8">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-white">Resource Management</h2>
        <p className="text-gray-400">Team capacity and workload distribution</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(user => {
          const userTasks = activeTasks.filter(t => t.assignee_id === user.id);
          const totalHours = userTasks.reduce((sum, t) => sum + t.estimated_time, 0);
          const sprintCapacity = user.daily_capacity_hours * 5; // Assuming 5 day sprint
          const utilization = (totalHours / sprintCapacity) * 100;

          let statusColor = 'bg-green-500';
          let statusText = 'Optimal';
          if (utilization > 100) {
            statusColor = 'bg-red-500';
            statusText = 'Overloaded';
          } else if (utilization > 80) {
            statusColor = 'bg-yellow-500';
            statusText = 'Heavy';
          } else if (utilization < 40) {
            statusColor = 'bg-blue-500';
            statusText = 'Underutilized';
          }

          return (
            <div key={user.id} className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
              <div className="p-6 border-b border-gray-800 flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <img
                    src={user.avatar_url || 'https://via.placeholder.com/40'}
                    alt={user.full_name}
                    className="w-12 h-12 rounded-full border-2 border-gray-800"
                  />
                  <div>
                    <h3 className="font-bold text-white">{user.full_name}</h3>
                    <p className="text-xs text-gray-500">{user.role}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-bold text-white ${statusColor}`}>
                  {statusText}
                </span>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Capacity Usage</span>
                    <span>{totalHours} / {sprintCapacity} h</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${statusColor}`}
                      style={{ width: `${Math.min(utilization, 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">Active Tasks</h4>
                  <div className="space-y-2">
                    {userTasks.length > 0 ? (
                      userTasks.map(task => (
                        <div key={task.id} className="bg-gray-950 p-3 rounded-lg border border-gray-800 flex justify-between items-center">
                          <span className="text-sm text-gray-300 truncate max-w-[150px]">{task.title}</span>
                          <span className="text-xs text-gray-500">{task.estimated_time}h</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-600 italic">No active tasks assigned.</p>
                    )}
                  </div>
                </div>

                <button className="w-full py-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 text-xs transition-colors">
                  Reassign Tasks
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};