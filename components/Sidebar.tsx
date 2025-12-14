import React from 'react';
import { LayoutDashboard, KanbanSquare, GanttChartSquare, BarChart3, Clock, Settings } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'kanban', label: 'Kanban Board', icon: KanbanSquare },
    { id: 'gantt', label: 'Gantt Chart', icon: GanttChartSquare },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="w-64 h-screen bg-slate-950 border-r border-slate-800/50 flex flex-col text-slate-300">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800/50">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-blue-600/20">T</div>
        <h1 className="text-lg font-bold text-slate-50">Taskflow</h1>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 mt-2 px-2">
          Main Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive 
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'
              }`}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800/50">
        <button
          onClick={() => setCurrentView('settings')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
             currentView === 'settings' ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-slate-400 hover:bg-slate-800/50 border border-transparent'
          }`}
        >
          <Settings size={18} />
          Settings
        </button>
      </div>
    </div>
  );
};