import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, CreditCard, Eye, Info, Settings } from 'lucide-react';

interface PaymentPlan {
  id: string;
  name: string;
  type: 'subscription' | 'upfront' | 'invoice';
  currency: string;
  isDefault: boolean;
  config: any;
}

interface PaymentPlanSelectorProps {
  selectedPlanId: string;
  onPlanSelect: (planId: string) => void;
}

// Mock data - in a real app, this would come from the institute settings
const availablePaymentPlans: PaymentPlan[] = [
  {
    id: '1',
    name: 'Standard Subscription Plan',
    type: 'subscription',
    currency: 'INR',
    isDefault: true,
    config: {
      monthly: { enabled: true, price: '999' },
      quarterly: { enabled: true, price: '2799' },
      annual: { enabled: true, price: '9999' },
      autoRenew: true
    }
  },
  {
    id: '2',
    name: 'One-Time Payment Plan',
    type: 'upfront',
    currency: 'INR',
    isDefault: false,
    config: {
      fullPrice: '15000',
      allowInstallments: true,
      installmentPlans: [
        {
          id: '1',
          numberOfPayments: 3,
          amountPerPayment: 5000,
          dueDates: ['2024-02-15', '2024-03-15', '2024-04-15']
        }
      ]
    }
  },
  {
    id: '3',
    name: 'Enterprise Invoice Plan',
    type: 'invoice',
    currency: 'INR',
    isDefault: false,
    config: {
      allowStudentRequests: true,
      customTerms: '30 days payment terms'
    }
  }
];

const currencySymbols = {
  'USD': '$',
  'EUR': '€',
  'GBP': '£',
  'INR': '₹',
  'AUD': 'A$',
  'CAD': 'C$'
};

const getCurrencySymbol = (currencyCode: string) => {
  return currencySymbols[currencyCode as keyof typeof currencySymbols] || '$';
};

export const PaymentPlanSelector: React.FC<PaymentPlanSelectorProps> = ({ 
  selectedPlanId, 
  onPlanSelect 
}) => {
  const [showAllPlans, setShowAllPlans] = useState(false);
  
  const defaultPlan = availablePaymentPlans.find(plan => plan.isDefault);
  const selectedPlan = availablePaymentPlans.find(plan => plan.id === selectedPlanId) || defaultPlan;

  const getPlanSummary = (plan: PaymentPlan) => {
    switch (plan.type) {
      case 'subscription':
        if (plan.config.monthly?.enabled) {
          return `Monthly: ${getCurrencySymbol(plan.currency)}${plan.config.monthly.price}`;
        }
        return 'Subscription-based';
      case 'upfront':
        return `One-time: ${getCurrencySymbol(plan.currency)}${plan.config.fullPrice}`;
      case 'invoice':
        return 'Invoice-based payment';
      default:
        return '';
    }
  };

  const getPlanDetails = (plan: PaymentPlan) => {
    const details = [];
    
    switch (plan.type) {
      case 'subscription':
        if (plan.config.monthly?.enabled) {
          details.push(`Monthly: ${getCurrencySymbol(plan.currency)}${plan.config.monthly.price}`);
        }
        if (plan.config.quarterly?.enabled) {
          details.push(`Quarterly: ${getCurrencySymbol(plan.currency)}${plan.config.quarterly.price}`);
        }
        if (plan.config.annual?.enabled) {
          details.push(`Annual: ${getCurrencySymbol(plan.currency)}${plan.config.annual.price}`);
        }
        if (plan.config.autoRenew) {
          details.push('Auto-renewal enabled');
        }
        break;
      case 'upfront':
        details.push(`Full Price: ${getCurrencySymbol(plan.currency)}${plan.config.fullPrice}`);
        if (plan.config.allowInstallments) {
          details.push(`Installments available (${plan.config.installmentPlans?.length || 0} plans)`);
        }
        break;
      case 'invoice':
        details.push('Manual invoice processing');
        if (plan.config.allowStudentRequests) {
          details.push('Students can request enrollment');
        }
        break;
    }
    
    return details;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Plan Selection
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">Choose a payment plan for this course</p>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium text-green-600">
              Payment plans configured
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Selection */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-medium text-blue-900">{selectedPlan?.name}</h3>
                {selectedPlan?.isDefault && (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    Default
                  </Badge>
                )}
              </div>
              <p className="text-sm text-blue-700 capitalize">
                {selectedPlan?.type} Plan • {getPlanSummary(selectedPlan!)}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Currency: {selectedPlan?.currency}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-blue-600 mb-2">Currently Selected</p>
              <Dialog open={showAllPlans} onOpenChange={setShowAllPlans}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                    <Eye className="w-3 h-3 mr-1" />
                    View More Options
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Available Payment Plans
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        Select a different payment plan for this course. You can manage payment plans in 
                        <Button variant="link" className="p-0 h-auto text-blue-600" onClick={() => window.open('/institute-settings', '_blank')}>
                          Institute Settings
                        </Button>.
                      </AlertDescription>
                    </Alert>
                    
                    <RadioGroup value={selectedPlanId} onValueChange={onPlanSelect}>
                      {availablePaymentPlans.map((plan) => (
                        <div key={plan.id} className="space-y-2">
                          <div className={`p-4 border rounded-lg transition-colors ${
                            selectedPlanId === plan.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                          }`}>
                            <div className="flex items-start space-x-3">
                              <RadioGroupItem value={plan.id} id={plan.id} className="mt-1" />
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <Label htmlFor={plan.id} className="font-medium text-gray-900 cursor-pointer">
                                    {plan.name}
                                  </Label>
                                  {plan.isDefault && (
                                    <Badge variant="default" className="bg-green-100 text-green-800">
                                      Default
                                    </Badge>
                                  )}
                                  <Badge variant="outline" className="text-xs capitalize">
                                    {plan.type}
                                  </Badge>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm text-gray-600 mb-1">Plan Details:</p>
                                    <ul className="text-xs text-gray-500 space-y-1">
                                      {getPlanDetails(plan).map((detail, index) => (
                                        <li key={index}>• {detail}</li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-600 mb-1">Configuration:</p>
                                    <div className="text-xs text-gray-500 space-y-1">
                                      <div>Currency: {plan.currency}</div>
                                      <div>Type: {plan.type}</div>
                                      {plan.type === 'subscription' && plan.config.autoRenew && (
                                        <div>Auto-renewal: Enabled</div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                    
                    <div className="flex justify-end space-x-2 pt-4 border-t">
                      <Button 
                        variant="outline" 
                        onClick={() => window.open('/institute-settings', '_blank')}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Manage Payment Plans
                      </Button>
                      <Button onClick={() => setShowAllPlans(false)}>
                        Apply Selection
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Plan Details Preview */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Selected Plan Details:</h4>
          <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
            <div>
              <ul className="space-y-1">
                {getPlanDetails(selectedPlan!).slice(0, Math.ceil(getPlanDetails(selectedPlan!).length / 2)).map((detail, index) => (
                  <li key={index}>• {detail}</li>
                ))}
              </ul>
            </div>
            <div>
              <ul className="space-y-1">
                {getPlanDetails(selectedPlan!).slice(Math.ceil(getPlanDetails(selectedPlan!).length / 2)).map((detail, index) => (
                  <li key={index}>• {detail}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Info Note */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription className="text-sm">
            This payment plan will be applied to the course. Students will see the pricing and options configured in this plan. 
            You can modify payment plans in Institute Settings.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}; 