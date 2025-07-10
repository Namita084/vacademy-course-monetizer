import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Info, Plus, Edit, Trash2, Save, Eye } from 'lucide-react';
import { PaymentPlanSelector } from '@/components/PaymentPlanSelector';

// Payment plans are now managed in Institute Settings
// Course creation just references the selected plan ID

const CourseCreation = () => {
  const [activeTab, setActiveTab] = useState('basic-info');
  const [courseData, setCourseData] = useState({
    name: '',
    description: '',
    category: '',
    instructor: '',
    // Simplified payment configuration - just store the selected payment plan ID
    selectedPaymentPlanId: '1', // Default to the first plan
    enrollmentRule: 'automatic',
  });

  const handleSaveDraft = () => {
    // Save course as draft
    console.log('Saving draft:', courseData);
  };

  const handlePublishCourse = () => {
    // Publish course
    console.log('Publishing course:', courseData);
  };

  const handlePaymentPlanSelect = (planId: string) => {
    setCourseData({...courseData, selectedPaymentPlanId: planId});
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Course</h1>
              <p className="text-gray-600 mt-2">Configure your course details and payment settings</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleSaveDraft}>
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button onClick={handlePublishCourse} className="bg-blue-600 hover:bg-blue-700">
                <Eye className="w-4 h-4 mr-2" />
                Publish Course
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Card className="shadow-lg">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="border-b bg-white rounded-t-lg">
                <TabsList className="grid w-full grid-cols-4 h-16 bg-transparent">
                  <TabsTrigger 
                    value="basic-info" 
                    className="flex-col gap-1 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
                  >
                    <span className="font-medium">Basic Info</span>
                    <span className="text-xs text-gray-500">Course details</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="content" 
                    className="flex-col gap-1 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
                  >
                    <span className="font-medium">Content</span>
                    <span className="text-xs text-gray-500">Modules & lessons</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="settings" 
                    className="flex-col gap-1 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
                  >
                    <span className="font-medium">Settings</span>
                    <span className="text-xs text-gray-500">Visibility & access</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="payment" 
                    className="flex-col gap-1 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
                  >
                    <span className="font-medium">Payment & Enrollment</span>
                    <span className="text-xs text-gray-500">Pricing & access rules</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="p-8">
                {/* Basic Info Tab */}
                <TabsContent value="basic-info" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="courseName" className="text-sm font-medium text-gray-700">
                          Course Name *
                        </Label>
                        <Input
                          id="courseName"
                          placeholder="Enter course name"
                          value={courseData.name}
                          onChange={(e) => setCourseData({...courseData, name: e.target.value})}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                          Category *
                        </Label>
                        <Select value={courseData.category} onValueChange={(value) => setCourseData({...courseData, category: value})}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="programming">Programming</SelectItem>
                            <SelectItem value="design">Design</SelectItem>
                            <SelectItem value="business">Business</SelectItem>
                            <SelectItem value="marketing">Marketing</SelectItem>
                            <SelectItem value="academics">Academics</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="instructor" className="text-sm font-medium text-gray-700">
                          Instructor *
                        </Label>
                        <Input
                          id="instructor"
                          placeholder="Enter instructor name"
                          value={courseData.instructor}
                          onChange={(e) => setCourseData({...courseData, instructor: e.target.value})}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                        Course Description *
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your course..."
                        value={courseData.description}
                        onChange={(e) => setCourseData({...courseData, description: e.target.value})}
                        className="mt-1 min-h-[200px]"
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Content Tab */}
                <TabsContent value="content" className="space-y-6">
                  <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <div className="max-w-md mx-auto">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Add Course Content</h3>
                      <p className="text-gray-600 mb-4">Start building your course by adding modules and lessons</p>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add First Module
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* Settings Tab */}
                <TabsContent value="settings" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Visibility Settings</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm font-medium">Public Course</Label>
                            <p className="text-xs text-gray-500">Course visible in catalog</p>
                          </div>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm font-medium">Allow Preview</Label>
                            <p className="text-xs text-gray-500">Students can preview content</p>
                          </div>
                          <Switch />
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Access Requirements</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium">Prerequisites</Label>
                          <Input placeholder="No prerequisites required" className="mt-1" />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Minimum Age</Label>
                          <Select>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="No age restriction" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="13">13+</SelectItem>
                              <SelectItem value="16">16+</SelectItem>
                              <SelectItem value="18">18+</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Payment & Enrollment Tab */}
                <TabsContent value="payment" className="space-y-8">
                  {/* Payment Plan Selection */}
                  <PaymentPlanSelector
                    selectedPlanId={courseData.selectedPaymentPlanId}
                    onPlanSelect={handlePaymentPlanSelect}
                  />

                  {/* Enrollment Rules */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Enrollment Rules</CardTitle>
                      <p className="text-sm text-gray-600">Define how students gain access after payment/registration</p>
                    </CardHeader>
                    <CardContent>
                      <RadioGroup value={courseData.enrollmentRule} onValueChange={(value) => setCourseData({...courseData, enrollmentRule: value})}>
                        <div className="space-y-3">
                          <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                            <RadioGroupItem value="automatic" id="automatic" className="mt-1" />
                            <div>
                              <Label htmlFor="automatic" className="font-medium cursor-pointer">
                                Automatic Enrollment on successful payment/registration
                              </Label>
                              <p className="text-sm text-gray-600 mt-1">
                                Students get immediate access after successful payment (recommended for most courses)
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                            <RadioGroupItem value="approval" id="approval" className="mt-1" />
                            <div>
                              <Label htmlFor="approval" className="font-medium cursor-pointer">
                                Require Admin Approval after successful payment/registration
                              </Label>
                              <p className="text-sm text-gray-600 mt-1">
                                Students must wait for admin approval before accessing the course content
                              </p>
                            </div>
                          </div>
                        </div>
                      </RadioGroup>
                    </CardContent>
                  </Card>

                  {/* Payment Gateway Information */}
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="pt-6">
                      <div className="flex items-start space-x-3">
                        <Info className="w-5 h-5 text-blue-600 mt-1" />
                        <div>
                          <h4 className="font-medium text-blue-900 mb-2">Payment Gateway Integration</h4>
                          <p className="text-sm text-blue-800 mb-2">
                            Currently integrated with <strong>Stripe</strong> for secure payment processing.
                          </p>
                          <p className="text-sm text-blue-700">
                            Future integrations: Razorpay, PayPal, and other regional payment gateways will be available soon.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CourseCreation;
