import React, { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  ArrowRight, 
  CreditCard, 
  CheckCircle, 
  User, 
  Mail,
  Phone,
  Building,
  Calendar,
  DollarSign,
  Percent,
  Tag,
  Info,
  Lock,
  Check,
  BookOpen,
  Users,
  Clock,
  Star
} from 'lucide-react';

interface Course {
  id: string;
  name: string;
  description: string;
  previewImage: string;
  bannerImage: string;
  instructor: string;
  duration: string;
  level: string;
  tags: string[];
  learningObjectives: string;
  aboutCourse: string;
  targetAudience: string;
  needsApproval: boolean;
  paymentModel: 'subscription' | 'oneTime' | 'donation' | 'free';
}

interface PaymentPlan {
  id: string;
  name: string;
  type: 'subscription' | 'upfront' | 'donation';
  currency: string;
  price?: number;
  interval?: string;
  features: string[];
  isPopular?: boolean;
}

interface DiscountCoupon {
  id: string;
  code: string;
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
  currency?: string;
}

const StudentInvitePage = () => {
  // Get invite parameters from URL
  const { inviteId } = useParams();
  const [searchParams] = useSearchParams();
  const paymentModel = searchParams.get('paymentModel') || 'subscription';
  const needsApproval = searchParams.get('needsApproval') === 'true';
  
  // Debug logging
  console.log('Invite ID:', inviteId);
  console.log('Payment Model:', paymentModel);
  console.log('Needs Approval:', needsApproval);
  
  // Step management
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');
  
  // Payment plan selection
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedCoupon, setSelectedCoupon] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [customDonationAmount, setCustomDonationAmount] = useState<number>(0);
  
  // Payment details
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');

  // Mock course data - this would come from the invite link
  const course: Course = {
    id: '1',
    name: 'Web Development Fundamentals',
    description: 'Learn web development from scratch. This course will guide you through the basics of HTML, CSS, and JavaScript, and introduce you to modern frameworks and tools used by professional developers. You will also explore best practices, version control, and how to collaborate on real-world projects. By the end, you will have built several portfolio-worthy applications and gained the confidence to tackle more advanced topics.',
    previewImage: '/placeholder.svg',
    bannerImage: '/placeholder.svg',
    instructor: 'Jane Doe',
    duration: '8 weeks',
    level: 'Beginner',
    tags: ['web', 'development', 'javascript'],
    learningObjectives: 'By the end of this course, you will be able to build modern, responsive web applications, understand the fundamentals of web technologies, and deploy your projects online. You will also gain hands-on experience with real-world projects, collaborative coding, and learn how to debug and optimize your code for performance and accessibility.',
    aboutCourse: 'This comprehensive course covers everything you need to start your journey as a web developer. You will learn through interactive lessons, coding exercises, and project-based assignments. The curriculum is designed for absolute beginners and gradually progresses to advanced topics, ensuring a solid foundation and practical skills. Topics include HTML, CSS, JavaScript, responsive design, version control with Git, and an introduction to popular frameworks like React. You will also learn about web hosting, deployment, and how to keep your codebase organized and maintainable.',
    targetAudience: 'Beginners interested in web development',
    paymentModel: paymentModel as 'subscription' | 'oneTime' | 'donation' | 'free',
    needsApproval: needsApproval
  };

  // Get payment plans based on the course payment model
  const getPaymentPlans = () => {
    console.log('Getting payment plans for model:', course.paymentModel);
    switch (course.paymentModel) {
      case 'subscription':
        return [
          {
            id: '1month',
            name: '1 Month Plan',
            type: 'subscription' as const,
            currency: 'USD',
            price: 19.99,
            interval: 'month',
            features: ['Access to all modules', 'Community support', '1 month access'],
            isPopular: false
          },
          {
            id: '3months',
            name: '3 Months Plan',
            type: 'subscription' as const,
            currency: 'USD',
            price: 49.99,
            interval: '3 months',
            features: ['Access to all modules', 'Community support', '3 months access', 'Save 17%'],
            isPopular: true
          },
          {
            id: '6months',
            name: '6 Months Plan',
            type: 'subscription' as const,
            currency: 'USD',
            price: 89.99,
            interval: '6 months',
            features: ['Access to all modules', 'Community support', '6 months access', 'Save 25%'],
            isPopular: false
          },
          {
            id: '12months',
            name: '12 Months Plan',
            type: 'subscription' as const,
            currency: 'USD',
            price: 159.99,
            interval: '12 months',
            features: ['Access to all modules', 'Community support', '12 months access', 'Save 33%'],
            isPopular: false
          }
        ];
      case 'oneTime':
        return [
          {
            id: 'onetime',
            name: 'One-Time Payment',
            type: 'upfront' as const,
            currency: 'USD',
            price: 99.99,
            features: ['Full course access', 'Certificate', 'Community support', 'Lifetime access']
          }
        ];
      case 'donation':
        return [
          {
            id: 'donation',
            name: 'Pay What You Want',
            type: 'donation' as const,
            currency: 'USD',
            features: ['Full course access', 'Certificate', 'Community support', 'Support the creator']
          }
        ];
      case 'free':
        return [];
      default:
        return [];
    }
  };

  const paymentPlans = getPaymentPlans();
  console.log('Available payment plans:', paymentPlans);

  // Auto-select plan based on payment model
  React.useEffect(() => {
    if (course.paymentModel === 'oneTime' && paymentPlans.length > 0) {
      setSelectedPlan(paymentPlans[0].id);
    }
  }, [course.paymentModel, paymentPlans]);

  // Force re-render when URL parameters change
  React.useEffect(() => {
    console.log('URL Parameters changed:', { paymentModel, needsApproval });
  }, [paymentModel, needsApproval]);

  // Mock discount coupons
  const availableCoupons: DiscountCoupon[] = [
    {
      id: '1',
      code: 'WELCOME20',
      name: 'Welcome Discount',
      type: 'percentage',
      value: 20
    },
    {
      id: '2',
      code: 'STUDENT500',
      name: 'Student Discount',
      type: 'fixed',
      value: 500,
      currency: 'INR'
    },
    {
      id: '3',
      code: 'REFERRAL10',
      name: 'Referral Bonus',
      type: 'percentage',
      value: 10
    }
  ];

  const steps = [
    { id: 0, name: 'Course Preview & Registration', description: 'Review course and fill registration form' },
    { id: 1, name: 'Choose Plan', description: 'Select payment plan and discounts' },
    { id: 2, name: 'Order Summary', description: 'Review your order details' },
    { id: 3, name: 'Payment', description: 'Complete payment' },
    { id: 4, name: 'Welcome', description: 'Access your course' }
  ];

  // For free courses, skip step 1 (payment plan selection)
  const effectiveSteps = course.paymentModel === 'free' ? steps.filter(step => step.id !== 1) : steps;

  const getSelectedPlan = () => paymentPlans.find(plan => plan.id === selectedPlan);
  const getSelectedCouponData = () => availableCoupons.find(coupon => coupon.id === selectedCoupon);

  const calculateDiscount = () => {
    const plan = getSelectedPlan();
    const coupon = getSelectedCouponData();
    if (!plan || !coupon || plan.type === 'donation') return 0;
    
    if (coupon.type === 'percentage') {
      return (plan.price! * coupon.value) / 100;
    }
    return coupon.value;
  };

  const calculateTotal = () => {
    const plan = getSelectedPlan();
    if (!plan) return 0;
    
    if (plan.type === 'donation') {
      return customDonationAmount - calculateDiscount();
    }
    
    return (plan.price || 0) - calculateDiscount();
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 0:
        return email && fullName;
      case 1:
        // Skip step 1 for free courses
        if (course.paymentModel === 'free') return true;
        // For donation, no selection is also valid (treats as $0)
        if (course.paymentModel === 'donation') {
          return true; // Always allow proceeding, even without selection
        }
        return selectedPlan !== null;
      case 2:
        return true;
      case 3:
        // Skip payment for free courses
        if (course.paymentModel === 'free') return true;
        // For $0 donations or no selection, no payment validation required
        if (course.paymentModel === 'donation' && (customDonationAmount === 0 || selectedPlan === null)) return true;
        return cardNumber && expiryDate && cvv && cardholderName;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (canProceedToNext()) {
      let nextStep = currentStep + 1;
      
      // For free courses, skip step 1 (payment plan selection)
      if (course.paymentModel === 'free' && nextStep === 1) {
        nextStep = 2;
      }
      
      // For free courses, skip step 3 (payment) and go directly to welcome
      if (course.paymentModel === 'free' && nextStep === 3) {
        nextStep = 4;
      }
      
      if (nextStep <= 4) {
        setCurrentStep(nextStep);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleApplyCoupon = () => {
    const coupon = availableCoupons.find(c => c.code === couponCode.toUpperCase());
    if (coupon) {
      setSelectedCoupon(coupon.id);
      setCouponCode('');
    }
  };

  const scrollToInviteForm = () => {
    const element = document.getElementById('invite-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderStep0 = () => (
    <div className="space-y-8">
      {/* Course Preview */}
      <section className="bg-white/90 rounded-3xl shadow-xl p-6 border border-gray-100 mb-2">
        {/* Banner Image at the top */}
        <div className="mb-6 overflow-hidden rounded-xl">
          <img
            src={course.bannerImage}
            alt="Course banner"
            className="w-full h-28 object-cover rounded-xl border border-gray-100 shadow-sm"
          />
        </div>
        {/* Title and Tags - left-aligned, no image before */}
        <div className="mb-3">
          <h1 className="text-2xl font-extrabold mb-2 text-gray-900 tracking-tight leading-tight">{course.name}</h1>
          <div className="flex flex-wrap gap-2">
            {course.tags.map((tag) => (
              <span key={tag} className="bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-xs font-medium shadow-sm">{tag}</span>
            ))}
          </div>
        </div>
        {/* Description - more detailed */}
        <p className="text-gray-700 mb-3 text-base leading-relaxed">{course.description}</p>
        {/* Details (only Level) */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-blue-50 text-blue-700 rounded-full px-3 py-1 text-xs font-semibold">
            Level: {course.level}
          </span>
        </div>
        {/* What learners will gain - more detailed */}
        <div className="mb-6">
          <h2 className="font-semibold text-lg mb-2 text-gray-900">What learners will gain</h2>
          <p className="text-gray-700 text-base leading-relaxed">{course.learningObjectives}</p>
        </div>
        {/* About the course - more detailed */}
        <div>
          <h2 className="font-semibold text-lg mb-2 text-gray-900">About the course</h2>
          <p className="text-gray-700 text-base leading-relaxed">{course.aboutCourse}</p>
        </div>
      </section>
      
      {/* Registration Form */}
      <section id="invite-form" className="bg-white/90 rounded-3xl shadow p-6 border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-[#ED7424]" />
          <h2 className="text-lg font-bold text-gray-900">Join this Course</h2>
        </div>
        <div className="space-y-4">
          <div>
            <Label htmlFor="fullName" className="text-sm font-medium text-gray-800">
              Full Name *
            </Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="border border-gray-200 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#ED7424] bg-gray-50 transition placeholder-gray-400"
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-sm font-medium text-gray-800">
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="border border-gray-200 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#ED7424] bg-gray-50 transition placeholder-gray-400"
            />
          </div>
          <div>
            <Label htmlFor="phone" className="text-sm font-medium text-gray-800">
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number (optional)"
              className="border border-gray-200 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#ED7424] bg-gray-50 transition placeholder-gray-400"
            />
          </div>

          <Button
            onClick={handleNext}
            disabled={!fullName || !email}
            className="w-full bg-[#ED7424] text-white rounded-lg py-2 font-semibold hover:bg-orange-600 transition shadow focus:ring-2 focus:ring-[#ED7424] focus:outline-none"
          >
            Register
          </Button>
        </div>
      </section>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-8">
      <section className="bg-white/90 rounded-3xl shadow-xl p-6 border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-[#ED7424]" />
          <h2 className="text-lg font-bold text-gray-900">Choose Your Plan</h2>
        </div>
        <p className="text-gray-600 mb-6">
          {course.paymentModel === 'free' ? 'This step is skipped for free courses' : 'Select the payment plan that works best for you'}
        </p>

        {/* Payment Plans */}
        {course.paymentModel === 'free' ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Payment Required</h3>
            <p className="text-gray-600">
              This course is completely free. You will have full access to all course materials.
            </p>
          </div>
        ) : course.paymentModel === 'donation' ? (
          <div className="space-y-6">
            {/* Donation Chips */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Choose a donation amount (optional):</h3>
              <div className="grid grid-cols-3 gap-3">
                {[0, 10, 20, 30, 50, 75, 100].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => {
                      setSelectedPlan('donation');
                      setCustomDonationAmount(amount);
                    }}
                    className={`p-3 border rounded-lg text-center transition-all ${
                      selectedPlan === 'donation' && customDonationAmount === amount
                        ? 'border-[#ED7424] bg-orange-50 text-[#ED7424]'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className="font-semibold">${amount}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Or enter a custom amount (optional):</h3>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">$</span>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={customDonationAmount || ''}
                  onChange={(e) => {
                    const amount = Number(e.target.value);
                    setCustomDonationAmount(amount);
                    if (amount >= 0) {
                      setSelectedPlan('donation');
                    }
                  }}
                  className="flex-1"
                />
                <span className="text-gray-600">USD</span>
              </div>
            </div>

            {/* Plan Features */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-semibold text-gray-900 mb-2">What you'll get:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Full course access</li>
                <li>• Certificate of completion</li>
                <li>• Community support</li>
                <li>• Support the creator</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {paymentPlans.map((plan) => (
              <div
                key={plan.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedPlan === plan.id ? 'border-[#ED7424] bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                } ${course.paymentModel === 'oneTime' ? 'cursor-default' : ''}`}
                onClick={() => course.paymentModel !== 'oneTime' && setSelectedPlan(plan.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                    <p className="text-sm text-gray-600">${plan.price}{plan.interval ? `/${plan.interval}` : ''}</p>
                    <ul className="text-xs text-gray-500 mt-1">
                      {plan.features.map((feature, index) => (
                        <li key={index}>• {feature}</li>
                      ))}
                    </ul>
                  </div>
                  {selectedPlan === plan.id && (
                    <CheckCircle className="w-5 h-5 text-[#ED7424]" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Discount Section */}
      {course.paymentModel !== 'free' && selectedPlan && getSelectedPlan()?.type !== 'donation' && (
        <section className="bg-white/90 rounded-3xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Tag className="w-5 h-5 text-[#ED7424]" />
            <h2 className="text-lg font-bold text-gray-900">Apply Discount</h2>
          </div>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleApplyCoupon} variant="outline">
                Apply
              </Button>
            </div>
            
            {selectedCoupon && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-800">
                      {getSelectedCouponData()?.name} Applied
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCoupon(null)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </Button>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  {getSelectedCouponData()?.type === 'percentage' 
                    ? `${getSelectedCouponData()?.value}% off`
                    : `$${getSelectedCouponData()?.value} off`
                  }
                </p>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-8">
      <section className="bg-white/90 rounded-3xl shadow-xl p-6 border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-5 h-5 text-[#ED7424]" />
          <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
        </div>
        <p className="text-gray-600 mb-6">
          {course.paymentModel === 'free' ? 'Review your enrollment details' : 'Review your order before proceeding to payment'}
        </p>

        {/* Order Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img src={course.previewImage} alt={course.name} className="w-16 h-12 object-cover rounded" />
            <div>
              <h3 className="font-medium">{course.name}</h3>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
                          <div className="flex justify-between">
                <span>Plan:</span>
                <span className="font-medium">
                  {course.paymentModel === 'free' ? 'Free Course' : getSelectedPlan()?.name}
                </span>
              </div>
              {course.paymentModel !== 'free' && getSelectedPlan()?.type !== 'donation' && (
                <div className="flex justify-between">
                  <span>Price:</span>
                  <span>${(getSelectedPlan() as any)?.price || 0}</span>
                </div>
              )}
              {course.paymentModel !== 'free' && selectedCoupon && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({getSelectedCouponData()?.name}):</span>
                  <span>-${calculateDiscount().toFixed(2)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>
                  {course.paymentModel === 'free' ? 'Free' : `$${calculateTotal().toFixed(2)}`}
                </span>
              </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="bg-white/90 rounded-3xl shadow-xl p-6 border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-[#ED7424]" />
          <h2 className="text-lg font-bold text-gray-900">Contact Information</h2>
        </div>
        <div className="space-y-4">
          <div>
            <Label htmlFor="editFullName" className="text-sm font-medium text-gray-800">
              Full Name
            </Label>
            <Input
              id="editFullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#ED7424] bg-gray-50 transition"
            />
          </div>
          <div>
            <Label htmlFor="editEmail" className="text-sm font-medium text-gray-800">
              Email Address
            </Label>
            <Input
              id="editEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#ED7424] bg-gray-50 transition"
            />
          </div>
          {phone && (
            <div>
              <Label htmlFor="editPhone" className="text-sm font-medium text-gray-800">
                Phone Number
              </Label>
              <Input
                id="editPhone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#ED7424] bg-gray-50 transition"
              />
            </div>
          )}
          {organization && (
            <div>
              <Label htmlFor="editOrganization" className="text-sm font-medium text-gray-800">
                Organization
              </Label>
              <Input
                id="editOrganization"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#ED7424] bg-gray-50 transition"
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-8">
      <section className="bg-white/90 rounded-3xl shadow-xl p-6 border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="w-5 h-5 text-[#ED7424]" />
          <h2 className="text-lg font-bold text-gray-900">Payment Information</h2>
        </div>
        <p className="text-gray-600 mb-6">
          {course.paymentModel === 'free' ? 'No payment required for this free course' : 
           course.paymentModel === 'donation' && (customDonationAmount === 0 || selectedPlan === null) ? 'No payment required for this free enrollment' :
           'Enter your payment details to complete the purchase'}
        </p>

        {(course.paymentModel === 'free' || (course.paymentModel === 'donation' && (customDonationAmount === 0 || selectedPlan === null))) ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Payment Required</h3>
            <p className="text-gray-600">
              {course.paymentModel === 'free' 
                ? 'This is a free course. You can proceed directly to access the course materials.'
                : selectedPlan === null
                ? 'You have chosen to enroll without a donation. You can proceed directly to access the course materials.'
                : 'You have chosen to enroll for free. You can proceed directly to access the course materials.'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="cardholderName" className="text-sm font-medium text-gray-800">
                Cardholder Name
              </Label>
              <Input
                id="cardholderName"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                placeholder="Name on card"
                className="border border-gray-200 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#ED7424] bg-gray-50 transition placeholder-gray-400"
              />
            </div>
            
            <div>
              <Label htmlFor="cardNumber" className="text-sm font-medium text-gray-800">
                Card Number
              </Label>
              <Input
                id="cardNumber"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                className="border border-gray-200 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#ED7424] bg-gray-50 transition placeholder-gray-400"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate" className="text-sm font-medium text-gray-800">
                  Expiry Date
                </Label>
                <Input
                  id="expiryDate"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  placeholder="MM/YY"
                  maxLength={5}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#ED7424] bg-gray-50 transition placeholder-gray-400"
                />
              </div>
              <div>
                <Label htmlFor="cvv" className="text-sm font-medium text-gray-800">
                  CVV
                </Label>
                <Input
                  id="cvv"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  placeholder="123"
                  maxLength={4}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#ED7424] bg-gray-50 transition placeholder-gray-400"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Lock className="w-4 h-4" />
              <span>Your payment information is secure and encrypted</span>
            </div>
          </div>
        )}
      </section>

      {/* Order Summary */}
      <section className="bg-white/90 rounded-3xl shadow-xl p-6 border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-5 h-5 text-[#ED7424]" />
          <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
        </div>
        <div className="space-y-2">
                      <div className="flex justify-between">
              <span>{course.name}</span>
              <span>{course.paymentModel === 'free' ? 'Free' : `$${calculateTotal().toFixed(2)}`}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold">
              <span>{course.paymentModel === 'free' ? 'Total:' : 'Total to Pay:'}</span>
              <span>{course.paymentModel === 'free' ? 'Free' : `$${calculateTotal().toFixed(2)}`}</span>
            </div>
        </div>
      </section>
    </div>
  );

  const renderStep4 = () => (
    <section className="bg-white/90 rounded-3xl shadow-xl p-6 border border-gray-100 text-center">
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
      </div>
      
      <div className="mb-8">
        {course.needsApproval ? (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Enrollment Request Submitted!</h2>
            <p className="text-gray-600 mb-4">
              Thank you for your interest in {course.name}. Your enrollment request has been submitted successfully.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-800">Approval Required</span>
              </div>
              <p className="text-sm text-blue-700">
                Your enrollment request is being reviewed by our team. You will receive an email notification once approved.
              </p>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to {course.name}!</h2>
            <p className="text-gray-600 mb-4">
              Your enrollment has been successful. You now have access to all course materials.
            </p>
          </>
        )}
      </div>
      
      <div className="space-y-3">
        {course.needsApproval ? (
          <Button variant="outline" className="w-full">
            <Mail className="w-4 h-4 mr-2" />
            Check Email Status
          </Button>
        ) : (
          <>
            <Button className="w-full bg-[#ED7424] hover:bg-[#D86420] text-white">
              <BookOpen className="w-4 h-4 mr-2" />
              Access Course
            </Button>
            <Button variant="outline" className="w-full">
              Download Receipt
            </Button>
          </>
        )}
      </div>
    </section>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderStep0();
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return renderStep0();
    }
  };

  return (
    <div key={`${paymentModel}-${needsApproval}`} className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center px-2 py-6 font-sans">
      <div className={`w-full max-w-md mx-auto ${currentStep === 0 ? 'pb-24' : ''}`}>
        {/* Progress Bar - Only show from step 1 onwards */}
        {currentStep > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {effectiveSteps.slice(1).map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                    currentStep >= step.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
                  </div>
                  {index < effectiveSteps.slice(1).length - 1 && (
                    <div className={`w-16 h-1 mx-2 ${
                      currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <Progress value={(currentStep / (effectiveSteps.length - 1)) * 100} className="h-2" />
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              {effectiveSteps.slice(1).map((step) => (
                <span key={step.id} className={currentStep >= step.id ? 'text-blue-600 font-medium' : ''}>
                  {step.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Step Content */}
        <div className="space-y-8">
          {renderCurrentStep()}
        </div>

        {/* Navigation Buttons - Only show for steps 0-3 */}
        {currentStep < 4 && (
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!canProceedToNext()}
              className="flex items-center gap-2 bg-[#ED7424] hover:bg-[#D86420] text-white"
            >
              {currentStep === 3 ? 'Complete Payment' : 
               currentStep === 2 && course.paymentModel === 'free' ? 'Complete Enrollment' : 'Next'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Fixed Bottom Bar - Only show on step 0 */}
      {currentStep === 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
          <div className="max-w-md mx-auto">
            <Button
              onClick={scrollToInviteForm}
              className="w-full bg-[#ED7424] text-white rounded-lg py-3 font-semibold hover:bg-orange-600 transition shadow-lg focus:ring-2 focus:ring-[#ED7424] focus:outline-none text-lg"
            >
              Enroll Now
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentInvitePage; 