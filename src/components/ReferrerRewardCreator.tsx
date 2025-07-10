import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Percent, DollarSign, Calendar, Star, TrendingUp, Gift, FileText, Upload } from 'lucide-react';

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

interface ReferrerRewardCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reward: ReferrerReward) => void;
  editingReward?: ReferrerReward | null;
}

export const ReferrerRewardCreator: React.FC<ReferrerRewardCreatorProps> = ({
  isOpen,
  onClose,
  onSave,
  editingReward
}) => {
  const [formData, setFormData] = useState<Partial<ReferrerReward>>({
    type: 'next_payment_discount_percentage',
    value: 10,
    currency: 'INR',
    pointsPerReferral: 10,
    pointsToReward: 100,
    pointsRewardType: 'membership_days',
    pointsRewardValue: 30,
    contentType: '',
    contentTitle: '',
    contentSource: 'upload',
    contentFile: undefined,
    selectedCourseId: '',
    selectedBatchId: '',
    shareViaEmail: true,
    shareViaWhatsapp: true,
    description: '',
    isDefault: false,
    payoutVestingDays: 7
  });

  useEffect(() => {
    if (editingReward) {
      setFormData(editingReward);
    } else {
      setFormData({
        type: 'next_payment_discount_percentage',
        value: 10,
        currency: 'INR',
        pointsPerReferral: 10,
        pointsToReward: 100,
        pointsRewardType: 'membership_days',
        pointsRewardValue: 30,
        contentType: '',
        contentTitle: '',
        contentSource: 'upload',
        contentFile: undefined,
        selectedCourseId: '',
        selectedBatchId: '',
        shareViaEmail: true,
        shareViaWhatsapp: true,
        description: '',
        isDefault: false,
        payoutVestingDays: 7
      });
    }
  }, [editingReward, isOpen]);

  const handleSave = () => {
    const reward: ReferrerReward = {
      id: editingReward?.id || Date.now().toString(),
      type: formData.type as ReferrerReward['type'],
      value: formData.value,
      currency: formData.currency,
      pointsPerReferral: formData.pointsPerReferral,
      pointsToReward: formData.pointsToReward,
      pointsRewardType: formData.pointsRewardType,
      pointsRewardValue: formData.pointsRewardValue,
      contentType: formData.contentType,
      contentTitle: formData.contentTitle,
      contentSource: formData.contentSource,
      contentFile: formData.contentFile,
      selectedCourseId: formData.selectedCourseId,
      selectedBatchId: formData.selectedBatchId,
      shareViaEmail: formData.shareViaEmail,
      shareViaWhatsapp: formData.shareViaWhatsapp,
      description: formData.description || getDefaultDescription(),
      isDefault: formData.isDefault || false,
      payoutVestingDays: formData.payoutVestingDays
    };

    onSave(reward);
  };

  const getDefaultDescription = () => {
    switch (formData.type) {
      case 'next_payment_discount_percentage':
        return `${formData.value}% discount on next payment or course purchase`;
      case 'next_payment_discount_fixed':
        return `Fixed ${formData.currency === 'USD' ? '$' : '₹'}${formData.value} discount on next payment`;
      case 'membership_extension_days':
        return `${formData.value} days added to current membership`;
      case 'bonus_content':
        return `Free ${formData.contentType} content: ${formData.contentTitle}`;
      case 'points_system':
        return `Earn ${formData.pointsPerReferral} points per referral, ${formData.pointsToReward} points = ${formData.pointsRewardValue} ${
          formData.pointsRewardType === 'membership_days' ? 'free days' : 
          formData.pointsRewardType === 'discount_percentage' ? '% discount' : 
          `${formData.currency === 'USD' ? '$' : '₹'} discount`
        }`;
      default:
        return 'Referral reward for advocates';
    }
  };

  const getIcon = () => {
    switch (formData.type) {
      case 'next_payment_discount_percentage': return <Percent className="w-5 h-5" />;
      case 'next_payment_discount_fixed': return <DollarSign className="w-5 h-5" />;
      case 'membership_extension_days': return <Calendar className="w-5 h-5" />;
      case 'bonus_content': return <Gift className="w-5 h-5" />;
      case 'points_system': return <Star className="w-5 h-5" />;
      default: return <TrendingUp className="w-5 h-5" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getIcon()}
            {editingReward ? 'Edit Advocate Reward' : 'Create Advocate Reward'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Reward Type Selection */}
          <div className="space-y-2">
            <Label>Reward Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value as ReferrerReward['type'] })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="next_payment_discount_percentage">
                  <div className="flex items-center gap-2">
                    <Percent className="w-4 h-4" />
                    Next Payment % Discount
                  </div>
                </SelectItem>
                <SelectItem value="next_payment_discount_fixed">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Next Payment Fixed Discount
                  </div>
                </SelectItem>
                <SelectItem value="membership_extension_days">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Membership Extension
                  </div>
                </SelectItem>
                <SelectItem value="points_system">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Points System
                  </div>
                </SelectItem>
                <SelectItem value="bonus_content">
                  <div className="flex items-center gap-2">
                    <Gift className="w-4 h-4" />
                    Bonus Content
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Conditional Fields */}
          <Card>
            <CardContent className="pt-6">
              {formData.type === 'next_payment_discount_percentage' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Discount Percentage</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={formData.value || ''}
                        onChange={(e) => setFormData({ ...formData, value: parseInt(e.target.value) || 0 })}
                        placeholder="Enter percentage"
                        min="1"
                        max="100"
                      />
                      <span className="text-sm text-gray-500">%</span>
                    </div>
                  </div>
                </div>
              )}

              {formData.type === 'next_payment_discount_fixed' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Currency</Label>
                      <Select
                        value={formData.currency}
                        onValueChange={(value) => setFormData({ ...formData, currency: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="INR">₹ Indian Rupee</SelectItem>
                          <SelectItem value="USD">$ US Dollar</SelectItem>
                          <SelectItem value="EUR">€ Euro</SelectItem>
                          <SelectItem value="GBP">£ British Pound</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Discount Amount</Label>
                      <Input
                        type="number"
                        value={formData.value || ''}
                        onChange={(e) => setFormData({ ...formData, value: parseInt(e.target.value) || 0 })}
                        placeholder="Enter amount"
                        min="1"
                      />
                    </div>
                  </div>
                </div>
              )}

              {formData.type === 'membership_extension_days' && (
                <div className="space-y-2">
                  <Label>Extension Period</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={formData.value || ''}
                      onChange={(e) => setFormData({ ...formData, value: parseInt(e.target.value) || 0 })}
                      placeholder="Enter days"
                      min="1"
                      max="365"
                    />
                    <span className="text-sm text-gray-500">days</span>
                  </div>
                </div>
              )}

              {formData.type === 'points_system' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Points per Referral</Label>
                      <Input
                        type="number"
                        value={formData.pointsPerReferral || ''}
                        onChange={(e) => setFormData({ ...formData, pointsPerReferral: parseInt(e.target.value) || 0 })}
                        placeholder="e.g., 10"
                        min="1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Points to Redeem</Label>
                      <Input
                        type="number"
                        value={formData.pointsToReward || ''}
                        onChange={(e) => setFormData({ ...formData, pointsToReward: parseInt(e.target.value) || 0 })}
                        placeholder="e.g., 100"
                        min="1"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Reward Type</Label>
                    <Select
                      value={formData.pointsRewardType}
                      onValueChange={(value) => setFormData({ ...formData, pointsRewardType: value as ReferrerReward['pointsRewardType'] })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="membership_days">Membership Days</SelectItem>
                        <SelectItem value="discount_percentage">Discount Percentage</SelectItem>
                        <SelectItem value="discount_fixed">Fixed Discount Amount</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Reward Value</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={formData.pointsRewardValue || ''}
                        onChange={(e) => setFormData({ ...formData, pointsRewardValue: parseInt(e.target.value) || 0 })}
                        placeholder="Enter value"
                        min="1"
                      />
                      <span className="text-sm text-gray-500">
                        {formData.pointsRewardType === 'membership_days' ? 'days' : 
                         formData.pointsRewardType === 'discount_percentage' ? '%' : 
                         formData.currency === 'USD' ? '$' : '₹'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {formData.type === 'bonus_content' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Content Type</Label>
                    <Input
                      value={formData.contentType || ''}
                      onChange={(e) => setFormData({ ...formData, contentType: e.target.value })}
                      placeholder="e.g., PDF, Video, Audio, Document, etc."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Content Source</Label>
                    <Select
                      value={formData.contentSource}
                      onValueChange={(value) => setFormData({ ...formData, contentSource: value as 'upload' | 'existing' })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upload">Upload New Content</SelectItem>
                        <SelectItem value="existing">Choose from Existing Content</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.contentSource === 'upload' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Content Title</Label>
                        <Input
                          value={formData.contentTitle || ''}
                          onChange={(e) => setFormData({ ...formData, contentTitle: e.target.value })}
                          placeholder="e.g., Advanced Study Guide, Bonus Tutorial Video"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Upload Content File</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                          <input
                            type="file"
                            id="contentFile"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setFormData({ ...formData, contentFile: file });
                              }
                            }}
                          />
                          <label htmlFor="contentFile" className="cursor-pointer">
                            <div className="flex flex-col items-center gap-2">
                              <Upload className="w-8 h-8 text-gray-400" />
                              <div>
                                <p className="text-sm font-medium text-gray-700">
                                  Click to upload content file
                                </p>
                                <p className="text-xs text-gray-500">
                                  Any file format accepted
                                </p>
                              </div>
                            </div>
                          </label>
                        </div>
                        
                        {formData.contentFile && (
                          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-medium text-green-800">
                                {formData.contentFile.name}
                              </span>
                            </div>
                            <p className="text-xs text-green-600 mt-1">
                              File size: {(formData.contentFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {formData.contentSource === 'existing' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Select Course</Label>
                        <Select
                          value={formData.selectedCourseId}
                          onValueChange={(value) => setFormData({ ...formData, selectedCourseId: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a course" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="course1">JavaScript Fundamentals</SelectItem>
                            <SelectItem value="course2">React Development</SelectItem>
                            <SelectItem value="course3">Python Programming</SelectItem>
                            <SelectItem value="course4">Data Science Basics</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Select Batch</Label>
                        <Select
                          value={formData.selectedBatchId}
                          onValueChange={(value) => setFormData({ ...formData, selectedBatchId: value })}
                          disabled={!formData.selectedCourseId}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a batch" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="batch1">Morning Batch (9 AM - 12 PM)</SelectItem>
                            <SelectItem value="batch2">Afternoon Batch (2 PM - 5 PM)</SelectItem>
                            <SelectItem value="batch3">Evening Batch (6 PM - 9 PM)</SelectItem>
                            <SelectItem value="batch4">Weekend Batch (Sat-Sun)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {/* Content Sharing Options */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Share Content Via</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="shareEmail"
                          checked={formData.shareViaEmail || false}
                          onChange={(e) => setFormData({ ...formData, shareViaEmail: e.target.checked })}
                        />
                        <Label htmlFor="shareEmail" className="text-sm">Email</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="shareWhatsapp"
                          checked={formData.shareViaWhatsapp || false}
                          onChange={(e) => setFormData({ ...formData, shareViaWhatsapp: e.target.checked })}
                        />
                        <Label htmlFor="shareWhatsapp" className="text-sm">WhatsApp</Label>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">Select how the bonus content will be delivered to advocates</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={formData.description || getDefaultDescription()}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe this reward for advocates"
              rows={3}
            />
          </div>

          {/* Payout Timing */}
          <div className="space-y-2">
            <Label>Release Reward After</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={formData.payoutVestingDays || ''}
                onChange={(e) => setFormData({ ...formData, payoutVestingDays: parseInt(e.target.value) || 0 })}
                placeholder="Enter days"
                min="0"
                max="365"
              />
              <span className="text-sm text-gray-500">days</span>
            </div>
            <p className="text-xs text-gray-500">Reward will be held for this period to account for potential refunds or cancellations</p>
          </div>

          {/* Default Setting */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <Label className="text-sm font-medium">Set as Default</Label>
              <p className="text-xs text-gray-600">This will be the default reward for new courses</p>
            </div>
            <Switch
              checked={formData.isDefault || false}
              onCheckedChange={(checked) => setFormData({ ...formData, isDefault: checked })}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingReward ? 'Update Reward' : 'Create Reward'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 