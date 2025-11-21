import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import { X } from 'lucide-react';

interface CreateProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (project: Omit<Project, 'id'>) => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
    isOpen,
    onClose,
    onSave
}) => {
    const [newProject, setNewProject] = useState<Partial<Project>>({
        name: '',
        description: '',
        status: 'Active',
        progress: 0
    });

    useEffect(() => {
        if (isOpen) {
            setNewProject({
                name: '',
                description: '',
                status: 'Active',
                progress: 0
            });
        }
    }, [isOpen]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newProject.name) return;

        onSave({
            name: newProject.name,
            description: newProject.description || '',
            status: newProject.status as 'Active' | 'On Hold' | 'Completed',
            progress: newProject.progress || 0
        });

        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-800">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Create New Project</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Project Name *</label>
                        <input
                            type="text"
                            value={newProject.name || ''}
                            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-primary-600 focus:outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                        <textarea
                            value={newProject.description || ''}
                            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-primary-600 focus:outline-none"
                            rows={4}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                        <select
                            value={newProject.status || 'Active'}
                            onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-primary-600 focus:outline-none"
                        >
                            <option value="Active">Active</option>
                            <option value="On Hold">On Hold</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Initial Progress ({newProject.progress || 0}%)
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={newProject.progress || 0}
                            onChange={(e) => setNewProject({ ...newProject, progress: parseInt(e.target.value) })}
                            className="w-full"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors font-medium"
                        >
                            Create Project
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
