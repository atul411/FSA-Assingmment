import React from 'react';
import { LayoutDashboard, Search, BookOpen, Menu } from 'lucide-react';

export const MobileNav = ({ currentPage, onNavigate, onMenuOpen }) => {
  const navItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'equipment', label: 'Search', icon: Search },
    { id: 'my-loans', label: 'My Loans', icon: BookOpen },
    { id: 'menu', label: 'Menu', icon: Menu },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 flex items-center justify-around z-50 lg:hidden">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentPage === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => item.id === 'menu' ? onMenuOpen() : onNavigate(item.id)}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${
              isActive ? 'text-[#2F5DFF]' : 'text-gray-600'
            }`}
          >
            <Icon className="w-6 h-6" />
            <span style={{ fontSize: '12px' }}>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
