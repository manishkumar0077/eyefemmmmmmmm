import { useState, useEffect, useRef } from 'react';
import { useEyecareHeroSection } from '@/hooks/useEyecareHeroSection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Upload, Save, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

export const EyecareHeroSectionEditor = () => {
  const { 
    heroSection, 
    isLoading, 
    error, 
    updateHeroSection, 
    uploadImage,
    refreshData
  } = useEyecareHeroSection();

  const [editValues, setEditValues] = useState({
    title: '',
    subtitle: '',
    image_url: ''
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update form when hero section is loaded
  useEffect(() => {
    if (heroSection) {
      setEditValues({
        title: heroSection.title,
        subtitle: heroSection.subtitle,
        image_url: heroSection.image_url
      });
      setImagePreview(heroSection.image_url);
    }
  }, [heroSection]);

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    console.log("File selected for upload:", file.name);
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);

    setIsUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      console.log("Image uploaded, URL:", imageUrl);
      if (imageUrl) {
        setEditValues(prev => ({ ...prev, image_url: imageUrl }));
        toast.success('Image uploaded successfully');
      } else {
        toast.error('Failed to upload image');
      }
    } catch (err) {
      console.error('Error handling image:', err);
      toast.error('An error occurred while uploading the image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editValues.title.trim()) {
      toast.error('Title is required');
      return;
    }

    setIsSaving(true);
    try {
      const success = await updateHeroSection(editValues);
      if (success) {
        toast.success('Hero section updated successfully');
        refreshData();
      } else {
        toast.error('Failed to update hero section');
      }
    } catch (err) {
      console.error('Error updating hero section:', err);
      toast.error('An error occurred while updating');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="shadow-sm border-neutral-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Advanced Eye Care Services</CardTitle>
          <CardDescription>Edit the hero section on the Eyecare homepage</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <p className="text-sm text-gray-500">Loading hero section content...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-sm border-neutral-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Advanced Eye Care Services</CardTitle>
          <CardDescription>Edit the hero section on the Eyecare homepage</CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="bg-red-50 p-4 rounded-md border border-red-100 flex items-center">
            <div className="text-red-500 mr-2">⚠️</div>
            <p className="text-red-500 text-sm">An error occurred while loading data. Please try again later.</p>
          </div>
          <div className="mt-3 flex justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshData} 
              className="text-xs h-8"
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border-neutral-200">
      <CardHeader className="border-b bg-gray-50/50 pb-3">
        <CardTitle className="text-lg font-medium flex items-center">
          <ImageIcon className="h-4 w-4 mr-2 text-primary" />
          Advanced Eye Care Services
        </CardTitle>
        <CardDescription className="text-xs">Edit the hero section on the Eyecare homepage</CardDescription>
      </CardHeader>
      <CardContent className="pt-5">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            {/* Left side - Text fields */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="title" className="text-sm font-medium">
                  Title
                </Label>
                <Input
                  id="title"
                  value={editValues.title}
                  onChange={(e) => setEditValues({ ...editValues, title: e.target.value })}
                  placeholder="Enter title"
                  className="h-9"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="subtitle" className="text-sm font-medium">
                  Subtitle
                </Label>
                <Textarea
                  id="subtitle"
                  value={editValues.subtitle || ''}
                  onChange={(e) => setEditValues({ ...editValues, subtitle: e.target.value })}
                  placeholder="Enter subtitle"
                  className="min-h-[120px] resize-none"
                />
              </div>
            </div>
            
            {/* Right side - Image upload */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Hero Image</Label>
              <div 
                className={`border-2 border-dashed rounded-lg cursor-pointer transition-colors h-[185px] flex flex-col items-center justify-center overflow-hidden relative
                  ${imagePreview ? 'border-primary/20 bg-primary/5' : 'hover:bg-gray-50 border-gray-200'}`}
                onClick={handleImageClick}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
                
                {imagePreview ? (
                  <div className="relative w-full h-full">
                    <img 
                      src={imagePreview} 
                      alt="Hero preview" 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                      <Button variant="secondary" size="sm" className="text-white bg-black/60 hover:bg-black/80 border-0">
                        <ImageIcon className="h-4 w-4 mr-1.5" />
                        Change Image
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center px-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                      <Upload className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-sm font-medium">Upload hero image</p>
                    <p className="text-xs text-gray-500 mt-1">Click to browse or drag and drop</p>
                  </div>
                )}

                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                    <div className="flex flex-col items-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                      <span className="text-sm font-medium">Uploading...</span>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1.5 pl-1">
                Recommended: 1200×600px, PNG or JPG format
              </p>
            </div>
          </div>

          <div className="pt-2 border-t mt-6">
            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                type="button" 
                size="sm"
                className="h-9"
                onClick={() => {
                  setEditValues({
                    title: heroSection?.title || '',
                    subtitle: heroSection?.subtitle || '',
                    image_url: heroSection?.image_url || ''
                  });
                  setImagePreview(heroSection?.image_url || null);
                }}
                disabled={isUploading || isSaving}
              >
                Reset
              </Button>
              <Button 
                type="submit" 
                size="sm"
                className="h-9"
                disabled={isUploading || isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-3.5 w-3.5 mr-1.5" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EyecareHeroSectionEditor;
