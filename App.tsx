import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { KanbanBoard } from './components/KanbanBoard';
import { GanttChart } from './components/GanttChart';
import { ResourceView } from './components/ResourceView';
import { AnalyticsView } from './components/AnalyticsView';
import { TimeLogView } from './components/TimeLogView';
import { CreateTaskModal } from './components/CreateTaskModal';
import { Login } from './components/Login';
import { supabase } from './services/supabaseClient';
import { MOCK_TIME_ENTRIES } from './constants';
import { TimeEntry, Task, TaskStatus, Project, User } from './types';
import { Plus, LogOut } from 'lucide-react';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [currentView, setCurrentView] = useState('dashboard');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [timeEntries, setTimeEntries] = useState(MOCK_TIME_ENTRIES);

  // Global Modal State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskModalStatus, setTaskModalStatus] = useState<TaskStatus>(TaskStatus.TODO);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [session]);

  const fetchData = async () => {
    const { data: tasksData } = await supabase.from('tasks').select('*');
    const { data: projectsData } = await supabase.from('projects').select('*');
    const { data: profilesData } = await supabase.from('profiles').select('*');

    if (tasksData) setTasks(tasksData);
    if (projectsData) setProjects(projectsData);
    if (profilesData) setUsers(profilesData);
  };

  const handleAddTimeEntry = (entry: Omit<TimeEntry, 'id'>) => {
    const newEntry: TimeEntry = {
      ...entry,
      id: Math.random().toString(36).substr(2, 9)
    };
    setTimeEntries([...timeEntries, newEntry]);
  };

  const handleAddTask = async (taskData: Omit<Task, 'id'>) => {
    // Optimistic update
    const tempTask: Task = {
      ...taskData,
      id: Math.random().toString(36).substr(2, 9),
    };
    setTasks([...tasks, tempTask]);

    // Save to Supabase
    const { data, error } = await supabase.from('tasks').insert([
      {
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        priority: taskData.priority,
        assignee_id: taskData.assignee_id,
        start_date: taskData.start_date,
        due_date: taskData.due_date,
        estimated_time: taskData.estimated_time,
        tags: taskData.tags,
        project_id: taskData.project_id
      }
    ]).select();

    if (data) {
      // Replace temp task with real one
      setTasks(prev => prev.map(t => t.id === tempTask.id ? data[0] : t));
    } else if (error) {
      console.error('Error adding task:', error);
      // Revert optimistic update
      setTasks(prev => prev.filter(t => t.id !== tempTask.id));
    }
  };

  const openCreateTaskModal = (status: TaskStatus = TaskStatus.TODO) => {
    setTaskModalStatus(status);
    setIsTaskModalOpen(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard tasks={tasks} projects={projects} />;
      case 'kanban':
        return <KanbanBoard tasks={tasks} users={users} onAddTask={handleAddTask} onOpenCreateTask={openCreateTaskModal} />;
      case 'gantt':
        return <GanttChart tasks={tasks} users={users} />;
      case 'resources':
        return <ResourceView tasks={tasks} users={users} />;
      case 'analytics':
        return <AnalyticsView tasks={tasks} timeEntries={timeEntries} />;
      case 'time':
        return <TimeLogView tasks={tasks} timeEntries={timeEntries} addTimeEntry={handleAddTimeEntry} />;
      default:
        return (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">Settings</h2>
              <p>Settings panel is under construction.</p>
            </div>
          </div>
        );
    }
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-black text-white">Loading...</div>;
  }

  if (!session) {
    return <Login onLoginSuccess={() => { }} />;
  }

  return (
    <div className="flex h-screen bg-black overflow-hidden font-sans">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <main className="flex-1 overflow-auto bg-gray-950 relative flex flex-col">
        {/* Top bar */}
        <div className="h-16 border-b border-gray-800 flex items-center justify-between px-8 bg-gray-950 sticky top-0 z-40 shrink-0">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-400 hidden md:block">
              <span className="text-gray-600">Workspace / </span>
              <span className="text-white font-medium">InsightPM Platform</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-64 relative hidden md:block">
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-gray-900 border border-gray-700 rounded-full py-1.5 px-4 text-sm text-gray-300 focus:border-primary-600 focus:outline-none transition-colors"
              />
            </div>

            {/* Global Add Task Button */}
            <button
              onClick={() => openCreateTaskModal()}
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">New Task</span>
            </button>

            <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:bg-gray-700">
              AC
            </div>

            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-white transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {renderView()}
        </div>
      </main>

      <CreateTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleAddTask}
        users={users}
        initialStatus={taskModalStatus}
      />
    </div>
  );
};

export default App;