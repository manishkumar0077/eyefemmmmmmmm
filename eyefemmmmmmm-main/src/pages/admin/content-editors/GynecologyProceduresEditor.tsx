import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useGynecologyProcedures } from "@/hooks/useGynecologyProcedures";
import {
  Loader2, Save, Upload, X, Plus, Trash2,
  AlertTriangle, MoveUp, MoveDown, Image, Edit
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export const GynecologyProceduresEditor = () => {
  const { procedures, isLoading, error, updateProcedure, addProcedure, deleteProcedure } = useGynecologyProcedures();
  const [editingProcedure, setEditingProcedure] = useState<number | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state for editing/adding
  const [form, setForm] = useState({
    title: '',
    description: '',
    alt_text: '',
    image_url: ''
  });

  // Image handling
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset form when the editing procedure changes
  useEffect(() => {
    if (editingProcedure !== null) {
      const procedure = procedures.find(p => p.id === editingProcedure);
      if (procedure) {
        setForm({
          title: procedure.title,
          description: procedure.description,
          alt_text: procedure.alt_text,
          image_url: procedure.image_url
        });
        setImagePreview(procedure.image_url);
      }
    } else if (!showAddDialog) {
      resetForm();
    }
  }, [editingProcedure, procedures, showAddDialog]);

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      alt_text: '',
      image_url: ''
    });
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!form.description.trim()) {
      toast.error("Description is required");
      return;
    }

    if (!form.alt_text.trim()) {
      toast.error("Alt text is required for accessibility");
      return;
    }

    if (!imagePreview && !form.image_url) {
      toast.error("Image is required");
      return;
    }

    setSaving(true);
    try {
      let success;

      if (editingProcedure !== null) {
        // Update existing procedure
        success = await updateProcedure(
          editingProcedure,
          form,
          imageFile || undefined
        );

        if (success) {
          setEditingProcedure(null);
          toast.success("Procedure updated successfully");
        }
      } else {
        // Add new procedure
        success = await addProcedure(
          form as Omit<typeof form, 'id' | 'created_at'>,
          imageFile || undefined
        );

        if (success) {
          setShowAddDialog(false);
          toast.success("New procedure added successfully");
        }
      }

      if (!success) {
        toast.error("Failed to save procedure");
      }
    } catch (error) {
      console.error("Error saving procedure:", error);
      toast.error("An error occurred while saving");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this procedure?")) {
      try {
        const success = await deleteProcedure(id);

        if (success) {
          toast.success("Procedure deleted successfully");
        } else {
          toast.error("Failed to delete procedure");
        }
      } catch (error) {
        console.error("Error deleting procedure:", error);
        toast.error("An error occurred while deleting");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="flex flex-col items-center text-center">
          <Loader2 className="h-10 w-10 animate-spin text-gynecology mb-3" />
          <p className="text-sm font-medium text-gray-600">Loading procedures...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 border border-red-200 rounded-lg bg-red-50/50 shadow-sm">
        <div className="flex items-center gap-2 text-red-600">
          <AlertTriangle className="h-5 w-5" />
          <h3 className="font-semibold">Error loading procedures</h3>
        </div>
        <p className="mt-2 text-sm text-red-600">{error.message}</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4 border-red-200 text-red-600 hover:bg-red-50"
          onClick={() => window.location.reload()}
        >
          <span className="flex items-center gap-2">
            <span className="i-lucide-refresh-cw h-3.5 w-3.5" />
            Retry
          </span>
        </Button>
      </div>
    );
  }

  // Organize procedures - first 2 cards in top row, remainder in bottom row
  const topRowProcedures = procedures.slice(0, 2);
  const bottomRowProcedures = procedures.slice(2);

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg border shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b pb-4 mb-6">
        <div className="flex flex-col items-start">
          <div className="flex items-center">
            <div className="h-5 w-1.5 bg-gynecology rounded-full mr-2.5"></div>
            <h2 className="text-xl font-semibold text-gray-800">Gynecology Procedures</h2>
          </div>
          <h3 className="text-l font-medium text-gray-600 mt-1 ml-6">⚠️ ONLY THE FIRST TWO IMAGES WILL BE DISPLAYED <br/> OTHERS WILL BE HIDDEN DUE TO DOCTOR'S REQUEST.
          </h3>
        </div>


        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button
              onClick={() => { resetForm(); setEditingProcedure(null); }}
              className="bg-gynecology hover:bg-gynecology/90 shadow-sm"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Add New Procedure
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[650px]">
            <DialogHeader>
              <DialogTitle className="text-gynecology flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Add New Procedure
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              {renderForm()}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {topRowProcedures.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {topRowProcedures.map((procedure) => (
            <ProcedureCard
              key={procedure.id}
              procedure={procedure}
              onEdit={() => setEditingProcedure(procedure.id)}
              onDelete={() => handleDelete(procedure.id)}
            />
          ))}
        </div>
      )}

      {bottomRowProcedures.length > 0 && (
        <>
          <div className="flex items-center mb-4">
            <div className="h-4 w-1 bg-gray-300 rounded-full mr-2"></div>
            <h3 className="text-lg font-medium text-gray-700">Additional Procedures</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {bottomRowProcedures.map((procedure) => (
              <ProcedureCard
                key={procedure.id}
                procedure={procedure}
                onEdit={() => setEditingProcedure(procedure.id)}
                onDelete={() => handleDelete(procedure.id)}
                compact
              />
            ))}
          </div>
        </>
      )}

      {procedures.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Image className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">No procedures added yet</h3>
            <p className="text-gray-500 max-w-md mb-4">Add your first procedure to display it on the gynecology page</p>
            <Button
              onClick={() => { resetForm(); setShowAddDialog(true); }}
              className="bg-gynecology hover:bg-gynecology/90"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add First Procedure
            </Button>
          </div>
        </div>
      )}

      {/* Editing Dialog */}
      <Dialog open={editingProcedure !== null} onOpenChange={(open) => !open && setEditingProcedure(null)}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle className="text-gynecology flex items-center">
              <Edit className="h-4 w-4 mr-2" />
              Edit Procedure
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {renderForm()}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

  function renderForm() {
    return (
      <>
        <div className="grid md:grid-cols-2 gap-x-6 gap-y-5">
          <div className="md:col-span-2 space-y-1.5">
            <Label htmlFor="title" className="text-sm font-medium">Procedure Title</Label>
            <Input
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Ultrasound Procedure"
              className="h-10"
            />
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <Label htmlFor="description" className="text-sm font-medium">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="resize-none min-h-[100px]"
              placeholder="Using advanced technology for accurate diagnosis"
            />
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <Label htmlFor="alt_text" className="text-sm font-medium">Image Alt Text</Label>
            <Input
              id="alt_text"
              name="alt_text"
              value={form.alt_text}
              onChange={handleChange}
              placeholder="Dr. Nisha Bhatnagar performing ultrasound"
              className="h-10"
            />
            <p className="text-xs text-gray-500 mt-1.5 ml-0.5">
              Describe the image for accessibility (for screen readers)
            </p>
          </div>

          {/* Image Upload Section */}
          <div className="md:col-span-2 space-y-1.5">
            <Label htmlFor="procedure-image" className="text-sm font-medium">Procedure Image</Label>
            <div className="flex flex-col md:flex-row md:items-center gap-5">
              <div
                className={`rounded-lg overflow-hidden border-2 ${imagePreview ? 'border-gynecology border-opacity-30 bg-gynecology bg-opacity-5' : 'border-gray-200 border-dashed'} w-full md:w-48 h-48 flex-shrink-0 relative cursor-pointer group shadow-sm transition-all duration-200 hover:shadow-md`}
                onClick={handleImageClick}
              >
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Procedure Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/eyefemm_pic_uploads/default-image.png";
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full">
                        <Upload className="h-6 w-6 text-white" />
                      </div>
                      <p className="text-white text-xs mt-2 font-medium">Change image</p>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
                    <div className="h-12 w-12 rounded-full bg-gynecology/10 flex items-center justify-center mb-2">
                      <Upload className="h-6 w-6 text-gynecology" />
                    </div>
                    <p className="text-sm font-medium text-gray-700">Upload procedure image</p>
                    <p className="text-xs text-gray-500 mt-1">Click to browse</p>
                  </div>
                )}

                {imagePreview && (
                  <button
                    type="button"
                    className="absolute top-2 right-2 bg-red-500 rounded-full p-1.5 text-white shadow-md hover:bg-red-600 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage();
                    }}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="procedure-image"
              />

              <div className="md:pl-1 md:flex-1">
                <p className="text-sm text-gray-700 font-medium">
                  Procedure Image Guidelines
                </p>
                <ul className="mt-2 space-y-1.5 text-xs text-gray-600">
                  <li className="flex items-center">
                    <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                    <span>Recommended size: 800×600 pixels or higher</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                    <span>Use high-quality images that clearly show the procedure</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                    <span>PNG or JPG format</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 border-t pt-4 mt-4 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => editingProcedure ? setEditingProcedure(null) : setShowAddDialog(false)}
            disabled={saving}
            size="sm"
            className="h-9"
          >
            Cancel
          </Button>
          <Button
            className="bg-gynecology hover:bg-gynecology/90 h-9"
            onClick={handleSave}
            disabled={saving}
            size="sm"
          >
            {saving ? (
              <span className="flex items-center gap-1.5">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Save className="h-3.5 w-3.5" />
                Save {editingProcedure !== null ? 'Changes' : 'Procedure'}
              </span>
            )}
          </Button>
        </div>
      </>
    );
  }
};

