import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Loader2, Plus, Trash2, Save, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useDoctorWhyChoose } from '@/hooks/useDoctorWhyChoose';

export const DoctorWhyChooseEditor = () => {
  const { choices, isLoading, error, updateChoice, addChoice, deleteChoice } = useDoctorWhyChoose();
  const [editingChoice, setEditingChoice] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newChoice, setNewChoice] = useState({ title: '', description: '' });
  const [editData, setEditData] = useState<{[key: string]: {title: string, description: string}}>({});
  const [saving, setSaving] = useState<{[key: string]: boolean}>({});

  // Initialize edit data from choices
  const getEditData = (id: string) => {
    if (!editData[id]) {
      const choice = choices.find(c => c.id === id);
      if (choice) {
        return { title: choice.title, description: choice.description };
      }
    }
    return editData[id] || { title: '', description: '' };
  };

  const handleEditStart = (id: string) => {
    setEditingChoice(id);
    setEditData({
      ...editData,
      [id]: { 
        title: choices.find(c => c.id === id)?.title || '',
        description: choices.find(c => c.id === id)?.description || ''
      }
    });
  };

  const handleEditCancel = () => {
    setEditingChoice(null);
  };

  const handleEditSave = async (id: string) => {
    setSaving({ ...saving, [id]: true });
    try {
      const data = editData[id];
      if (!data) return;

      const success = await updateChoice(id, data);
      if (success) {
        toast.success('Choice updated successfully!');
        setEditingChoice(null);
      } else {
        toast.error('Failed to update choice.');
      }
    } catch (err) {
      console.error('Error saving choice:', err);
      toast.error('An error occurred while saving.');
    } finally {
      setSaving({ ...saving, [id]: false });
    }
  };

  const handleAddSubmit = async () => {
    if (!newChoice.title.trim()) {
      toast.error('Title is required');
      return;
    }

    setSaving({ ...saving, new: true });
    try {
      const success = await addChoice(newChoice);
      if (success) {
        toast.success('Choice added successfully!');
        setNewChoice({ title: '', description: '' });
        setIsAdding(false);
      } else {
        toast.error('Failed to add choice.');
      }
    } catch (err) {
      console.error('Error adding choice:', err);
      toast.error('An error occurred while adding.');
    } finally {
      setSaving({ ...saving, new: false });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    setSaving({ ...saving, [id]: true });
    try {
      const success = await deleteChoice(id);
      if (success) {
        toast.success('Choice deleted successfully!');
      } else {
        toast.error('Failed to delete choice.');
      }
    } catch (err) {
      console.error('Error deleting choice:', err);
      toast.error('An error occurred while deleting.');
    } finally {
      setSaving({ ...saving, [id]: false });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 px-4 bg-white rounded-lg border shadow-sm">
        <Loader2 className="h-7 w-7 animate-spin text-gynecology mb-2" />
        <p className="text-sm text-gray-600">Loading benefits...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5 border border-red-200 rounded-lg bg-red-50/80 shadow-sm">
        <div className="flex items-center gap-2 text-red-600">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <h3 className="font-medium">Error loading benefits</h3>
        </div>
        <p className="mt-2 text-sm text-red-600/90">{error.message}</p>
        <div className="mt-4 flex justify-end">
          <Button 
            variant="outline" 
            size="sm"
            className="text-xs h-8"
            onClick={() => window.location.reload()}
          >
            <Loader2 className="h-3 w-3 mr-1" />
            Reload Page
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white p-4 rounded-lg border shadow-sm">
        <div>
          <h3 className="text-base font-medium flex items-center text-gynecology">
            <div className="h-5 w-1 bg-gynecology rounded-full mr-2"></div>
            Doctor Benefits
          </h3>
          <p className="text-xs text-gray-500 mt-1 ml-3">Edit the "Why Choose Us" items displayed on the gynecology homepage</p>
        </div>
        <Button
          onClick={() => setIsAdding(true)}
          disabled={isAdding}
          size="sm"
          className="bg-gynecology hover:bg-gynecology/90 h-8 shadow-sm self-end sm:self-auto"
        >
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          Add New Benefit
        </Button>
      </div>

      {isAdding && (
        <Card className="shadow-sm border border-gynecology/30 overflow-hidden">
          <div className="bg-gynecology/10 border-b px-4 py-2.5 flex justify-between items-center">
            <h3 className="font-medium text-sm text-gynecology flex items-center">
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Add New Benefit
            </h3>
          </div>
          <div className="p-4 space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium">Title</label>
              <Input
                value={newChoice.title}
                onChange={(e) => setNewChoice({...newChoice, title: e.target.value})}
                placeholder="Enter benefit title"
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium">Description</label>
              <Textarea
                value={newChoice.description}
                onChange={(e) => setNewChoice({...newChoice, description: e.target.value})}
                placeholder="Enter benefit description"
                rows={3}
                className="resize-none text-sm"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                className="h-8"
                onClick={() => {
                  setIsAdding(false);
                  setNewChoice({ title: '', description: '' });
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddSubmit}
                disabled={saving.new}
                size="sm"
                className="h-8 bg-gynecology hover:bg-gynecology/90"
              >
                {saving.new ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Save className="h-3.5 w-3.5 mr-1.5" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="space-y-3">
        {choices.map((choice) => (
          <Card key={choice.id} className="shadow-sm overflow-hidden">
            {editingChoice === choice.id ? (
              <div>
                <div className="bg-gynecology/5 border-b px-4 py-2.5 flex justify-between items-center">
                  <h3 className="font-medium text-sm text-gynecology">Editing Benefit</h3>
                </div>
                <div className="p-4 space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium">Title</label>
                    <Input
                      value={getEditData(choice.id).title}
                      onChange={(e) => setEditData({
                        ...editData,
                        [choice.id]: {...getEditData(choice.id), title: e.target.value}
                      })}
                      placeholder="Enter benefit title"
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium">Description</label>
                    <Textarea
                      value={getEditData(choice.id).description}
                      onChange={(e) => setEditData({
                        ...editData,
                        [choice.id]: {...getEditData(choice.id), description: e.target.value}
                      })}
                      placeholder="Enter benefit description"
                      rows={3}
                      className="resize-none text-sm"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8"
                      onClick={handleEditCancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => handleEditSave(choice.id)}
                      disabled={saving[choice.id]}
                      className="bg-gynecology hover:bg-gynecology/90 h-8"
                      size="sm"
                    >
                      {saving[choice.id] ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-3.5 w-3.5 mr-1.5" />
                          Save
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gynecology">{choice.title}</h3>
                    <p className="mt-1.5 text-xs text-gray-600 leading-relaxed">{choice.description}</p>
                  </div>
                  <div className="flex gap-1 ml-4 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs px-2 hover:bg-gynecology/10"
                      onClick={() => handleEditStart(choice.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(choice.id)}
                      disabled={saving[choice.id]}
                    >
                      {saving[choice.id] ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        ))}
        {choices.length === 0 && !isAdding && (
          <div className="bg-gray-50 border rounded-lg p-5 text-center">
            <p className="text-sm text-gray-500">No benefits added yet</p>
            <Button
              onClick={() => setIsAdding(true)}
              size="sm"
              className="bg-gynecology hover:bg-gynecology/90 mt-3 h-8"
            >
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Add Your First Benefit
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};