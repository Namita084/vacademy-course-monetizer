import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';

interface Batch {
  sessionId: string;
  levelId: string;
}

interface BatchSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (courseId: string, batches: Batch[]) => void;
  courses: Array<{
    id: string;
    name: string;
    sessions: Array<{ id: string; name: string }>;
    levels: Array<{ id: string; name: string }>;
  }>;
}

export const BatchSelectionDialog: React.FC<BatchSelectionDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  courses
}) => {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [batches, setBatches] = useState<Batch[]>([]);
  const [currentBatch, setCurrentBatch] = useState<Batch>({
    sessionId: '',
    levelId: ''
  });

  const selectedCourseData = courses.find(course => course.id === selectedCourse);

  const handleAddBatch = () => {
    if (currentBatch.sessionId && currentBatch.levelId) {
      setBatches([...batches, { ...currentBatch }]);
      setCurrentBatch({ sessionId: '', levelId: '' });
    }
  };

  const handleRemoveBatch = (index: number) => {
    setBatches(batches.filter((_, i) => i !== index));
  };

  const handleConfirm = () => {
    if (selectedCourse && batches.length > 0) {
      onConfirm(selectedCourse, batches);
    }
  };

  const getBatchLabel = (batch: Batch) => {
    const session = selectedCourseData?.sessions.find(s => s.id === batch.sessionId);
    const level = selectedCourseData?.levels.find(l => l.id === batch.levelId);
    return `${session?.name} - ${level?.name}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Select Course and Batches</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Course Selection */}
          <div className="space-y-2">
            <Label>Select Course</Label>
            <Select
              value={selectedCourse}
              onValueChange={setSelectedCourse}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map(course => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedCourseData && (
            <>
              {/* Batch Creation */}
              <div className="space-y-4">
                <Label>Add Batch</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Select
                    value={currentBatch.sessionId}
                    onValueChange={(value) => setCurrentBatch({ ...currentBatch, sessionId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select session" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedCourseData.sessions.map(session => (
                        <SelectItem key={session.id} value={session.id}>
                          {session.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={currentBatch.levelId}
                    onValueChange={(value) => setCurrentBatch({ ...currentBatch, levelId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedCourseData.levels.map(level => (
                        <SelectItem key={level.id} value={level.id}>
                          {level.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={handleAddBatch}
                  disabled={!currentBatch.sessionId || !currentBatch.levelId}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Batch
                </Button>
              </div>

              {/* Selected Batches */}
              <div className="space-y-2">
                <Label>Selected Batches</Label>
                <div className="space-y-2">
                  {batches.length === 0 ? (
                    <p className="text-sm text-gray-500">No batches selected</p>
                  ) : (
                    batches.map((batch, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <Badge variant="secondary">
                          {getBatchLabel(batch)}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveBatch(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!selectedCourse || batches.length === 0}
            >
              Continue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 