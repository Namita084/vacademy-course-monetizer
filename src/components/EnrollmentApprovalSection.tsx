import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  content: string;
}

interface EnrollmentApprovalSectionProps {
  needsApproval: boolean;
  onApprovalChange: (needsApproval: boolean) => void;
  selectedTemplateId: string;
  onTemplateChange: (templateId: string) => void;
  customMessage: string;
  onMessageChange: (message: string) => void;
  templates: Template[];
}

export const EnrollmentApprovalSection: React.FC<EnrollmentApprovalSectionProps> = ({
  needsApproval,
  onApprovalChange,
  selectedTemplateId,
  onTemplateChange,
  customMessage,
  onMessageChange,
  templates
}) => {
  const [isCustomMessage, setIsCustomMessage] = useState(!selectedTemplateId);

  const handleTemplateChange = (templateId: string) => {
    if (templateId === 'custom') {
      setIsCustomMessage(true);
      onTemplateChange('');
    } else {
      setIsCustomMessage(false);
      onTemplateChange(templateId);
      const template = templates.find(t => t.id === templateId);
      if (template) {
        onMessageChange(template.content);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enrollment Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Require Approval</Label>
            <p className="text-sm text-gray-500">
              Enable if you want to review and approve enrollment requests
            </p>
          </div>
          <Switch
            checked={needsApproval}
            onCheckedChange={onApprovalChange}
          />
        </div>

        {needsApproval && (
          <>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Students will see your message while their enrollment request is pending approval.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Message Template</Label>
                <Select
                  value={isCustomMessage ? 'custom' : selectedTemplateId}
                  onValueChange={handleTemplateChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">Custom Message</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Approval Message</Label>
                <div className="relative">
                  <textarea
                    value={customMessage}
                    onChange={(e) => onMessageChange(e.target.value)}
                    className="w-full min-h-[200px] p-3 rounded-md border border-input bg-transparent text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    placeholder="Enter the message that students will see while their enrollment request is pending..."
                    disabled={!isCustomMessage}
                  />
                </div>
                <p className="text-sm text-gray-500">
                  You can use markdown formatting in your message.
                </p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}; 