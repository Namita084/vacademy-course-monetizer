import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Plus, 
  Edit, 
  Trash2, 
  TrendingUp, 
  Users, 
  Gift, 
  Copy,
  Eye,
  Settings,
  Star,
  Award,
  Target,
  Zap,
  CheckCircle,
  XCircle,
  Percent,
  DollarSign,
  Calendar,
  BookOpen
} from 'lucide-react';
import { UnifiedReferralSettings, UnifiedReferralSettings as UnifiedReferralSettingsType } from './UnifiedReferralSettings';

interface ReferralProgramsManagerProps {
  programs: UnifiedReferralSettingsType[];
  onCreateProgram: () => void;
  onEditProgram: (program: UnifiedReferralSettingsType) => void;
  onDeleteProgram: (programId: string) => void;
  onSetDefaultProgram: (programId: string) => void;
  onDuplicateProgram: (program: UnifiedReferralSettingsType) => void;
}

export const ReferralProgramsManager: React.FC<ReferralProgramsManagerProps> = ({
  programs,
  onCreateProgram,
  onEditProgram,
  onDeleteProgram,
  onSetDefaultProgram,
  onDuplicateProgram
}) => {
  const [selectedProgram, setSelectedProgram] = useState<UnifiedReferralSettingsType | null>(null);
  const [showProgramDetails, setShowProgramDetails] = useState(false);

  const getRewardTypeIcon = (type: string) => {
    switch(type) {
      case 'discount_percentage': return <Percent className="w-4 h-4 text-green-600" />;
      case 'discount_fixed': return <DollarSign className="w-4 h-4 text-green-600" />;
      case 'bonus_content': return <Gift className="w-4 h-4 text-purple-600" />;
      case 'free_days': return <Calendar className="w-4 h-4 text-blue-600" />;
      case 'free_course': return <BookOpen className="w-4 h-4 text-indigo-600" />;
      case 'points_system': return <Star className="w-4 h-4 text-yellow-600" />;
      default: return <Gift className="w-4 h-4 text-purple-600" />;
    }
  };

  const handleViewProgram = (program: UnifiedReferralSettingsType) => {
    setSelectedProgram(program);
    setShowProgramDetails(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Referral Programs</h2>
          <p className="text-gray-600">Manage multiple referral programs with different reward structures</p>
        </div>
        <Button onClick={onCreateProgram} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create New Program
        </Button>
      </div>

      {/* Programs Grid */}
      {programs.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">No referral programs created</h3>
            <p className="text-gray-600 mb-4">Create your first referral program to start incentivizing referrals</p>
            <Button onClick={onCreateProgram}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Program
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {programs.map((program) => (
            <Card key={program.id} className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
              program.isDefault 
                ? 'border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-sm' 
                : 'border-gray-200 bg-gradient-to-br from-gray-50 to-slate-50'
            }`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${program.isDefault ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      <TrendingUp className={`w-5 h-5 ${program.isDefault ? 'text-blue-600' : 'text-gray-500'}`} />
                    </div>
                    <CardTitle className="text-lg">{program.label}</CardTitle>
                  </div>
                  <div className="flex items-center gap-1">
                    {program.isDefault && (
                      <Badge variant="default" className="text-xs flex items-center gap-1 bg-blue-600">
                        <Award className="w-3 h-3" />
                        Default
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Referee Benefit Summary */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 rounded-md bg-green-100">
                      <Gift className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-800">Referee Benefit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getRewardTypeIcon(program.refereeReward.type)}</span>
                    <div className="text-sm">
                      {program.refereeReward.type === 'discount_percentage' && `${program.refereeReward.value}% off`}
                      {program.refereeReward.type === 'discount_fixed' && `₹${program.refereeReward.value} off`}
                      {program.refereeReward.type === 'free_days' && `${program.refereeReward.value} free days`}
                      {program.refereeReward.type === 'bonus_content' && 'Bonus content'}
                      {program.refereeReward.type === 'free_course' && 'Free course access'}
                    </div>
                  </div>
                </div>

                {/* Referrer Tiers Summary */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 rounded-md bg-blue-100">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-800">Referrer Tiers</span>
                  </div>
                  <div className="space-y-1">
                    {program.referrerRewards.slice(0, 2).map((tier, index) => (
                      <div key={tier.id} className="flex items-center justify-between text-xs">
                        <span>{tier.referralCount} referral{tier.referralCount !== 1 ? 's' : ''}</span>
                        <div className="flex items-center gap-1">
                          <span>{getRewardTypeIcon(tier.reward.type)}</span>
                          {tier.reward.type === 'points_system' && tier.reward.pointsPerReferral && (
                            <span className="text-xs text-blue-600 font-medium">
                              +{tier.reward.pointsPerReferral}pts
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                    {program.referrerRewards.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{program.referrerRewards.length - 2} more tiers
                      </div>
                    )}
                  </div>
                </div>

                {/* Program Settings Summary */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 rounded-md bg-gray-100">
                      <Settings className="w-4 h-4 text-gray-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-800">Program Settings</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2 bg-gray-50 rounded">
                      <span className="text-gray-500 block mb-1">Vesting Period</span>
                      <div className="font-medium text-gray-800">{program.payoutVestingDays} days</div>
                    </div>
                    <div className="p-2 bg-gray-50 rounded">
                      <span className="text-gray-500 block mb-1">Combine Offers</span>
                      <div className="font-medium text-gray-800">{program.allowCombineOffers ? 'Yes' : 'No'}</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewProgram(program)}
                    className="flex-1 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditProgram(program)}
                    className="hover:bg-green-50 hover:border-green-300 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDuplicateProgram(program)}
                    className="hover:bg-purple-50 hover:border-purple-300 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300 transition-colors"
                    onClick={() => onDeleteProgram(program.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Program Details Modal */}
      {showProgramDetails && selectedProgram && (
        <ProgramDetailsModal
          program={selectedProgram}
          isOpen={showProgramDetails}
          onClose={() => {
            setShowProgramDetails(false);
            setSelectedProgram(null);
          }}
          onEdit={() => {
            onEditProgram(selectedProgram);
            setShowProgramDetails(false);
            setSelectedProgram(null);
          }}
        />
      )}
    </div>
  );
};

// Program Details Modal Component
interface ProgramDetailsModalProps {
  program: UnifiedReferralSettingsType;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}

const ProgramDetailsModal: React.FC<ProgramDetailsModalProps> = ({
  program,
  isOpen,
  onClose,
  onEdit
}) => {
  if (!isOpen) return null;

  const getRewardTypeLabel = (type: string) => {
    switch(type) {
      case 'discount_percentage': return 'Percentage Discount';
      case 'discount_fixed': return 'Fixed Discount';
      case 'bonus_content': return 'Bonus Content';
      case 'free_days': return 'Free Days';
      case 'free_course': return 'Free Course';
      case 'points_system': return 'Points System';
      default: return type;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{program.label}</h2>
              <p className="text-gray-600">Program Details & Configuration</p>
            </div>
            <div className="flex items-center gap-2">
              {program.isDefault && (
                <Badge variant="default" className="bg-blue-600">
                  <Award className="w-3 h-3 mr-1" />
                  Default
                </Badge>
              )}
              <Button onClick={onEdit} className="flex items-center gap-2">
                <Edit className="w-4 h-4" />
                Edit Program
              </Button>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Referee Benefits */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-green-600" />
                Referee Benefits (One-time)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{getRewardTypeLabel(program.refereeReward.type)}</span>
                  {program.refereeReward.value && (
                    <Badge variant="secondary">
                      {program.refereeReward.value}
                      {program.refereeReward.type === 'discount_percentage' ? '%' : 
                       program.refereeReward.type === 'free_days' ? ' days' : ''}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-700">{program.refereeReward.description}</p>
                {program.refereeReward.delivery && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-500">Delivery:</span>
                    {program.refereeReward.delivery.email && (
                      <Badge variant="outline" className="text-xs">📧 Email</Badge>
                    )}
                    {program.refereeReward.delivery.whatsapp && (
                      <Badge variant="outline" className="text-xs">💬 WhatsApp</Badge>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Referrer Tiers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Referrer Rewards (Tiered)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {program.referrerRewards
                  .sort((a, b) => a.referralCount - b.referralCount)
                  .map((tier) => (
                  <div key={tier.id} className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          {tier.referralCount} referral{tier.referralCount !== 1 ? 's' : ''}
                        </Badge>
                        <span className="font-medium">{tier.tierName}</span>
                      </div>
                      <span className="font-medium">{getRewardTypeLabel(tier.reward.type)}</span>
                    </div>
                    <p className="text-sm text-gray-700">{tier.reward.description}</p>
                    
                    {/* Points System Details */}
                    {tier.reward.type === 'points_system' && (
                      <div className="mt-3 bg-white rounded border p-3">
                        <h6 className="text-xs font-medium text-gray-700 mb-2">Points System Details</h6>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-gray-500">Per Referral:</span>
                            <div className="font-medium text-blue-600">+{tier.reward.pointsPerReferral || 0} points</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Reward at:</span>
                            <div className="font-medium">{tier.reward.pointsToReward || 0} points</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Referrals needed:</span>
                            <div className="font-medium">
                              {Math.ceil((tier.reward.pointsToReward || 0) / (tier.reward.pointsPerReferral || 1))}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500">Reward:</span>
                            <div className="font-medium">
                              {tier.reward.pointsRewardValue || 0}
                              {tier.reward.pointsRewardType === 'discount_percentage' ? '% off' :
                               tier.reward.pointsRewardType === 'membership_days' ? ' days' : '₹ off'}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {tier.reward.delivery && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-gray-500">Delivery:</span>
                        {tier.reward.delivery.email && (
                          <Badge variant="outline" className="text-xs">📧 Email</Badge>
                        )}
                        {tier.reward.delivery.whatsapp && (
                          <Badge variant="outline" className="text-xs">💬 WhatsApp</Badge>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Program Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Program Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-500">Vesting Period</span>
                  <div className="font-medium">{program.payoutVestingDays} days</div>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-500">Combine with Other Offers</span>
                  <div className="font-medium">{program.allowCombineOffers ? 'Yes' : 'No'}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-500">Program Status</span>
                  <div className="font-medium">{program.isDefault ? 'Default' : 'Available'}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}; 