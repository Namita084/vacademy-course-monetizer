import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Settings, 
  CreditCard, 
  Users, 
  Building, 
  Globe, 
  Tag, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle,
  Info,
  Percent,
  DollarSign,
  AlertTriangle,
  Gift,
  FileText,
  Video,
  Calendar,
  Star,
  Link,
  TrendingUp
} from 'lucide-react';
import { PaymentPlanCreator } from '@/components/PaymentPlanCreator';
import { CouponCreator } from '@/components/CouponCreator';
import { PaymentPlanList } from '@/components/PaymentPlanList';
import { AdminNavigation } from '@/components/AdminNavigation';
import { InstituteSidebar } from '@/components/InstituteSidebar';
import { UnifiedReferralSettings, UnifiedReferralSettings as UnifiedReferralSettingsType } from '@/components/UnifiedReferralSettings';
import { ReferralProgramsManager } from '@/components/ReferralProgramsManager';
import './InstituteSettings.custom.css'; // (create this file for custom styles)

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

interface ReferralReward {
  id: string;
  type: 'discount_percentage' | 'discount_fixed' | 'bonus_content' | 'free_days';
  value?: number;
  currency?: string;
  contentType?: string;
  contentTitle?: string;
  contentSource?: 'upload' | 'existing';
  contentFile?: File;
  selectedCourseId?: string;
  selectedBatchId?: string;
  shareViaEmail?: boolean;
  shareViaWhatsapp?: boolean;
  description: string;
  isDefault: boolean;
}

interface ReferrerReward {
  id: string;
  type: 'next_payment_discount_percentage' | 'next_payment_discount_fixed' | 'membership_extension_days' | 'points_system' | 'bonus_content';
  value?: number;
  currency?: string;
  pointsPerReferral?: number;
  pointsToReward?: number;
  pointsRewardType?: 'discount_percentage' | 'discount_fixed' | 'membership_days';
  pointsRewardValue?: number;
  contentType?: string;
  contentTitle?: string;
  contentSource?: 'upload' | 'existing';
  contentFile?: File;
  selectedCourseId?: string;
  selectedBatchId?: string;
  shareViaEmail?: boolean;
  shareViaWhatsapp?: boolean;
  description: string;
  isDefault: boolean;
  payoutVestingDays?: number;
}

interface ReferralSettings {
  isEnabled: boolean;
  referralRewards: ReferralReward[];
  referrerRewards: ReferrerReward[];
  referralLinkPrefix: string;
  programTerms: string;
  allowCombineOffers: boolean;
  payoutVestingDays: number;
}

const SIDEBAR_WIDTH = 256; // 64 * 4 (w-64)

