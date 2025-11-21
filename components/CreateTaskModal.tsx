import React, { useState, useEffect } from 'react';
import { Task, TaskStatus, Priority, User, Project } from '../types';
import { X } from 'lucide-react';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id'>) => void;
  users: User[];
  projects: Project[];
  initialStatus?: TaskStatus;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  users,
  projects,
  initialStatus = TaskStatus.TODO,
}) => {
  const [newTask, setNewTask] = useState<Partial<Task>>({
    status: initialStatus,
    priority: Priority.MEDIUM,
    estimated_time: 0,
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');

  // Reset form when modal opens or initialStatus changes
  useEffect(() => {
    if (isOpen) {
      setNewTask({
        title: '',
        description: '',
        status: initialStatus,
        priority: Priority.MEDIUM,
        assignee_id: users.length > 0 ? users[0].id : undefined,
        project_id: projects.length > 0 ? projects[0].id : undefined,
        start_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
        estimated_time: 4,
        tags: [],
      });
      setTagInput('');
    }
  }, [isOpen, initialStatus, users, projects]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title || !newTask.assignee_id) return;

    const tags = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t !== '');

    onSave({
      title: newTask.title!,
      description: newTask.description || '',
      status: newTask.status as TaskStatus,
      priority: newTask.priority as Priority,
      assignee_id: newTask.assignee_id!,
      project_id: newTask.project_id || undefined,
      start_date: newTask.start_date!,
      due_date: newTask.due_date!,
      estimated_time: Number(newTask.estimated_time),
      tags: tags.length > 0 ? tags : ['general'],
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-lg shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <h3 className="text-xl font-bold text-white">Create New Task</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSave} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Task Title *</label>
            <input
              type="text"
              required
              value={newTask.title || ''}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              placeholder="e.g., Update Landing Page"
              className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-primary-600 focus:outline-none transition-colors"
              autoFocus
            />
          </div>
          {/* Status & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Status</label>
              <select
                value={newTask.status}
                onChange={(e) => setNewTask({ ...newTask, status: e.target.value as TaskStatus })}
                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-primary-600 focus:outline-none transition-colors"
              >
                {Object.values(TaskStatus).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Priority</label>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Priority })}
                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-primary-600 focus:outline-none transition-colors"
              >
                {Object.values(Priority).map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Assignee & Project */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Assignee *</label>
              <select
                required
                value={newTask.assignee_id || ''}
                onChange={(e) => setNewTask({ ...newTask, assignee_id: e.target.value })}
                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-primary-600 focus:outline-none transition-colors"
              >
                {users.length === 0 ? (
                  <option value="" disabled>
                    No users available
                  </option>
                ) : (
                  users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.full_name}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Project</label>
              <select
                value={newTask.project_id || ''}
                onChange={(e) => setNewTask({ ...newTask, project_id: e.target.value || undefined })}
                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-primary-600 focus:outline-none transition-colors"
              >
                <option value="">No Project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Estimated Hours */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Est. Hours</label>
              <input
                type="number"
                min="0"
                value={newTask.estimated_time || 0}
                onChange={(e) => setNewTask({ ...newTask, estimated_time: Number(e.target.value) })}
                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-primary-600 focus:outline-none transition-colors"
              />
            </div>
          </div>
          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Start Date</label>
              <input
                type="date"
                value={newTask.start_date || ''}
                onChange={(e) => setNewTask({ ...newTask, start_date: e.target.value })}
                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-primary-600 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Due Date</label>
              <input
                type="date"
                value={newTask.due_date || ''}
                onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-primary-600 focus:outline-none transition-colors"
              />
            </div>
          </div>
          {/* Tags */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Tags (comma separated)</label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="design, backend, urgent"
              className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-primary-600 focus:outline-none transition-colors"
            />
          </div>
          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-800 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newTask.title || !newTask.assignee_id}
              className="px-4 py-2 text-sm font-medium bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};