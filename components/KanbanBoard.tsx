import React from 'react';
import { Task, TaskStatus, Priority, User } from '../types';
import { Plus, MoreHorizontal, Calendar, Clock } from 'lucide-react';

interface KanbanBoardProps {
  tasks: Task[];
  users: User[];
  onAddTask: (task: Omit<Task, 'id'>) => void;
  onOpenCreateTask: (status?: TaskStatus) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, users, onOpenCreateTask }) => {
  const columns = [
    { id: TaskStatus.TODO, title: 'To Do', color: 'border-gray-500' },
    { id: TaskStatus.IN_PROGRESS, title: 'In Progress', color: 'border-cyan-500' },
    { id: TaskStatus.REVIEW, title: 'In Review', color: 'border-purple-500' },
    { id: TaskStatus.DONE, title: 'Done', color: 'border-green-500' },
  ];

  const getPriorityColor = (p: Priority) => {
    switch (p) {
      case Priority.HIGH: return 'bg-red-500/10 text-red-400 border-red-500/20';
      case Priority.MEDIUM: return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case Priority.LOW: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default: return 'bg-gray-500/10 text-gray-400';
    }
  };

  const getUser = (id: string) => users.find(u => u.id === id);

  return (
    <div className="p-8 h-full flex flex-col relative">
      <header className="flex justify-between items-center mb-8 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-white">Kanban Board</h2>
            <span className="px-2 py-0.5 bg-gray-800 text-xs rounded-full text-gray-400">InsightPM</span>
          </div>
          <p className="text-gray-400">{tasks.length} tasks across all stages</p>
        </div>
        <button
          onClick={() => onOpenCreateTask(TaskStatus.TODO)}
          className="bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          Add Task
        </button>
      </header>

      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-6 h-full min-w-[1000px]">
          {columns.map(col => {
            const colTasks = tasks.filter(t => t.status === col.id);
            return (
              <div key={col.id} className="flex-1 flex flex-col min-w-[300px] bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                <div className={`flex items-center justify-between mb-4 border-t-2 ${col.color} pt-2`}>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-200">{col.title}</h3>
                    <span className="bg-gray-800 text-gray-400 text-xs px-2 py-0.5 rounded-full">
                      {colTasks.length}
                    </span>
                  </div>
                  <button className="text-gray-500 hover:text-gray-300">
                    <MoreHorizontal size={16} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                  {colTasks.map(task => {
                    const assignee = task.assignee_id ? getUser(task.assignee_id) : undefined;
                    return (
                      <div key={task.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors group cursor-pointer shadow-sm">
                        <div className="flex justify-between items-start mb-3">
                          <span className={`text-xs px-2 py-1 rounded border ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                          {assignee && (
                            <img
                              src={assignee.avatar_url || 'https://via.placeholder.com/32'}
                              alt={assignee.full_name}
                              className="w-6 h-6 rounded-full border border-gray-600"
                              title={assignee.full_name}
                            />
                          )}
                        </div>

                        <h4 className="text-gray-200 font-medium mb-2 line-clamp-2">{task.title}</h4>

                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-3">
                          {task.due_date && (
                            <div className="flex items-center gap-1">
                              <Calendar size={12} />
                              <span>{new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                            </div>
                          )}
                          {task.estimated_time && (
                            <div className="flex items-center gap-1">
                              <Clock size={12} />
                              <span>{task.estimated_time}h</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => onOpenCreateTask(col.id)}
                  className="mt-3 w-full py-2 flex items-center justify-center gap-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors text-sm border border-dashed border-gray-700 hover:border-gray-600"
                >
                  <Plus size={16} />
                  Add card
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};