const InstituteSettings = () => {
  const [activeTab, setActiveTab] = useState('basic');
  const [showPaymentPlanCreator, setShowPaymentPlanCreator] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PaymentPlan | null>(null);
  const [showCouponCreator, setShowCouponCreator] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<DiscountCoupon | null>(null);
  const [showUnifiedReferralSettings, setShowUnifiedReferralSettings] = useState(false);
  const [editingUnifiedReferralSettings, setEditingUnifiedReferralSettings] = useState<UnifiedReferralSettingsType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [featuresGlobal, setFeaturesGlobal] = useState<string[]>([]);
  
  const [paymentPlans, setPaymentPlans] = useState<PaymentPlan[]>([
    {
      id: '1',
      name: 'Standard Subscription Plan',
      type: 'subscription',
      currency: 'INR',
      isDefault: true,
      config: {
        subscription: {
          monthly: { enabled: true, price: '999' },
          annual: { enabled: true, price: '9999' },
          customIntervals: []
        }
      }
    },
    {
      id: '2',
      name: 'One-Time Payment Plan',
      type: 'upfront',
      currency: 'INR',
      isDefault: false,
      config: {
        upfront: {
          fullPrice: '15000',
          installmentPlans: []
        }
      }
    },
    {
      id: '3',
      name: 'Free Trial Plan',
      type: 'free',
      currency: 'INR',
      isDefault: false,
      config: {
        free: {
          validityDays: 7
        }
      }
    },
    {
      id: '4',
      name: 'Optional Donation Plan',
      type: 'donation',
      currency: 'INR',
      isDefault: false,
      config: {
        donation: {
          suggestedAmounts: '100, 500, 1000',
          allowCustomAmount: true,
          minimumAmount: '0'
        }
      }
    }
  ]);

  const [discountCoupons, setDiscountCoupons] = useState<DiscountCoupon[]>([
    {
      id: '1',
      code: 'WELCOME20',
      name: 'Welcome Discount',
      type: 'percentage',
      value: 20,
      isActive: true,
      usageLimit: 100,
      usedCount: 15,
      expiryDate: '2024-12-31',
      applicablePlans: ['1', '2']
    },
    {
      id: '2',
      code: 'STUDENT500',
      name: 'Student Discount',
      type: 'fixed',
      value: 500,
      currency: 'INR',
      isActive: true,
      usageLimit: 50,
      usedCount: 8,
      expiryDate: '2024-06-30',
      applicablePlans: ['1']
    }
  ]);

  const [instituteSettings, setInstituteSettings] = useState({
    name: 'Vidyalankar Institute',
    country: 'India',
    defaultCurrency: 'INR',
    allowCouponCodes: true,
    autoApproveEnrollments: true,
    emailNotifications: true
  });

  const [referralPrograms, setReferralPrograms] = useState<UnifiedReferralSettingsType[]>([
    {
      id: '1',
      label: 'Welcome Program',
      isDefault: true,
      allowCombineOffers: true,
      payoutVestingDays: 7,
      refereeReward: {
        type: 'discount_percentage',
        value: 10,
        currency: 'INR',
        description: '10% discount on course enrollment',
        delivery: { email: true, whatsapp: false }
      },
      referrerRewards: [
        {
          id: '1',
          tierName: 'First Referral',
          referralCount: 1,
          reward: {
            type: 'bonus_content',
            content: {
              contentType: 'pdf',
              content: {
                type: 'upload',
                title: 'Study Guide',
                delivery: { email: true, whatsapp: false }
              }
            },
            description: 'Free study guide for your first referral'
          }
        },
        {
          id: '2',
          tierName: '10 Referrals',
          referralCount: 10,
          reward: {
            type: 'free_days',
            value: 30,
            description: '30 days added to your membership'
          }
        }
      ]
    },
    {
      id: '2',
      label: 'Premium Program',
      isDefault: false,
      allowCombineOffers: false,
      payoutVestingDays: 14,
      refereeReward: {
        type: 'free_course',
        courseId: '1',
        sessionId: '1',
        levelId: '1',
        description: 'Free course access for new users',
        delivery: { email: true, whatsapp: true }
      },
      referrerRewards: [
        {
          id: '1',
          tierName: 'Points Earner',
          referralCount: 1,
          reward: {
            type: 'points_system',
            pointsPerReferral: 100,
            pointsToReward: 1000,
            pointsRewardType: 'discount_percentage',
            pointsRewardValue: 25,
            description: 'Earn 100 points per referral. Get 25% discount for 1000 points.'
          }
        },
        {
          id: '2',
          tierName: 'Premium Tier',
          referralCount: 15,
          reward: {
            type: 'free_days',
            value: 60,
            description: '60 days premium membership extension'
          }
        }
      ]
    }
  ]);

  const currencyOptions = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' }
  ];

  const getCurrencySymbol = (currencyCode: string) => {
    const currency = currencyOptions.find(c => c.code === currencyCode);
    return currency?.symbol || '$';
  };

  // Error handling for component operations
  const handleError = (error: any, operation: string) => {
    console.error(`Error in ${operation}:`, error);
    setError(`Failed to ${operation}. Please try again.`);
    setTimeout(() => setError(null), 5000);
  };

  const handleSetDefaultPlan = (planId: string) => {
    try {
      setPaymentPlans(plans => 
        plans.map(plan => ({
          ...plan,
          isDefault: plan.id === planId
        }))
      );
    } catch (error) {
      handleError(error, 'set default plan');
    }
  };

  const handleDeletePlan = (planId: string) => {
    try {
      setPaymentPlans(plans => plans.filter(plan => plan.id !== planId));
    } catch (error) {
      handleError(error, 'delete plan');
    }
  };

  const handleSavePaymentPlan = (plan: PaymentPlan) => {
    try {
      if (editingPlan) {
        setPaymentPlans(plans => 
          plans.map(p => p.id === editingPlan.id ? plan : p)
        );
      } else {
        setPaymentPlans(plans => [...plans, plan]);
      }
      setEditingPlan(null);
    } catch (error) {
      handleError(error, 'save payment plan');
    }
  };

  const handleEditPlan = (plan: PaymentPlan) => {
    try {
      setEditingPlan(plan);
      setShowPaymentPlanCreator(true);
    } catch (error) {
      handleError(error, 'edit plan');
    }
  };

  const handleToggleCoupon = (couponId: string) => {
    try {
      setDiscountCoupons(coupons =>
        coupons.map(coupon =>
          coupon.id === couponId
            ? { ...coupon, isActive: !coupon.isActive }
            : coupon
        )
      );
    } catch (error) {
      handleError(error, 'toggle coupon');
    }
  };

  const handleDeleteCoupon = (couponId: string) => {
    try {
      setDiscountCoupons(coupons => coupons.filter(coupon => coupon.id !== couponId));
    } catch (error) {
      handleError(error, 'delete coupon');
    }
  };

  const handleSaveCoupon = (coupon: DiscountCoupon) => {
    try {
      if (editingCoupon) {
        setDiscountCoupons(coupons => 
          coupons.map(c => c.id === editingCoupon.id ? coupon : c)
        );
      } else {
        setDiscountCoupons(coupons => [...coupons, coupon]);
      }
      setEditingCoupon(null);
    } catch (error) {
      handleError(error, 'save coupon');
    }
  };

  const handleEditCoupon = (coupon: DiscountCoupon) => {
    try {
      setEditingCoupon(coupon);
      setShowCouponCreator(true);
    } catch (error) {
      handleError(error, 'edit coupon');
    }
  };

  // Referral reward management functions
  const handleCreateProgram = () => {
    setEditingUnifiedReferralSettings(null);
    setShowUnifiedReferralSettings(true);
  };

  const handleEditProgram = (program: UnifiedReferralSettingsType) => {
    setEditingUnifiedReferralSettings(program);
    setShowUnifiedReferralSettings(true);
  };

  const handleSaveProgram = (settings: UnifiedReferralSettingsType) => {
    try {
      if (editingUnifiedReferralSettings) {
        // Update existing program
        setReferralPrograms(programs => 
          programs.map(p => p.id === editingUnifiedReferralSettings.id ? settings : p)
        );
      } else {
        // Add new program
        setReferralPrograms(programs => [...programs, settings]);
      }
      setEditingUnifiedReferralSettings(null);
      setShowUnifiedReferralSettings(false);
    } catch (error) {
      handleError(error, 'save referral program');
    }
  };

  const handleDeleteProgram = (programId: string) => {
    try {
      setReferralPrograms(programs => programs.filter(p => p.id !== programId));
    } catch (error) {
      handleError(error, 'delete referral program');
    }
  };

  const handleSetDefaultProgram = (programId: string) => {
    try {
      setReferralPrograms(programs => 
        programs.map(p => ({ ...p, isDefault: p.id === programId }))
      );
    } catch (error) {
      handleError(error, 'set default referral program');
    }
  };

  const handleDuplicateProgram = (program: UnifiedReferralSettingsType) => {
    try {
      const duplicatedProgram: UnifiedReferralSettingsType = {
        ...program,
        id: Date.now().toString(),
        label: `${program.label} (Copy)`,
        isDefault: false
      };
      setReferralPrograms(programs => [...programs, duplicatedProgram]);
    } catch (error) {
      handleError(error, 'duplicate referral program');
    }
  };

  const getPaymentPlanTypeLabel = (type: string) => {
    switch (type) {
      case 'subscription': return 'Subscription';
      case 'upfront': return 'One-Time';
      case 'invoice': return 'Pay Bill (Post-paid)';
      case 'donation': return 'Optional Donation';
      case 'free': return 'Free';
      default: return type;
    }
  };

  const getReferralRewardTypeLabel = (type: string) => {
    switch(type) {
      case 'discount_percentage': return 'Percentage Discount';
      case 'discount_fixed': return 'Fixed Discount';
      case 'bonus_content': return 'Bonus Content';
      case 'free_days': return 'Free Membership Days';
      default: return type;
    }
  };

  const getReferrerRewardTypeLabel = (type: string) => {
    switch(type) {
      case 'next_payment_discount_percentage': return 'Next Payment % Discount';
      case 'next_payment_discount_fixed': return 'Next Payment Fixed Discount';
      case 'membership_extension_days': return 'Membership Extension';
      case 'points_system': return 'Points System';
      case 'bonus_content': return 'Bonus Content';
      default: return type;
    }
  };

  const getReferralRewardIcon = (type: string) => {
    switch(type) {
      case 'discount_percentage': return <Percent className="w-4 h-4" />;
      case 'discount_fixed': return <DollarSign className="w-4 h-4" />;
      case 'bonus_content': return <Gift className="w-4 h-4" />;
      case 'free_days': return <Calendar className="w-4 h-4" />;
      default: return <Gift className="w-4 h-4" />;
    }
  };

  const getReferrerRewardIcon = (type: string) => {
    switch(type) {
      case 'next_payment_discount_percentage': return <Percent className="w-4 h-4" />;
      case 'next_payment_discount_fixed': return <DollarSign className="w-4 h-4" />;
      case 'membership_extension_days': return <Calendar className="w-4 h-4" />;
      case 'points_system': return <Star className="w-4 h-4" />;
      case 'bonus_content': return <Gift className="w-4 h-4" />;
      default: return <TrendingUp className="w-4 h-4" />;
    }
  };

  // Helper functions to separate free and paid plans
  const getFreePlans = () => {
    return paymentPlans.filter(plan => plan.type === 'free' || plan.type === 'donation');
  };

  const getPaidPlans = () => {
    return paymentPlans.filter(plan => plan.type !== 'free' && plan.type !== 'donation');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex" style={{ fontFamily: 'Open Sans, sans-serif' }}>
      <InstituteSidebar />
      <div className="flex-1 flex flex-col" style={{ marginLeft: SIDEBAR_WIDTH }}>
        <AdminNavigation />
        <main className="flex-1 w-full py-8 px-4 sm:px-6 lg:px-8">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Institute Settings</h1>
            <p className="text-gray-600 mt-2">Manage your institute's configuration and preferences</p>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="basic" className="flex items-center gap-2">Basic Details</TabsTrigger>
              <TabsTrigger value="payment" className="flex items-center gap-2">Payment Settings</TabsTrigger>
              <TabsTrigger value="discount" className="flex items-center gap-2">Discount Settings</TabsTrigger>
              <TabsTrigger value="referral" className="flex items-center gap-2">Referral Settings</TabsTrigger>
            </TabsList>

            {/* Basic Details Tab */}
            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    General Institute Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="instituteName">Institute Name</Label>
                      <Input
                        id="instituteName"
                        value={instituteSettings.name}
                        onChange={(e) => setInstituteSettings({...instituteSettings, name: e.target.value})}
                        placeholder="Enter institute name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Select 
                        value={instituteSettings.country}
                        onValueChange={(value) => setInstituteSettings({...instituteSettings, country: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="India">India</SelectItem>
                          <SelectItem value="United States">United States</SelectItem>
                          <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                          <SelectItem value="Canada">Canada</SelectItem>
                          <SelectItem value="Australia">Australia</SelectItem>
                          <SelectItem value="Germany">Germany</SelectItem>
                          <SelectItem value="France">France</SelectItem>
                          <SelectItem value="Japan">Japan</SelectItem>
                          <SelectItem value="Singapore">Singapore</SelectItem>
                          <SelectItem value="UAE">UAE</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Enrollment Settings</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">Auto-approve Enrollments</Label>
                          <p className="text-xs text-gray-600">Automatically approve student enrollments without manual review</p>
                        </div>
                        <Switch 
                          checked={instituteSettings.autoApproveEnrollments}
                          onCheckedChange={(checked) => 
                            setInstituteSettings({...instituteSettings, autoApproveEnrollments: checked})
                          }
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">Email Notifications</Label>
                          <p className="text-xs text-gray-600">Send email notifications for important events</p>
                        </div>
                        <Switch 
                          checked={instituteSettings.emailNotifications}
                          onCheckedChange={(checked) => 
                            setInstituteSettings({...instituteSettings, emailNotifications: checked})
                          }
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payment Settings Tab */}
            <TabsContent value="payment" className="space-y-6">
              {/* Payment Settings Configuration */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Payment Configuration
                    </CardTitle>
                    <Button onClick={() => setShowPaymentPlanCreator(true)} className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Add Payment Plan
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Currency and General Payment Settings */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Default Currency</Label>
                      <Select 
                        value={instituteSettings.defaultCurrency}
                        onValueChange={(value) => setInstituteSettings({...instituteSettings, defaultCurrency: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          {currencyOptions.map(currency => (
                            <SelectItem key={currency.code} value={currency.code}>
                              {currency.symbol} {currency.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Allow Coupon Codes</Label>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          checked={instituteSettings.allowCouponCodes}
                          onCheckedChange={(checked) => 
                            setInstituteSettings({...instituteSettings, allowCouponCodes: checked})
                          }
                        />
                        <span className="text-sm text-gray-600">
                          Enable discount coupons for courses
                        </span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Free Plans Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-green-600" />
                        Free Plans
                      </h3>
                      <Badge variant="outline" className="text-green-600 border-green-200">
                        {getFreePlans().length} plans
                      </Badge>
                    </div>
                    <PaymentPlanList 
                      plans={getFreePlans()} 
                      onEdit={handleEditPlan}
                      onDelete={handleDeletePlan}
                      onSetDefault={handleSetDefaultPlan}
                    />
                  </div>

                  <Separator />

                  {/* Paid Plans Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                        Paid Plans
                      </h3>
                      <Badge variant="outline" className="text-blue-600 border-blue-200">
                        {getPaidPlans().length} plans
                      </Badge>
                    </div>
                    <PaymentPlanList 
                      plans={getPaidPlans()} 
                      onEdit={handleEditPlan}
                      onDelete={handleDeletePlan}
                      onSetDefault={handleSetDefaultPlan}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Discount Settings Tab */}
            <TabsContent value="discount" className="space-y-6">
              {/* Coupon Management Section */}
              {instituteSettings.allowCouponCodes && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Tag className="w-5 h-5" />
                        Discount Coupons
                      </CardTitle>
                      <Button onClick={() => setShowCouponCreator(true)} className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Add Coupon
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {discountCoupons.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <Tag className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                          <p>No discount coupons created yet</p>
                          <p className="text-sm">Create your first coupon to offer discounts to students</p>
                        </div>
                      ) : (
                        discountCoupons.map((coupon, index) => (
                          <div key={coupon.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                  <Badge 
                                    variant={coupon.isActive ? "default" : "secondary"}
                                    className={coupon.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}
                                  >
                                    {coupon.isActive ? "Active" : "Inactive"}
                                  </Badge>
                                  <span className="font-mono font-medium text-lg">{coupon.code}</span>
                                </div>
                                <span className="text-sm text-gray-500">•</span>
                                <span className="font-medium">{coupon.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditCoupon(coupon)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleToggleCoupon(coupon.id)}
                                >
                                  {coupon.isActive ? "Deactivate" : "Activate"}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteCoupon(coupon.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Type:</span>
                                <div className="flex items-center gap-1">
                                  {coupon.type === 'percentage' ? (
                                    <Percent className="w-3 h-3" />
                                  ) : (
                                    <DollarSign className="w-3 h-3" />
                                  )}
                                  <span className="font-medium">
                                    {coupon.type === 'percentage' ? `${coupon.value}%` : `${getCurrencySymbol(coupon.currency || 'INR')}${coupon.value}`}
                                  </span>
                                </div>
                              </div>
                              
                              <div>
                                <span className="text-gray-500">Usage:</span>
                                <div className="font-medium">
                                  {coupon.usedCount}
                                  {coupon.usageLimit && ` / ${coupon.usageLimit}`}
                                </div>
                              </div>
                              
                              <div>
                                <span className="text-gray-500">Expires:</span>
                                <div className="font-medium">
                                  {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : 'No expiry'}
                                </div>
                              </div>
                              
                              <div>
                                <span className="text-gray-500">Applicable Plans:</span>
                                <div className="font-medium">
                                  {coupon.applicablePlans.length} plan{coupon.applicablePlans.length !== 1 ? 's' : ''}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Referral Settings Tab */}
            <TabsContent value="referral" className="space-y-6">
              <ReferralProgramsManager
                programs={referralPrograms}
                onCreateProgram={handleCreateProgram}
                onEditProgram={handleEditProgram}
                onDeleteProgram={handleDeleteProgram}
                onSetDefaultProgram={handleSetDefaultProgram}
                onDuplicateProgram={handleDuplicateProgram}
              />
            </TabsContent>
          </Tabs>

          {/* Payment Plan Creator Dialog */}
          <PaymentPlanCreator
            isOpen={showPaymentPlanCreator}
            onClose={() => setShowPaymentPlanCreator(false)}
            onSave={handleSavePaymentPlan}
            editingPlan={editingPlan}
            availableCoupons={discountCoupons}
            featuresGlobal={featuresGlobal}
            setFeaturesGlobal={setFeaturesGlobal}
            allPlans={paymentPlans}
          />

          {/* Coupon Creator Dialog */}
          <CouponCreator
            isOpen={showCouponCreator}
            onClose={() => {
              setShowCouponCreator(false);
              setEditingCoupon(null);
            }}
            onSave={handleSaveCoupon}
            editingCoupon={editingCoupon}
            availablePlans={paymentPlans}
          />

          {/* Unified Referral Settings Dialog */}
          <UnifiedReferralSettings
            isOpen={showUnifiedReferralSettings}
            onClose={() => {
              setShowUnifiedReferralSettings(false);
              setEditingUnifiedReferralSettings(null);
            }}
            onSave={handleSaveProgram}
            editingSettings={editingUnifiedReferralSettings}
          />
        </main>
      </div>
    </div>
  );
};

export default InstituteSettings;