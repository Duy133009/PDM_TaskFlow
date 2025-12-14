import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { KanbanBoard } from './components/KanbanBoard';
import { GanttChart } from './components/GanttChart';
import { ResourceView } from './components/ResourceView';
import { AnalyticsView } from './components/AnalyticsView';
import { TimeLogView } from './components/TimeLogView';
import { SettingsView } from './components/SettingsView';
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
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(MOCK_TIME_ENTRIES);
  const [displayName, setDisplayName] = useState<string>('');

  // Modal state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskModalStatus, setTaskModalStatus] = useState<TaskStatus>(TaskStatus.TODO);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  // Auth session handling
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        const name = session.user.user_metadata?.display_name || session.user.user_metadata?.full_name || session.user.email || '';
        setDisplayName(name);
      }
      setLoading(false);
    });
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        const name = session.user.user_metadata?.display_name || session.user.user_metadata?.full_name || session.user.email || '';
        setDisplayName(name);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  // Fetch data when session is ready
  const fetchData = async () => {
    const { data: tasksData } = await supabase.from('tasks').select('*');
    const { data: projectsData } = await supabase.from('projects').select('*');
    const { data: usersData } = await supabase.from('users').select('*');
    if (tasksData) setTasks(tasksData as Task[]);
    if (projectsData) setProjects(projectsData as Project[]);
    if (usersData) setUsers(usersData as User[]);
    // Ensure at least one project exists
    if (!projectsData || projectsData.length === 0) {
      const { data: newProject, error } = await supabase.from('projects').insert([
        {
          name: 'Default Project',
          description: 'Auto-generated default project',
          status: 'Active',
          progress: 0,
        },
      ]).select();
      if (newProject) setProjects(newProject as Project[]);
      if (error) console.error('Error creating default project:', error);
    }
  };

  const handleAddTask = async (taskData: Omit<Task, 'id'>) => {
    if (editingTask) {
      // Update existing task
      const { data, error } = await supabase
        .from('tasks')
        .update({
          title: taskData.title,
          description: taskData.description,
          status: taskData.status,
          priority: taskData.priority,
          assignee_id: taskData.assignee_id,
          start_date: taskData.start_date,
          due_date: taskData.due_date,
          estimated_time: taskData.estimated_time,
          tags: taskData.tags,
          project_id: taskData.project_id?.trim() || null,
        })
        .eq('id', editingTask.id)
        .select();

      if (data) {
        setTasks(prev => prev.map(t => (t.id === editingTask.id ? data[0] : t)));
      } else if (error) {
        console.error('Error updating task:', error);
      }
      setEditingTask(undefined);
    } else {
      // Create new task
      // Optimistic UI update
      const tempTask: Task = { ...taskData, id: Math.random().toString(36).substr(2, 9) };
      setTasks([...tasks, tempTask]);

      const insertData: any = {
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        priority: taskData.priority,
        assignee_id: taskData.assignee_id,
        start_date: taskData.start_date,
        due_date: taskData.due_date,
        estimated_time: taskData.estimated_time,
        tags: taskData.tags,
        // Auto-set completed_at if creating a task with Done status
        completed_at: taskData.status === 'Done' ? new Date().toISOString() : null,
      };

      if (taskData.project_id && taskData.project_id.trim() !== '') {
        insertData.project_id = taskData.project_id;
      }

      const { data, error } = await supabase.from('tasks').insert([insertData]).select();

      if (data) {
        setTasks(prev => prev.map(t => (t.id === tempTask.id ? data[0] : t)));
      } else if (error) {
        console.error('Error adding task:', error);
        setTasks(prev => prev.filter(t => t.id !== tempTask.id));
      }
    }
  };

  const handleUpdateTask = async (task: Task) => {
    // Auto-set completed_at when task is marked as Done
    const updatedTask = { ...task };
    if (task.status === 'Done' && !task.completed_at) {
      updatedTask.completed_at = new Date().toISOString();
    } else if (task.status !== 'Done') {
      updatedTask.completed_at = undefined;
    }

    // Optimistic update
    setTasks(prev => prev.map(t => (t.id === task.id ? updatedTask : t)));

    const { error } = await supabase
      .from('tasks')
      .update({
        title: updatedTask.title,
        description: updatedTask.description,
        status: updatedTask.status,
        priority: updatedTask.priority,
        assignee_id: updatedTask.assignee_id,
        start_date: updatedTask.start_date,
        due_date: updatedTask.due_date,
        completed_at: updatedTask.completed_at || null,
        estimated_time: updatedTask.estimated_time,
        tags: updatedTask.tags,
        project_id: updatedTask.project_id?.trim() || null,
      })
      .eq('id', task.id);

    if (error) {
      console.error('Error updating task:', error);
      // Revert if error (fetch fresh data)
      fetchData();
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    // Optimistic update
    const taskToDelete = tasks.find(t => t.id === taskId);
    setTasks(prev => prev.filter(t => t.id !== taskId));

    const { error } = await supabase.from('tasks').delete().eq('id', taskId);

    if (error) {
      console.error('Error deleting task:', error);
      // Revert if error
      if (taskToDelete) setTasks(prev => [...prev, taskToDelete]);
    }
  };

  const openEditTaskModal = (task: Task) => {
    setEditingTask(task);
    setTaskModalStatus(task.status);
    setIsTaskModalOpen(true);
  };

  const handleAddTimeEntry = (entry: Omit<TimeEntry, 'id'>) => {
    const newEntry: TimeEntry = { ...entry, id: Math.random().toString(36).substr(2, 9) };
    setTimeEntries([...timeEntries, newEntry]);
  };

  const openCreateTaskModal = (status: TaskStatus = TaskStatus.TODO) => {
    setEditingTask(undefined);
    setTaskModalStatus(status);
    setIsTaskModalOpen(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard
          tasks={tasks}
          projects={projects}
          onDeleteTask={handleDeleteTask}
          onUpdateTask={handleUpdateTask}
        />;
      case 'kanban':
        return <KanbanBoard
          tasks={tasks}
          users={users}
          onAddTask={handleAddTask}
          onOpenCreateTask={openCreateTaskModal}
          onEditTask={openEditTaskModal}
          onDeleteTask={handleDeleteTask}
        />;
      case 'gantt':
        return <GanttChart tasks={tasks} users={users} />;
      case 'resources':
        return <ResourceView tasks={tasks} users={users} />;
      case 'analytics':
        return <AnalyticsView tasks={tasks} timeEntries={timeEntries} />;
      case 'time':
        return <TimeLogView tasks={tasks} timeEntries={timeEntries} addTimeEntry={handleAddTimeEntry} />;
      case 'settings':
        return <SettingsView />;
      default:
        return <SettingsView />;
    }
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-black text-white">Loading...</div>;
  }

  if (!session) {
    return <Login onLoginSuccess={() => { }} />;
  }

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden font-sans">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <main className="flex-1 overflow-auto bg-slate-950 relative flex flex-col">
        {/* Top bar */}
        <div className="h-16 border-b border-slate-800/50 flex items-center justify-between px-8 bg-slate-950/95 backdrop-blur-sm sticky top-0 z-40 shrink-0">
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-400 hidden md:block">
              <span className="text-slate-600">Workspace / </span>
              <span className="text-slate-200 font-medium">Taskflow</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-64 relative hidden md:block">
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-slate-900 border border-slate-700/50 rounded-full py-1.5 px-4 text-sm text-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 focus:outline-none transition-all"
              />
            </div>
            {/* Global Add Task Button */}
            <button
              onClick={() => openCreateTaskModal()}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-all shadow-lg shadow-blue-600/20"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">New Task</span>
            </button>
            <div className="px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700/50 flex items-center justify-center text-slate-200 text-xs font-bold cursor-pointer hover:bg-slate-700 transition-colors" title={displayName}>
              {displayName ? displayName.slice(0, 12) : 'User'}
            </div>
            <button onClick={handleLogout} className="text-slate-400 hover:text-slate-200 transition-colors" title="Logout">
              <LogOut size={20} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto">{renderView()}</div>
      </main>
      <CreateTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(undefined);
        }}
        onSave={handleAddTask}
        users={users}
        projects={projects}
        initialStatus={taskModalStatus}
        taskToEdit={editingTask}
      />
    </div>
  );
};

export default App;