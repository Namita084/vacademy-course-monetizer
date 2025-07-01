
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Info, Plus, Edit, Trash2 } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface InstallmentPlan {
  id: string;
  numberOfPayments: number;
  amountPerPayment: number;
}

interface PaymentConfigurationProps {
  courseData: any;
  setCourseData: (data: any) => void;
}

export const PaymentConfiguration: React.FC<PaymentConfigurationProps> = ({ courseData, setCourseData }) => {
  const [showInstallmentModal, setShowInstallmentModal] = useState(false);
  const [newInstallment, setNewInstallment] = useState({
    numberOfPayments: 2,
    amountPerPayment: 0
  });

  const handleEnrollmentTypeChange = (value: string) => {
    setCourseData({
      ...courseData,
      enrollmentType: value,
      paymentModels: value === 'free' ? [] : courseData.paymentModels
    });
  };

  const handlePaymentModelChange = (model: string, checked: boolean) => {
    const models = checked 
      ? [...courseData.paymentModels, model]
      : courseData.paymentModels.filter((m: string) => m !== model);
    
    setCourseData({
      ...courseData,
      paymentModels: models
    });
  };

  const addInstallmentPlan = () => {
    const newPlan: InstallmentPlan = {
      id: Date.now().toString(),
      numberOfPayments: newInstallment.numberOfPayments,
      amountPerPayment: newInstallment.amountPerPayment
    };
    
    setCourseData({
      ...courseData,
      upfrontPayment: {
        ...courseData.upfrontPayment,
        installmentPlans: [...courseData.upfrontPayment.installmentPlans, newPlan]
      }
    });
    
    setShowInstallmentModal(false);
    setNewInstallment({ numberOfPayments: 2, amountPerPayment: 0 });
  };

  const removeInstallmentPlan = (id: string) => {
    setCourseData({
      ...courseData,
      upfrontPayment: {
        ...courseData.upfrontPayment,
        installmentPlans: courseData.upfrontPayment.installmentPlans.filter((plan: InstallmentPlan) => plan.id !== id)
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment & Enrollment Settings</h2>
        <p className="text-gray-600">Configure how students can enroll and pay for your course</p>
      </div>

      {/* Enrollment Type Selection */}
      <Card className="border-2 border-blue-100">
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            Enrollment Type
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <RadioGroup value={courseData.enrollmentType} onValueChange={handleEnrollmentTypeChange}>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="free" id="free" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="free" className="font-medium text-gray-900 cursor-pointer">
                    Free Course
                  </Label>
                  <p className="text-sm text-gray-600 mt-1">Students can enroll without payment</p>
                  
                  {courseData.enrollmentType === 'free' && (
                    <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-2 mb-3">
                        <Checkbox
                          id="donations"
                          checked={courseData.donationSettings.enabled}
                          onCheckedChange={(checked: boolean) => 
                            setCourseData({
                              ...courseData,
                              donationSettings: { ...courseData.donationSettings, enabled: checked }
                            })
                          }
                        />
                        <Label htmlFor="donations" className="text-sm font-medium">
                          Allow optional donations from students for your institute
                        </Label>
                      </div>
                      
                      {courseData.donationSettings.enabled && (
                        <div className="mt-3">
                          <Label className="text-sm text-gray-700">
                            Suggested donation amounts (comma-separated, e.g., 500, 1000, 2500):
                          </Label>
                          <Input
                            placeholder="500, 1000, 2500"
                            value={courseData.donationSettings.suggestedAmounts}
                            onChange={(e) => 
                              setCourseData({
                                ...courseData,
                                donationSettings: { ...courseData.donationSettings, suggestedAmounts: e.target.value }
                              })
                            }
                            className="mt-1"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="paid" id="paid" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="paid" className="font-medium text-gray-900 cursor-pointer">
                    Paid Course
                  </Label>
                  <p className="text-sm text-gray-600 mt-1">Students must pay to access the course</p>
                </div>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Payment Models (only show if paid course) */}
      {courseData.enrollmentType === 'paid' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Choose Applicable Payment Models</CardTitle>
            <p className="text-sm text-gray-600">Select one or more payment options for students</p>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Subscription-Based */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="subscription"
                  checked={courseData.paymentModels.includes('subscription')}
                  onCheckedChange={(checked: boolean) => handlePaymentModelChange('subscription', checked)}
                />
                <Label htmlFor="subscription" className="font-medium">Subscription-Based</Label>
                <Badge variant="outline" className="text-xs">Recurring</Badge>
              </div>
              
              {courseData.paymentModels.includes('subscription') && (
                <Collapsible defaultOpen className="border rounded-lg">
                  <CollapsibleTrigger className="w-full p-4 text-left bg-blue-50 hover:bg-blue-100 transition-colors rounded-t-lg">
                    <h4 className="font-medium text-blue-900">Subscription Plans Configuration</h4>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Monthly Plan */}
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Switch
                            checked={courseData.subscriptionPlans.monthly.enabled}
                            onCheckedChange={(checked: boolean) => 
                              setCourseData({
                                ...courseData,
                                subscriptionPlans: {
                                  ...courseData.subscriptionPlans,
                                  monthly: { ...courseData.subscriptionPlans.monthly, enabled: checked }
                                }
                              })
                            }
                          />
                          <Label className="font-medium">Monthly Plan</Label>
                        </div>
                        {courseData.subscriptionPlans.monthly.enabled && (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm">₹</span>
                            <Input
                              type="number"
                              placeholder="0"
                              className="w-20"
                              value={courseData.subscriptionPlans.monthly.price}
                              onChange={(e) => 
                                setCourseData({
                                  ...courseData,
                                  subscriptionPlans: {
                                    ...courseData.subscriptionPlans,
                                    monthly: { ...courseData.subscriptionPlans.monthly, price: e.target.value }
                                  }
                                })
                              }
                            />
                          </div>
                        )}
                      </div>

                      {/* Quarterly Plan */}
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Switch
                            checked={courseData.subscriptionPlans.quarterly.enabled}
                            onCheckedChange={(checked: boolean) => 
                              setCourseData({
                                ...courseData,
                                subscriptionPlans: {
                                  ...courseData.subscriptionPlans,
                                  quarterly: { ...courseData.subscriptionPlans.quarterly, enabled: checked }
                                }
                              })
                            }
                          />
                          <Label className="font-medium">Quarterly Plan</Label>
                        </div>
                        {courseData.subscriptionPlans.quarterly.enabled && (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm">₹</span>
                            <Input
                              type="number"
                              placeholder="0"
                              className="w-20"
                              value={courseData.subscriptionPlans.quarterly.price}
                              onChange={(e) => 
                                setCourseData({
                                  ...courseData,
                                  subscriptionPlans: {
                                    ...courseData.subscriptionPlans,
                                    quarterly: { ...courseData.subscriptionPlans.quarterly, price: e.target.value }
                                  }
                                })
                              }
                            />
                          </div>
                        )}
                      </div>

                      {/* Half-Yearly Plan */}
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Switch
                            checked={courseData.subscriptionPlans.halfYearly.enabled}
                            onCheckedChange={(checked: boolean) => 
                              setCourseData({
                                ...courseData,
                                subscriptionPlans: {
                                  ...courseData.subscriptionPlans,
                                  halfYearly: { ...courseData.subscriptionPlans.halfYearly, enabled: checked }
                                }
                              })
                            }
                          />
                          <Label className="font-medium">Half-Yearly Plan</Label>
                        </div>
                        {courseData.subscriptionPlans.halfYearly.enabled && (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm">₹</span>
                            <Input
                              type="number"
                              placeholder="0"
                              className="w-20"
                              value={courseData.subscriptionPlans.halfYearly.price}
                              onChange={(e) => 
                                setCourseData({
                                  ...courseData,
                                  subscriptionPlans: {
                                    ...courseData.subscriptionPlans,
                                    halfYearly: { ...courseData.subscriptionPlans.halfYearly, price: e.target.value }
                                  }
                                })
                              }
                            />
                          </div>
                        )}
                      </div>

                      {/* Annual Plan */}
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Switch
                            checked={courseData.subscriptionPlans.annual.enabled}
                            onCheckedChange={(checked: boolean) => 
                              setCourseData({
                                ...courseData,
                                subscriptionPlans: {
                                  ...courseData.subscriptionPlans,
                                  annual: { ...courseData.subscriptionPlans.annual, enabled: checked }
                                }
                              })
                            }
                          />
                          <Label className="font-medium">Annual Plan</Label>
                        </div>
                        {courseData.subscriptionPlans.annual.enabled && (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm">₹</span>
                            <Input
                              type="number"
                              placeholder="0"
                              className="w-20"
                              value={courseData.subscriptionPlans.annual.price}
                              onChange={(e) => 
                                setCourseData({
                                  ...courseData,
                                  subscriptionPlans: {
                                    ...courseData.subscriptionPlans,
                                    annual: { ...courseData.subscriptionPlans.annual, price: e.target.value }
                                  }
                                })
                              }
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <Separator />
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="autoRenew"
                        checked={courseData.subscriptionPlans.autoRenew}
                        onCheckedChange={(checked: boolean) => 
                          setCourseData({
                            ...courseData,
                            subscriptionPlans: { ...courseData.subscriptionPlans, autoRenew: checked }
                          })
                        }
                      />
                      <Label htmlFor="autoRenew" className="text-sm">Automatically renew subscriptions</Label>
                      <Info className="w-4 h-4 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-500">Students will be automatically billed based on their chosen plan.</p>
                  </CollapsibleContent>
                </Collapsible>
              )}
            </div>

            {/* One-Time Upfront Payment */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="upfront"
                  checked={courseData.paymentModels.includes('upfront')}
                  onCheckedChange={(checked: boolean) => handlePaymentModelChange('upfront', checked)}
                />
                <Label htmlFor="upfront" className="font-medium">One-Time Upfront Payment</Label>
                <Badge variant="outline" className="text-xs">Lifetime Access</Badge>
              </div>

              {courseData.paymentModels.includes('upfront') && (
                <Collapsible defaultOpen className="border rounded-lg">
                  <CollapsibleTrigger className="w-full p-4 text-left bg-green-50 hover:bg-green-100 transition-colors rounded-t-lg">
                    <h4 className="font-medium text-green-900">Upfront Payment Options</h4>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-4 space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Full Price (₹) *</Label>
                      <Input
                        type="number"
                        placeholder="Enter full course price"
                        value={courseData.upfrontPayment.fullPrice}
                        onChange={(e) => 
                          setCourseData({
                            ...courseData,
                            upfrontPayment: { ...courseData.upfrontPayment, fullPrice: e.target.value }
                          })
                        }
                        className="mt-1"
                      />
                    </div>

                    <Separator />

                    {/* Installments Section */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="installments"
                          checked={courseData.upfrontPayment.allowInstallments}
                          onCheckedChange={(checked: boolean) => 
                            setCourseData({
                              ...courseData,
                              upfrontPayment: { ...courseData.upfrontPayment, allowInstallments: checked }
                            })
                          }
                        />
                        <Label htmlFor="installments" className="font-medium">Allow Installments</Label>
                      </div>

                      {courseData.upfrontPayment.allowInstallments && (
                        <div className="pl-6 space-y-4">
                          <div className="flex items-center justify-between">
                            <h5 className="font-medium text-gray-900">Installment Plans</h5>
                            <Button
                              size="sm"
                              onClick={() => setShowInstallmentModal(true)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Add Plan
                            </Button>
                          </div>

                          {/* Installment Plans List */}
                          <div className="space-y-2">
                            {courseData.upfrontPayment.installmentPlans.map((plan: InstallmentPlan) => (
                              <div key={plan.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                                <span className="text-sm">
                                  {plan.numberOfPayments} Payments @ ₹{plan.amountPerPayment.toLocaleString()}
                                </span>
                                <div className="flex space-x-2">
                                  <Button size="sm" variant="outline">
                                    <Edit className="w-3 h-3" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    onClick={() => removeInstallmentPlan(plan.id)}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Add Installment Modal */}
                          {showInstallmentModal && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                              <div className="bg-white p-6 rounded-lg w-96">
                                <h3 className="text-lg font-medium mb-4">Add Installment Plan</h3>
                                <div className="space-y-4">
                                  <div>
                                    <Label className="text-sm font-medium">Number of Payments</Label>
                                    <Select
                                      value={newInstallment.numberOfPayments.toString()}
                                      onValueChange={(value) => setNewInstallment({...newInstallment, numberOfPayments: parseInt(value)})}
                                    >
                                      <SelectTrigger className="mt-1">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="2">2</SelectItem>
                                        <SelectItem value="3">3</SelectItem>
                                        <SelectItem value="4">4</SelectItem>
                                        <SelectItem value="6">6</SelectItem>
                                        <SelectItem value="12">12</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Amount per Payment (₹)</Label>
                                    <Input
                                      type="number"
                                      value={newInstallment.amountPerPayment}
                                      onChange={(e) => setNewInstallment({...newInstallment, amountPerPayment: parseInt(e.target.value) || 0})}
                                      className="mt-1"
                                    />
                                  </div>
                                </div>
                                <div className="flex justify-end space-x-2 mt-6">
                                  <Button variant="outline" onClick={() => setShowInstallmentModal(false)}>
                                    Cancel
                                  </Button>
                                  <Button onClick={addInstallmentPlan}>
                                    Add Plan
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Late Fee Policy */}
                          <div className="border-t pt-4 mt-4">
                            <h5 className="font-medium text-gray-900 mb-3">Late Fee Policy for Installments</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium">Late Fee Type</Label>
                                <Select
                                  value={courseData.upfrontPayment.lateFeeType}
                                  onValueChange={(value) => 
                                    setCourseData({
                                      ...courseData,
                                      upfrontPayment: { ...courseData.upfrontPayment, lateFeeType: value }
                                    })
                                  }
                                >
                                  <SelectTrigger className="mt-1">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                                    <SelectItem value="percentage">Percentage of Due Amount</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              {courseData.upfrontPayment.lateFeeType === 'fixed' && (
                                <div>
                                  <Label className="text-sm font-medium">Fixed Amount (₹)</Label>
                                  <Input
                                    type="number"
                                    value={courseData.upfrontPayment.lateFeeAmount}
                                    onChange={(e) => 
                                      setCourseData({
                                        ...courseData,
                                        upfrontPayment: { ...courseData.upfrontPayment, lateFeeAmount: e.target.value }
                                      })
                                    }
                                    className="mt-1"
                                  />
                                </div>
                              )}
                              
                              {courseData.upfrontPayment.lateFeeType === 'percentage' && (
                                <div>
                                  <Label className="text-sm font-medium">Percentage (%)</Label>
                                  <Input
                                    type="number"
                                    value={courseData.upfrontPayment.lateFeePercentage}
                                    onChange={(e) => 
                                      setCourseData({
                                        ...courseData,
                                        upfrontPayment: { ...courseData.upfrontPayment, lateFeePercentage: e.target.value }
                                      })
                                    }
                                    className="mt-1"
                                  />
                                </div>
                              )}
                            </div>
                            
                            <div className="mt-4">
                              <Label className="text-sm font-medium">Grace Period (days)</Label>
                              <Input
                                type="number"
                                value={courseData.upfrontPayment.gracePeriod}
                                onChange={(e) => 
                                  setCourseData({
                                    ...courseData,
                                    upfrontPayment: { ...courseData.upfrontPayment, gracePeriod: e.target.value }
                                  })
                                }
                                className="mt-1 w-32"
                              />
                              <div className="flex items-center space-x-2 mt-2">
                                <Info className="w-4 h-4 text-blue-500" />
                                <p className="text-xs text-gray-600">
                                  Late fees will be automatically applied if an installment is not paid within the grace period.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )}
            </div>

            {/* Invoice-Based Post-Paid */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="invoice"
                  checked={courseData.paymentModels.includes('invoice')}
                  onCheckedChange={(checked: boolean) => handlePaymentModelChange('invoice', checked)}
                />
                <Label htmlFor="invoice" className="font-medium">Invoice-Based Post-Paid</Label>
                <Badge variant="outline" className="text-xs">Manual Processing</Badge>
              </div>

              {courseData.paymentModels.includes('invoice') && (
                <div className="pl-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800 mb-3">
                    Enrollment via this option requires manual invoice creation and tracking by an admin.
                  </p>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="studentRequests"
                      checked={courseData.invoiceBased.allowStudentRequests}
                      onCheckedChange={(checked: boolean) => 
                        setCourseData({
                          ...courseData,
                          invoiceBased: { ...courseData.invoiceBased, allowStudentRequests: checked }
                        })
                      }
                    />
                    <Label htmlFor="studentRequests" className="text-sm">
                      Allow students to request invoice enrollment directly?
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Info className="w-4 h-4 text-yellow-600" />
                    <p className="text-xs text-yellow-700">
                      Students will not make an online payment immediately; an invoice will be generated by the institute.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

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

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-6 border-t">
        <div className="text-sm text-gray-600">
          All payment records will be automatically tracked with student ID, course details, transaction IDs, and timestamps.
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            Preview Configuration
          </Button>
          <Button className="bg-green-600 hover:bg-green-700">
            Save Payment Settings
          </Button>
        </div>
      </div>
    </div>
  );
};
