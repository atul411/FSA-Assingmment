import React, { useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

import {
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Eye,
  ShoppingCart,
  Edit,
  Trash2
} from 'lucide-react';

import { ImageWithFallback } from '../figma/ImageWithFallback';

export const DashboardPage = ({ searchQuery, onNavigate }) => {
  const { currentUser, equipment, requests } = useApp();

  const filteredEquipment = useMemo(() => {
    return equipment.filter(e =>
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [equipment, searchQuery]);

  const stats = useMemo(() => {
    const myRequests = requests.filter(r => r.userId === currentUser?.id);
    const allPending = requests.filter(r => r.status === 'Pending');
    const overdueCount = requests.filter(r => r.status === 'Overdue').length;
    
    return {
      available: equipment.reduce((sum, e) => sum + e.available, 0),
      borrowed: myRequests.filter(r => r.status === 'Issued').length,
      pending: currentUser?.role === 'student' 
        ? myRequests.filter(r => r.status === 'Pending').length
        : allPending.length,
      overdue: overdueCount,
    };
  }, [equipment, requests, currentUser]);

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

  const canEdit = currentUser?.role === 'admin' || currentUser?.role === 'staff';

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, {currentUser?.name}! Here's your equipment overview.
          </p>
        </div>
        {currentUser?.role === 'admin' && (
          <Button
            onClick={() => onNavigate('equipment-add')}
            className="bg-[#2F5DFF] hover:bg-[#2548CC]"
          >
            <Package className="w-4 h-4 mr-2" />
            Add Equipment
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className={"border-gray-300"}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle style={{ fontSize: '14px' }} className="text-gray-600">
              Available
            </CardTitle>
            <Package className="w-5 h-5 text-[#2F5DFF]" />
          </CardHeader>
          <CardContent>
            <div className="text-gray-900" style={{ fontSize: '32px', fontWeight: '700' }}>
              {stats.available}
            </div>
            <p className="text-gray-500" style={{ fontSize: '12px' }}>
              Items ready to borrow
            </p>
          </CardContent>
        </Card>

        <Card className={"border-gray-300"}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle style={{ fontSize: '14px' }} className="text-gray-600">
              {currentUser?.role === 'student' ? 'My Borrowed' : 'Total Borrowed'}
            </CardTitle>
            <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
          </CardHeader>
          <CardContent>
            <div className="text-gray-900" style={{ fontSize: '32px', fontWeight: '700' }}>
              {stats.borrowed}
            </div>
            <p className="text-gray-500" style={{ fontSize: '12px' }}>
              Currently in use
            </p>
          </CardContent>
        </Card>

        <Card className={"border-gray-300"}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle style={{ fontSize: '14px' }} className="text-gray-600">
              Pending
            </CardTitle>
            <Clock className="w-5 h-5 text-[#F59E0B]" />
          </CardHeader>
          <CardContent>
            <div className="text-gray-900" style={{ fontSize: '32px', fontWeight: '700' }}>
              {stats.pending}
            </div>
            <p className="text-gray-500" style={{ fontSize: '12px' }}>
              Awaiting approval
            </p>
          </CardContent>
        </Card>

        <Card className={"border-gray-300"}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle style={{ fontSize: '14px' }} className="text-gray-600">
              Overdue
            </CardTitle>
            <AlertCircle className="w-5 h-5 text-[#EF4444]" />
          </CardHeader>
          <CardContent>
            <div className="text-gray-900" style={{ fontSize: '32px', fontWeight: '700' }}>
              {stats.overdue}
            </div>
            <p className="text-gray-500" style={{ fontSize: '12px' }}>
              Need attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Equipment Grid */}
      <Card className={"border-gray-300"}>
        <CardHeader>
          <CardTitle>Available Equipment</CardTitle>
          <CardDescription>
            Browse and borrow from our collection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredEquipment.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all group"
              >
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Badge className={getCategoryColor(item.category)}>
                      {item.category}
                    </Badge>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="text-gray-900 mb-1" style={{ fontSize: '16px', fontWeight: '600' }}>
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

                  <div className="flex gap-2">
                    <Button
                      onClick={() => onNavigate('equipment-detail', item)}
                      variant="outline"
                      className="flex-1"
                      size="sm"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    {currentUser?.role === 'student' && item.available > 0 && (
                      <Button
                        onClick={() => onNavigate('request-form', item)}
                        className="flex-1 bg-[#2F5DFF] hover:bg-[#2548CC]"
                        size="sm"
                      >
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        Borrow
                      </Button>
                    )}
                    {canEdit && (
                      <>
                        <Button
                          onClick={() => onNavigate('equipment-edit', item)}
                          variant="outline"
                          size="sm"
                        >
                          <Edit className="w-4 h-4" />
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
                </div>
              </div>
            ))}
          </div>

          {filteredEquipment.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No equipment found matching your search.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
