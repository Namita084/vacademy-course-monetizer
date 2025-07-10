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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Info, 
  Plus, 
  Edit, 
  Trash2, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Globe, 
  Tag, 
  Calendar,
  CreditCard,
  Heart,
  Receipt,
  DollarSign
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SubscriptionPlanPreview } from '@/components/SubscriptionPlanPreview';

interface PaymentPlan {
  id: string;
  name: string;
  type: 'subscription' | 'upfront' | 'invoice' | 'donation' | 'free';
  currency: string;
  isDefault: boolean;
  config: any;
  features?: string[];
  validityDays?: number;
}

interface DiscountCoupon {
  id: string;
  code: string;
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
  currency?: string;
  isActive: boolean;
  usageLimit?: number;
  usedCount: number;
  expiryDate?: string;
  applicablePlans: string[];
}

interface PaymentPlanCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (plan: PaymentPlan) => void;
  editingPlan?: PaymentPlan | null;
  availableCoupons?: DiscountCoupon[];
  featuresGlobal: string[];
  setFeaturesGlobal: (features: string[]) => void;
  allPlans: PaymentPlan[];
}

interface InstallmentPlan {
  numberOfInstallments: number;
  intervalDays: number;
  gracePeriodDays: number;
  lateFeePercentage: number;
}

interface CustomInterval {
  value: number;
  unit: 'days' | 'months';
  price: number;
  features?: string[];
  newFeature?: string;
  title?: string;
}

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

