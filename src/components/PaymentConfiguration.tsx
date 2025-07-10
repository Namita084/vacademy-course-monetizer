import React, { useState, useEffect } from 'react';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Plus, Edit, Trash2, AlertTriangle, CheckCircle, XCircle, Globe, Tag, Calendar } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SubscriptionPlanPreview } from './SubscriptionPlanPreview';

interface InstallmentPlan {
  id: string;
  numberOfPayments: number;
  amountPerPayment: number;
  dueDates: string[]; // Array of payment due dates
}

interface SubscriptionPlan {
  enabled: boolean;
  price: string;
  interval: string; // 'monthly', 'quarterly', 'half-yearly', 'annual', 'custom'
  customInterval?: {
    value: number;
    unit: 'days' | 'weeks' | 'months' | 'years';
  };
}

interface CourseData {
  enrollmentType: 'free' | 'paid';
  paymentModels: string[];
  currency: string;
  allowCouponCodes: boolean;
  donationSettings: {
    enabled: boolean;
    suggestedAmounts: string;
  };
  subscriptionPlans: {
    monthly: {
      enabled: boolean;
      price: string;
      interval: string;
    };
    quarterly: {
      enabled: boolean;
      price: string;
      interval: string;
    };
    halfYearly: {
      enabled: boolean;
      price: string;
      interval: string;
    };
    annual: {
      enabled: boolean;
      price: string;
      interval: string;
    };
    custom: {
      enabled: boolean;
      price: string;
      interval: string;
      customInterval?: {
        value: number;
        unit: 'days' | 'weeks' | 'months' | 'years';
      };
    };
    autoRenew: boolean;
  };
  upfrontPayment: {
    fullPrice: string;
    allowInstallments: boolean;
    installmentPlans: InstallmentPlan[];
    lateFeeType: 'none' | 'fixed' | 'percentage';
    lateFeeAmount: string;
    lateFeePercentage: string;
    gracePeriod: string;
  };
  invoiceBased: {
    allowStudentRequests: boolean;
  };
  enrollmentRule: 'automatic' | 'approval';
}

interface PaymentConfigurationProps {
  courseData: CourseData;
  setCourseData: (data: CourseData) => void;
}

interface ValidationErrors {
  subscriptionPlans?: string;
  upfrontPrice?: string;
  installmentPlans?: string;
  donationAmounts?: string;
  lateFee?: string;
  installmentDates?: string;
  customInterval?: string;
}

// Currency options with symbols
const currencyOptions = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
];

