import React, { useState } from 'react';
import { Search, Bell, Menu, X } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Input } from './ui/input';
import { useApp } from '../contexts/AppContext';
import { Badge } from './ui/badge';

export const TopBar = ({ onSearch, onMenuToggle, showMenuButton = false }) => {
  const { currentUser, logout } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (value) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4 flex-1">
        {showMenuButton && (
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search equipment, requests, or users..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded-lg border-gray-300"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="relative p-2 hover:bg-gray-100 rounded-lg">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#EF4444] rounded-full"></span>
        </button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 hover:bg-gray-100 rounded-lg p-2">
              <Avatar className="w-9 h-9">
                <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
                <AvatarFallback>{getInitials(currentUser?.name || 'U')}</AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-gray-900" style={{ fontSize: '14px', fontWeight: '600' }}>
                  {currentUser?.name}
                </span>
                <span className="text-gray-500" style={{ fontSize: '12px' }}>
                  {currentUser?.role?.charAt(0).toUpperCase()}{currentUser?.role?.slice(1)}
                </span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-gray-100 border-gray-300">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{currentUser?.name}</span>
                <span className="text-gray-500" style={{ fontSize: '12px', fontWeight: '400' }}>
                  {currentUser?.email}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile Settings</DropdownMenuItem>
            <DropdownMenuItem>Notification Preferences</DropdownMenuItem>
            <DropdownMenuItem>Help & Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-[#EF4444]">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
