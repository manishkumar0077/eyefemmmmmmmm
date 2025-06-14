import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Save, Plus, Trash2, MoveUp, MoveDown, Upload, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEyeCareWhyChoose } from "@/hooks/UseEyeCareWhyChoose";

interface Feature {
  id: string;
  feature_text: string;
  display_order: number;
}

export const EyeCareWhyChooseEditor = () => {
  const { section, features, refreshData, updateSection, uploadImage } = useEyeCareWhyChoose();
  const [activeTab, setActiveTab] = useState("section");
  const [sectionData, setSectionData] = useState({
    id: "",
    heading: "",
    description: "",
    image_url: ""
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Load section data when available
  useEffect(() => {
    if (section) {
      setSectionData({
        id: section.id,
        heading: section.heading,
        description: section.description || "",
        image_url: section.image_url || ""
      });
      if (section.image_url) {
        setImagePreview(section.image_url);
      }
    }
  }, [section]);
  
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
        setSectionData(prev => ({ ...prev, image_url: imageUrl }));
        toast({
          title: "Success",
          description: "Image uploaded successfully"
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to upload image",
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error('Error handling image:', err);
      toast({
        title: "Error",
        description: "An error occurred while uploading the image",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSectionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSectionData({
      ...sectionData,
      [name]: value
    });
  };

  const handleFeatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedFeature) return;
    
    const { name, value } = e.target;
    setSelectedFeature({
      ...selectedFeature,
      [name]: value
    });
  };

  const handleSaveSection = async () => {
    setLoading(true);
    try {
      const success = await updateSection({
        heading: sectionData.heading,
        description: sectionData.description,
        image_url: sectionData.image_url
      });
      
      if (!success) throw new Error('Failed to update section');
      
      toast({
        title: "Success",
        description: "Section content updated successfully"
      });
      
      refreshData();
    } catch (err) {
      console.error("Error saving section:", err);
      toast({
        title: "Error",
        description: "Failed to save section content",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFeature = async () => {
    if (!selectedFeature) return;
    
    setLoading(true);
    try {
      const { error } = await (supabase as any)
        .from('csm_eyecare_why_choose_features')
        .upsert({
          id: selectedFeature.id,
          feature_text: selectedFeature.feature_text,
          display_order: selectedFeature.display_order
        });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Feature updated successfully"
      });
      
      refreshData();
      setSelectedFeature(null);
    } catch (err) {
      console.error("Error saving feature:", err);
      toast({
        title: "Error",
        description: "Failed to save feature",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewFeature = () => {
    // Find the highest display order
    const maxOrder = features.length > 0
      ? Math.max(...features.map(f => f.display_order || 0))
      : 0;
    
    setSelectedFeature({
      id: '', // Will be generated on the server
      feature_text: '',
      display_order: maxOrder + 1
    });
  };

  const handleDeleteFeature = async () => {
    if (!selectedFeature?.id) return;
    
    setLoading(true);
    try {
      const { error } = await (supabase as any)
        .from('csm_eyecare_why_choose_features')
        .delete()
        .eq('id', selectedFeature.id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Feature deleted successfully"
      });
      
      refreshData();
      setSelectedFeature(null);
    } catch (err) {
      console.error("Error deleting feature:", err);
      toast({
        title: "Error",
        description: "Failed to delete feature",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMoveFeature = async (direction: 'up' | 'down') => {
    if (!selectedFeature) return;
    
    // Sort features by display order
    const sortedFeatures = [...features].sort((a, b) => 
      (a.display_order || 0) - (b.display_order || 0)
    );
    
    const currentIndex = sortedFeatures.findIndex(f => f.id === selectedFeature.id);
    if (currentIndex < 0) return;
    
    let swapIndex;
    if (direction === 'up' && currentIndex > 0) {
      swapIndex = currentIndex - 1;
    } else if (direction === 'down' && currentIndex < sortedFeatures.length - 1) {
      swapIndex = currentIndex + 1;
    } else {
      return; // Can't move further up or down
    }
    
    // Swap display orders
    const currentOrder = sortedFeatures[currentIndex].display_order || 0;
    const swapOrder = sortedFeatures[swapIndex].display_order || 0;
    
    setLoading(true);
    try {
      // Update both records
      const updates = [
        {
          id: sortedFeatures[currentIndex].id,
          display_order: swapOrder
        },
        {
          id: sortedFeatures[swapIndex].id,
          display_order: currentOrder
        }
      ];
      
      for (const update of updates) {
        const { error } = await (supabase as any)
          .from('csm_eyecare_why_choose_features')
          .update({ display_order: update.display_order })
          .eq('id', update.id);
        
        if (error) throw error;
      }
      
      toast({
        title: "Success",
        description: "Feature order updated"
      });
      
      refreshData();
      
      // Update the selected feature with new display order
      setSelectedFeature({
        ...selectedFeature,
        display_order: swapOrder
      });
    } catch (err) {
      console.error("Error updating feature order:", err);
      toast({
        title: "Error",
        description: "Failed to update feature order",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full shadow-sm border rounded-lg bg-white overflow-hidden">
      <TabsList className="grid w-full grid-cols-2 p-1 bg-gray-50 border-b">
        <TabsTrigger value="section" className="text-sm font-medium">Section Content</TabsTrigger>
        <TabsTrigger value="features" className="text-sm font-medium">Features</TabsTrigger>
      </TabsList>
      
      {/* Section Content Tab */}
      <TabsContent value="section" className="p-5 space-y-5">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-2">
          <div className="flex items-center">
            <div className="h-5 w-1 bg-blue-600 rounded-full mr-2"></div>
            <h3 className="text-base font-medium">Why Choose Us Section</h3>
          </div>
          <p className="text-xs text-gray-500 ml-3 sm:ml-0">Edit the section content displayed on the Eyecare homepage</p>
        </div>
      
        <div className="grid md:grid-cols-2 gap-5">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="heading" className="text-sm font-medium">Section Heading</Label>
              <Input 
                id="heading"
                name="heading"
                value={sectionData.heading}
                onChange={handleSectionChange}
                placeholder="Why Choose Our Eye Care Center?"
                className="h-10"
              />
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-sm font-medium">Section Description</Label>
              <Textarea 
                id="description"
                name="description"
                value={sectionData.description}
                onChange={handleSectionChange}
                placeholder="Enter section description"
                rows={5}
                className="resize-none min-h-[120px]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Section Image</Label>
            <div 
              className={`border-2 border-dashed rounded-lg cursor-pointer transition-colors h-[185px] flex flex-col items-center justify-center overflow-hidden relative
                ${imagePreview ? 'border-blue-300 bg-blue-50/40' : 'hover:bg-gray-50 border-gray-200'}`}
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
                    alt="Why Choose Us preview" 
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
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                    <Upload className="h-6 w-6 text-blue-500" />
                  </div>
                  <p className="text-sm font-medium">Upload section image</p>
                  <p className="text-xs text-gray-500 mt-1">Click to browse</p>
                </div>
              )}

              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                  <div className="flex flex-col items-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-2" />
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
          
        <div className="pt-3 border-t mt-3 flex justify-end">
          <Button 
            onClick={handleSaveSection} 
            disabled={loading || isUploading}
            size="sm"
            className="h-9"
          >
            {loading ? (
              <>
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-1.5 h-3.5 w-3.5" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </TabsContent>
      
      {/* Features Tab */}
      <TabsContent value="features" className="p-5 space-y-5">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-2">
          <div className="flex items-center">
            <div className="h-5 w-1 bg-blue-600 rounded-full mr-2"></div>
            <h3 className="text-base font-medium">Features</h3>
          </div>
          <p className="text-xs text-gray-500 ml-3 sm:ml-0">Manage the benefit features listed on the Eyecare homepage</p>
        </div>
      
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1 border rounded-lg shadow-sm overflow-hidden">
            <div className="bg-gray-50 border-b px-3 py-2.5 flex justify-between items-center">
              <h3 className="font-medium text-sm">Feature List</h3>
              <Button 
                size="sm" 
                variant="outline"
                className="h-7 text-xs" 
                onClick={handleAddNewFeature}
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add New
              </Button>
            </div>
            
            <div className="max-h-[350px] overflow-y-auto p-2">
              {features.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-4 text-center">
                  <p className="text-gray-500 text-sm">No features found</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2 text-xs h-8"
                    onClick={handleAddNewFeature}
                  >
                    <Plus className="h-3 w-3 mr-1" /> Add First Feature
                  </Button>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {features
                    .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
                    .map(feature => (
                      <div 
                        key={feature.id}
                        className={`p-2.5 rounded-md cursor-pointer transition-colors text-sm
                          ${selectedFeature?.id === feature.id 
                            ? 'bg-blue-50 border border-blue-200 shadow-sm' 
                            : 'bg-gray-50 hover:bg-gray-100 border border-transparent'}`}
                        onClick={() => setSelectedFeature({...feature})}
                      >
                        <div className="font-medium truncate">{feature.feature_text}</div>
                      </div>
                    ))}
                </div>
              )}
            </div>
            
            <div className="p-2 border-t bg-gray-50">
              <Button 
                variant="outline" 
                size="sm"
                className="w-full text-xs h-8"
                onClick={refreshData}
              >
                Refresh List
              </Button>
            </div>
          </div>
          
          <div className="col-span-2 border rounded-lg shadow-sm overflow-hidden">
            {selectedFeature ? (
              <div>
                <div className="bg-gray-50 border-b px-4 py-2.5 flex justify-between items-center">
                  <h3 className="font-medium text-sm">
                    {selectedFeature.id ? 'Edit Feature' : 'Add New Feature'}
                  </h3>
                </div>
                
                <div className="p-4 space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="feature_text" className="text-sm font-medium">Feature Text</Label>
                    <Input 
                      id="feature_text"
                      name="feature_text"
                      value={selectedFeature.feature_text}
                      onChange={handleFeatureChange}
                      placeholder="Enter feature text"
                      className="h-10"
                    />
                  </div>
                  
                  <div className="border-t pt-3 mt-3 flex flex-wrap justify-between gap-2">
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleSaveFeature} 
                        disabled={loading}
                        size="sm"
                        className="h-9"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-1.5 h-3.5 w-3.5" />
                            Save Feature
                          </>
                        )}
                      </Button>
                      
                      {selectedFeature.id && (
                        <Button 
                          variant="destructive" 
                          onClick={handleDeleteFeature} 
                          disabled={loading}
                          size="sm"
                          className="h-9"
                        >
                          <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                          Delete
                        </Button>
                      )}
                    </div>
                    
                    <div className="flex gap-1.5">
                      <Button 
                        size="icon" 
                        variant="outline" 
                        onClick={() => handleMoveFeature('up')}
                        disabled={loading}
                        className="h-9 w-9"
                        title="Move Up"
                      >
                        <MoveUp className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        size="icon" 
                        variant="outline" 
                        onClick={() => handleMoveFeature('down')}
                        disabled={loading}
                        className="h-9 w-9"
                        title="Move Down"
                      >
                        <MoveDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-14 px-4 text-gray-500">
                <div className="rounded-full bg-gray-100 p-3 mb-3">
                  <Plus className="h-6 w-6 text-gray-400" />
                </div>
                <p className="font-medium">Select a feature</p>
                <p className="text-sm mt-1">Choose from the list or click "Add New"</p>
              </div>
            )}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};
