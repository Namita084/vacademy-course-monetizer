import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { 
  Link,
  Copy,
  MoreVertical,
  Calendar,
  Users,
  Plus,
  Trash2,
  UserPlus,
  CreditCard,
  Percent,
  Clock,
  Eye,
  Building,
  Code,
  ChevronDown,
  Share2,
  Gift,
  Trophy,
  FileText,
  Video,
  Mail,
  MessageSquare,
  TrendingUp,
  Settings,
  Bookmark,
  Star,
  Tag,
  Info,
  Ban
} from 'lucide-react';
import { BatchSelectionDialog } from '@/components/BatchSelectionDialog';
import { CoursePreviewSection } from '@/components/CoursePreviewSection';
import { CouponCreator } from '@/components/CouponCreator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from '@/lib/utils';
import { EnrollmentApprovalSection } from '@/components/EnrollmentApprovalSection';

interface InviteLink {
  id: string;
  courseName: string;
  createdOn: string;
  acceptedCount: number;
  link: string;
}

interface Course {
  id: string;
  name: string;
  description: string;
  previewImage: string;
  bannerImage: string;
  media: {
    type: 'image' | 'video';
    url: string;
  };
  tags: string[];
  learningObjectives: string;
  aboutCourse: string;
  targetAudience: string;
  needsApproval: boolean;
  defaultPaymentPlan: string;
}

interface PaymentPlan {
  id: string;
  name: string;
  type: 'subscription' | 'upfront' | 'invoice' | 'free';
  currency: string;
  isDefault: boolean;
  config: {
    subscription?: {
      customIntervals: Array<{
        value: number;
        unit: 'days' | 'months';
        price: number;
        features: string[];
        title?: string;
      }>;
    };
    upfront?: {
      fullPrice: string;
      installmentPlans: Array<{
        numberOfInstallments: number;
        intervalDays: number;
        gracePeriodDays: number;
        lateFeePercentage: number;
      }>;
    };
    invoice?: {
      baseAmount: string;
      billingInterval: {
        value: number;
        unit: 'days' | 'months';
      };
      gracePeriodDays: number;
      lateFeePercentage: number;
      allowStudentRequests: boolean;
    };
    free?: {
      validityDays: number;
    };
    donation?: {
      suggestedAmounts: string[];
      minimumAmount: string;
    };
  };
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

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'number' | 'dropdown' | 'textarea';
  required: boolean;
  options?: string[];
  placeholder?: string;
}

interface ReferralSettings {
  enabled: boolean;
  referee: {
    type: 'discount' | 'bonus_content' | 'free_days';
    discountPercentage?: number;
    bonusContent?: {
      type: 'pdf' | 'video';
      title: string;
      description: string;
      deliveryMethods: ('email' | 'whatsapp')[];
    };
    freeDays?: number;
  };
  referrer: {
    type: 'discount' | 'membership_days' | 'points';
    discountPercentage?: number;
    membershipDays?: number;
    pointsConfig?: {
      pointsPerReferral: number;
      pointsThreshold: number;
      rewardType: 'discount' | 'membership_extension';
      rewardValue: number;
    };
  };
}

