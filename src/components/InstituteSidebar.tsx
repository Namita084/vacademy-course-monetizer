import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Users, Settings, Home, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Dashboard', icon: Home, to: '/' },
  { label: 'Manage Institute', icon: Settings, to: '/institute-settings', active: true },
  { label: 'Courses', icon: BookOpen, to: '/course-creation' },
  { label: 'Members', icon: Users, to: '/members' },
  { label: 'Payments', icon: DollarSign, to: '/payments' },
  // Add more as needed
];

export const InstituteSidebar = () => {
  const location = useLocation();
  return (
    <aside
      className="hidden md:flex flex-col h-screen w-64 bg-[#FAF3EF] text-[#444] font-sans border-r border-[#F2E6DE] fixed left-0 top-0 z-30"
      style={{ fontFamily: 'Open Sans, sans-serif' }}
    >
      <div className="flex items-center h-16 px-6 text-xl bg-[#FAF3EF] border-b border-[#F2E6DE] text-[#ED7424] font-semibold tracking-tight">
        Vidyalankar Class
      </div>
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to || (item.active && location.pathname.startsWith('/institute-settings'));
          return (
            <Link
              key={item.label}
              to={item.to}
              className={cn(
                'flex items-center gap-3 px-4 py-2 rounded-lg font-normal transition-colors',
                isActive
                  ? 'bg-[#FFF3ED] text-[#ED7424]'
                  : 'text-[#444] hover:bg-[#F7E3D6]'
              )}
              style={{ fontFamily: 'Open Sans, sans-serif' }}
            >
              <item.icon className={cn('w-5 h-5', isActive ? 'text-[#ED7424]' : 'text-[#B0A8A0]')} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}; 