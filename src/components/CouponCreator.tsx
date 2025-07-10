import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Percent, DollarSign, Info, Calendar, Users } from 'lucide-react';

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

interface PaymentPlan {
  id: string;
  name: string;
  type: 'subscription' | 'upfront' | 'invoice' | 'donation';
  currency: string;
  isDefault: boolean;
}

interface CouponCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (coupon: DiscountCoupon) => void;
  editingCoupon?: DiscountCoupon | null;
  availablePlans?: PaymentPlan[];
  defaultCurrency?: string;
}

const currencyOptions = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' }
];

export const CouponCreator: React.FC<CouponCreatorProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  editingCoupon,
  availablePlans = [],
  defaultCurrency = 'INR'
}) => {
  const [couponData, setCouponData] = useState<Partial<DiscountCoupon>>({
    code: editingCoupon?.code || '',
    name: editingCoupon?.name || '',
    type: editingCoupon?.type || 'percentage',
    value: editingCoupon?.value || 0,
    currency: editingCoupon?.currency || defaultCurrency,
    isActive: editingCoupon?.isActive ?? true,
    usageLimit: editingCoupon?.usageLimit || undefined,
    usedCount: editingCoupon?.usedCount || 0,
    expiryDate: editingCoupon?.expiryDate || '',
    applicablePlans: editingCoupon?.applicablePlans || []
  });

  const getCurrencySymbol = (currencyCode: string) => {
    const currency = currencyOptions.find(c => c.code === currencyCode);
    return currency?.symbol || '$';
  };

  const handleSave = () => {
    if (!couponData.code || !couponData.name || !couponData.value) {
      return;
    }

    const newCoupon: DiscountCoupon = {
      id: editingCoupon?.id || Date.now().toString(),
      code: couponData.code.toUpperCase(),
      name: couponData.name,
      type: couponData.type || 'percentage',
      value: couponData.value,
      currency: couponData.type === 'fixed' ? couponData.currency : undefined,
      isActive: couponData.isActive ?? true,
      usageLimit: couponData.usageLimit || undefined,
      usedCount: couponData.usedCount || 0,
      expiryDate: couponData.expiryDate || undefined,
      applicablePlans: couponData.applicablePlans || []
    };

    onSave(newCoupon);
    onClose();
    setCouponData({
      code: '',
      name: '',
      type: 'percentage',
      value: 0,
      currency: defaultCurrency,
      isActive: true,
      usageLimit: undefined,
      usedCount: 0,
      expiryDate: '',
      applicablePlans: []
    });
  };

  const updateCouponData = (updates: Partial<DiscountCoupon>) => {
    setCouponData({
      ...couponData,
      ...updates
    });
  };

  const handlePlanToggle = (planId: string, checked: boolean) => {
    const currentPlans = couponData.applicablePlans || [];
    const newPlans = checked 
      ? [...currentPlans, planId]
      : currentPlans.filter(id => id !== planId);
    updateCouponData({ applicablePlans: newPlans });
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Percent className="w-5 h-5" />
            {editingCoupon ? 'Edit Discount Coupon' : 'Create Discount Coupon'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="couponName">Coupon Name *</Label>
                  <Input
                    id="couponName"
                    placeholder="e.g., Welcome Discount"
                    value={couponData.name}
                    onChange={(e) => updateCouponData({ name: e.target.value })}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="couponCode">Coupon Code *</Label>
                  <Input
                    id="couponCode"
                    placeholder="e.g., WELCOME20"
                    value={couponData.code}
                    onChange={(e) => updateCouponData({ code: e.target.value.toUpperCase() })}
                    className="mt-1 font-mono"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Code will be automatically converted to uppercase
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={couponData.isActive}
                  onCheckedChange={(checked) => updateCouponData({ isActive: !!checked })}
                />
                <Label htmlFor="isActive" className="text-sm">
                  Activate coupon immediately
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Discount Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Discount Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-3 block">Discount Type</Label>
                <RadioGroup 
                  value={couponData.type} 
                  onValueChange={(value: 'percentage' | 'fixed') => 
                    updateCouponData({ type: value, currency: value === 'fixed' ? defaultCurrency : undefined })
                  }
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Percentage Discount */}
                    <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      couponData.type === 'percentage' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <div className="flex items-start space-x-3">
                        <RadioGroupItem value="percentage" id="percentage" className="mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Percent className="w-4 h-4 text-blue-600" />
                            <Label htmlFor="percentage" className="font-medium text-gray-900 cursor-pointer">
                              Percentage Discount
                            </Label>
                          </div>
                          <p className="text-sm text-gray-600">
                            Discount as a percentage of the course price
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Fixed Amount Discount */}
                    <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      couponData.type === 'fixed' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <div className="flex items-start space-x-3">
                        <RadioGroupItem value="fixed" id="fixed" className="mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            <Label htmlFor="fixed" className="font-medium text-gray-900 cursor-pointer">
                              Fixed Amount Discount
                            </Label>
                          </div>
                          <p className="text-sm text-gray-600">
                            Fixed amount off the course price
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="discountValue">
                    Discount Value *
                    {couponData.type === 'percentage' ? ' (%)' : ` (${getCurrencySymbol(couponData.currency || defaultCurrency)})`}
                  </Label>
                  <Input
                    id="discountValue"
                    type="number"
                    min="0"
                    max={couponData.type === 'percentage' ? "100" : undefined}
                    placeholder={couponData.type === 'percentage' ? "e.g., 20" : "e.g., 500"}
                    value={couponData.value || ''}
                    onChange={(e) => updateCouponData({ value: parseFloat(e.target.value) || 0 })}
                    className="mt-1"
                  />
                </div>

                {couponData.type === 'fixed' && (
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select 
                      value={couponData.currency || defaultCurrency} 
                      onValueChange={(value) => updateCouponData({ currency: value })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencyOptions.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code}>
                            {currency.symbol} {currency.name} ({currency.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Usage Limits and Expiry */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5" />
                Usage Limits and Expiry
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="usageLimit">Usage Limit</Label>
                  <Input
                    id="usageLimit"
                    type="number"
                    min="1"
                    placeholder="Unlimited (leave empty)"
                    value={couponData.usageLimit || ''}
                    onChange={(e) => updateCouponData({ 
                      usageLimit: e.target.value ? parseInt(e.target.value) : undefined 
                    })}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum number of times this coupon can be used
                  </p>
                </div>

                <div>
                  <Label htmlFor="expiryDate" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Expiry Date
                  </Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={couponData.expiryDate || ''}
                    onChange={(e) => updateCouponData({ expiryDate: e.target.value })}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty for no expiry date
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Applicable Payment Plans */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Applicable Payment Plans</CardTitle>
              <p className="text-sm text-gray-600">Select which payment plans this coupon can be used with</p>
            </CardHeader>
            <CardContent>
              {availablePlans.length > 0 ? (
                <div className="space-y-3">
                  {availablePlans.map((plan) => (
                    <div key={plan.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id={`plan-${plan.id}`}
                          checked={couponData.applicablePlans?.includes(plan.id) || false}
                          onCheckedChange={(checked) => handlePlanToggle(plan.id, !!checked)}
                        />
                        <div>
                          <Label htmlFor={`plan-${plan.id}`} className="font-medium cursor-pointer">
                            {plan.name}
                          </Label>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {plan.type}
                            </Badge>
                            <span className="text-xs text-gray-500">{plan.currency}</span>
                            {plan.isDefault && (
                              <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                                Default
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {couponData.applicablePlans?.length === 0 && (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        Select at least one payment plan for this coupon to be applicable.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              ) : (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    No payment plans available. Create payment plans first to assign coupons to them.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              className="bg-orange-600 hover:bg-orange-700"
              disabled={!couponData.code || !couponData.name || !couponData.value}
            >
              {editingCoupon ? 'Update' : 'Create'} Coupon
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 