const InvitePage = () => {
  // List View State
  const [inviteLinks, setInviteLinks] = useState<InviteLink[]>([
    {
      id: '1',
      courseName: 'DEFAULT Everyday Yoga',
      createdOn: '2025-05-26',
      acceptedCount: 0,
      link: 'https://learner.vacademy.io/lear...'
    },
    {
      id: '2',
      courseName: 'DEFAULT Everyday Yoga',
      createdOn: '2025-05-26',
      acceptedCount: 0,
      link: 'https://learner.vacademy.io/lear...'
    },
    {
      id: '3',
      courseName: 'DEFAULT Everyday Yoga',
      createdOn: '2025-05-26',
      acceptedCount: 0,
      link: 'https://learner.vacademy.io/lear...'
    }
  ]);

  // Creation Form State
  const [showBatchSelection, setShowBatchSelection] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showCouponDialog, setShowCouponDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedBatches, setSelectedBatches] = useState<Array<{ sessionId: string; levelId: string }>>([]);
  const [selectedPaymentPlan, setSelectedPaymentPlan] = useState<string | null>(null);
  const [isPaidCourse, setIsPaidCourse] = useState(false);
  const [showPaymentPlanDialog, setShowPaymentPlanDialog] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<string | null>(null);
  const [learnerAccessType, setLearnerAccessType] = useState<'defined' | 'session' | 'payment'>('defined');
  const [learnerAccessDays, setLearnerAccessDays] = useState(365);
  const [includeInstituteLogo, setIncludeInstituteLogo] = useState(true);
  const [customHtml, setCustomHtml] = useState('');
  const [includeRelatedCourses, setIncludeRelatedCourses] = useState(false);
  const [formFields, setFormFields] = useState<FormField[]>([
    { id: '1', label: 'Full Name', type: 'text', required: true },
    { id: '2', label: 'Email Address', type: 'email', required: true },
    { id: '3', label: 'Phone Number', type: 'phone', required: false },
    { id: '4', label: 'Organization', type: 'text', required: false }
  ]);
  const [inviteEmails, setInviteEmails] = useState<string[]>([]);
  const [currentEmail, setCurrentEmail] = useState('');
  const [referralSettings, setReferralSettings] = useState<ReferralSettings>({
    enabled: true,
    referee: {
      type: 'discount',
      discountPercentage: 10
    },
    referrer: {
      type: 'points',
      pointsConfig: {
        pointsPerReferral: 50,
        pointsThreshold: 100,
        rewardType: 'discount',
        rewardValue: 15
      }
    }
  });
  const [needsApproval, setNeedsApproval] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [allowCoupons, setAllowCoupons] = useState(false);
  
  // Mock templates data
  const mockTemplates = [
    {
      id: 'template1',
      name: 'Standard Approval Message',
      content: 'Thank you for your interest in our course. Your enrollment request is being reviewed by our team. We will notify you once your request has been approved.'
    },
    {
      id: 'template2',
      name: 'Custom Review Process',
      content: 'Your enrollment request has been received. Our team will review your application within 2 business days. You will receive an email notification with the decision.'
    }
  ];

  // Mock Data
  const mockCourses = [
    {
      id: '1',
      name: 'Web Development Fundamentals',
      description: 'Learn HTML, CSS, JavaScript and modern web frameworks from scratch',
      previewImage: '/placeholder.svg',
      bannerImage: '/placeholder.svg',
      media: { type: 'image' as const, url: '/placeholder.svg' },
      tags: ['HTML', 'CSS', 'JavaScript'],
      learningObjectives: 'Build responsive websites and web applications',
      aboutCourse: 'Comprehensive web development course covering frontend fundamentals',
      targetAudience: 'Beginners with no prior experience',
      needsApproval: false,
      defaultPaymentPlan: 'plan1',
      sessions: [
        { id: 's1', name: 'January 2024' },
        { id: 's2', name: 'February 2024' }
      ],
      levels: [
        { id: 'l1', name: 'Beginner' },
        { id: 'l2', name: 'Intermediate' }
      ]
    },
    {
      id: '2',
      name: 'React.js Masterclass',
      description: 'Master React.js with hooks, context, and advanced patterns',
      previewImage: '/placeholder.svg',
      bannerImage: '/placeholder.svg',
      media: { type: 'image' as const, url: '/placeholder.svg' },
      tags: ['React', 'JavaScript', 'Frontend'],
      learningObjectives: 'Build modern React applications',
      aboutCourse: 'Advanced React course for experienced developers',
      targetAudience: 'Developers with JavaScript experience',
      needsApproval: false,
      defaultPaymentPlan: 'plan1',
      sessions: [
        { id: 's3', name: 'March 2024' },
        { id: 's4', name: 'April 2024' }
      ],
      levels: [
        { id: 'l3', name: 'Advanced' }
      ]
    },
    {
      id: '3',
      name: 'Node.js Backend Development',
      description: 'Build scalable backend applications with Node.js and Express',
      previewImage: '/placeholder.svg',
      bannerImage: '/placeholder.svg',
      media: { type: 'image' as const, url: '/placeholder.svg' },
      tags: ['Node.js', 'Backend', 'API'],
      learningObjectives: 'Create RESTful APIs and databases',
      aboutCourse: 'Complete backend development with Node.js',
      targetAudience: 'Frontend developers moving to fullstack',
      needsApproval: false,
      defaultPaymentPlan: 'plan1',
      sessions: [
        { id: 's5', name: 'May 2024' }
      ],
      levels: [
        { id: 'l4', name: 'Intermediate' }
      ]
    },
    {
      id: '4',
      name: 'UI/UX Design Fundamentals',
      description: 'Learn design principles, user research, and prototyping',
      previewImage: '/placeholder.svg',
      bannerImage: '/placeholder.svg',
      media: { type: 'image' as const, url: '/placeholder.svg' },
      tags: ['Design', 'UX', 'Figma'],
      learningObjectives: 'Create user-centered designs',
      aboutCourse: 'Complete guide to UI/UX design process',
      targetAudience: 'Aspiring designers and developers',
      needsApproval: false,
      defaultPaymentPlan: 'plan1',
      sessions: [
        { id: 's6', name: 'June 2024' }
      ],
      levels: [
        { id: 'l5', name: 'Beginner' }
      ]
    }
  ];

  const mockPaymentPlans = [
    {
      id: 'plan1',
      name: 'Premium Subscription Plan',
      type: 'subscription',
      currency: 'INR',
      isDefault: true,
      config: {
        subscription: {
          customIntervals: [
            {
              value: 1,
              unit: 'months',
              price: 999,
              title: '1 Month Plan',
              features: ['Access to all courses', 'Live sessions', 'Certificate', '24/7 Support']
            },
            {
              value: 3,
              unit: 'months',
              price: 2499,
              title: '3 Month Plan',
              features: ['Access to all courses', 'Live sessions', 'Certificate', '24/7 Support', 'Priority Support']
            },
            {
              value: 6,
              unit: 'months',
              price: 5500,
              title: '6 Month Plan',
              features: ['Access to all courses', 'Live sessions', 'Certificate', '24/7 Support', 'Priority Support', 'Offline Downloads']
            },
            {
              value: 12,
              unit: 'months',
              price: 10000,
              title: '12 Month Plan',
              features: ['Access to all courses', 'Live sessions', 'Certificate', '24/7 Support', 'Priority Support', 'Offline Downloads', 'Personal Mentor']
            }
          ]
        }
      }
    },
    {
      id: 'plan2',
      name: 'Complete Course Package',
      type: 'upfront',
      currency: 'INR',
      isDefault: false,
      config: {
        upfront: {
          fullPrice: '25000',
          installmentPlans: [
            {
              numberOfInstallments: 3,
              intervalDays: 30,
              gracePeriodDays: 7,
              lateFeePercentage: 5
            },
            {
              numberOfInstallments: 6,
              intervalDays: 30,
              gracePeriodDays: 7,
              lateFeePercentage: 5
            },
            {
              numberOfInstallments: 12,
              intervalDays: 30,
              gracePeriodDays: 7,
              lateFeePercentage: 5
            }
          ]
        }
      }
    },
    {
      id: 'plan3',
      name: 'Enterprise Package',
      type: 'invoice',
      currency: 'INR',
      isDefault: false,
      config: {
        invoice: {
          baseAmount: '50000',
          billingInterval: {
            value: 1,
            unit: 'months'
          },
          gracePeriodDays: 15,
          lateFeePercentage: 5,
          allowStudentRequests: true
        }
      }
    },
    {
      id: 'plan4',
      name: 'Free Course',
      type: 'free',
      currency: 'INR',
      isDefault: false,
      config: {
        free: {
          validityDays: 30
        }
      }
    },
    {
      id: 'plan5',
      name: 'Donation',
      type: 'donation',
      currency: 'INR',
      isDefault: false,
      config: {
        donation: {
          suggestedAmounts: ['100', '500', '1000'],
          minimumAmount: '100'
        }
      }
    }
  ];

  const mockCoupons: DiscountCoupon[] = [
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
  ];

  // Handlers
  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
  };

  const handleDeleteLink = (id: string) => {
    setInviteLinks(inviteLinks.filter(link => link.id !== id));
  };

  const handleBatchSelection = (courseId: string, batches: Array<{ sessionId: string; levelId: string }>) => {
    const course = {
      id: courseId,
      name: 'Web Development Fundamentals',
      description: 'Learn web development from scratch',
      previewImage: '/placeholder.jpg',
      bannerImage: '/placeholder.jpg',
      media: {
        type: 'image' as const,
        url: '/placeholder.jpg'
      },
      tags: ['web', 'development', 'javascript'],
      learningObjectives: 'Build modern web applications',
      aboutCourse: 'Comprehensive web development course',
      targetAudience: 'Beginners interested in web development',
      needsApproval: false,
      defaultPaymentPlan: '1'
    };
    setSelectedCourse(course);
    setSelectedBatches(batches);
    setShowBatchSelection(false);
    setShowInviteDialog(true);
    setSelectedPaymentPlan(course.defaultPaymentPlan);
  };

  const handleAddFormField = (label?: string, type?: FormField['type'], options?: string[]) => {
    const newField: FormField = {
      id: Date.now().toString(),
      label: label || '',
      type: type || 'text',
      required: false,
      ...(options && { options })
    };
    setFormFields([...formFields, newField]);
  };

  const handleRemoveFormField = (id: string) => {
    setFormFields(formFields.filter(field => field.id !== id));
  };

  const handleUpdateFormField = (id: string, updates: Partial<FormField>) => {
    setFormFields(formFields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ));
  };

  const handleCreateInvite = () => {
    // Handle invite creation with approval and discount settings
    setShowInviteDialog(false);
    setSelectedCourse(null);
    setSelectedBatches([]);
    setSelectedPaymentPlan(null);
    setSelectedCoupon(null);
    setLearnerAccessType('defined');
    setLearnerAccessDays(365);
    setNeedsApproval(false);
    setSelectedTemplateId('');
    setCustomMessage('');
    setAllowCoupons(false);
  };

  const getSelectedPaymentPlan = () => {
    return mockPaymentPlans.find(plan => plan.id === selectedPaymentPlan);
  };

  const getSelectedCoupon = () => {
    return mockCoupons.find(coupon => coupon.id === selectedCoupon);
  };

  const handleAddEmail = () => {
    if (currentEmail.trim() && !inviteEmails.includes(currentEmail.trim())) {
      setInviteEmails([...inviteEmails, currentEmail.trim()]);
      setCurrentEmail('');
    }
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setInviteEmails(inviteEmails.filter(email => email !== emailToRemove));
  };

  const handleEmailKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddEmail();
    }
  };

  const handleReferralSettingChange = (section: 'referee' | 'referrer', field: string, value: any) => {
    setReferralSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleReferralPointsConfigChange = (field: string, value: any) => {
    setReferralSettings(prev => ({
      ...prev,
      referrer: {
        ...prev.referrer,
        pointsConfig: {
          ...prev.referrer.pointsConfig!,
          [field]: value
        }
      }
    }));
  };

  const handleReferralBonusContentChange = (field: string, value: any) => {
    setReferralSettings(prev => ({
      ...prev,
      referee: {
        ...prev.referee,
        bonusContent: {
          ...prev.referee.bonusContent!,
          [field]: value
        }
      }
    }));
  };

  const renderPlanPrice = (plan: any) => {
    const paymentPlan = getSelectedPaymentPlan();
    if (paymentPlan?.type === 'subscription') {
      return paymentPlan.config.subscription?.customIntervals[0]?.price || 'N/A';
    } else if (paymentPlan?.type === 'upfront') {
      return paymentPlan.config.upfront?.fullPrice || 'N/A';
    } else if (paymentPlan?.type === 'invoice') {
      return 'Custom pricing';
    }
    return 'N/A';
  };

  const getFeatures = (plan: PaymentPlan) => {
    if (plan.type === 'subscription') {
      // Get features from the highest tier interval
      const intervals = plan.config.subscription?.customIntervals || [];
      return intervals[intervals.length - 1]?.features || [];
    }
    return [];
  };

  // Referral Settings Dialog State
  const [showReferralSettingsDialog, setShowReferralSettingsDialog] = useState(false);
  const [selectedReferralProgram, setSelectedReferralProgram] = useState<string | null>(null);
  const [checkSameBatch, setCheckSameBatch] = useState(false);
  const [selectedReferralPlan, setSelectedReferralPlan] = useState<'welcome' | 'premium' | null>(null);

  const mockReferralPrograms = [
    {
      id: '1',
      name: 'Welcome Program',
      isDefault: true,
      refereeBenefit: 10,
      referrerTiers: [
        { count: 1, reward: '10% off' },
        { count: 10, reward: '100% off' }
      ],
      vestingPeriod: 7,
      combineOffers: true
    },
    {
      id: '2',
      name: 'Referrer Program',
      isDefault: false,
      refereeBenefit: 5,
      referrerTiers: [
        { count: 1, reward: '10% off' },
        { count: 10, reward: '50% off' }
      ],
      vestingPeriod: 14,
      combineOffers: false
    }
  ];

  const handleSaveCoupon = (coupon: DiscountCoupon) => {
    // Handle saving the coupon
    setShowCouponDialog(false);
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Link className="w-5 h-5 text-[#4B4B4B]" />
          <h1 className="text-xl font-semibold text-[#4B4B4B]">Invite Link</h1>
        </div>
      </div>

      {/* List View */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-[#4B4B4B]">Invite Link List</h2>
          <Button 
            onClick={() => setShowBatchSelection(true)}
            className="bg-[#ED7424] hover:bg-[#D86420] text-white"
          >
            + Create Invite Link
          </Button>
        </div>

        <div className="space-y-4">
          {inviteLinks.map((inviteLink) => (
            <Card key={inviteLink.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-[#4B4B4B]">{inviteLink.courseName}</h3>
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Created on: {inviteLink.createdOn}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Invites accepted by: {inviteLink.acceptedCount}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm text-gray-600">Invite Link:</span>
                    <span className="text-sm text-[#4B4B4B]">{inviteLink.link}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyLink(inviteLink.link)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleCopyLink(inviteLink.link)}>
                      Copy Link
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeleteLink(inviteLink.id)}>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <span className="px-3 py-1 rounded bg-gray-100">1</span>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>

      {/* Step 1: Batch Selection Dialog */}
      {showBatchSelection && (
        <BatchSelectionDialog
          isOpen={showBatchSelection}
          onClose={() => setShowBatchSelection(false)}
          onConfirm={handleBatchSelection}
          courses={mockCourses}
        />
      )}

      {/* Step 2: Invite Creation Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-[#4B4B4B]">Create Invite Link</DialogTitle>
              <Button variant="outline" className="border-[#ED7424] text-[#ED7424] hover:bg-[#ED7424] hover:text-white">
                <Eye className="w-4 h-4 mr-2" />
                Preview Invite
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Institute Branding */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#4B4B4B]">
                  <Building className="w-5 h-5" />
                  Institute Branding
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={includeInstituteLogo}
                    onCheckedChange={setIncludeInstituteLogo}
                  />
                  <Label className="text-[#4B4B4B]">Include Institute Logo</Label>
                </div>
              </CardContent>
            </Card>

            {/* Enrollment Approval Settings - Moved below institute logo */}
            <EnrollmentApprovalSection
              needsApproval={needsApproval}
              onApprovalChange={setNeedsApproval}
              selectedTemplateId={selectedTemplateId}
              onTemplateChange={setSelectedTemplateId}
              customMessage={customMessage}
              onMessageChange={setCustomMessage}
              templates={mockTemplates}
            />

            {/* Course Preview */}
            {selectedCourse && (
              <CoursePreviewSection
                courseData={selectedCourse}
                onUpdate={() => {}}
              />
            )}

            {/* Payment Configuration */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-[#4B4B4B]">Payment Plan</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPaymentPlanDialog(true)}
                  className="border-[#ED7424] text-[#ED7424] hover:bg-[#ED7424] hover:text-white"
                >
                  Change Payment Plan
                </Button>
              </div>

              {/* Default Payment Plan Card */}
              <div className="border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-[#4B4B4B]" />
                    <h3 className="text-lg font-medium text-[#4B4B4B]">{getSelectedPaymentPlan()?.name || mockPaymentPlans.find(p => p.isDefault)?.name}</h3>
                    <Badge className="bg-green-100 text-green-800 border-0">Default</Badge>
                  </div>
                  <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                    Subscription
                  </Badge>
                </div>

                {/* Plan Details */}
                <div className="space-y-1 mb-2">
                  <p className="text-sm text-gray-600">
                    Monthly: ₹{getSelectedPaymentPlan()?.config.subscription?.customIntervals.find(i => i.value === 1)?.price || mockPaymentPlans.find(p => p.isDefault)?.config.subscription?.customIntervals.find(i => i.value === 1)?.price}
                  </p>
                  <p className="text-sm text-gray-600">
                    Annual: ₹{getSelectedPaymentPlan()?.config.subscription?.customIntervals.find(i => i.value === 12)?.price || mockPaymentPlans.find(p => p.isDefault)?.config.subscription?.customIntervals.find(i => i.value === 12)?.price}
                  </p>
                </div>
                <p className="text-xs text-gray-500">Currency: {getSelectedPaymentPlan()?.currency || mockPaymentPlans.find(p => p.isDefault)?.currency}</p>
              </div>
            </div>

            {/* Payment Plan Selection Dialog */}
            <Dialog open={showPaymentPlanDialog} onOpenChange={setShowPaymentPlanDialog}>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Select Payment Plan</DialogTitle>
                  <DialogDescription>Choose a payment plan for this course</DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                  {/* Free Plans */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-[#4B4B4B]">Free Plans</h3>
                    {mockPaymentPlans
                      .filter(plan => plan.type === 'free' || plan.type === 'donation')
                      .map((plan) => (
                        <div
                          key={plan.id}
                          className={`border rounded-lg p-4 cursor-pointer transition-all hover:border-[#ED7424] ${
                            selectedPaymentPlan === plan.id ? 'border-[#ED7424] bg-orange-50' : ''
                          }`}
                          onClick={() => {
                            setSelectedPaymentPlan(plan.id);
                            setShowPaymentPlanDialog(false);
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Gift className="w-5 h-5 text-[#4B4B4B]" />
                              <div>
                                <h4 className="font-medium text-[#4B4B4B]">{plan.name}</h4>
                                {plan.type === 'free' ? (
                                  <p className="text-sm text-gray-600">Free for {plan.config.free?.validityDays} days</p>
                                ) : (
                                  <p className="text-sm text-gray-600">
                                    Suggested: ₹{plan.config.donation?.suggestedAmounts.join(', ')}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={plan.type === 'free' ? 'bg-purple-50 text-purple-700' : 'bg-orange-50 text-orange-700'}>
                                {plan.type === 'free' ? 'Free' : 'Donation'}
                              </Badge>
                              {plan.isDefault && (
                                <Badge className="bg-green-100 text-green-800">Default</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Paid Plans */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-[#4B4B4B]">Paid Plans</h3>
                      <span className="text-sm text-blue-600">{mockPaymentPlans.filter(p => p.type === 'subscription' || p.type === 'upfront').length} plans</span>
                    </div>
                    {mockPaymentPlans
                      .filter(plan => plan.type === 'subscription' || plan.type === 'upfront')
                      .map((plan) => (
                        <div
                          key={plan.id}
                          className={`border rounded-lg p-4 cursor-pointer transition-all hover:border-[#ED7424] ${
                            selectedPaymentPlan === plan.id ? 'border-[#ED7424] bg-orange-50' : ''
                          }`}
                          onClick={() => {
                            setSelectedPaymentPlan(plan.id);
                            setShowPaymentPlanDialog(false);
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {plan.type === 'subscription' ? (
                                <Calendar className="w-5 h-5 text-[#4B4B4B]" />
                              ) : (
                                <CreditCard className="w-5 h-5 text-[#4B4B4B]" />
                              )}
                              <div>
                                <h4 className="font-medium text-[#4B4B4B]">{plan.name}</h4>
                                {plan.type === 'subscription' ? (
                                  <div className="space-y-1">
                                    <p className="text-sm text-gray-600">
                                      Monthly: ₹{plan.config.subscription?.customIntervals.find(i => i.value === 1)?.price}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      Annual: ₹{plan.config.subscription?.customIntervals.find(i => i.value === 12)?.price}
                                    </p>
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-600">Full Price: ₹{plan.config.upfront?.fullPrice}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={plan.type === 'subscription' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'}>
                                {plan.type === 'subscription' ? 'Subscription' : 'Upfront'}
                              </Badge>
                              {plan.isDefault && (
                                <Badge className="bg-green-100 text-green-800">Default</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Add New Plan Link */}
                  <div className="flex items-center justify-center pt-4 border-t">
                    <Button
                      variant="link"
                      onClick={() => {
                        setShowPaymentPlanDialog(false);
                        window.location.href = '/institute-settings';
                      }}
                      className="text-[#ED7424] hover:text-[#D86420]"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Payment Plan in Institute Settings
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Discount Settings - Revamped to match institute settings pattern */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-[#4B4B4B]">
                    <Tag className="w-5 h-5" />
                    Discount Settings
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCouponDialog(true)}
                    className="text-[#ED7424] border-[#ED7424]"
                  >
                    Change Discount Settings
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Current Discount Display */}
                  {selectedCoupon ? (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-[#ED7424]" />
                          <span className="font-medium text-[#4B4B4B]">
                            {mockCoupons.find(c => c.id === selectedCoupon)?.name}
                          </span>
                        </div>
                        <Badge variant="outline" className="text-[#ED7424] border-[#ED7424]">
                          Active
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 ml-6">
                        <p>Code: {mockCoupons.find(c => c.id === selectedCoupon)?.code}</p>
                        <p>
                          {mockCoupons.find(c => c.id === selectedCoupon)?.type === 'percentage'
                            ? `${mockCoupons.find(c => c.id === selectedCoupon)?.value}% off`
                            : `₹${mockCoupons.find(c => c.id === selectedCoupon)?.value} off`
                          }
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Info className="w-4 h-4" />
                        <span>No discount applied</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Referral Settings */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-[#4B4B4B]">Referral Settings</h3>
                <p className="text-sm text-gray-600">Configure rewards for referrers and referees when referral codes are used</p>
              </div>

              <div className="space-y-6">
                {/* Applied Referral Settings Card */}
                <div className="border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-[#4B4B4B]" />
                      <h3 className="text-lg font-medium text-[#4B4B4B]">
                        {selectedReferralPlan === 'premium' ? 'Premium Program' : 'Welcome Program'}
                      </h3>
                      {selectedReferralPlan !== 'premium' && (
                        <Badge className="bg-blue-100 text-blue-800 border-0">Default</Badge>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowReferralSettingsDialog(true)}
                      className="border-[#ED7424] text-[#ED7424] hover:bg-[#ED7424] hover:text-white"
                    >
                      Change Referral Settings
                    </Button>
                  </div>

                  {/* Referee Benefit */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Gift className="w-5 h-5 text-green-600" />
                      <h4 className="font-medium text-[#4B4B4B]">Referee Benefit</h4>
                    </div>
                    <div className="ml-7">
                      {selectedReferralPlan === 'premium' ? (
                        <div className="flex items-center gap-2">
                          <Bookmark className="w-4 h-4 text-gray-500" />
                          <p className="text-sm text-gray-600">Free course access</p>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Percent className="w-4 h-4 text-gray-500" />
                          <p className="text-sm text-gray-600">10% off</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Referrer Tiers */}
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      <h4 className="font-medium text-[#4B4B4B]">Referrer Tiers</h4>
                    </div>
                    <div className="ml-7 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">1 referral</p>
                        {selectedReferralPlan === 'premium' ? (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm text-gray-600">+100pts</span>
                          </div>
                        ) : (
                          <Gift className="w-4 h-4 text-purple-600" />
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">{selectedReferralPlan === 'premium' ? '15' : '10'} referrals</p>
                        <Calendar className="w-4 h-4 text-blue-600" />
                      </div>
                    </div>
                  </div>

                  {/* Program Settings */}
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center gap-2">
                      <Settings className="w-5 h-5 text-gray-600" />
                      <h4 className="font-medium text-[#4B4B4B]">Program Settings</h4>
                    </div>
                    <div className="ml-7 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">Vesting Period</p>
                        <p className="text-sm text-gray-600">{selectedReferralPlan === 'premium' ? '14' : '7'} days</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">Combine Offers</p>
                        <p className="text-sm text-gray-600">{selectedReferralPlan === 'premium' ? 'No' : 'Yes'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Batch Check Toggle */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium text-[#4B4B4B]">Check if the referrer is a part of the same course and batch?</Label>
                      <p className="text-xs text-gray-600 mt-1">Enable this to restrict referrals to students from the same batch</p>
                    </div>
                    <Switch
                      checked={checkSameBatch}
                      onCheckedChange={setCheckSameBatch}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#4B4B4B]">Customize Invite Form</CardTitle>
                <CardDescription>Configure the fields students will fill out</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Form Fields List */}
                <div className="space-y-4">
                  {formFields.map((field) => (
                    <div key={field.id} className="border rounded-lg p-4 space-y-4 bg-white">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium text-[#4B4B4B]">Form Field #{formFields.indexOf(field) + 1}</h4>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={field.required}
                              onCheckedChange={(checked) => handleUpdateFormField(field.id, { required: checked })}
                              className="scale-90"
                            />
                            <Label className="text-xs text-[#4B4B4B]">Required</Label>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFormField(field.id)}
                            disabled={formFields.length <= 1}
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-[#4B4B4B] mb-2 block">Field Label</Label>
                          <Input
                            placeholder="e.g. Full Name"
                            value={field.label}
                            onChange={(e) => handleUpdateFormField(field.id, { label: e.target.value })}
                            className="h-9"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-[#4B4B4B] mb-2 block">Field Type</Label>
                          <Select
                            value={field.type}
                            onValueChange={(value: FormField['type']) => handleUpdateFormField(field.id, { type: value })}
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text">Text</SelectItem>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="phone">Phone</SelectItem>
                              <SelectItem value="number">Number</SelectItem>
                              <SelectItem value="dropdown">Dropdown</SelectItem>
                              <SelectItem value="textarea">Textarea</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className={field.type === 'dropdown' ? 'lg:col-span-2' : ''}>
                          <Label className="text-sm font-medium text-[#4B4B4B] mb-2 block">Placeholder</Label>
                          <Input
                            placeholder="Enter placeholder text"
                            value={field.placeholder || ''}
                            onChange={(e) => handleUpdateFormField(field.id, { placeholder: e.target.value })}
                            className="h-9"
                          />
                        </div>
                        {field.type !== 'dropdown' && <div></div>}
                      </div>
                      
                      {field.type === 'dropdown' && (
                        <div className="pt-2">
                          <Label className="text-sm font-medium text-[#4B4B4B] mb-2 block">Options (comma separated)</Label>
                          <Input
                            placeholder="Option 1, Option 2, Option 3"
                            value={field.options?.join(', ') || ''}
                            onChange={(e) => handleUpdateFormField(field.id, { 
                              options: e.target.value.split(',').map(opt => opt.trim()).filter(Boolean)
                            })}
                            className="h-9"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Quick Add Buttons */}
                <div className="border-t pt-6">
                  <Label className="text-sm font-medium text-[#4B4B4B] mb-3 block">Quick Add Fields</Label>
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      onClick={() => handleAddFormField('Gender', 'dropdown', ['Male', 'Female', 'Other'])} 
                      variant="outline"
                      size="sm"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                    >
                      <Plus className="w-3 h-3 mr-2" />
                      Add Gender
                    </Button>
                    <Button 
                      onClick={() => handleAddFormField('Address Line 1', 'text')} 
                      variant="outline"
                      size="sm"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                    >
                      <Plus className="w-3 h-3 mr-2" />
                      Add Address Line 1
                    </Button>
                    <Button 
                      onClick={() => handleAddFormField('Region', 'text')} 
                      variant="outline"
                      size="sm"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                    >
                      <Plus className="w-3 h-3 mr-2" />
                      Add Region
                    </Button>
                    <Button 
                      onClick={() => handleAddFormField('Pincode', 'number')} 
                      variant="outline"
                      size="sm"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                    >
                      <Plus className="w-3 h-3 mr-2" />
                      Add Pincode
                    </Button>
                    <Button 
                      onClick={() => handleAddFormField()} 
                      variant="outline"
                      size="sm"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                    >
                      <Plus className="w-3 h-3 mr-2" />
                      Add Custom Field
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>



            {/* Learner Access */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#4B4B4B]">
                  <Clock className="w-5 h-5" />
                  Learner Access Duration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup 
                  value={learnerAccessType}
                  onValueChange={(value: 'defined' | 'session' | 'payment') => setLearnerAccessType(value)}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="defined" id="defined" className="border-[#ED7424] text-[#ED7424]" />
                    <Label htmlFor="defined" className="text-[#4B4B4B]">Define Validity (Days)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="session" id="session" className="border-[#ED7424] text-[#ED7424]" />
                    <Label htmlFor="session" className="text-[#4B4B4B]">Same as Session Expiry</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="payment" id="payment" className="border-[#ED7424] text-[#ED7424]" />
                    <Label htmlFor="payment" className="text-[#4B4B4B]">Same as Payment Plan</Label>
                  </div>
                </RadioGroup>

                {learnerAccessType === 'defined' && (
                  <div className="space-y-2">
                    <Label className="text-[#4B4B4B]">Access Duration (Days)</Label>
                    <Input
                      type="number"
                      value={learnerAccessDays}
                      onChange={(e) => setLearnerAccessDays(parseInt(e.target.value))}
                      min={1}
                      className="w-32"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Invite via Email */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#4B4B4B]">Invite via email</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-[#4B4B4B] mb-2 block">
                      Enter invitee email<span className="text-red-500">*</span>
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        type="email"
                        placeholder="you@email.com"
                        value={currentEmail}
                        onChange={(e) => setCurrentEmail(e.target.value)}
                        onKeyPress={handleEmailKeyPress}
                        className="flex-1"
                      />
                      <Button
                        onClick={handleAddEmail}
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                        disabled={!currentEmail.trim()}
                      >
                        Add
                      </Button>
                    </div>
                  </div>

                  {/* Email Tags */}
                  {inviteEmails.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {inviteEmails.map((email, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                        >
                          <span>{email}</span>
                          <button
                            onClick={() => handleRemoveEmail(email)}
                            className="text-gray-500 hover:text-gray-700 ml-1"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Invite Link */}
                  <div className="mt-6">
                    <Label className="text-sm text-[#4B4B4B] mb-2 block">Invite Link</Label>
                    <div className="flex gap-2">
                      <Input
                        value="https://forms.gle/example123"
                        readOnly
                        className="flex-1 bg-gray-50"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                        onClick={() => navigator.clipboard.writeText("https://forms.gle/example123")}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Custom HTML */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#4B4B4B]">
                  <Code className="w-5 h-5" />
                  Custom HTML
                </CardTitle>
                <CardDescription>Add custom HTML content to the invite page</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Enter custom HTML code here..."
                  value={customHtml}
                  onChange={(e) => setCustomHtml(e.target.value)}
                  className="min-h-[120px] font-mono text-sm"
                />
              </CardContent>
            </Card>

            {/* Include Related Courses */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium text-[#4B4B4B]">Include Related Courses</CardTitle>
                <CardDescription>Show related courses to students on the invite page</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="includeRelatedCourses" 
                    checked={includeRelatedCourses}
                    onCheckedChange={setIncludeRelatedCourses}
                  />
                  <Label htmlFor="includeRelatedCourses" className="text-sm font-medium text-[#4B4B4B]">
                    Show related courses on invite page
                  </Label>
                </div>

                {includeRelatedCourses && (
                  <div className="space-y-3 border-t pt-4">
                    <Label className="text-sm font-medium text-[#4B4B4B]">Related Courses</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {mockCourses.filter(course => course.id !== selectedCourse?.id).slice(0, 4).map(course => (
                        <div key={course.id} className="flex items-center space-x-3 p-3 border rounded-lg bg-gray-50">
                          <img 
                            src={course.previewImage} 
                            alt={course.name}
                            className="w-16 h-12 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-[#4B4B4B] truncate">{course.name}</h4>
                            <p className="text-xs text-gray-600 line-clamp-2">{course.description}</p>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {course.tags.slice(0, 2).map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      These courses will be displayed as suggestions on the invite page to encourage additional enrollments.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateInvite}
                className="bg-[#ED7424] hover:bg-[#D86420] text-white"
              >
                Create Invite Link
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Discount Settings Dialog */}
      <Dialog open={showCouponDialog} onOpenChange={setShowCouponDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sticky top-0 bg-white z-10 pb-4 mb-4 border-b">
            <DialogTitle>Select Discount Settings</DialogTitle>
            <DialogDescription>Choose a discount coupon or create a new one</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pr-2">
            {/* No Discount Option */}
            <div 
              className={cn(
                "border rounded-lg p-4 cursor-pointer transition-all",
                !selectedCoupon ? "border-[#ED7424] ring-2 ring-[#ED7424] ring-opacity-20" : "hover:border-[#ED7424]"
              )}
              onClick={() => {
                setSelectedCoupon(null);
                setShowCouponDialog(false);
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Ban className="w-5 h-5 text-gray-500" />
                  <span className="font-medium text-gray-600">No Discount</span>
                </div>
                {!selectedCoupon && (
                  <Badge className="bg-green-100 text-green-800 border-0">Selected</Badge>
                )}
              </div>
            </div>

            {/* Available Coupons */}
            {mockCoupons.map(coupon => (
              <div 
                key={coupon.id}
                className={cn(
                  "border rounded-lg p-4 cursor-pointer transition-all",
                  selectedCoupon === coupon.id ? "border-[#ED7424] ring-2 ring-[#ED7424] ring-opacity-20" : "hover:border-[#ED7424]"
                )}
                onClick={() => {
                  setSelectedCoupon(coupon.id);
                  setShowCouponDialog(false);
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Tag className="w-5 h-5 text-[#ED7424]" />
                    <span className="font-medium text-[#4B4B4B]">{coupon.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {coupon.isActive && (
                      <Badge className="bg-green-100 text-green-800 border-0">Active</Badge>
                    )}
                    {selectedCoupon === coupon.id && (
                      <Badge className="bg-orange-100 text-orange-800 border-0">Selected</Badge>
                    )}
                  </div>
                </div>
                <div className="ml-7 space-y-1">
                  <p className="text-sm text-gray-600">Code: {coupon.code}</p>
                  <p className="text-sm text-gray-600">
                    {coupon.type === 'percentage'
                      ? `${coupon.value}% off`
                      : `₹${coupon.value} off`
                    }
                  </p>
                  <p className="text-xs text-gray-500">
                    Used {coupon.usedCount}/{coupon.usageLimit} times
                    {coupon.expiryDate && ` • Expires ${coupon.expiryDate}`}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Coupon Link */}
          <div className="flex items-center justify-center pt-6 border-t mt-6 sticky bottom-0 bg-white">
            <Button
              variant="link"
              onClick={() => {
                setShowCouponDialog(false);
                window.location.href = '/institute-settings';
              }}
              className="text-[#ED7424] hover:text-[#D86420]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Discount Coupon in Institute Settings
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvitePage;