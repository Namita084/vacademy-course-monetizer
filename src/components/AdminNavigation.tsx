
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, BookOpen, Users, BarChart3, Settings } from 'lucide-react';

export const AdminNavigation = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-blue-600">Vacademy Admin</h1>
            </div>
            <div className="flex space-x-4">
              <Link to="/">
                <Button 
                  variant={isActive('/') ? 'default' : 'ghost'} 
                  className="flex items-center space-x-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Dashboard</span>
                </Button>
              </Link>
              <Link to="/course-creation">
                <Button 
                  variant={isActive('/course-creation') ? 'default' : 'ghost'} 
                  className="flex items-center space-x-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Courses</span>
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/course-creation">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Course
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
