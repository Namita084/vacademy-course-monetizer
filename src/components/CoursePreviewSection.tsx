import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Upload, 
  X, 
  Image as ImageIcon,
  Video,
  Edit3,
  Plus
} from 'lucide-react';

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
}

interface CoursePreviewSectionProps {
  courseData: Course;
  onUpdate: (field: string, value: any) => void;
}

export const CoursePreviewSection: React.FC<CoursePreviewSectionProps> = ({ 
  courseData, 
  onUpdate 
}) => {
  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    if (newTag.trim() && !courseData.tags.includes(newTag.trim())) {
      onUpdate('tags', [...courseData.tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onUpdate('tags', courseData.tags.filter(tag => tag !== tagToRemove));
  };

  const handleImageUpload = (type: 'preview' | 'banner' | 'media') => {
    // In a real implementation, this would handle file upload
    console.log(`Upload ${type} image`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Edit3 className="w-5 h-5" />
          Course Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Course Information */}
          <div className="space-y-6">
            {/* Course Name */}
            <div>
              <Label htmlFor="courseName" className="text-sm font-medium">
                Course<span className="text-red-500">*</span>
              </Label>
              <Input
                id="courseName"
                placeholder="Enter course name"
                value={courseData.name}
                onChange={(e) => onUpdate('name', e.target.value)}
                className="mt-1"
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description" className="text-sm font-medium">Description</Label>
              <div className="mt-1 border rounded-md">
                {/* Rich Text Editor Toolbar */}
                <div className="flex items-center gap-1 p-2 border-b bg-gray-50">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 font-bold">
                    B
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 italic">
                    I
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 underline">
                    U
                  </Button>
                  <div className="w-px h-4 bg-gray-300 mx-1" />
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    ≡
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    ☰
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    ≣
                  </Button>
                  <div className="w-px h-4 bg-gray-300 mx-1" />
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    fx
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    🖼
                  </Button>
                </div>
                <Textarea
                  id="description"
                  placeholder="Enter course description"
                  value={courseData.description}
                  onChange={(e) => onUpdate('description', e.target.value)}
                  className="min-h-[120px] border-0 resize-none focus:ring-0"
                />
              </div>
            </div>

            {/* Course Tags */}
            <div>
              <Label className="text-sm font-medium">Course Tags</Label>
              <p className="text-sm text-gray-600 mt-1">
                Add tags to help categorize and find your course easily
              </p>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Enter a tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                />
                <Button 
                  onClick={handleAddTag}
                  variant="outline"
                  disabled={!newTag.trim()}
                >
                  Add
                </Button>
              </div>
              {courseData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {courseData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X 
                        className="w-3 h-3 cursor-pointer hover:text-red-500" 
                        onClick={() => handleRemoveTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* What learners will gain */}
            <div>
              <Label htmlFor="learningObjectives" className="text-sm font-medium">What learners will gain?</Label>
              <div className="mt-1 border rounded-md">
                {/* Rich Text Editor Toolbar */}
                <div className="flex items-center gap-1 p-2 border-b bg-gray-50">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 font-bold">
                    B
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 italic">
                    I
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 underline">
                    U
                  </Button>
                  <div className="w-px h-4 bg-gray-300 mx-1" />
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    ≡
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    ☰
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    ≣
                  </Button>
                  <div className="w-px h-4 bg-gray-300 mx-1" />
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    fx
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    🖼
                  </Button>
                </div>
                <Textarea
                  id="learningObjectives"
                  placeholder="Provide a detailed overview of the course. Include learning objectives, topics covered, format (video, quizzes, projects), and who this course is for."
                  value={courseData.learningObjectives}
                  onChange={(e) => onUpdate('learningObjectives', e.target.value)}
                  className="min-h-[120px] border-0 resize-none focus:ring-0"
                />
              </div>
            </div>

            {/* About the course */}
            <div>
              <Label htmlFor="aboutCourse" className="text-sm font-medium">About the course</Label>
              <div className="mt-1 border rounded-md">
                {/* Rich Text Editor Toolbar */}
                <div className="flex items-center gap-1 p-2 border-b bg-gray-50">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 font-bold">
                    B
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 italic">
                    I
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 underline">
                    U
                  </Button>
                  <div className="w-px h-4 bg-gray-300 mx-1" />
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    ≡
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    ☰
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    ≣
                  </Button>
                  <div className="w-px h-4 bg-gray-300 mx-1" />
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    fx
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    🖼
                  </Button>
                </div>
                <Textarea
                  id="aboutCourse"
                  placeholder="Provide a detailed overview of the course. Include learning objectives, topics covered, format (video, quizzes, projects), and who this course is for."
                  value={courseData.aboutCourse}
                  onChange={(e) => onUpdate('aboutCourse', e.target.value)}
                  className="min-h-[120px] border-0 resize-none focus:ring-0"
                />
              </div>
            </div>

            {/* Who should join */}
            <div>
              <Label htmlFor="targetAudience" className="text-sm font-medium">Who should join?</Label>
              <div className="mt-1 border rounded-md">
                {/* Rich Text Editor Toolbar */}
                <div className="flex items-center gap-1 p-2 border-b bg-gray-50">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 font-bold">
                    B
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 italic">
                    I
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 underline">
                    U
                  </Button>
                  <div className="w-px h-4 bg-gray-300 mx-1" />
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    ≡
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    ☰
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    ≣
                  </Button>
                  <div className="w-px h-4 bg-gray-300 mx-1" />
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    fx
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    🖼
                  </Button>
                </div>
                <Textarea
                  id="targetAudience"
                  placeholder="Provide a detailed overview of the course. Include learning objectives, topics covered, format (video, quizzes, projects), and who this course is for."
                  value={courseData.targetAudience}
                  onChange={(e) => onUpdate('targetAudience', e.target.value)}
                  className="min-h-[120px] border-0 resize-none focus:ring-0"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Image Uploads */}
          <div className="space-y-6">
            {/* Course Preview Image */}
            <div>
              <Label className="text-sm font-medium">Course Preview Image</Label>
              <p className="text-sm text-gray-500 mt-1">
                This is the thumbnail that appears on the course card. Recommended size: 2:1 ratio
              </p>
              <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-gray-400 transition-colors bg-gray-50">
                {courseData.previewImage ? (
                  <div className="space-y-3">
                    <img 
                      src={courseData.previewImage} 
                      alt="Course preview" 
                      className="w-full h-32 object-cover rounded-lg mx-auto"
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleImageUpload('preview')}
                      className="text-xs"
                    >
                      <Upload className="w-3 h-3 mr-1" />
                      Change
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg mx-auto flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-gray-400" />
                    </div>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => handleImageUpload('preview')}
                      className="text-xs"
                    >
                      <Upload className="w-3 h-3 mr-1" />
                      Upload
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Course Banner Image */}
            <div>
              <Label className="text-sm font-medium">Course Banner Image</Label>
              <p className="text-sm text-gray-500 mt-1">
                A wide background image displayed on top of the course detail page. Recommended size: 2.64:1 ratio
              </p>
              <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-gray-400 transition-colors bg-gray-50">
                {courseData.bannerImage ? (
                  <div className="space-y-3">
                    <img 
                      src={courseData.bannerImage} 
                      alt="Course banner" 
                      className="w-full h-24 object-cover rounded-lg mx-auto"
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleImageUpload('banner')}
                      className="text-xs"
                    >
                      <Upload className="w-3 h-3 mr-1" />
                      Change
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg mx-auto flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-gray-400" />
                    </div>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => handleImageUpload('banner')}
                      className="text-xs"
                    >
                      <Upload className="w-3 h-3 mr-1" />
                      Upload
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Course Media */}
            <div>
              <Label className="text-sm font-medium">Course Media (Image or Video)</Label>
              <p className="text-sm text-gray-500 mt-1">
                A featured media block within the course page; this can visually represent the content or offer a teaser. For videos, recommended format: MP4
              </p>
              <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-gray-400 transition-colors bg-gray-50">
                {courseData.media.url ? (
                  <div className="space-y-3">
                    {courseData.media.type === 'video' ? (
                      <div className="w-12 h-12 bg-gray-200 rounded-lg mx-auto flex items-center justify-center">
                        <Video className="w-6 h-6 text-gray-400" />
                      </div>
                    ) : (
                      <img 
                        src={courseData.media.url} 
                        alt="Course media" 
                        className="w-full h-32 object-cover rounded-lg mx-auto"
                      />
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleImageUpload('media')}
                      className="text-xs"
                    >
                      <Upload className="w-3 h-3 mr-1" />
                      Change
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg mx-auto flex items-center justify-center">
                      <Plus className="w-6 h-6 text-gray-400" />
                    </div>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => handleImageUpload('media')}
                      className="text-xs"
                    >
                      <Upload className="w-3 h-3 mr-1" />
                      Upload
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};