import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  CreditCard, 
  Calendar,
  Receipt,
  DollarSign,
  Edit,
  Trash2,
  Globe
} from 'lucide-react';

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

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'subscription':
      return <Calendar className="w-5 h-5" />;
    case 'upfront':
      return <DollarSign className="w-5 h-5" />;
    case 'invoice':
      return <Receipt className="w-5 h-5" />;
    case 'free':
      return <Globe className="w-5 h-5" />;
    default:
      return <CreditCard className="w-5 h-5" />;
  }
};

const getPlanPriceDetails = (plan: PaymentPlan) => {
  const symbol = getCurrencySymbol(plan.currency);
  const details = [];

  switch (plan.type) {
    case 'subscription':
      if (plan.config.subscription.monthly?.enabled) {
        details.push(`Monthly: ${symbol}${plan.config.subscription.monthly.price}`);
      }
      if (plan.config.subscription.annual?.enabled) {
        details.push(`Annual: ${symbol}${plan.config.subscription.annual.price}`);
      }
      if (plan.config.subscription.customIntervals?.length > 0) {
        plan.config.subscription.customIntervals.forEach((interval: any) => {
          details.push(`${interval.value} ${interval.unit}: ${symbol}${interval.price}`);
        });
      }
      break;
    
    case 'upfront':
      details.push(`Full Price: ${symbol}${plan.config.upfront.fullPrice}`);
      if (plan.config.upfront.installmentPlans?.length > 0) {
        plan.config.upfront.installmentPlans.forEach((installment: any, index: number) => {
          details.push(`Installment Plan ${index + 1}: ${installment.numberOfInstallments} payments of ${symbol}${installment.amountPerPayment}`);
        });
      }
      break;
    
    case 'invoice':
      details.push(`Base Amount: ${symbol}${plan.config.invoice.baseAmount}`);
      details.push(`Billing Interval: ${plan.config.invoice.billingInterval.value} ${plan.config.invoice.billingInterval.unit}`);
      break;

    case 'donation':
      if (plan.config.donation.suggestedAmounts) {
        details.push(`Suggested Amounts: ${symbol}${plan.config.donation.suggestedAmounts}`);
      }
      if (plan.config.donation.minimumAmount) {
        details.push(`Minimum Amount: ${symbol}${plan.config.donation.minimumAmount}`);
      }
      break;

    case 'free':
      if (plan.config.free?.validityDays) {
        details.push(`Free for ${plan.config.free.validityDays} days`);
      } else {
        details.push('Free access');
      }
      break;
  }

  return details;
};

interface PaymentPlanListProps {
  plans: PaymentPlan[];
  onEdit?: (plan: PaymentPlan) => void;
  onDelete?: (planId: string) => void;
  onSetDefault?: (planId: string) => void;
}

export const PaymentPlanList: React.FC<PaymentPlanListProps> = ({ 
  plans, 
  onEdit, 
  onDelete, 
  onSetDefault 
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Payment Plans
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {plans.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No payment plans created yet</p>
              <p className="text-sm">Create your first payment plan to start accepting payments</p>
            </div>
          ) : (
            plans.map((plan, index) => (
              <React.Fragment key={plan.id}>
                {index > 0 && <Separator className="my-4" />}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(plan.type)}
                      <h3 className="font-medium text-lg">{plan.name}</h3>
                      {plan.isDefault && (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          Default
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize">
                        {plan.type}
                      </Badge>
                      {onEdit && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(plan)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                      {onSetDefault && !plan.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onSetDefault(plan.id)}
                        >
                          Make Default
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDelete(plan.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="ml-7 space-y-1">
                    {getPlanPriceDetails(plan).map((detail, idx) => (
                      <p key={idx} className="text-sm text-gray-600">
                        {detail}
                      </p>
                    ))}
                    <p className="text-xs text-gray-500 mt-2">
                      Currency: {plan.currency}
                    </p>
                  </div>
                </div>
              </React.Fragment>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 