export const PaymentConfiguration: React.FC<PaymentConfigurationProps> = ({ courseData, setCourseData }) => {
  const [showInstallmentModal, setShowInstallmentModal] = useState(false);
  const [editingInstallment, setEditingInstallment] = useState<InstallmentPlan | null>(null);
  const [showSubscriptionPreview, setShowSubscriptionPreview] = useState(false);
  const [subscriptionFeatures] = useState([
    'Live Classes',
    '1500 Tests',
    '500 Students',
    'Course Content',
    'Presentations',
    'Assignments',
    'Discussion Forums',
    'Progress Tracking'
  ]);
  const [newInstallment, setNewInstallment] = useState({
    numberOfPayments: 2,
    amountPerPayment: 0,
    dueDates: [] as string[]
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isValidating, setIsValidating] = useState(false);

  // Initialize subscription plans if they don't exist
  useEffect(() => {
    if (courseData.paymentModels.includes('subscription') && !courseData.subscriptionPlans) {
      setCourseData({
        ...courseData,
        subscriptionPlans: {
          monthly: {
            enabled: true,
            price: '999',
            interval: 'monthly'
          },
          quarterly: {
            enabled: true,
            price: '2499',
            interval: 'quarterly'
          },
          halfYearly: {
            enabled: true,
            price: '4499',
            interval: 'halfYearly'
          },
          annual: {
            enabled: true,
            price: '7999',
            interval: 'annual'
          },
          custom: {
            enabled: false,
            price: '',
            interval: 'custom',
            customInterval: {
              value: 1,
              unit: 'months'
            }
          },
          autoRenew: true
        }
      });
    }
  }, [courseData.paymentModels]);

  // Get currency symbol
  const getCurrencySymbol = (currencyCode: string) => {
    const currency = currencyOptions.find(c => c.code === currencyCode);
    return currency?.symbol || '$';
  };

  const handleEnrollmentTypeChange = (value: 'free' | 'paid') => {
    setCourseData({
      ...courseData,
      enrollmentType: value,
      paymentModels: value === 'free' ? [] : courseData.paymentModels
    });
    setValidationErrors({});
  };

  const handlePaymentModelChange = (model: string, checked: boolean) => {
    const models = checked 
      ? [...courseData.paymentModels, model]
      : courseData.paymentModels.filter((m: string) => m !== model);
    
    let updatedData = {
      ...courseData,
      paymentModels: models
    };

    // Initialize subscription plans when enabling subscription model
    if (model === 'subscription' && checked) {
      updatedData = {
        ...updatedData,
        subscriptionPlans: {
          monthly: {
            enabled: true,
            price: '999',
            interval: 'monthly'
          },
          quarterly: {
            enabled: true,
            price: '2499',
            interval: 'quarterly'
          },
          halfYearly: {
            enabled: true,
            price: '4499',
            interval: 'halfYearly'
          },
          annual: {
            enabled: true,
            price: '7999',
            interval: 'annual'
          },
          custom: {
            enabled: false,
            price: '',
            interval: 'custom',
            customInterval: {
              value: 1,
              unit: 'months'
            }
          },
          autoRenew: true
        }
      };
    }
    
    setCourseData(updatedData);
    setValidationErrors({});
  };

  const handleLateFeeTypeChange = (value: 'none' | 'fixed' | 'percentage') => {
    setCourseData({
      ...courseData,
      upfrontPayment: {
        ...courseData.upfrontPayment,
        lateFeeType: value
      }
    });
  };

  const handleEnrollmentRuleChange = (value: 'automatic' | 'approval') => {
    setCourseData({
      ...courseData,
      enrollmentRule: value
    });
  };

  // Generate installment due dates
  const generateInstallmentDueDates = (numberOfPayments: number, startDate?: string) => {
    const dates = [];
    const start = startDate ? new Date(startDate) : new Date();
    
    for (let i = 0; i < numberOfPayments; i++) {
      const dueDate = new Date(start);
      dueDate.setMonth(dueDate.getMonth() + i);
      dates.push(dueDate.toISOString().split('T')[0]); // YYYY-MM-DD format
    }
    
    return dates;
  };

  const validateConfiguration = () => {
    setIsValidating(true);
    const errors: ValidationErrors = {};

    // Validate subscription plans
    if (courseData.paymentModels.includes('subscription')) {
      const hasAnyPlan = Object.values(courseData.subscriptionPlans).some((plan: any) => 
        plan.enabled && plan.price && parseFloat(plan.price) > 0
      );
      if (!hasAnyPlan) {
        errors.subscriptionPlans = 'At least one subscription plan must be enabled with a valid price.';
      }
    }

    // Validate upfront payment
    if (courseData.paymentModels.includes('upfront')) {
      if (!courseData.upfrontPayment.fullPrice || parseFloat(courseData.upfrontPayment.fullPrice) <= 0) {
        errors.upfrontPrice = 'Full price is required and must be greater than 0.';
      }
      
      if (courseData.upfrontPayment.allowInstallments && courseData.upfrontPayment.installmentPlans.length === 0) {
        errors.installmentPlans = 'At least one installment plan is required when installments are enabled.';
      }
    }

    // Validate donation amounts
    if (courseData.enrollmentType === 'free' && courseData.donationSettings.enabled && courseData.donationSettings.suggestedAmounts) {
      const amounts = courseData.donationSettings.suggestedAmounts.split(',').map((a: string) => a.trim());
      const invalidAmounts = amounts.filter((amount: string) => isNaN(parseFloat(amount)) || parseFloat(amount) <= 0);
      if (invalidAmounts.length > 0) {
        errors.donationAmounts = 'All donation amounts must be valid positive numbers.';
      }
    }

    // Validate late fees
    if (courseData.upfrontPayment.lateFeeType === 'fixed' && (!courseData.upfrontPayment.lateFeeAmount || parseFloat(courseData.upfrontPayment.lateFeeAmount) <= 0)) {
      errors.lateFee = 'Fixed late fee amount must be greater than 0.';
    }
    if (courseData.upfrontPayment.lateFeeType === 'percentage' && (!courseData.upfrontPayment.lateFeePercentage || parseFloat(courseData.upfrontPayment.lateFeePercentage) <= 0 || parseFloat(courseData.upfrontPayment.lateFeePercentage) > 100)) {
      errors.lateFee = 'Late fee percentage must be between 0 and 100.';
    }

    setValidationErrors(errors);
    setIsValidating(false);
    return Object.keys(errors).length === 0;
  };

  const calculateTotalFromInstallments = (plan: { numberOfPayments: number; amountPerPayment: number }) => {
    return plan.numberOfPayments * plan.amountPerPayment;
  };

  const addOrUpdateInstallmentPlan = () => {
    if (newInstallment.amountPerPayment <= 0) {
      setValidationErrors({...validationErrors, installmentPlans: 'Amount per payment must be greater than 0.'});
      return;
    }

    // Validate due dates
    const validDates = newInstallment.dueDates.filter(date => date && date.trim() !== '');
    if (validDates.length !== newInstallment.numberOfPayments) {
      setValidationErrors({...validationErrors, installmentDates: 'Please set due dates for all installment payments.'});
      return;
    }

    // Check if dates are in chronological order
    const dates = validDates.map(date => new Date(date));
    for (let i = 1; i < dates.length; i++) {
      if (dates[i] <= dates[i - 1]) {
        setValidationErrors({...validationErrors, installmentDates: 'Payment due dates must be in chronological order.'});
        return;
      }
    }

    // Check if first date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (dates[0] < today) {
      setValidationErrors({...validationErrors, installmentDates: 'First payment due date cannot be in the past.'});
      return;
    }

    const fullPrice = parseFloat(courseData.upfrontPayment.fullPrice) || 0;
    const totalInstallmentAmount = calculateTotalFromInstallments(newInstallment);
    
    if (totalInstallmentAmount > fullPrice * 1.5) {
      setValidationErrors({...validationErrors, installmentPlans: 'Total installment amount seems too high compared to full price.'});
      return;
    }

    if (editingInstallment) {
      setCourseData({
        ...courseData,
        upfrontPayment: {
          ...courseData.upfrontPayment,
          installmentPlans: courseData.upfrontPayment.installmentPlans.map((plan: InstallmentPlan) => 
            plan.id === editingInstallment.id 
              ? { ...editingInstallment, ...newInstallment }
              : plan
          )
        }
      });
      setEditingInstallment(null);
    } else {
      const newPlan: InstallmentPlan = {
        id: Date.now().toString(),
        numberOfPayments: newInstallment.numberOfPayments,
        amountPerPayment: newInstallment.amountPerPayment,
        dueDates: newInstallment.dueDates
      };
      
      setCourseData({
        ...courseData,
        upfrontPayment: {
          ...courseData.upfrontPayment,
          installmentPlans: [...courseData.upfrontPayment.installmentPlans, newPlan]
        }
      });
    }
    
    setShowInstallmentModal(false);
    setNewInstallment({ numberOfPayments: 2, amountPerPayment: 0, dueDates: [] });
    setValidationErrors({});
  };

  const editInstallmentPlan = (plan: InstallmentPlan) => {
    setEditingInstallment(plan);
    setNewInstallment({
      numberOfPayments: plan.numberOfPayments,
      amountPerPayment: plan.amountPerPayment,
      dueDates: plan.dueDates
    });
    setShowInstallmentModal(true);
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

  const getConfigurationStatus = () => {
    if (courseData.enrollmentType === 'free') {
      return { status: 'complete', message: 'Free course configuration complete' };
    }
    
    if (courseData.paymentModels.length === 0) {
      return { status: 'incomplete', message: 'Select at least one payment model' };
    }
    
    const errors = Object.keys(validationErrors);
    if (errors.length > 0) {
      return { status: 'error', message: `Configuration has ${errors.length} error(s)` };
    }
    
    return { status: 'complete', message: 'Payment configuration complete' };
  };

  const configStatus = getConfigurationStatus();

  return (
    <div className="space-y-8">
      {/* Header with Status */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment & Enrollment Settings</h2>
          <p className="text-gray-600">Configure how students can enroll and pay for your course</p>
        </div>
        <div className="flex items-center space-x-2">
          {configStatus.status === 'complete' && <CheckCircle className="w-5 h-5 text-green-500" />}
          {configStatus.status === 'incomplete' && <AlertTriangle className="w-5 h-5 text-yellow-500" />}
          {configStatus.status === 'error' && <XCircle className="w-5 h-5 text-red-500" />}
          <span className={`text-sm font-medium ${
            configStatus.status === 'complete' ? 'text-green-600' : 
            configStatus.status === 'incomplete' ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {configStatus.message}
          </span>
        </div>
      </div>

      {/* Currency and General Settings */}
      <Card className="border-2 border-blue-100">
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" />
            Currency & General Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Currency Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Currency *
              </Label>
              <Select 
                value={courseData.currency} 
                onValueChange={(value) => setCourseData({...courseData, currency: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencyOptions.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{currency.symbol}</span>
                        <span>{currency.name}</span>
                        <span className="text-gray-500">({currency.code})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Default currency is based on your institute's location, but you can change it here.
              </p>
            </div>

            {/* Coupon Codes Toggle */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Allow Coupon Codes
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">
                    Students can apply discount codes during checkout
                  </p>
                </div>
                <Switch
                  checked={courseData.allowCouponCodes}
                  onCheckedChange={(checked) => 
                    setCourseData({...courseData, allowCouponCodes: checked})
                  }
                />
              </div>
              {courseData.allowCouponCodes && (
                <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2">
                    <Info className="w-4 h-4 text-green-600" />
                    <p className="text-xs text-green-700">
                      Coupon management will be available in the course dashboard after creation.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enrollment Type Selection */}
      <Card className="border-2 border-orange-100">
        <CardHeader className="bg-orange-50">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            Enrollment Type
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <RadioGroup 
            value={courseData.enrollmentType} 
            onValueChange={(value) => handleEnrollmentTypeChange(value as 'free' | 'paid')}
          >
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
                        <div className="mt-3 space-y-2">
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
                            className={`mt-1 ${validationErrors.donationAmounts ? 'border-red-500' : ''}`}
                          />
                          {validationErrors.donationAmounts && (
                            <p className="text-sm text-red-600">{validationErrors.donationAmounts}</p>
                          )}
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
        <>
          {courseData.paymentModels.length === 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Please select at least one payment model to continue.
              </AlertDescription>
            </Alert>
          )}

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
                  <>
                    <Collapsible defaultOpen className="border rounded-lg">
                      <CollapsibleTrigger className="w-full p-4 text-left bg-blue-50 hover:bg-blue-100 transition-colors rounded-t-lg">
                        <h4 className="font-medium text-blue-900">Subscription Plans Configuration</h4>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="p-4 space-y-4">
                        {validationErrors.subscriptionPlans && (
                          <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>{validationErrors.subscriptionPlans}</AlertDescription>
                          </Alert>
                        )}
                        
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
                                <span className="text-sm">{getCurrencySymbol(courseData.currency)}</span>
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
                                <span className="text-sm">{getCurrencySymbol(courseData.currency)}</span>
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
                                <span className="text-sm">{getCurrencySymbol(courseData.currency)}</span>
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
                                <span className="text-sm">{getCurrencySymbol(courseData.currency)}</span>
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

                          {/* Custom Plan */}
                          <div className="flex items-center justify-between p-3 border rounded-lg bg-purple-50">
                            <div className="flex items-center space-x-3">
                              <Switch
                                checked={courseData.subscriptionPlans.custom.enabled}
                                onCheckedChange={(checked: boolean) => 
                                  setCourseData({
                                    ...courseData,
                                    subscriptionPlans: {
                                      ...courseData.subscriptionPlans,
                                      custom: { ...courseData.subscriptionPlans.custom, enabled: checked }
                                    }
                                  })
                                }
                              />
                              <Label className="font-medium text-purple-800">Custom Interval Plan</Label>
                              <Badge variant="outline" className="text-xs bg-purple-100 text-purple-700">Flexible</Badge>
                            </div>
                            {courseData.subscriptionPlans.custom.enabled && (
                              <div className="flex items-center space-x-2">
                                <span className="text-sm">{getCurrencySymbol(courseData.currency)}</span>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  className="w-20"
                                  value={courseData.subscriptionPlans.custom.price}
                                  onChange={(e) => 
                                    setCourseData({
                                      ...courseData,
                                      subscriptionPlans: {
                                        ...courseData.subscriptionPlans,
                                        custom: { ...courseData.subscriptionPlans.custom, price: e.target.value }
                                      }
                                    })
                                  }
                                />
                              </div>
                            )}
                          </div>

                          {/* Custom Interval Configuration */}
                          {courseData.subscriptionPlans.custom.enabled && (
                            <div className="ml-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                              <Label className="text-sm font-medium text-purple-800 mb-2 block">
                                Define Custom Billing Interval
                              </Label>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <Label className="text-xs text-gray-600">Interval Value</Label>
                                  <Input
                                    type="number"
                                    min="1"
                                    value={courseData.subscriptionPlans.custom.customInterval?.value || 1}
                                    onChange={(e) => 
                                      setCourseData({
                                        ...courseData,
                                        subscriptionPlans: {
                                          ...courseData.subscriptionPlans,
                                          custom: {
                                            ...courseData.subscriptionPlans.custom,
                                            customInterval: {
                                              ...courseData.subscriptionPlans.custom.customInterval,
                                              value: parseInt(e.target.value) || 1
                                            }
                                          }
                                        }
                                      })
                                    }
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs text-gray-600">Unit</Label>
                                  <Select
                                    value={courseData.subscriptionPlans.custom.customInterval?.unit || 'months'}
                                    onValueChange={(value: 'days' | 'weeks' | 'months' | 'years') => 
                                      setCourseData({
                                        ...courseData,
                                        subscriptionPlans: {
                                          ...courseData.subscriptionPlans,
                                          custom: {
                                            ...courseData.subscriptionPlans.custom,
                                            customInterval: {
                                              ...courseData.subscriptionPlans.custom.customInterval,
                                              unit: value
                                            }
                                          }
                                        }
                                      })
                                    }
                                  >
                                    <SelectTrigger className="mt-1">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="days">Days</SelectItem>
                                      <SelectItem value="weeks">Weeks</SelectItem>
                                      <SelectItem value="months">Months</SelectItem>
                                      <SelectItem value="years">Years</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <p className="text-xs text-purple-600 mt-2">
                                Billing every {courseData.subscriptionPlans.custom.customInterval?.value || 1} {courseData.subscriptionPlans.custom.customInterval?.unit || 'months'}
                              </p>
                            </div>
                          )}
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

                    {/* Add Subscription Plans Preview */}
                    <div className="flex items-center justify-between mt-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          // Ensure subscription plans exist
                          if (!courseData.subscriptionPlans) {
                            setCourseData({
                              ...courseData,
                              subscriptionPlans: {
                                monthly: {
                                  enabled: true,
                                  price: '999',
                                  interval: 'monthly'
                                },
                                quarterly: {
                                  enabled: true,
                                  price: '2499',
                                  interval: 'quarterly'
                                },
                                halfYearly: {
                                  enabled: true,
                                  price: '4499',
                                  interval: 'halfYearly'
                                },
                                annual: {
                                  enabled: true,
                                  price: '7999',
                                  interval: 'annual'
                                },
                                custom: {
                                  enabled: false,
                                  price: '',
                                  interval: 'custom',
                                  customInterval: {
                                    value: 1,
                                    unit: 'months'
                                  }
                                },
                                autoRenew: true
                              }
                            });
                          }
                          console.log('Current subscription plans:', courseData.subscriptionPlans);
                          console.log('Current currency:', courseData.currency);
                          setShowSubscriptionPreview(!showSubscriptionPreview);
                        }}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        {showSubscriptionPreview ? 'Hide Preview' : 'Show Preview'}
                      </Button>
                    </div>

                    {showSubscriptionPreview && courseData.subscriptionPlans && (
                      <div className="mt-6">
                        <SubscriptionPlanPreview 
                          currency={courseData.currency || 'INR'}
                          subscriptionPlans={courseData.subscriptionPlans}
                          features={subscriptionFeatures}
                          onSelectPlan={(planType) => {
                            console.log('Selected plan:', planType);
                          }}
                        />
                      </div>
                    )}

                    {/* Custom Interval Plan */}
                    <div className="flex items-center justify-between p-3 border rounded-lg mt-4">
                      <div className="flex items-center space-x-3">
                        <Switch
                          checked={courseData.subscriptionPlans?.custom?.enabled || false}
                          onCheckedChange={(checked: boolean) => {
                            const updatedPlans = {
                              ...courseData.subscriptionPlans,
                              custom: {
                                enabled: checked,
                                price: checked ? courseData.subscriptionPlans?.custom?.price || '' : '',
                                interval: 'custom',
                                customInterval: {
                                  value: 1,
                                  unit: 'months' as const
                                }
                              }
                            };
                            setCourseData({
                              ...courseData,
                              subscriptionPlans: updatedPlans
                            });
                          }}
                        />
                        <Label className="font-medium">Custom Interval Plan</Label>
                      </div>
                      {courseData.subscriptionPlans?.custom?.enabled && (
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            min="1"
                            placeholder="1"
                            className="w-20"
                            value={courseData.subscriptionPlans?.custom?.customInterval?.value || 1}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 1;
                              const updatedPlans = {
                                ...courseData.subscriptionPlans,
                                custom: {
                                  ...courseData.subscriptionPlans.custom,
                                  customInterval: {
                                    ...courseData.subscriptionPlans.custom.customInterval,
                                    value
                                  }
                                }
                              };
                              setCourseData({
                                ...courseData,
                                subscriptionPlans: updatedPlans
                              });
                            }}
                          />
                          <Select
                            value={courseData.subscriptionPlans?.custom?.customInterval?.unit || 'months'}
                            onValueChange={(value: 'days' | 'weeks' | 'months' | 'years') => {
                              const updatedPlans = {
                                ...courseData.subscriptionPlans,
                                custom: {
                                  ...courseData.subscriptionPlans.custom,
                                  customInterval: {
                                    ...courseData.subscriptionPlans.custom.customInterval,
                                    unit: value
                                  }
                                }
                              };
                              setCourseData({
                                ...courseData,
                                subscriptionPlans: updatedPlans
                              });
                            }}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="days">Days</SelectItem>
                              <SelectItem value="weeks">Weeks</SelectItem>
                              <SelectItem value="months">Months</SelectItem>
                              <SelectItem value="years">Years</SelectItem>
                            </SelectContent>
                          </Select>
                          <span className="text-sm">{getCurrencySymbol(courseData.currency)}</span>
                          <Input
                            type="number"
                            placeholder="0"
                            className="w-20"
                            value={courseData.subscriptionPlans?.custom?.price || ''}
                            onChange={(e) => {
                              const updatedPlans = {
                                ...courseData.subscriptionPlans,
                                custom: {
                                  ...courseData.subscriptionPlans.custom,
                                  price: e.target.value
                                }
                              };
                              setCourseData({
                                ...courseData,
                                subscriptionPlans: updatedPlans
                              });
                            }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Preview Button */}
                    <div className="flex items-center justify-between mt-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          // Ensure subscription plans exist
                          if (!courseData.subscriptionPlans) {
                            setCourseData({
                              ...courseData,
                              subscriptionPlans: {
                                monthly: {
                                  enabled: true,
                                  price: '999',
                                  interval: 'monthly'
                                },
                                quarterly: {
                                  enabled: true,
                                  price: '2499',
                                  interval: 'quarterly'
                                },
                                halfYearly: {
                                  enabled: true,
                                  price: '4499',
                                  interval: 'halfYearly'
                                },
                                annual: {
                                  enabled: true,
                                  price: '7999',
                                  interval: 'annual'
                                },
                                custom: {
                                  enabled: false,
                                  price: '',
                                  interval: 'custom',
                                  customInterval: {
                                    value: 1,
                                    unit: 'months'
                                  }
                                },
                                autoRenew: true
                              }
                            });
                          }
                          console.log('Current subscription plans:', courseData.subscriptionPlans);
                          console.log('Current currency:', courseData.currency);
                          setShowSubscriptionPreview(!showSubscriptionPreview);
                        }}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        {showSubscriptionPreview ? 'Hide Preview' : 'Show Preview'}
                      </Button>
                    </div>

                    {/* Preview Section */}
                    {showSubscriptionPreview && courseData.subscriptionPlans && (
                      <div className="mt-6">
                        <SubscriptionPlanPreview 
                          currency={courseData.currency || 'INR'}
                          subscriptionPlans={courseData.subscriptionPlans}
                          features={subscriptionFeatures}
                          onSelectPlan={(planType) => {
                            console.log('Selected plan:', planType);
                          }}
                        />
                      </div>
                    )}
                  </>
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
                      {validationErrors.upfrontPrice && (
                        <Alert variant="destructive">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>{validationErrors.upfrontPrice}</AlertDescription>
                        </Alert>
                      )}
                      
                      <div>
                        <Label className="text-sm font-medium">Full Price ({getCurrencySymbol(courseData.currency)}) *</Label>
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
                          className={`mt-1 ${validationErrors.upfrontPrice ? 'border-red-500' : ''}`}
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
                            {validationErrors.installmentPlans && (
                              <Alert variant="destructive">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>{validationErrors.installmentPlans}</AlertDescription>
                              </Alert>
                            )}
                            
                            <div className="flex items-center justify-between">
                              <h5 className="font-medium text-gray-900">Installment Plans</h5>
                              <Button
                                size="sm"
                                onClick={() => setShowInstallmentModal(true)}
                                className="bg-orange-600 hover:bg-orange-700"
                              >
                                <Plus className="w-4 h-4 mr-1" />
                                Add Plan
                              </Button>
                            </div>

                            {/* Installment Plans List */}
                            <div className="space-y-2">
                              {courseData.upfrontPayment.installmentPlans.map((plan: InstallmentPlan) => (
                                <div key={plan.id} className="p-3 bg-gray-50 rounded-lg border">
                                  <div className="flex items-center justify-between mb-2">
                                    <div>
                                      <span className="text-sm font-medium">
                                        {plan.numberOfPayments} Payments @ {getCurrencySymbol(courseData.currency)}{plan.amountPerPayment.toLocaleString()}
                                      </span>
                                      <p className="text-xs text-gray-500">
                                        Total: {getCurrencySymbol(courseData.currency)}{calculateTotalFromInstallments(plan).toLocaleString()}
                                      </p>
                                    </div>
                                    <div className="flex space-x-2">
                                      <Button 
                                        size="sm" 
                                        variant="outline"
                                        onClick={() => editInstallmentPlan(plan)}
                                      >
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
                                  {/* Payment Schedule */}
                                  {plan.dueDates && plan.dueDates.length > 0 && (
                                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                                      <Calendar className="w-3 h-3" />
                                      <span>Payment Schedule:</span>
                                      <div className="flex flex-wrap gap-1">
                                        {plan.dueDates.map((date, index) => (
                                          <Badge key={index} variant="outline" className="text-xs">
                                            Payment {index + 1}: {new Date(date).toLocaleDateString()}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>

                            {/* Add/Edit Installment Modal */}
                            {showInstallmentModal && (
                              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                <div className="bg-white p-6 rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                                  <h3 className="text-lg font-medium mb-4">
                                    {editingInstallment ? 'Edit' : 'Add'} Installment Plan
                                  </h3>
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label className="text-sm font-medium">Number of Payments</Label>
                                        <Select
                                          value={newInstallment.numberOfPayments.toString()}
                                          onValueChange={(value) => {
                                            const numPayments = parseInt(value);
                                            const generatedDates = generateInstallmentDueDates(numPayments);
                                            setNewInstallment({
                                              ...newInstallment, 
                                              numberOfPayments: numPayments,
                                              dueDates: generatedDates
                                            });
                                          }}
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
                                        <Label className="text-sm font-medium">Amount per Payment ({getCurrencySymbol(courseData.currency)})</Label>
                                        <Input
                                          type="number"
                                          value={newInstallment.amountPerPayment}
                                          onChange={(e) => setNewInstallment({...newInstallment, amountPerPayment: parseInt(e.target.value) || 0})}
                                          className="mt-1"
                                        />
                                        {newInstallment.amountPerPayment > 0 && (
                                          <p className="text-xs text-gray-500 mt-1">
                                            Total: {getCurrencySymbol(courseData.currency)}{calculateTotalFromInstallments(newInstallment).toLocaleString()}
                                          </p>
                                        )}
                                      </div>
                                    </div>

                                    {/* Payment Schedule Configuration */}
                                    <div className="space-y-3">
                                      <div className="flex items-center justify-between">
                                        <Label className="text-sm font-medium flex items-center gap-2">
                                          <Calendar className="w-4 h-4" />
                                          Payment Schedule
                                        </Label>
                                        <Button
                                          type="button"
                                          size="sm"
                                          variant="outline"
                                          onClick={() => {
                                            const generatedDates = generateInstallmentDueDates(newInstallment.numberOfPayments);
                                            setNewInstallment({...newInstallment, dueDates: generatedDates});
                                          }}
                                        >
                                          Auto-Generate Monthly
                                        </Button>
                                      </div>
                                      
                                      {validationErrors.installmentDates && (
                                        <Alert variant="destructive">
                                          <AlertTriangle className="h-4 w-4" />
                                          <AlertDescription>{validationErrors.installmentDates}</AlertDescription>
                                        </Alert>
                                      )}

                                      <div className="grid grid-cols-1 gap-3 max-h-48 overflow-y-auto">
                                        {Array.from({ length: newInstallment.numberOfPayments }, (_, index) => (
                                          <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                            <span className="text-sm font-medium w-20">Payment {index + 1}:</span>
                                            <Input
                                              type="date"
                                              value={newInstallment.dueDates[index] || ''}
                                              onChange={(e) => {
                                                const newDates = [...newInstallment.dueDates];
                                                newDates[index] = e.target.value;
                                                setNewInstallment({...newInstallment, dueDates: newDates});
                                              }}
                                              className="flex-1"
                                            />
                                            <span className="text-xs text-gray-500 w-20">
                                              {getCurrencySymbol(courseData.currency)}{newInstallment.amountPerPayment.toLocaleString()}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                      
                                      <div className="flex items-center space-x-2 text-xs text-blue-600 bg-blue-50 p-2 rounded">
                                        <Info className="w-4 h-4" />
                                        <p>
                                          Set specific due dates for each installment payment. Students will be notified before each due date.
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex justify-end space-x-2 mt-6">
                                    <Button variant="outline" onClick={() => {
                                      setShowInstallmentModal(false);
                                      setEditingInstallment(null);
                                      setNewInstallment({ numberOfPayments: 2, amountPerPayment: 0, dueDates: [] });
                                    }}>
                                      Cancel
                                    </Button>
                                    <Button onClick={addOrUpdateInstallmentPlan} className="bg-orange-600 hover:bg-orange-700">
                                      {editingInstallment ? 'Update' : 'Add'} Plan
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Late Fee Policy */}
                            <div className="border-t pt-4 mt-4">
                              <h5 className="font-medium text-gray-900 mb-3">Late Fee Policy for Installments</h5>
                              {validationErrors.lateFee && (
                                <Alert variant="destructive" className="mb-3">
                                  <AlertTriangle className="h-4 w-4" />
                                  <AlertDescription>{validationErrors.lateFee}</AlertDescription>
                                </Alert>
                              )}
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium">Late Fee Type</Label>
                                  <Select
                                    value={courseData.upfrontPayment.lateFeeType}
                                    onValueChange={(value) => handleLateFeeTypeChange(value as 'none' | 'fixed' | 'percentage')}
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
                                    <Label className="text-sm font-medium">Fixed Amount ({getCurrencySymbol(courseData.currency)})</Label>
                                    <Input
                                      type="number"
                                      value={courseData.upfrontPayment.lateFeeAmount}
                                      onChange={(e) => 
                                        setCourseData({
                                          ...courseData,
                                          upfrontPayment: { ...courseData.upfrontPayment, lateFeeAmount: e.target.value }
                                        })
                                      }
                                      className={`mt-1 ${validationErrors.lateFee ? 'border-red-500' : ''}`}
                                    />
                                  </div>
                                )}
                                
                                {courseData.upfrontPayment.lateFeeType === 'percentage' && (
                                  <div>
                                    <Label className="text-sm font-medium">Percentage (%)</Label>
                                    <Input
                                      type="number"
                                      max="100"
                                      value={courseData.upfrontPayment.lateFeePercentage}
                                      onChange={(e) => 
                                        setCourseData({
                                          ...courseData,
                                          upfrontPayment: { ...courseData.upfrontPayment, lateFeePercentage: e.target.value }
                                        })
                                      }
                                      className={`mt-1 ${validationErrors.lateFee ? 'border-red-500' : ''}`}
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
        </>
      )}

      {/* Enrollment Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Enrollment Rules</CardTitle>
          <p className="text-sm text-gray-600">Define how students gain access after payment/registration</p>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={courseData.enrollmentRule} 
            onValueChange={(value) => handleEnrollmentRuleChange(value as 'automatic' | 'approval')}
          >
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
          <Button variant="outline" onClick={validateConfiguration} disabled={isValidating}>
            {isValidating ? 'Validating...' : 'Validate Configuration'}
          </Button>
          <Button 
            className="bg-orange-600 hover:bg-orange-700" 
            onClick={validateConfiguration}
            disabled={isValidating}
          >
            Save Payment Settings
          </Button>
        </div>
      </div>
    </div>
  );
};
