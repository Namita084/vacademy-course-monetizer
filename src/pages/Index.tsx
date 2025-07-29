
import React from 'react';
import { AdminNavigation } from '@/components/AdminNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, DollarSign, TrendingUp, Plus, Settings, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavigation />
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Overview of your institute's performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">+180 from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹45,231</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12.5%</div>
              <p className="text-xs text-muted-foreground">+2.1% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New enrollment in "Advanced React Course"</p>
                    <p className="text-xs text-gray-500">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Payment received for "Python Basics"</p>
                    <p className="text-xs text-gray-500">5 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Course completion: "Data Structures"</p>
                    <p className="text-xs text-gray-500">10 minutes ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/course-creation">
                <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Course
                </Button>
              </Link>
              <Link to="/invite">
                <Button variant="outline" className="w-full justify-start text-[#ED7424] border-[#ED7424] hover:bg-orange-50">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create New Invite
                </Button>
              </Link>
              <Button variant="outline" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                Manage Students
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <DollarSign className="w-4 h-4 mr-2" />
                View Payments
              </Button>
              <Link to="/institute-settings">
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  Institute Settings
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Student Invites Card (now at the bottom) */}
      <div className="max-w-xl mx-auto mt-8 mb-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-bold mb-2 text-gray-900">Student Invites</h2>
          <p className="text-gray-600 mb-4 text-sm">Preview and test all student invite scenarios as a student would experience them.</p>
          <ul className="space-y-2">
            <li>
              <Link to="/invite/student/demo?paymentModel=subscription&needsApproval=true" className="text-[#ED7424] font-semibold underline">
                Test Student Invite Page (Subscription, Approval Required)
              </Link>
            </li>
            <li>
              <Link to="/invite/student/demo-one-time-approval?paymentModel=oneTime&needsApproval=true" className="text-blue-700 underline">
                One Time Payment – Requires Approval
              </Link>
            </li>
            <li>
              <Link to="/invite/student/demo-donation-approval?paymentModel=donation&needsApproval=true" className="text-blue-700 underline">
                Optional Donation – Requires Approval
              </Link>
            </li>
            <li>
              <Link to="/invite/student/demo-free-approval?paymentModel=free&needsApproval=true" className="text-blue-700 underline">
                Free – Requires Approval
              </Link>
            </li>
            <li>
              <Link to="/invite/student/demo-one-time-direct?paymentModel=oneTime&needsApproval=false" className="text-blue-700 underline">
                One Time Payment – Direct Entry
              </Link>
            </li>
            <li>
              <Link to="/invite/student/demo-donation-direct?paymentModel=donation&needsApproval=false" className="text-blue-700 underline">
                Optional Donation – Direct Entry
              </Link>
            </li>
            <li>
              <Link to="/invite/student/demo-free-direct?paymentModel=free&needsApproval=false" className="text-blue-700 underline">
                Free – Direct Entry
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Index;
