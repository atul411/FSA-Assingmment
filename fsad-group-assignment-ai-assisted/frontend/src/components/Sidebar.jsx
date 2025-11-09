import React from 'react';
import { Logo } from './Logo';
import { 
  LayoutDashboard, 
  Package, 
  ClipboardList, 
  BookOpen, 
  RotateCcw,
  FileText,
  Settings,
  LogOut
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export const Sidebar = ({ currentPage, onNavigate, collapsed = false }) => {
  const { currentUser, logout } = useApp();
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'equipment', label: 'Equipment', icon: Package },
    { id: 'requests', label: 'Requests', icon: ClipboardList },
    { id: 'my-loans', label: 'My Loans', icon: BookOpen },
    { id: 'returns', label: 'Returns', icon: RotateCcw },
    ...(currentUser?.role === 'admin' ? [{ id: 'reports', label: 'Reports', icon: FileText }] : []),
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className={`bg-white border-r border-gray-200 flex flex-col h-screen transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className="p-6 border-b border-gray-200">
        <Logo variant={collapsed ? 'compact' : 'default'} />
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive 
                  ? 'bg-[#2F5DFF] text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-all"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};