interface ProcedureCardProps {
  procedure: {
    id: number;
    image_url: string;
    alt_text: string;
    title: string;
    description: string;
  };
  onEdit: () => void;
  onDelete: () => void;
  compact?: boolean;
}

const ProcedureCard = ({ procedure, onEdit, onDelete, compact = false }: ProcedureCardProps) => {
  return (
    <Card className="overflow-hidden border shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 duration-300">
      <div className={`relative ${compact ? 'h-48' : 'h-64'}`}>
        <img
          src={procedure.image_url}
          alt={procedure.alt_text}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "/eyefemm_pic_uploads/default-image.png";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/90 text-black hover:bg-white shadow-sm"
              onClick={onEdit}
            >
              <Edit className="h-3.5 w-3.5 mr-1.5" />
              Edit
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="shadow-sm"
              onClick={onDelete}
            >
              <Trash2 className="h-3.5 w-3.5 mr-1.5" />
              Delete
            </Button>
          </div>
        </div>
      </div>
      <CardContent className={`${compact ? 'p-3.5' : 'p-4'}`}>
        <h3 className={`font-semibold text-gray-800 ${compact ? 'text-sm' : 'text-base'}`}>{procedure.title}</h3>
        <p className={`text-gray-600 ${compact ? 'text-xs' : 'text-sm'} mt-1 line-clamp-2`}>{procedure.description}</p>
      </CardContent>
    </Card>
  );
};
