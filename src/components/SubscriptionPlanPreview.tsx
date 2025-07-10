import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Check, 
  X, 
  Calendar,
  Info,
} from 'lucide-react';

interface SubscriptionPlan {
  enabled: boolean;
  price: string;
  interval: string;
  customInterval?: {
    value: number;
    unit: 'days' | 'weeks' | 'months' | 'years';
  };
}

interface SubscriptionPlansConfig {
  monthly: SubscriptionPlan;
  quarterly: SubscriptionPlan;
  halfYearly: SubscriptionPlan;
  annual: SubscriptionPlan;
  custom: SubscriptionPlan;
  autoRenew: boolean;
}

interface SubscriptionPlanPreviewProps {
  currency: string;
  subscriptionPlans: SubscriptionPlansConfig;
  features: string[];
  onSelectPlan?: (planType: string) => void;
}

const currencySymbols: { [key: string]: string } = {
  'USD': '$',
  'EUR': '€',
  'GBP': '£',
  'INR': '₹',
  'AUD': 'A$',
  'CAD': 'C$',
  'JPY': '¥',
  'CNY': '¥',
  'SGD': 'S$',
  'AED': 'د.إ'
};

const getCurrencySymbol = (currencyCode: string) => {
  return currencySymbols[currencyCode] || currencyCode;
};

const formatCustomInterval = (value: number, unit: string) => {
  const unitStr = value === 1 ? unit.slice(0, -1) : unit; // Remove 's' for singular
  return `${value} ${unitStr}`;
};

const getPlanTitle = (planType: string, customInterval?: { value: number; unit: string }) => {
  if (planType === 'custom' && customInterval) {
    return `${formatCustomInterval(customInterval.value, customInterval.unit)} Plan`;
  }
  
  const titles: { [key: string]: string } = {
    monthly: '1 Month Plan',
    quarterly: '3 Months Plan',
    halfYearly: '6 Months Plan',
    annual: '12 Months Plan'
  };
  
  return titles[planType] || planType;
};

const getPlanDuration = (planType: string, customInterval?: { value: number; unit: string }) => {
  if (planType === 'custom' && customInterval) {
    return formatCustomInterval(customInterval.value, customInterval.unit);
  }
  
  const durations: { [key: string]: string } = {
    monthly: '1 month',
    quarterly: '3 months',
    halfYearly: '6 months',
    annual: '12 months'
  };
  
  return durations[planType] || planType;
};

const getIncludedFeatures = (planType: string, features: string[]) => {
  // Monthly plan has limited features
  if (planType === 'monthly') {
    return features.map(feature => ({
      name: feature,
      included: ['Live Classes', '1500 Tests', '500 Students'].includes(feature)
    }));
  }
  
  // All other plans include all features
  return features.map(feature => ({
    name: feature,
    included: true
  }));
};

export const SubscriptionPlanPreview: React.FC<SubscriptionPlanPreviewProps> = ({ 
  currency,
  subscriptionPlans,
  features,
  onSelectPlan 
}) => {
  console.log('SubscriptionPlanPreview props:', {
    currency,
    subscriptionPlans,
    features
  });

  // Validate required props
  if (!subscriptionPlans) {
    console.error('subscriptionPlans prop is required');
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Subscription Intervals Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Error: Subscription plans data is missing</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currency) {
    console.error('currency prop is required');
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Subscription Intervals Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Error: Currency is not selected</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Filter enabled plans and create cards data
  const enabledPlans = Object.entries(subscriptionPlans)
    .filter(([type, plan]) => {
      // Skip autoRenew field
      if (type === 'autoRenew') return false;
      
      // Plan must be enabled and have a valid price
      const isEnabled = plan.enabled;
      const hasValidPrice = plan.price && !isNaN(parseFloat(plan.price)) && parseFloat(plan.price) > 0;
      
      console.log(`Plan ${type}:`, {
        isEnabled,
        hasValidPrice,
        price: plan.price,
        customInterval: plan.customInterval
      });
      
      return isEnabled && hasValidPrice;
    })
    .map(([type, plan]) => ({
      type,
      ...plan
    }));

  console.log('Enabled plans:', enabledPlans);

  if (enabledPlans.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Subscription Intervals Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No subscription intervals enabled yet</p>
            <p className="text-sm">Enable intervals and set prices in the settings to see the preview cards</p>
            <div className="mt-4 text-xs text-gray-400">
              <p>To show a plan:</p>
              <ol className="list-decimal list-inside mt-2">
                <li>Enable the plan using the switch</li>
                <li>Set a valid price greater than 0</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Subscription Intervals Preview
        </CardTitle>
        <p className="text-sm text-gray-600">
          Live preview of your subscription intervals with feature comparison
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enabledPlans.map((plan) => {
            const planFeatures = getIncludedFeatures(plan.type, features || []);
            const isCustom = plan.type === 'custom';
            const isAnnual = plan.type === 'annual';
            
            return (
              <Card 
                key={plan.type} 
                className={`relative overflow-hidden transition-all hover:shadow-lg border-2 ${
                  isAnnual ? 'border-orange-300 bg-orange-50/30' : 
                  isCustom ? 'border-purple-300 bg-purple-50/30' :
                  'border-gray-100'
                } hover:border-orange-300`}
              >
                {isAnnual && (
                  <div className="absolute -right-12 top-6 bg-orange-500 text-white px-12 py-1 rotate-45 text-sm font-medium">
                    Best Value
                  </div>
                )}
                {isCustom && (
                  <div className="absolute -right-12 top-6 bg-purple-500 text-white px-12 py-1 rotate-45 text-sm font-medium">
                    Custom
                  </div>
                )}
                <CardHeader className="pb-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-lg font-bold text-gray-900">
                      {getPlanTitle(plan.type, plan.customInterval)}
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-blue-600">
                        {getCurrencySymbol(currency)}{parseFloat(plan.price).toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-500">
                        /{getPlanDuration(plan.type, plan.customInterval)}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      {planFeatures.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          {feature.included ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <X className="w-4 h-4 text-red-500" />
                          )}
                          <span className={`text-sm ${feature.included ? 'text-gray-700' : 'text-gray-400 line-through'}`}>
                            {feature.name}
                          </span>
                        </div>
                      ))}
                    </div>
                    <Button 
                      className="w-full"
                      onClick={() => onSelectPlan?.(plan.type)}
                    >
                      Select Plan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}; 