import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { toast } from 'sonner';

export const EquipmentFormPage = ({ equipment, onNavigate }) => {
  const { addEquipment, updateEquipment } = useApp();
  const isEdit = !!equipment;

  const [formData, setFormData] = useState({
    name: equipment?.name || '',
    category: equipment?.category || 'Lab',
    condition: equipment?.condition || 'Good',
    quantity: equipment?.quantity || 1,
    available: equipment?.available || 1,
    image: equipment?.image || '',
    description: equipment?.description || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEdit && equipment) {
      updateEquipment(equipment.id, formData);
      toast.success('Equipment updated successfully!');
    } else {
      addEquipment(formData);
      toast.success('Equipment added successfully!');
    }

    onNavigate('dashboard');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <Button
        variant="ghost"
        onClick={() => onNavigate('dashboard')}
        className="gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? 'Edit Equipment' : 'Add New Equipment'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Equipment Name *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g., Digital Camera Canon EOS"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lab">Lab</SelectItem>
                    <SelectItem value="Sports">Sports</SelectItem>
                    <SelectItem value="Music">Music</SelectItem>
                    <SelectItem value="Camera">Camera</SelectItem>
                    <SelectItem value="AV">AV</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="condition">Condition *</Label>
                <Select
                  value={formData.condition}
                  onValueChange={(value) => setFormData({ ...formData, condition: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Excellent">Excellent</SelectItem>
                    <SelectItem value="Good">Good</SelectItem>
                    <SelectItem value="Fair">Fair</SelectItem>
                    <SelectItem value="Poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Total Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    quantity: parseInt(e.target.value),
                    available: Math.min(formData.available, parseInt(e.target.value))
                  })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="available">Available Quantity *</Label>
                <Input
                  id="available"
                  type="number"
                  min="0"
                  max={formData.quantity}
                  value={formData.available}
                  onChange={(e) => setFormData({ ...formData, available: parseInt(e.target.value) })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  type="url"
                  placeholder="https://..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Provide a detailed description of the equipment..."
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => onNavigate('dashboard')}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-[#2F5DFF] hover:bg-[#2548CC]">
                {isEdit ? 'Update Equipment' : 'Add Equipment'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
