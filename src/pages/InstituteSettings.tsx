import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  TrendingUp,
  Lock,
  Folder,
} from "lucide-react";
import { PaymentPlanCreator } from "@/components/PaymentPlanCreator";
import { CouponCreator } from "@/components/CouponCreator";
import { PaymentPlanList } from "@/components/PaymentPlanList";
import { AdminNavigation } from "@/components/AdminNavigation";
import { InstituteSidebar } from "@/components/InstituteSidebar";
import {
  UnifiedReferralSettings,
  UnifiedReferralSettings as UnifiedReferralSettingsType,
} from "@/components/UnifiedReferralSettings";
import { ReferralProgramsManager } from "@/components/ReferralProgramsManager";
import "./InstituteSettings.custom.css"; // (create this file for custom styles)
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PaymentPlan {
  id: string;
  name: string;
  type: "subscription" | "upfront" | "invoice" | "donation" | "free";
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
  type: "percentage" | "fixed";
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
  type:
    | "discount_percentage"
    | "discount_fixed"
    | "bonus_content"
    | "free_days";
  value?: number;
  currency?: string;
  contentType?: string;
  contentTitle?: string;
  contentSource?: "upload" | "existing";
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
  type:
    | "next_payment_discount_percentage"
    | "next_payment_discount_fixed"
    | "membership_extension_days"
    | "points_system"
    | "bonus_content";
  value?: number;
  currency?: string;
  pointsPerReferral?: number;
  pointsToReward?: number;
  pointsRewardType?:
    | "discount_percentage"
    | "discount_fixed"
    | "membership_days";
  pointsRewardValue?: number;
  contentType?: string;
  contentTitle?: string;
  contentSource?: "upload" | "existing";
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
  const [activeTab, setActiveTab] = useState("basic");
  const [showPaymentPlanCreator, setShowPaymentPlanCreator] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PaymentPlan | null>(null);
  const [showCouponCreator, setShowCouponCreator] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<DiscountCoupon | null>(
    null
  );
  const [showUnifiedReferralSettings, setShowUnifiedReferralSettings] =
    useState(false);
  const [editingUnifiedReferralSettings, setEditingUnifiedReferralSettings] =
    useState<UnifiedReferralSettingsType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [featuresGlobal, setFeaturesGlobal] = useState<string[]>([]);
  const [defaultStructure, setDefaultStructure] = useState("2");
  const [enableSessions, setEnableSessions] = useState(true);
  const [enableLevels, setEnableLevels] = useState(true);
  const [showAddToCatalogue, setShowAddToCatalogue] = useState("yes"); // 'yes' or 'no'
  const [catalogueDefaultState, setCatalogueDefaultState] = useState("checked"); // 'checked' or 'unchecked'
  const [catalogueNoOption, setCatalogueNoOption] = useState("auto-add"); // 'auto-add' or 'no-auto-add'
  const [courseViewPreference, setCourseViewPreference] = useState("outline"); // 'outline' or 'structure'
  const [outlineExpansion, setOutlineExpansion] = useState("expanded"); // 'expanded' or 'collapsed'
  const [courseInfoFields, setCourseInfoFields] = useState({
    description: true,
    tags: true,
    outcomes: true,
    about: true,
    audience: true,
    previewImage: true,
    bannerImage: true,
    media: true,
  });
  const [showStructureToInstructors, setShowStructureToInstructors] = useState('yes'); // 'yes' or 'no'
  const [allowLearnerCourseCreation, setAllowLearnerCourseCreation] = useState(false);

  const [paymentPlans, setPaymentPlans] = useState<PaymentPlan[]>([
    {
      id: "1",
      name: "Standard Subscription Plan",
      type: "subscription",
      currency: "INR",
      isDefault: true,
      config: {
        subscription: {
          monthly: { enabled: true, price: "999" },
          annual: { enabled: true, price: "9999" },
          customIntervals: [],
        },
      },
    },
    {
      id: "2",
      name: "One-Time Payment Plan",
      type: "upfront",
      currency: "INR",
      isDefault: false,
      config: {
        upfront: {
          fullPrice: "15000",
          installmentPlans: [],
        },
      },
    },
    {
      id: "3",
      name: "Free Trial Plan",
      type: "free",
      currency: "INR",
      isDefault: false,
      config: {
        free: {
          validityDays: 7,
        },
      },
    },
    {
      id: "4",
      name: "Optional Donation Plan",
      type: "donation",
      currency: "INR",
      isDefault: false,
      config: {
        donation: {
          suggestedAmounts: "100, 500, 1000",
          allowCustomAmount: true,
          minimumAmount: "0",
        },
      },
    },
  ]);

  const [discountCoupons, setDiscountCoupons] = useState<DiscountCoupon[]>([
    {
      id: "1",
      code: "WELCOME20",
      name: "Welcome Discount",
      type: "percentage",
      value: 20,
      isActive: true,
      usageLimit: 100,
      usedCount: 15,
      expiryDate: "2024-12-31",
      applicablePlans: ["1", "2"],
    },
    {
      id: "2",
      code: "STUDENT500",
      name: "Student Discount",
      type: "fixed",
      value: 500,
      currency: "INR",
      isActive: true,
      usageLimit: 50,
      usedCount: 8,
      expiryDate: "2024-06-30",
      applicablePlans: ["1"],
    },
  ]);

  const [instituteSettings, setInstituteSettings] = useState({
    name: "Vidyalankar Institute",
    country: "India",
    defaultCurrency: "INR",
    allowCouponCodes: true,
    autoApproveEnrollments: true,
    emailNotifications: true,
  });

  const [referralPrograms, setReferralPrograms] = useState<
    UnifiedReferralSettingsType[]
  >([
    {
      id: "1",
      label: "Welcome Program",
      isDefault: true,
      allowCombineOffers: true,
      payoutVestingDays: 7,
      refereeReward: {
        type: "discount_percentage",
        value: 10,
        currency: "INR",
        description: "10% discount on course enrollment",
        delivery: { email: true, whatsapp: false },
      },
      referrerRewards: [
        {
          id: "1",
          tierName: "First Referral",
          referralCount: 1,
          reward: {
            type: "bonus_content",
            content: {
              contentType: "pdf",
              content: {
                type: "upload",
                title: "Study Guide",
                delivery: { email: true, whatsapp: false },
              },
            },
            description: "Free study guide for your first referral",
          },
        },
        {
          id: "2",
          tierName: "10 Referrals",
          referralCount: 10,
          reward: {
            type: "free_days",
            value: 30,
            description: "30 days added to your membership",
          },
        },
      ],
    },
    {
      id: "2",
      label: "Premium Program",
      isDefault: false,
      allowCombineOffers: false,
      payoutVestingDays: 14,
      refereeReward: {
        type: "free_course",
        courseId: "1",
        sessionId: "1",
        levelId: "1",
        description: "Free course access for new users",
        delivery: { email: true, whatsapp: true },
      },
      referrerRewards: [
        {
          id: "1",
          tierName: "Points Earner",
          referralCount: 1,
          reward: {
            type: "points_system",
            pointsPerReferral: 100,
            pointsToReward: 1000,
            pointsRewardType: "discount_percentage",
            pointsRewardValue: 25,
            description:
              "Earn 100 points per referral. Get 25% discount for 1000 points.",
          },
        },
        {
          id: "2",
          tierName: "Premium Tier",
          referralCount: 15,
          reward: {
            type: "free_days",
            value: 60,
            description: "60 days premium membership extension",
          },
        },
      ],
    },
  ]);

  const currencyOptions = [
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "EUR", name: "Euro", symbol: "€" },
    { code: "GBP", name: "British Pound", symbol: "£" },
    { code: "INR", name: "Indian Rupee", symbol: "₹" },
    { code: "AUD", name: "Australian Dollar", symbol: "A$" },
    { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  ];

  const getCurrencySymbol = (currencyCode: string) => {
    const currency = currencyOptions.find((c) => c.code === currencyCode);
    return currency?.symbol || "$";
  };

  // Error handling for component operations
  const handleError = (error: any, operation: string) => {
    console.error(`Error in ${operation}:`, error);
    setError(`Failed to ${operation}. Please try again.`);
    setTimeout(() => setError(null), 5000);
  };

  const handleSetDefaultPlan = (planId: string) => {
    try {
      setPaymentPlans((plans) =>
        plans.map((plan) => ({
          ...plan,
          isDefault: plan.id === planId,
        }))
      );
    } catch (error) {
      handleError(error, "set default plan");
    }
  };

  const handleDeletePlan = (planId: string) => {
    try {
      setPaymentPlans((plans) => plans.filter((plan) => plan.id !== planId));
    } catch (error) {
      handleError(error, "delete plan");
    }
  };

  const handleSavePaymentPlan = (plan: PaymentPlan) => {
    try {
      if (editingPlan) {
        setPaymentPlans((plans) =>
          plans.map((p) => (p.id === editingPlan.id ? plan : p))
        );
      } else {
        setPaymentPlans((plans) => [...plans, plan]);
      }
      setEditingPlan(null);
    } catch (error) {
      handleError(error, "save payment plan");
    }
  };

  const handleEditPlan = (plan: PaymentPlan) => {
    try {
      setEditingPlan(plan);
      setShowPaymentPlanCreator(true);
    } catch (error) {
      handleError(error, "edit plan");
    }
  };

  const handleToggleCoupon = (couponId: string) => {
    try {
      setDiscountCoupons((coupons) =>
        coupons.map((coupon) =>
          coupon.id === couponId
            ? { ...coupon, isActive: !coupon.isActive }
            : coupon
        )
      );
    } catch (error) {
      handleError(error, "toggle coupon");
    }
  };

  const handleDeleteCoupon = (couponId: string) => {
    try {
      setDiscountCoupons((coupons) =>
        coupons.filter((coupon) => coupon.id !== couponId)
      );
    } catch (error) {
      handleError(error, "delete coupon");
    }
  };

  const handleSaveCoupon = (coupon: DiscountCoupon) => {
    try {
      if (editingCoupon) {
        setDiscountCoupons((coupons) =>
          coupons.map((c) => (c.id === editingCoupon.id ? coupon : c))
        );
      } else {
        setDiscountCoupons((coupons) => [...coupons, coupon]);
      }
      setEditingCoupon(null);
    } catch (error) {
      handleError(error, "save coupon");
    }
  };

  const handleEditCoupon = (coupon: DiscountCoupon) => {
    try {
      setEditingCoupon(coupon);
      setShowCouponCreator(true);
    } catch (error) {
      handleError(error, "edit coupon");
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
        setReferralPrograms((programs) =>
          programs.map((p) =>
            p.id === editingUnifiedReferralSettings.id ? settings : p
          )
        );
      } else {
        // Add new program
        setReferralPrograms((programs) => [...programs, settings]);
      }
      setEditingUnifiedReferralSettings(null);
      setShowUnifiedReferralSettings(false);
    } catch (error) {
      handleError(error, "save referral program");
    }
  };

  const handleDeleteProgram = (programId: string) => {
    try {
      setReferralPrograms((programs) =>
        programs.filter((p) => p.id !== programId)
      );
    } catch (error) {
      handleError(error, "delete referral program");
    }
  };

  const handleSetDefaultProgram = (programId: string) => {
    try {
      setReferralPrograms((programs) =>
        programs.map((p) => ({ ...p, isDefault: p.id === programId }))
      );
    } catch (error) {
      handleError(error, "set default referral program");
    }
  };

  const handleDuplicateProgram = (program: UnifiedReferralSettingsType) => {
    try {
      const duplicatedProgram: UnifiedReferralSettingsType = {
        ...program,
        id: Date.now().toString(),
        label: `${program.label} (Copy)`,
        isDefault: false,
      };
      setReferralPrograms((programs) => [...programs, duplicatedProgram]);
    } catch (error) {
      handleError(error, "duplicate referral program");
    }
  };

  const getPaymentPlanTypeLabel = (type: string) => {
    switch (type) {
      case "subscription":
        return "Subscription";
      case "upfront":
        return "One-Time";
      case "invoice":
        return "Pay Bill (Post-paid)";
      case "donation":
        return "Optional Donation";
      case "free":
        return "Free";
      default:
        return type;
    }
  };

  const getReferralRewardTypeLabel = (type: string) => {
    switch (type) {
      case "discount_percentage":
        return "Percentage Discount";
      case "discount_fixed":
        return "Fixed Discount";
      case "bonus_content":
        return "Bonus Content";
      case "free_days":
        return "Free Membership Days";
      default:
        return type;
    }
  };

  const getReferrerRewardTypeLabel = (type: string) => {
    switch (type) {
      case "next_payment_discount_percentage":
        return "Next Payment % Discount";
      case "next_payment_discount_fixed":
        return "Next Payment Fixed Discount";
      case "membership_extension_days":
        return "Membership Extension";
      case "points_system":
        return "Points System";
      case "bonus_content":
        return "Bonus Content";
      default:
        return type;
    }
  };

  const getReferralRewardIcon = (type: string) => {
    switch (type) {
      case "discount_percentage":
        return <Percent className="w-4 h-4" />;
      case "discount_fixed":
        return <DollarSign className="w-4 h-4" />;
      case "bonus_content":
        return <Gift className="w-4 h-4" />;
      case "free_days":
        return <Calendar className="w-4 h-4" />;
      default:
        return <Gift className="w-4 h-4" />;
    }
  };

  const getReferrerRewardIcon = (type: string) => {
    switch (type) {
      case "next_payment_discount_percentage":
        return <Percent className="w-4 h-4" />;
      case "next_payment_discount_fixed":
        return <DollarSign className="w-4 h-4" />;
      case "membership_extension_days":
        return <Calendar className="w-4 h-4" />;
      case "points_system":
        return <Star className="w-4 h-4" />;
      case "bonus_content":
        return <Gift className="w-4 h-4" />;
      default:
        return <TrendingUp className="w-4 h-4" />;
    }
  };

  // Helper functions to separate free and paid plans
  const getFreePlans = () => {
    return paymentPlans.filter(
      (plan) => plan.type === "free" || plan.type === "donation"
    );
  };

  const getPaidPlans = () => {
    return paymentPlans.filter(
      (plan) => plan.type !== "free" && plan.type !== "donation"
    );
  };

  // Handler to ensure levels is off if sessions is off
  const handleSessionsChange = (checked: boolean) => {
    setEnableSessions(checked);
    if (!checked) setEnableLevels(false);
  };

  return (
    <div
      className="min-h-screen bg-gray-50 flex"
      style={{ fontFamily: "Open Sans, sans-serif" }}
    >
      <InstituteSidebar />
      <div
        className="flex-1 flex flex-col"
        style={{ marginLeft: SIDEBAR_WIDTH }}
      >
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
            <h1 className="text-3xl font-bold text-gray-900">
              Institute Settings
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your institute's configuration and preferences
            </p>
          </div>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="basic" className="flex items-center gap-2">
                Basic Details
              </TabsTrigger>
              <TabsTrigger value="course" className="flex items-center gap-2">
                Course Settings
              </TabsTrigger>
              <TabsTrigger value="payment" className="flex items-center gap-2">
                Payment Settings
              </TabsTrigger>
              <TabsTrigger value="discount" className="flex items-center gap-2">
                Discount Settings
              </TabsTrigger>
              <TabsTrigger value="referral" className="flex items-center gap-2">
                Referral Settings
              </TabsTrigger>
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
                        onChange={(e) =>
                          setInstituteSettings({
                            ...instituteSettings,
                            name: e.target.value,
                          })
                        }
                        placeholder="Enter institute name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Select
                        value={instituteSettings.country}
                        onValueChange={(value) =>
                          setInstituteSettings({
                            ...instituteSettings,
                            country: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="India">India</SelectItem>
                          <SelectItem value="United States">
                            United States
                          </SelectItem>
                          <SelectItem value="United Kingdom">
                            United Kingdom
                          </SelectItem>
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
                    <h4 className="font-medium text-gray-900">
                      Enrollment Settings
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">
                            Auto-approve Enrollments
                          </Label>
                          <p className="text-xs text-gray-600">
                            Automatically approve student enrollments without
                            manual review
                          </p>
                        </div>
                        <Switch
                          checked={instituteSettings.autoApproveEnrollments}
                          onCheckedChange={(checked) =>
                            setInstituteSettings({
                              ...instituteSettings,
                              autoApproveEnrollments: checked,
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">
                            Email Notifications
                          </Label>
                          <p className="text-xs text-gray-600">
                            Send email notifications for important events
                          </p>
                        </div>
                        <Switch
                          checked={instituteSettings.emailNotifications}
                          onCheckedChange={(checked) =>
                            setInstituteSettings({
                              ...instituteSettings,
                              emailNotifications: checked,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Course Settings Tab */}
            <TabsContent value="course" className="space-y-8">
              {/* Course Creation Section */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Course Creation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Step 1: Course Information Fields */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      Step 1: Course Information Fields
                    </h3>
                    <div className="space-y-4">
                      {/* Course Name (locked) */}
                      <div className="flex items-center gap-3 opacity-60 cursor-not-allowed">
                        <Lock className="w-5 h-5 text-gray-400" />
                        <Label className="font-medium">Course Name</Label>
                        <span className="ml-2 text-xs text-gray-500">
                          This field is mandatory and cannot be disabled.
                        </span>
                      </div>
                      {/* Other fields as checkboxes */}
                      {[
                        {
                          key: "description",
                          label: "Course Description",
                          sub: "A detailed summary that helps students understand what the course covers, its scope, and its unique value.",
                        },
                        {
                          key: "tags",
                          label: "Popular Topics Tags",
                          sub: "Add relevant tags to help categorize, filter, and improve the discoverability of your course in search and catalogue.",
                        },
                        {
                          key: "outcomes",
                          label: "What Learners Will Gain",
                          sub: "Clearly list the skills, knowledge, or outcomes students will acquire by completing this course.",
                        },
                        {
                          key: "about",
                          label: "About the Course",
                          sub: "Provide in-depth information, background, and context about the course content and structure.",
                        },
                        {
                          key: "audience",
                          label: "Who Should Join",
                          sub: "Describe the ideal learners, prerequisites, or target audience for this course to help students self-select.",
                        },
                        {
                          key: "previewImage",
                          label: "Course Preview Image",
                          sub: "This is the main image shown in the course catalogue and search results. Use a clear, attractive image that represents your course.",
                        },
                        {
                          key: "bannerImage",
                          label: "Course Banner Image",
                          sub: "A large banner image displayed at the top of the course page. Recommended for branding and visual appeal.",
                        },
                        {
                          key: "media",
                          label: "Course Media (Image or Video)",
                          sub: "Add a video or image to visually showcase the course, such as a trailer, introduction, or highlight reel.",
                        },
                      ].map((field) => (
                        <div key={field.key} className="flex items-start gap-3">
                          <Checkbox
                            id={`show-${field.key}`}
                            className="mt-0.5"
                            checked={courseInfoFields[field.key]}
                            onCheckedChange={(checked) => setCourseInfoFields((prev) => ({ ...prev, [field.key]: checked }))}
                          />
                          <div>
                            <Label
                              htmlFor={`show-${field.key}`}
                              className="font-medium"
                            >
                              {field.label}
                            </Label>
                            <div className="text-xs text-gray-500">
                              {field.sub}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Step 2: Course Structure Defaults */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      Step 2: Course Structure Defaults
                    </h3>
                    {/* Course Structure Card Grid */}
                    <RadioGroup
                      value={defaultStructure}
                      onValueChange={setDefaultStructure}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-6"
                    >
                      {[
                        {
                          value: "2",
                          title: "2-Level Course Structure",
                          subtitle: "Introduction to Web Development (Level 2)",
                          items: [
                            {
                              icon: <Video className="w-4 h-4 text-blue-500" />,
                              text: "Welcome Video: Getting Started with HTML, CSS, and JavaScript Fundamentals",
                            },
                            {
                              icon: (
                                <FileText className="w-4 h-4 text-red-500" />
                              ),
                              text: "Course Overview: Syllabus and Learning Objectives",
                            },
                            {
                              icon: (
                                <FileText className="w-4 h-4 text-green-500" />
                              ),
                              text: "Setting up your development environment: Tools and Configurations",
                            },
                          ],
                        },
                        {
                          value: "3",
                          title: "3-Level Course Structure",
                          subtitle: "Frontend Fundamentals (Level 3)",
                          items: [
                            {
                              icon: (
                                <Folder className="w-4 h-4 text-blue-500" />
                              ),
                              text: "Module 1: HTML Basics and Advanced Tags",
                              children: [
                                {
                                  icon: (
                                    <FileText className="w-4 h-4 text-blue-400" />
                                  ),
                                  text: "Introduction to HTML Structure",
                                },
                                {
                                  icon: (
                                    <FileText className="w-4 h-4 text-red-400" />
                                  ),
                                  text: "Common HTML Tags and Attributes",
                                },
                              ],
                            },
                            {
                              icon: (
                                <Folder className="w-4 h-4 text-blue-500" />
                              ),
                              text: "Module 2: CSS Styling and Layout Techniques",
                            },
                          ],
                        },
                        {
                          value: "4",
                          title: "4-Level Course Structure",
                          subtitle:
                            "Full-Stack JavaScript Development Mastery (Level 4)",
                          items: [
                            {
                              icon: (
                                <Folder className="w-4 h-4 text-blue-500" />
                              ),
                              text: "Module 1: Backend Development with Node.js and Express",
                              children: [
                                {
                                  icon: (
                                    <Folder className="w-4 h-4 text-blue-400" />
                                  ),
                                  text: "Chapter 1.1: Express.js Fundamentals and Middleware",
                                  children: [
                                    {
                                      icon: (
                                        <FileText className="w-4 h-4 text-blue-400" />
                                      ),
                                      text: "Introduction to Express Framework",
                                    },
                                    {
                                      icon: (
                                        <FileText className="w-4 h-4 text-red-400" />
                                      ),
                                      text: "Understanding Routing and Middleware",
                                    },
                                  ],
                                },
                                {
                                  icon: (
                                    <Folder className="w-4 h-4 text-blue-400" />
                                  ),
                                  text: "Chapter 1.2: Databases and ORM/ODM Integration",
                                },
                              ],
                            },
                          ],
                        },
                        {
                          value: "5",
                          title: "5-Level Course Structure",
                          subtitle:
                            "Advanced Software Engineering Principles (Level 5)",
                          items: [
                            {
                              icon: (
                                <Folder className="w-4 h-4 text-blue-500" />
                              ),
                              text: "Subject 1: Advanced System Design Patterns",
                              children: [
                                {
                                  icon: (
                                    <Folder className="w-4 h-4 text-blue-400" />
                                  ),
                                  text: "Module 1.1: Scalability and Distributed Systems",
                                  children: [
                                    {
                                      icon: (
                                        <Folder className="w-4 h-4 text-blue-300" />
                                      ),
                                      text: "Chapter 1.1.1: Horizontal and Vertical Scaling Strategies",
                                      children: [
                                        {
                                          icon: (
                                            <FileText className="w-4 h-4 text-blue-300" />
                                          ),
                                          text: "Detailed Scaling Techniques and Trade-offs",
                                        },
                                      ],
                                    },
                                    {
                                      icon: (
                                        <Folder className="w-4 h-4 text-blue-300" />
                                      ),
                                      text: "Chapter 1.1.2: Microservices Architecture Considerations",
                                    },
                                  ],
                                },
                              ],
                            },
                            {
                              icon: (
                                <Folder className="w-4 h-4 text-blue-500" />
                              ),
                              text: "Subject 2: DevOps Practices and CI/CD Pipelines",
                            },
                          ],
                        },
                      ].map((structure) => (
                        <label
                          key={structure.value}
                          className="relative block cursor-pointer group"
                        >
                          <input
                            type="radio"
                            value={structure.value}
                            checked={defaultStructure === structure.value}
                            onChange={() =>
                              setDefaultStructure(structure.value)
                            }
                            className="peer sr-only"
                          />
                          <Card
                            className={`border-2 transition-all group-hover:border-blue-400 ${
                              defaultStructure === structure.value
                                ? "border-blue-600 shadow-lg"
                                : "border-gray-200 bg-white"
                            }`}
                          >
                            <CardHeader className="pb-2">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-base font-semibold">
                                  {structure.title}
                                </CardTitle>
                                {defaultStructure === structure.value ? (
                                  <Badge className="bg-blue-600 text-white px-2 py-0.5 text-xs">
                                    Default
                                  </Badge>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-xs px-2 py-0.5"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setDefaultStructure(structure.value);
                                    }}
                                  >
                                    Set as Default
                                  </Button>
                                )}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {structure.subtitle}
                              </div>
                            </CardHeader>
                            <CardContent className="pt-0 pb-4">
                              <div className="space-y-1">
                                {structure.items.map((item, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-start gap-2 ml-0"
                                  >
                                    {item.icon}
                                    <span className="text-sm text-gray-800">
                                      {item.text}
                                    </span>
                                    {item.children && (
                                      <div className="ml-6 space-y-1">
                                        {item.children.map((child, cidx) => (
                                          <div
                                            key={cidx}
                                            className="flex items-start gap-2"
                                          >
                                            {child.icon}
                                            <span className="text-sm text-gray-700">
                                              {child.text}
                                            </span>
                                            {child.children && (
                                              <div className="ml-6 space-y-1">
                                                {child.children.map(
                                                  (gchild, gcidx) => (
                                                    <div
                                                      key={gcidx}
                                                      className="flex items-start gap-2"
                                                    >
                                                      {gchild.icon}
                                                      <span className="text-sm text-gray-600">
                                                        {gchild.text}
                                                      </span>
                                                    </div>
                                                  )
                                                )}
                                              </div>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        </label>
                      ))}
                    </RadioGroup>
                    {/* Ask if structure selection should be shown to instructors */}
                    <div className="mt-4">
                      <Label className="font-medium mb-1 block">Do you want to show this structure selection to instructors during course creation?</Label>
                      <RadioGroup value={showStructureToInstructors} onValueChange={setShowStructureToInstructors} className="flex flex-row gap-8 mt-2">
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="yes" id="show-structure-yes" />
                          <Label htmlFor="show-structure-yes">Yes</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="no" id="show-structure-no" />
                          <Label htmlFor="show-structure-no">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    {/* Add extra spacing before switches */}
                    <div className="mt-8">
                      {/* Enable Sessions */}
                      <div className="flex items-center gap-3">
                        <Switch id="enable-sessions" checked={enableSessions} onCheckedChange={handleSessionsChange} />
                        <div>
                          <Label htmlFor="enable-sessions" className="font-medium">Enable Sessions in Course</Label>
                          <div className="text-xs text-gray-500">If enabled, instructors can break the course into individual sessions.</div>
                        </div>
                      </div>
                      {/* Enable Levels */}
                      <div className="flex items-center gap-3">
                        <Switch id="enable-levels" checked={enableLevels} onCheckedChange={setEnableLevels} disabled={!enableSessions} />
                        <div>
                          <Label htmlFor="enable-levels" className="font-medium">Enable Levels in Sessions</Label>
                          <div className="text-xs text-gray-500">If enabled, instructors can divide each session into multiple levels.</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Catalogue Options */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      Catalogue Options
                    </h3>
                    <div className="space-y-4">
                      {/* Show Add to Catalogue Option in Course Creation? */}
                      <div>
                        <Label className="font-medium mb-1 block">
                          Show 'Add to Catalogue' option in course creation?
                        </Label>
                        <RadioGroup
                          value={showAddToCatalogue}
                          onValueChange={setShowAddToCatalogue}
                          className="flex flex-row gap-6 mb-2"
                        >
                          <div className="flex items-center gap-2">
                            <RadioGroupItem
                              value="yes"
                              id="show-catalogue-yes"
                            />
                            <Label htmlFor="show-catalogue-yes">Yes</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="no" id="show-catalogue-no" />
                            <Label htmlFor="show-catalogue-no">No</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      {/* If Yes: show default state dropdown */}
                      {showAddToCatalogue === "yes" && (
                        <div className="pl-8 space-y-2">
                          <Label className="font-medium">Default State</Label>
                          <Select
                            value={catalogueDefaultState}
                            onValueChange={setCatalogueDefaultState}
                          >
                            <SelectTrigger className="w-56 mt-1">
                              <SelectValue placeholder="Checked by default" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="checked">
                                Checked by default
                              </SelectItem>
                              <SelectItem value="unchecked">
                                Unchecked by default
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      {/* If No: show radio options */}
                      {showAddToCatalogue === "no" && (
                        <div className="pl-8 space-y-2">
                          <div className="text-sm text-blue-700 font-medium mb-2">
                            All courses will be directly added to the course
                            catalogue.
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Course View Preference Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Course View Preference
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Course View Preference Radio Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Outline Mode */}
                    <label className="block cursor-pointer group relative">
                      <input
                        type="radio"
                        name="course-view-mode"
                        value="outline"
                        checked={courseViewPreference === "outline"}
                        onChange={() => setCourseViewPreference("outline")}
                        className="peer sr-only"
                      />
                      <div
                        className={`border rounded-lg p-5 transition-all bg-white shadow-sm group-hover:border-blue-400 ${
                          courseViewPreference === "outline"
                            ? "border-blue-600 shadow-lg"
                            : "border-gray-200"
                        }`}
                      >
                        {courseViewPreference === "outline" && (
                          <span className="absolute top-3 right-3 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full z-10">
                            Selected
                          </span>
                        )}
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
                            {/* Placeholder illustration for outline mode */}
                            <svg
                              width="24"
                              height="24"
                              fill="none"
                              stroke="#2563eb"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect x="4" y="6" width="16" height="12" rx="2" />
                              <line x1="8" y1="10" x2="16" y2="10" />
                              <line x1="8" y1="14" x2="12" y2="14" />
                            </svg>
                          </div>
                          <span className="font-medium text-lg">
                            Course Outline Mode
                          </span>
                          <span
                            className="ml-1 text-gray-400 cursor-pointer"
                            title="Learners see a simple linear outline of lessons and modules."
                          >
                            <Info className="w-4 h-4" />
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          Learners will see the course as a linear outline of
                          lessons and modules.
                        </div>
                        {/* Small preview mockup for outline mode */}
                        <div
                          className="bg-gray-50 border border-dashed border-gray-200 rounded p-3 text-xs font-sans"
                          style={{ minWidth: 220 }}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <svg
                              width="16"
                              height="16"
                              fill="none"
                              stroke="#ec4899"
                              strokeWidth="2"
                            >
                              <rect x="2" y="4" width="12" height="10" rx="2" />
                            </svg>
                            <span className="font-medium text-gray-700">
                              Quantitative Analysis
                            </span>
                            <span className="ml-2 bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded text-[10px]">
                              S1
                            </span>
                          </div>
                          <div className="pl-5 border-l border-dotted border-pink-300 ml-1">
                            <div className="flex items-center gap-2 text-pink-500 cursor-pointer mb-1">
                              <svg
                                width="14"
                                height="14"
                                fill="none"
                                stroke="#ec4899"
                                strokeWidth="2"
                              >
                                <line x1="7" y1="2" x2="7" y2="12" />
                                <line x1="2" y1="7" x2="12" y2="7" />
                              </svg>
                              <span>Add Modules</span>
                            </div>
                            <div className="flex items-center gap-2 mb-1 mt-1">
                              <svg
                                width="16"
                                height="16"
                                fill="none"
                                stroke="#2563eb"
                                strokeWidth="2"
                              >
                                <rect
                                  x="2"
                                  y="4"
                                  width="12"
                                  height="10"
                                  rx="2"
                                />
                              </svg>
                              <span className="font-medium text-gray-700">
                                Module 1
                              </span>
                              <span className="ml-2 bg-gray-100 text-blue-500 px-1.5 py-0.5 rounded text-[10px]">
                                M1
                              </span>
                            </div>
                            <div className="pl-5 border-l border-dotted border-pink-300 ml-1">
                              <div className="flex items-center gap-2 text-pink-500 cursor-pointer mb-1">
                                <svg
                                  width="14"
                                  height="14"
                                  fill="none"
                                  stroke="#ec4899"
                                  strokeWidth="2"
                                >
                                  <line x1="7" y1="2" x2="7" y2="12" />
                                  <line x1="2" y1="7" x2="12" y2="7" />
                                </svg>
                                <span>Add Chapters</span>
                              </div>
                              <div className="flex items-center gap-2 mb-1 mt-1">
                                <svg
                                  width="16"
                                  height="16"
                                  fill="none"
                                  stroke="#10b981"
                                  strokeWidth="2"
                                >
                                  <rect
                                    x="2"
                                    y="4"
                                    width="12"
                                    height="10"
                                    rx="2"
                                  />
                                </svg>
                                <span className="font-medium text-gray-700">
                                  Number Systems
                                </span>
                                <span className="ml-2 bg-gray-100 text-green-500 px-1.5 py-0.5 rounded text-[10px]">
                                  C1
                                </span>
                              </div>
                              <div className="pl-5 border-l border-dotted border-pink-300 ml-1">
                                <div className="flex items-center gap-2 text-pink-500 cursor-pointer mb-1">
                                  <svg
                                    width="14"
                                    height="14"
                                    fill="none"
                                    stroke="#ec4899"
                                    strokeWidth="2"
                                  >
                                    <line x1="7" y1="2" x2="7" y2="12" />
                                    <line x1="2" y1="7" x2="12" y2="7" />
                                  </svg>
                                  <span>Add Slides</span>
                                </div>
                                <div className="pl-2">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-gray-400">S1</span>
                                    <svg
                                      width="12"
                                      height="12"
                                      fill="none"
                                      stroke="#f59e42"
                                      strokeWidth="2"
                                    >
                                      <rect
                                        x="2"
                                        y="3"
                                        width="8"
                                        height="7"
                                        rx="1"
                                      />
                                    </svg>
                                    <span className="text-gray-700">
                                      Presentation 23
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-gray-400">S2</span>
                                    <svg
                                      width="12"
                                      height="12"
                                      fill="none"
                                      stroke="#f59e42"
                                      strokeWidth="2"
                                    >
                                      <rect
                                        x="2"
                                        y="3"
                                        width="8"
                                        height="7"
                                        rx="1"
                                      />
                                    </svg>
                                    <span className="text-gray-700">
                                      Presentation 23
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-gray-400">S3</span>
                                    <svg
                                      width="12"
                                      height="12"
                                      fill="none"
                                      stroke="#f59e42"
                                      strokeWidth="2"
                                    >
                                      <rect
                                        x="2"
                                        y="3"
                                        width="8"
                                        height="7"
                                        rx="1"
                                      />
                                    </svg>
                                    <span className="text-gray-700">
                                      Presentation 22
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-gray-400">S4</span>
                                    <svg
                                      width="12"
                                      height="12"
                                      fill="none"
                                      stroke="#f59e42"
                                      strokeWidth="2"
                                    >
                                      <rect
                                        x="2"
                                        y="3"
                                        width="8"
                                        height="7"
                                        rx="1"
                                      />
                                    </svg>
                                    <span className="text-gray-700">
                                      Assignment 7
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-gray-400">S5</span>
                                    <svg
                                      width="12"
                                      height="12"
                                      fill="none"
                                      stroke="#f59e42"
                                      strokeWidth="2"
                                    >
                                      <rect
                                        x="2"
                                        y="3"
                                        width="8"
                                        height="7"
                                        rx="1"
                                      />
                                    </svg>
                                    <span className="text-gray-700">
                                      Assignment 6
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-gray-400">S6</span>
                                    <svg
                                      width="12"
                                      height="12"
                                      fill="none"
                                      stroke="#f59e42"
                                      strokeWidth="2"
                                    >
                                      <rect
                                        x="2"
                                        y="3"
                                        width="8"
                                        height="7"
                                        rx="1"
                                      />
                                    </svg>
                                    <span className="text-gray-700">
                                      Assignment 5
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-gray-400">S7</span>
                                    <svg
                                      width="12"
                                      height="12"
                                      fill="none"
                                      stroke="#f59e42"
                                      strokeWidth="2"
                                    >
                                      <rect
                                        x="2"
                                        y="3"
                                        width="8"
                                        height="7"
                                        rx="1"
                                      />
                                    </svg>
                                    <span className="text-gray-700">
                                      Assignment 4
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-gray-400">S8</span>
                                    <svg
                                      width="12"
                                      height="12"
                                      fill="none"
                                      stroke="#f59e42"
                                      strokeWidth="2"
                                    >
                                      <rect
                                        x="2"
                                        y="3"
                                        width="8"
                                        height="7"
                                        rx="1"
                                      />
                                    </svg>
                                    <span className="text-gray-700">
                                      Presentation 3
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </label>
                    {/* Structure Mode */}
                    <label className="block cursor-pointer group relative">
                      <input
                        type="radio"
                        name="course-view-mode"
                        value="structure"
                        checked={courseViewPreference === "structure"}
                        onChange={() => setCourseViewPreference("structure")}
                        className="peer sr-only"
                      />
                      <div
                        className={`border rounded-lg p-5 transition-all bg-white shadow-sm group-hover:border-blue-400 ${
                          courseViewPreference === "structure"
                            ? "border-blue-600 shadow-lg"
                            : "border-gray-200"
                        }`}
                      >
                        {courseViewPreference === "structure" && (
                          <span className="absolute top-3 right-3 bg-green-600 text-white text-xs px-2 py-0.5 rounded-full z-10">
                            Selected
                          </span>
                        )}
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-green-100 rounded flex items-center justify-center">
                            {/* Placeholder illustration for structure mode */}
                            <svg
                              width="24"
                              height="24"
                              fill="none"
                              stroke="#059669"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect x="4" y="6" width="16" height="12" rx="2" />
                              <line x1="8" y1="10" x2="16" y2="10" />
                              <line x1="8" y1="14" x2="12" y2="14" />
                              <circle cx="8" cy="10" r="1.5" fill="#059669" />
                              <circle cx="12" cy="14" r="1.5" fill="#059669" />
                            </svg>
                          </div>
                          <span className="font-medium text-lg">
                            Course Structure Mode
                          </span>
                          <span
                            className="ml-1 text-gray-400 cursor-pointer"
                            title="Learners see the course divided into structured levels and sessions."
                          >
                            <Info className="w-4 h-4" />
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          Learners will see the course divided into structured
                          levels and sessions.
                        </div>
                        {/* Small preview mockup */}
                        <div
                          className="bg-gray-50 border border-dashed border-gray-200 rounded p-3"
                          style={{ minWidth: 260 }}
                        >
                          <div className="font-semibold text-gray-800 text-sm mb-1">
                            Content Structure
                          </div>
                          <div className="text-xs text-gray-500 mb-3">
                            Navigate through your course content using folders
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            {/* Subject with image */}
                            <div className="rounded-lg border bg-white p-1 flex flex-col items-center shadow-sm">
                              <div className="w-14 h-14 rounded-lg bg-green-100 flex items-center justify-center overflow-hidden mb-1">
                                <img
                                  src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=56&h=56"
                                  alt="Quantitative"
                                  className="object-cover w-full h-full"
                                />
                              </div>
                              <div className="text-xs font-medium text-gray-700 truncate w-16">
                                Quantita...
                              </div>
                              <div className="text-[10px] text-gray-400">
                                Subject 1
                              </div>
                            </div>
                            {/* Subject with image */}
                            <div className="rounded-lg border bg-white p-1 flex flex-col items-center shadow-sm">
                              <div className="w-14 h-14 rounded-lg bg-blue-100 flex items-center justify-center overflow-hidden mb-1">
                                <img
                                  src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=56&h=56"
                                  alt="Maths"
                                  className="object-cover w-full h-full"
                                />
                              </div>
                              <div className="text-xs font-medium text-gray-700 truncate w-16">
                                Mathem...
                              </div>
                              <div className="text-[10px] text-gray-400">
                                Subject 2
                              </div>
                            </div>
                            {/* Subject with image */}
                            <div className="rounded-lg border bg-white p-1 flex flex-col items-center shadow-sm">
                              <div className="w-14 h-14 rounded-lg bg-yellow-100 flex items-center justify-center overflow-hidden mb-1">
                                <img
                                  src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=56&h=56"
                                  alt="Chemistry"
                                  className="object-cover w-full h-full"
                                />
                              </div>
                              <div className="text-xs font-medium text-gray-700 truncate w-16">
                                Chemistry
                              </div>
                              <div className="text-[10px] text-gray-400">
                                Subject 3
                              </div>
                            </div>
                            {/* Subject with folder icon */}
                            <div className="rounded-lg border bg-white p-1 flex flex-col items-center shadow-sm">
                              <div className="w-14 h-14 rounded-lg bg-blue-50 flex items-center justify-center mb-1">
                                <svg
                                  width="28"
                                  height="28"
                                  fill="none"
                                  stroke="#2563eb"
                                  strokeWidth="2"
                                >
                                  <rect
                                    x="4"
                                    y="8"
                                    width="20"
                                    height="14"
                                    rx="3"
                                  />
                                </svg>
                              </div>
                              <div className="text-xs font-medium text-gray-700 truncate w-16">
                                trial
                              </div>
                              <div className="text-[10px] text-gray-400">
                                Subject 4
                              </div>
                            </div>
                            {/* Subject with folder icon */}
                            <div className="rounded-lg border bg-white p-1 flex flex-col items-center shadow-sm">
                              <div className="w-14 h-14 rounded-lg bg-blue-50 flex items-center justify-center mb-1">
                                <svg
                                  width="28"
                                  height="28"
                                  fill="none"
                                  stroke="#2563eb"
                                  strokeWidth="2"
                                >
                                  <rect
                                    x="4"
                                    y="8"
                                    width="20"
                                    height="14"
                                    rx="3"
                                  />
                                </svg>
                              </div>
                              <div className="text-xs font-medium text-gray-700 truncate w-16">
                                new sub
                              </div>
                              <div className="text-[10px] text-gray-400">
                                Subject 5
                              </div>
                            </div>
                            {/* Subject with image */}
                            <div className="rounded-lg border bg-white p-1 flex flex-col items-center shadow-sm">
                              <div className="w-14 h-14 rounded-lg bg-pink-100 flex items-center justify-center overflow-hidden mb-1">
                                <img
                                  src="https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=facearea&w=56&h=56"
                                  alt="Biology"
                                  className="object-cover w-full h-full"
                                />
                              </div>
                              <div className="text-xs font-medium text-gray-700 truncate w-16">
                                Biology
                              </div>
                              <div className="text-[10px] text-gray-400">
                                Subject 6
                              </div>
                            </div>
                            {/* Add Subjects card */}
                            <div className="rounded-lg border-2 border-dashed border-pink-300 bg-white flex flex-col items-center justify-center h-full min-h-[80px] min-w-[80px] relative">
                              <button className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-pink-500 text-white px-4 py-1.5 rounded font-medium text-xs shadow">
                                Add Subjects
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>
                  <div>
                    {/* If Outline Mode is selected, show expansion preference */}
                    {courseViewPreference === "outline" && (
                      <div className="mt-6 pl-2">
                        <Label className="font-medium mb-1 block">
                          Outline Expansion Preference
                        </Label>
                        <RadioGroup
                          value={outlineExpansion}
                          onValueChange={setOutlineExpansion}
                          className="flex flex-row gap-8 mt-2"
                        >
                          <div className="flex items-center gap-2">
                            <RadioGroupItem
                              value="expanded"
                              id="outline-expanded"
                            />
                            <Label htmlFor="outline-expanded">
                              Expanded by default
                            </Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <RadioGroupItem
                              value="collapsed"
                              id="outline-collapsed"
                            />
                            <Label htmlFor="outline-collapsed">
                              Collapsed by default
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Learner Course Creation Permissions Section (separate card) */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    Learner Course Creation Permissions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Label className="flex items-center gap-2 font-medium text-base">
                    <Switch id="allow-learner-course-creation" checked={allowLearnerCourseCreation} onCheckedChange={setAllowLearnerCourseCreation} />
                    Allow Learners to Create Courses
                  </Label>
                  <div className="text-xs text-gray-500 mt-2 max-w-2xl">
                    If enabled, learners will be assigned the 'Teacher' role and will be able to access the Teacher Portal with their current login credentials. This setting allows a more collaborative learning environment where students can also contribute by creating and managing their own courses.
                  </div>
                </CardContent>
              </Card>

              {/* Save Settings Button at the very bottom */}
              <div className="flex justify-end pt-4 pb-8">
                <Button
                  type="submit"
                  className="px-10 py-3 bg-blue-600 text-white font-semibold text-base rounded shadow hover:bg-blue-700 transition-colors duration-150"
                  style={{ minWidth: 180 }}
                >
                  Save Settings
                </Button>
              </div>
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
                    <Button
                      onClick={() => setShowPaymentPlanCreator(true)}
                      className="flex items-center gap-2"
                    >
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
                        onValueChange={(value) =>
                          setInstituteSettings({
                            ...instituteSettings,
                            defaultCurrency: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          {currencyOptions.map((currency) => (
                            <SelectItem
                              key={currency.code}
                              value={currency.code}
                            >
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
                            setInstituteSettings({
                              ...instituteSettings,
                              allowCouponCodes: checked,
                            })
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
                      <Badge
                        variant="outline"
                        className="text-green-600 border-green-200"
                      >
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
                      <Badge
                        variant="outline"
                        className="text-blue-600 border-blue-200"
                      >
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
                      <Button
                        onClick={() => setShowCouponCreator(true)}
                        className="flex items-center gap-2"
                      >
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
                          <p className="text-sm">
                            Create your first coupon to offer discounts to
                            students
                          </p>
                        </div>
                      ) : (
                        discountCoupons.map((coupon, index) => (
                          <div
                            key={coupon.id}
                            className="border rounded-lg p-4"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant={
                                      coupon.isActive ? "default" : "secondary"
                                    }
                                    className={
                                      coupon.isActive
                                        ? "bg-green-100 text-green-800"
                                        : "bg-gray-100 text-gray-600"
                                    }
                                  >
                                    {coupon.isActive ? "Active" : "Inactive"}
                                  </Badge>
                                  <span className="font-mono font-medium text-lg">
                                    {coupon.code}
                                  </span>
                                </div>
                                <span className="text-sm text-gray-500">•</span>
                                <span className="font-medium">
                                  {coupon.name}
                                </span>
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
                                  {coupon.type === "percentage" ? (
                                    <Percent className="w-3 h-3" />
                                  ) : (
                                    <DollarSign className="w-3 h-3" />
                                  )}
                                  <span className="font-medium">
                                    {coupon.type === "percentage"
                                      ? `${coupon.value}%`
                                      : `${getCurrencySymbol(
                                          coupon.currency || "INR"
                                        )}${coupon.value}`}
                                  </span>
                                </div>
                              </div>

                              <div>
                                <span className="text-gray-500">Usage:</span>
                                <div className="font-medium">
                                  {coupon.usedCount}
                                  {coupon.usageLimit &&
                                    ` / ${coupon.usageLimit}`}
                                </div>
                              </div>

                              <div>
                                <span className="text-gray-500">Expires:</span>
                                <div className="font-medium">
                                  {coupon.expiryDate
                                    ? new Date(
                                        coupon.expiryDate
                                      ).toLocaleDateString()
                                    : "No expiry"}
                                </div>
                              </div>

                              <div>
                                <span className="text-gray-500">
                                  Applicable Plans:
                                </span>
                                <div className="font-medium">
                                  {coupon.applicablePlans.length} plan
                                  {coupon.applicablePlans.length !== 1
                                    ? "s"
                                    : ""}
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
            availablePlans={paymentPlans as any}
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