export const PaymentPlanCreator: React.FC<PaymentPlanCreatorProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  editingPlan,
  availableCoupons = [],
  featuresGlobal,
  setFeaturesGlobal,
  allPlans
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [planData, setPlanData] = useState<Partial<PaymentPlan>>({
    name: editingPlan?.name || '',
    type: editingPlan?.type || 'subscription',
    currency: editingPlan?.currency || 'INR',
    isDefault: editingPlan?.isDefault || false,
    config: editingPlan?.config || {
      subscription: {
        monthly: { enabled: false, price: '' },
        annual: { enabled: false, price: '' },
        customIntervals: [] as CustomInterval[]
      },
      upfront: {
        fullPrice: '',
        installmentPlans: [] as InstallmentPlan[]
      },
      donation: {
        suggestedAmounts: '',
        allowCustomAmount: true,
        minimumAmount: '0'
      },
      invoice: {
        baseAmount: '',
        billingInterval: {
          value: 1,
          unit: 'months' as 'days' | 'months'
        },
        gracePeriodDays: 15,
        lateFeePercentage: 5
      }
    }
  });

  const [showInstallmentModal, setShowInstallmentModal] = useState(false);
  const [newInstallment, setNewInstallment] = useState({
    numberOfPayments: 2,
    amountPerPayment: 0,
    dueDates: [] as string[]
  });

  const [newFeature, setNewFeature] = useState('');

  const [showPreview, setShowPreview] = useState(false);

  const getCurrencySymbol = (currencyCode: string) => {
    const currency = currencyOptions.find(c => c.code === currencyCode);
    return currency?.symbol || '$';
  };

  const generateInstallmentDueDates = (numberOfPayments: number, startDate?: string) => {
    const dates = [];
    const start = startDate ? new Date(startDate) : new Date();
    
    for (let i = 0; i < numberOfPayments; i++) {
      const dueDate = new Date(start);
      dueDate.setMonth(dueDate.getMonth() + i);
      dates.push(dueDate.toISOString().split('T')[0]);
    }
    
    return dates;
  };

  const handleSave = () => {
    if (!planData.name || !planData.type) {
      return;
    }

    // Validate free plan
    if (planData.type === 'free' && (!planData.config?.free?.validityDays || planData.config.free.validityDays <= 0)) {
      return;
    }

    const newPlan: PaymentPlan = {
      id: editingPlan?.id || Date.now().toString(),
      name: planData.name,
      type: planData.type,
      currency: planData.currency || 'INR',
      isDefault: planData.isDefault || false,
      config: planData.config || {}
    };

    onSave(newPlan);
    onClose();
    setCurrentStep(1);
    setPlanData({
      name: '',
      type: 'subscription',
      currency: 'INR',
      isDefault: false,
      config: {}
    });
  };

  const updateConfig = (newConfig: any) => {
    setPlanData({
      ...planData,
      config: {
        ...planData.config,
        ...newConfig
      }
    });
  };

  const handleNext = () => {
    if (currentStep === 1 && planData.type && planData.name) {
      // For free and donation plans, skip to step 3 (discounts) or save directly
      if (planData.type === 'free') {
        // Free plans only need basic info, save directly
        handleSave();
      } else if (planData.type === 'donation') {
        // Donation plans skip discounts step
        setCurrentStep(3);
      } else {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Choose Payment Plan Type';
      case 2: return 'Configure Plan Details';
      case 3: return 'Assign Discount Coupons';
      default: return 'Create Payment Plan';
    }
  };

  const getTotalSteps = () => {
    if (planData.type === 'free') return 1;
    if (planData.type === 'donation') return 2;
    return 3;
  };

  useEffect(() => {
    if (isOpen && (!editingPlan || !editingPlan.features)) {
      setPlanData((prev) => ({
        ...prev,
        features: featuresGlobal
      }));
    } else if (isOpen && editingPlan && editingPlan.features) {
      setPlanData((prev) => ({
        ...prev,
        features: editingPlan.features
      }));
    }
    // eslint-disable-next-line
  }, [isOpen, editingPlan, featuresGlobal]);

  if (!isOpen) return null;

  const hasCustomIntervals = planData.type === 'subscription' && planData.config?.subscription?.customIntervals?.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              {editingPlan ? 'Edit Payment Plan' : 'Create Payment Plan'}
            </DialogTitle>
            <div className="text-sm text-gray-500">
              Step {currentStep} of {getTotalSteps()}
            </div>
          </div>
          <div className="text-lg font-medium text-gray-700 mt-2">
            {getStepTitle()}
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Step 1: Payment Type Selection */}
          {currentStep === 1 && (
            <div className="space-y-8">
              {/* Plan Name Input */}
              <div>
                <Label htmlFor="planName" className="text-sm font-medium">Plan Name *</Label>
                <Input
                  id="planName"
                  value={planData.name}
                  onChange={(e) => setPlanData({ ...planData, name: e.target.value })}
                  placeholder="Enter plan name"
                  className="mt-1"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">A unique name to identify this payment plan</p>
              </div>

              <RadioGroup
                value={planData.type as 'subscription' | 'upfront' | 'invoice' | 'donation' | 'free'}
                onValueChange={(value: 'subscription' | 'upfront' | 'invoice' | 'donation' | 'free') => setPlanData({ ...planData, type: value, config: {} })}
                className="space-y-8"
              >
                <div>
                  <div className="font-semibold text-orange-700 mb-2 text-lg">Free Plans</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Free Plan */}
                    <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${planData.type === 'free' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}> 
                      <div className="flex items-start space-x-3">
                        <RadioGroupItem value="free" id="free" className="mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Globe className="w-5 h-5 text-gray-600" />
                            <Label htmlFor="free" className="font-medium text-gray-900 cursor-pointer">Free Plan</Label>
                          </div>
                          <p className="text-sm text-gray-600">Free plan with no payment required</p>
                          <div className="mt-2 text-xs text-gray-500">
                            ✓ Free access<br/>
                            ✓ No payment required<br/>
                            ✓ Ideal for promotional purposes
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Optional Donation */}
                    <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${planData.type === 'donation' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}> 
                      <div className="flex items-start space-x-3">
                        <RadioGroupItem value="donation" id="donation" className="mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Heart className="w-5 h-5 text-red-600" />
                            <Label htmlFor="donation" className="font-medium text-gray-900 cursor-pointer">Optional Donation</Label>
                          </div>
                          <p className="text-sm text-gray-600">Allow students to make voluntary donations with suggested amounts</p>
                          <div className="mt-2 text-xs text-gray-500">
                            ✓ Free course access<br/>
                            ✓ Suggested donation amounts<br/>
                            ✓ Support your institute
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-orange-700 mb-2 text-lg">Paid Plans</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Subscription */}
                    <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${planData.type === 'subscription' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}> 
                      <div className="flex items-start space-x-3">
                        <RadioGroupItem value="subscription" id="subscription" className="mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <CreditCard className="w-5 h-5 text-blue-600" />
                            <Label htmlFor="subscription" className="font-medium text-gray-900 cursor-pointer">Subscription</Label>
                          </div>
                          <p className="text-sm text-gray-600">Recurring payments with flexible intervals (monthly, quarterly, annual, or custom)</p>
                          <div className="mt-2 text-xs text-gray-500">
                            ✓ Auto-renewal options<br/>
                            ✓ Multiple billing periods<br/>
                            ✓ Recurring revenue
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* One-Time Payment */}
                    <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${planData.type === 'upfront' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}> 
                      <div className="flex items-start space-x-3">
                        <RadioGroupItem value="upfront" id="upfront" className="mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <DollarSign className="w-5 h-5 text-green-600" />
                            <Label htmlFor="upfront" className="font-medium text-gray-900 cursor-pointer">One-Time Payment</Label>
                          </div>
                          <p className="text-sm text-gray-600">Single upfront payment with optional installment plans</p>
                          <div className="mt-2 text-xs text-gray-500">
                            ✓ Lifetime access<br/>
                            ✓ Installment options<br/>
                            ✓ No recurring charges
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Pay Bill (Post-paid) */}
                    <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${planData.type === 'invoice' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}> 
                      <div className="flex items-start space-x-3">
                        <RadioGroupItem value="invoice" id="invoice" className="mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Receipt className="w-5 h-5 text-purple-600" />
                            <Label htmlFor="invoice" className="font-medium text-gray-900 cursor-pointer">Pay Bill (Post-paid)</Label>
                          </div>
                          <p className="text-sm text-gray-600">Invoice-based payment with manual processing and approval</p>
                          <div className="mt-2 text-xs text-gray-500">
                            ✓ Corporate billing<br/>
                            ✓ Custom payment terms<br/>
                            ✓ Manual invoice generation
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Step 2: Plan Configuration */}
          {currentStep === 2 && (
            <div className="space-y-6">
              {planData.type === 'subscription' && (
                <>
                  {/* Custom Intervals Section */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium">Pricing Intervals</h3>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const customIntervals = planData.config?.subscription?.customIntervals || [];
                          // Each new interval starts with all features checked
                          const features = [...featuresGlobal];
                          const newInterval = { value: 1, unit: 'months', price: '', features };
                          const updatedConfig = {
                            ...planData.config,
                            subscription: {
                              ...planData.config?.subscription,
                              customIntervals: [...customIntervals, newInterval]
                            }
                          };
                          setPlanData({ ...planData, config: updatedConfig });
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Pricing Interval
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {(planData.config?.subscription?.customIntervals || []).map((interval, idx) => (
                        <div key={idx} className="p-4 border rounded-lg space-y-4">
                          <div className="grid grid-cols-4 gap-3 flex-1">
                            <div>
                              <Label className="text-xs">Interval Title</Label>
                              <Input
                                type="text"
                                placeholder="e.g. Starter, Pro, 9 Months Access"
                                value={interval.title || ''}
                                onChange={e => {
                                  const customIntervals = [...(planData.config?.subscription?.customIntervals || [])];
                                  customIntervals[idx] = { ...customIntervals[idx], title: e.target.value };
                                  setPlanData({
                                    ...planData,
                                    config: {
                                      ...planData.config,
                                      subscription: {
                                        ...planData.config?.subscription,
                                        customIntervals
                                      }
                                    }
                                  });
                                }}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Interval</Label>
                              <Input
                                type="number"
                                min="1"
                                value={interval.value}
                                onChange={e => {
                                  const customIntervals = [...(planData.config?.subscription?.customIntervals || [])];
                                  customIntervals[idx] = { ...customIntervals[idx], value: parseInt(e.target.value) || 1 };
                                  setPlanData({
                                    ...planData,
                                    config: {
                                      ...planData.config,
                                      subscription: {
                                        ...planData.config?.subscription,
                                        customIntervals
                                      }
                                    }
                                  });
                                }}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Unit</Label>
                              <Select
                                value={interval.unit}
                                onValueChange={value => {
                                  const customIntervals = [...(planData.config?.subscription?.customIntervals || [])];
                                  customIntervals[idx] = { ...customIntervals[idx], unit: value };
                                  setPlanData({
                                    ...planData,
                                    config: {
                                      ...planData.config,
                                      subscription: {
                                        ...planData.config?.subscription,
                                        customIntervals
                                      }
                                    }
                                  });
                                }}
                              >
                                <SelectTrigger className="mt-1">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="days">Days</SelectItem>
                                  <SelectItem value="months">Months</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-xs">Price</Label>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="text-sm">{getCurrencySymbol(planData.currency!)}</span>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  value={interval.price}
                                  onChange={e => {
                                    const customIntervals = [...(planData.config?.subscription?.customIntervals || [])];
                                    customIntervals[idx] = { ...customIntervals[idx], price: e.target.value };
                                    setPlanData({
                                      ...planData,
                                      config: {
                                        ...planData.config,
                                        subscription: {
                                          ...planData.config?.subscription,
                                          customIntervals
                                        }
                                      }
                                    });
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                          {/* Features for this interval */}
                          <div className="mt-4">
                            <h4 className="text-xs font-semibold mb-2">Features</h4>
                            <div className="space-y-2">
                              {featuresGlobal.map((feature, fidx) => (
                                <div key={fidx} className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={interval.features?.includes(feature) || false}
                                    onChange={e => {
                                      const customIntervals = [...(planData.config?.subscription?.customIntervals || [])];
                                      let newFeatures = interval.features ? [...interval.features] : [];
                                      if (e.target.checked) {
                                        newFeatures.push(feature);
                                      } else {
                                        newFeatures = newFeatures.filter(f => f !== feature);
                                      }
                                      customIntervals[idx] = { ...customIntervals[idx], features: newFeatures };
                                      setPlanData({
                                        ...planData,
                                        config: {
                                          ...planData.config,
                                          subscription: {
                                            ...planData.config?.subscription,
                                            customIntervals
                                          }
                                        }
                                      });
                                    }}
                                  />
                                  <span>{feature}</span>
                                </div>
                              ))}
                            </div>
                            <div className="flex gap-2 mt-2">
                              <input
                                type="text"
                                className="flex-1 border rounded px-2 py-1"
                                placeholder="Add new feature"
                                value={interval.newFeature || ''}
                                onChange={e => {
                                  const customIntervals = [...(planData.config?.subscription?.customIntervals || [])];
                                  customIntervals[idx] = { ...customIntervals[idx], newFeature: e.target.value };
                                  setPlanData({
                                    ...planData,
                                    config: {
                                      ...planData.config,
                                      subscription: {
                                        ...planData.config?.subscription,
                                        customIntervals
                                      }
                                    }
                                  });
                                }}
                              />
                              <button
                                type="button"
                                className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200"
                                onClick={() => {
                                  const customIntervals = [...(planData.config?.subscription?.customIntervals || [])];
                                  const newFeature = interval.newFeature?.trim();
                                  if (newFeature && !featuresGlobal.includes(newFeature)) {
                                    setFeaturesGlobal([...featuresGlobal, newFeature]);
                                    // Add to all intervals
                                    customIntervals.forEach((intv, i) => {
                                      if (!intv.features) customIntervals[i].features = [];
                                      customIntervals[i].features = [...(customIntervals[i].features || []), newFeature];
                                    });
                                    // Clear input
                                    customIntervals[idx].newFeature = '';
                                    setPlanData({
                                      ...planData,
                                      config: {
                                        ...planData.config,
                                        subscription: {
                                          ...planData.config?.subscription,
                                          customIntervals
                                        }
                                      }
                                    });
                                  }
                                }}
                              >
                                Add
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {planData.type === 'upfront' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">One-Time Payment Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label>Full Price ({getCurrencySymbol(planData.currency!)}) *</Label>
                      <Input
                        type="number"
                        placeholder="Enter price"
                        value={planData.config?.upfront?.fullPrice || ''}
                        onChange={(e) => updateConfig({
                          upfront: {
                            ...planData.config?.upfront,
                            fullPrice: e.target.value
                          }
                        })}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium">Installment Plans</h3>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const installmentPlans = planData.config?.upfront?.installmentPlans || [];
                            updateConfig({
                              upfront: {
                                ...planData.config?.upfront,
                                installmentPlans: [...installmentPlans, {
                                  numberOfInstallments: 2,
                                  intervalDays: 30,
                                  gracePeriodDays: 7,
                                  lateFeePercentage: 5
                                }]
                              }
                            });
                          }}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Installment Plan
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {planData.config?.upfront?.installmentPlans?.map((plan, index) => (
                          <div key={index} className="p-4 border rounded-lg space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">
                                {plan.numberOfInstallments} Installments
                              </h4>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => {
                                  const installmentPlans = planData.config?.upfront?.installmentPlans?.filter((_, i) => i !== index) || [];
                                  updateConfig({
                                    upfront: {
                                      ...planData.config?.upfront,
                                      installmentPlans
                                    }
                                  });
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-xs">Number of Installments</Label>
                                <Input
                                  type="number"
                                  min="2"
                                  value={plan.numberOfInstallments}
                                  onChange={(e) => {
                                    const installmentPlans = [...(planData.config?.upfront?.installmentPlans || [])];
                                    installmentPlans[index] = {
                                      ...installmentPlans[index],
                                      numberOfInstallments: parseInt(e.target.value) || 2
                                    };
                                    updateConfig({
                                      upfront: {
                                        ...planData.config?.upfront,
                                        installmentPlans
                                      }
                                    });
                                  }}
                                  className="mt-1"
                                />
                              </div>

                              <div>
                                <Label className="text-xs">Days Between Installments</Label>
                                <Input
                                  type="number"
                                  min="1"
                                  value={plan.intervalDays}
                                  onChange={(e) => {
                                    const installmentPlans = [...(planData.config?.upfront?.installmentPlans || [])];
                                    installmentPlans[index] = {
                                      ...installmentPlans[index],
                                      intervalDays: parseInt(e.target.value) || 30
                                    };
                                    updateConfig({
                                      upfront: {
                                        ...planData.config?.upfront,
                                        installmentPlans
                                      }
                                    });
                                  }}
                                  className="mt-1"
                                />
                              </div>

                              <div>
                                <Label className="text-xs">Grace Period (Days)</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  value={plan.gracePeriodDays}
                                  onChange={(e) => {
                                    const installmentPlans = [...(planData.config?.upfront?.installmentPlans || [])];
                                    installmentPlans[index] = {
                                      ...installmentPlans[index],
                                      gracePeriodDays: parseInt(e.target.value) || 0
                                    };
                                    updateConfig({
                                      upfront: {
                                        ...planData.config?.upfront,
                                        installmentPlans
                                      }
                                    });
                                  }}
                                  className="mt-1"
                                />
                              </div>

                              <div>
                                <Label className="text-xs">Late Fee (%)</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={plan.lateFeePercentage}
                                  onChange={(e) => {
                                    const installmentPlans = [...(planData.config?.upfront?.installmentPlans || [])];
                                    installmentPlans[index] = {
                                      ...installmentPlans[index],
                                      lateFeePercentage: parseInt(e.target.value) || 0
                                    };
                                    updateConfig({
                                      upfront: {
                                        ...planData.config?.upfront,
                                        installmentPlans
                                      }
                                    });
                                  }}
                                  className="mt-1"
                                />
                              </div>
                            </div>

                            <div className="mt-2 text-sm text-gray-600">
                              Amount per installment: {getCurrencySymbol(planData.currency!)}
                              {planData.config?.upfront?.fullPrice
                                ? (parseFloat(planData.config.upfront.fullPrice) / plan.numberOfInstallments).toFixed(2)
                                : '0.00'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {planData.type === 'donation' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Donation Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Suggested Donation Amounts ({getCurrencySymbol(planData.currency!)})</Label>
                      <Input
                        placeholder="e.g., 500, 1000, 2500"
                        value={planData.config?.donation?.suggestedAmounts || ''}
                        onChange={(e) => updateConfig({
                          donation: {
                            ...planData.config?.donation,
                            suggestedAmounts: e.target.value
                          }
                        })}
                        className="mt-1"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Comma-separated amounts that students can choose from
                      </p>
                    </div>

                    <div>
                      <Label>Minimum Donation Amount ({getCurrencySymbol(planData.currency!)})</Label>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0 for no minimum"
                        value={planData.config?.donation?.minimumAmount || '0'}
                        onChange={(e) => updateConfig({
                          donation: {
                            ...planData.config?.donation,
                            minimumAmount: e.target.value
                          }
                        })}
                        className="mt-1"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="allowCustomAmount"
                        checked={planData.config?.donation?.allowCustomAmount !== false}
                        onCheckedChange={(checked) => updateConfig({
                          donation: {
                            ...planData.config?.donation,
                            allowCustomAmount: checked
                          }
                        })}
                      />
                      <Label htmlFor="allowCustomAmount">Allow custom donation amounts</Label>
                    </div>

                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        Donation-based courses are free to access. Coupon codes are not applicable as students can choose their contribution amount.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              )}

              {planData.type === 'invoice' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Invoice Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Base Amount ({getCurrencySymbol(planData.currency!)}) *</Label>
                      <Input
                        type="number"
                        placeholder="Enter base amount"
                        value={planData.config?.invoice?.baseAmount || ''}
                        onChange={(e) => updateConfig({
                          invoice: {
                            ...planData.config?.invoice,
                            baseAmount: e.target.value
                          }
                        })}
                        className="mt-1"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Billing Interval Value</Label>
                        <Input
                          type="number"
                          min="1"
                          value={planData.config?.invoice?.billingInterval?.value || 1}
                          onChange={(e) => updateConfig({
                            invoice: {
                              ...planData.config?.invoice,
                              billingInterval: {
                                ...planData.config?.invoice?.billingInterval,
                                value: parseInt(e.target.value) || 1
                              }
                            }
                          })}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label>Interval Unit</Label>
                        <Select
                          value={planData.config?.invoice?.billingInterval?.unit || 'months'}
                          onValueChange={(value: 'days' | 'months') => updateConfig({
                            invoice: {
                              ...planData.config?.invoice,
                              billingInterval: {
                                ...planData.config?.invoice?.billingInterval,
                                unit: value
                              }
                            }
                          })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="days">Days</SelectItem>
                            <SelectItem value="months">Months</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Grace Period (Days)</Label>
                        <Input
                          type="number"
                          min="0"
                          value={planData.config?.invoice?.gracePeriodDays || 0}
                          onChange={(e) => updateConfig({
                            invoice: {
                              ...planData.config?.invoice,
                              gracePeriodDays: parseInt(e.target.value) || 0
                            }
                          })}
                          className="mt-1"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Days allowed after invoice due date before late fee applies
                        </p>
                      </div>

                      <div>
                        <Label>Late Fee (%)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={planData.config?.invoice?.lateFeePercentage || 0}
                          onChange={(e) => updateConfig({
                            invoice: {
                              ...planData.config?.invoice,
                              lateFeePercentage: parseInt(e.target.value) || 0
                            }
                          })}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="allowStudentRequests"
                        checked={planData.config?.invoice?.allowStudentRequests || false}
                        onCheckedChange={(checked) => updateConfig({
                          invoice: {
                            ...planData.config?.invoice,
                            allowStudentRequests: checked
                          }
                        })}
                      />
                      <Label htmlFor="allowStudentRequests">Allow students to request invoice enrollment</Label>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Step 3: Coupon Assignment */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Assign Discount Coupons</CardTitle>
                  <p className="text-sm text-gray-600">Select which discount coupons can be used with this payment plan</p>
                </CardHeader>
                <CardContent>
                  {availableCoupons.length > 0 ? (
                    <div className="space-y-3">
                      {availableCoupons.filter(coupon => coupon.isActive).map((coupon) => (
                        <div key={coupon.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id={`coupon-${coupon.id}`}
                              checked={planData.config?.applicableCoupons?.includes(coupon.id) || false}
                              onCheckedChange={(checked) => {
                                const currentCoupons = planData.config?.applicableCoupons || [];
                                const newCoupons = checked 
                                  ? [...currentCoupons, coupon.id]
                                  : currentCoupons.filter((id: string) => id !== coupon.id);
                                updateConfig({ applicableCoupons: newCoupons });
                              }}
                            />
                            <div>
                              <Label htmlFor={`coupon-${coupon.id}`} className="font-medium cursor-pointer">
                                {coupon.name}
                              </Label>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                                  {coupon.code}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {coupon.type === 'percentage' 
                                    ? `${coupon.value}% off` 
                                    : `${getCurrencySymbol(coupon.currency || planData.currency!)}${coupon.value} off`
                                  }
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        No active discount coupons available. You can create coupons in the Discount Coupons tab.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <div>
              {currentStep > 1 && (
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
              )}
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              {currentStep < getTotalSteps() ? (
                <Button 
                  onClick={handleNext}
                  disabled={currentStep === 1 && (!planData.name || !planData.type || (planData.type === 'free' && (!planData.config?.free?.validityDays || planData.config.free.validityDays <= 0)))}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  {planData.type === 'free' ? 'Create Plan' : 'Next'}
                </Button>
              ) : (
                <Button 
                  onClick={handleSave} 
                  className="bg-orange-600 hover:bg-orange-700"
                  disabled={!planData.name || !planData.type}
                >
                  {editingPlan ? 'Update' : 'Create'} Payment Plan
                </Button>
              )}
            </div>
          </div>

          {/* Show preview button at both step 2 and 3, but only if there are custom intervals for a subscription plan */}
          {((currentStep === 2 || currentStep === 3) && hasCustomIntervals) && (
            <div className="flex justify-end mt-6">
              <Button onClick={() => setShowPreview((prev) => !prev)} variant="outline">
                {showPreview ? 'Hide Preview' : 'Preview Plans'}
              </Button>
            </div>
          )}
          {showPreview && hasCustomIntervals && (
            <div className="mt-8">
              <SubscriptionPlanPreview 
                plans={[
                  ...allPlans,
                  // Include the current plan being created if it's a subscription plan
                  ...(planData.type === 'subscription' && planData.name ? [{
                    id: 'current-plan',
                    name: planData.name,
                    type: planData.type,
                    currency: planData.currency || 'INR',
                    isDefault: planData.isDefault || false,
                    config: planData.config || {},
                    features: planData.features || []
                    // Removed customIntervals property
                  }] : [])
                ]} 
                featuresGlobal={featuresGlobal}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}; 