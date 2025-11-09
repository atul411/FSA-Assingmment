import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  Package, 
  Search, 
  Filter,
  Eye,
  Edit,
  Trash2,
  Plus
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export const EquipmentListPage = ({ onNavigate }) => {
  const { currentUser, equipment } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  const filteredEquipment = useMemo(() => {
    return equipment.filter(e => {
      const matchesSearch = 
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = categoryFilter === 'all' || e.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [equipment, searchQuery, categoryFilter]);

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'Excellent': return 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20';
      case 'Good': return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
      case 'Fair': return 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20';
      case 'Poor': return 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Lab': return 'bg-purple-500/10 text-purple-700 border-purple-500/20';
      case 'Sports': return 'bg-orange-500/10 text-orange-700 border-orange-500/20';
      case 'Music': return 'bg-pink-500/10 text-pink-700 border-pink-500/20';
      case 'Camera': return 'bg-indigo-500/10 text-indigo-700 border-indigo-500/20';
      case 'AV': return 'bg-cyan-500/10 text-cyan-700 border-cyan-500/20';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const canEdit = ['admin', 'staff'].includes(currentUser?.role || '');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-gray-900 mb-2">Equipment Catalog</h1>
          <p className="text-gray-600">Browse and manage all available equipment</p>
        </div>
        {currentUser?.role === 'admin' && (
          <Button
            onClick={() => onNavigate('equipment-add')}
            className="bg-[#2F5DFF] hover:bg-[#2548CC]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Equipment
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card className="border-gray-300">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search equipment..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-gray-300"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48 border-gray-300">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-300">
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Lab">Lab</SelectItem>
                <SelectItem value="Sports">Sports</SelectItem>
                <SelectItem value="Music">Music</SelectItem>
                <SelectItem value="Camera">Camera</SelectItem>
                <SelectItem value="AV">AV</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          {filteredEquipment.length} {filteredEquipment.length === 1 ? 'item' : 'items'} found
        </p>
      </div>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredEquipment.map((item) => (
          <Card
            key={item.id}
            className="overflow-hidden hover:shadow-lg transition-all group cursor-pointer border-gray-300"
            onClick={() => onNavigate('equipment-detail', item)}
          >
            <div className="relative h-48 bg-gray-100 overflow-hidden">
              <ImageWithFallback
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 right-2">
                <Badge className={getCategoryColor(item.category)}>
                  {item.category}
                </Badge>
              </div>
              {item.available === 0 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white px-4 py-2 bg-[#EF4444] rounded" style={{ fontSize: '14px', fontWeight: '600' }}>
                    Unavailable
                  </span>
                </div>
              )}
            </div>

            <CardContent className="p-4 space-y-3">
              <div>
                <h3 className="text-gray-900 mb-1 line-clamp-1" style={{ fontSize: '16px', fontWeight: '600' }}>
                  {item.name}
                </h3>
                <p className="text-gray-600 line-clamp-2" style={{ fontSize: '14px' }}>
                  {item.description}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <Badge className={getConditionColor(item.condition)} variant="outline">
                  {item.condition}
                </Badge>
                <span className="text-gray-600" style={{ fontSize: '14px' }}>
                  {item.available}/{item.quantity} available
                </span>
              </div>

              <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                {canEdit && (
                  <>
                    <Button
                      onClick={() => onNavigate('equipment-edit', item)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => onNavigate('equipment-delete', item)}
                      variant="outline"
                      size="sm"
                      className="text-[#EF4444] hover:text-[#EF4444] hover:bg-[#EF4444]/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEquipment.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No equipment found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
