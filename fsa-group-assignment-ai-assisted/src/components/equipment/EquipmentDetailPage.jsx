import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ArrowLeft, ShoppingCart, Calendar, Package, AlertCircle } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export const EquipmentDetailPage = ({ equipment, onNavigate }) => {
  const { currentUser, requests } = useApp();

  const activeRequests = requests.filter(
    r => r.equipmentId === equipment.id && ['Pending', 'Approved', 'Issued'].includes(r.status)
  );

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

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={() => onNavigate('dashboard')}
        className="gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Image Section */}
        <Card className="border-gray-100">
          <CardContent className="p-0">
            <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
              <ImageWithFallback
                src={equipment.image}
                alt={equipment.name}
                className="w-full h-full object-cover"
              />
            </div>
          </CardContent>
        </Card>

        {/* Details Section */}
        <div className="space-y-6">
          <div>
            <div className="flex gap-2 mb-4">
              <Badge className={getCategoryColor(equipment.category)}>
                {equipment.category}
              </Badge>
              <Badge className={getConditionColor(equipment.condition)} variant="outline">
                {equipment.condition}
              </Badge>
            </div>
            <h1 className="text-gray-900 mb-2">{equipment.name}</h1>
            <p className="text-gray-600">{equipment.description}</p>
          </div>

          <Card className="border-gray-300">
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 mb-1" style={{ fontSize: '14px' }}>Total Quantity</p>
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900" style={{ fontSize: '20px', fontWeight: '600' }}>
                      {equipment.quantity}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-gray-500 mb-1" style={{ fontSize: '14px' }}>Available</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900" style={{ fontSize: '20px', fontWeight: '600' }}>
                      {equipment.available}
                    </span>
                  </div>
                </div>
              </div>

              {equipment.available === 0 && (
                <div className="flex items-start gap-2 p-3 bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[#F59E0B]" style={{ fontSize: '14px', fontWeight: '600' }}>
                      Currently Unavailable
                    </p>
                    <p className="text-[#F59E0B]/80" style={{ fontSize: '13px' }}>
                      All units are currently in use. You can join the waitlist.
                    </p>
                  </div>
                </div>
              )}

              {currentUser?.role === 'student' && (
                <Button
                  onClick={() => onNavigate('request-form', equipment)}
                  className="w-full bg-[#2F5DFF] hover:bg-[#2548CC]"
                  disabled={equipment.available === 0}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {equipment.available > 0 ? 'Request to Borrow' : 'Join Waitlist'}
                </Button>
              )}
            </CardContent>
          </Card>

          {activeRequests.length > 0 && (currentUser?.role === 'admin' || currentUser?.role === 'staff') && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-gray-900 mb-4" style={{ fontSize: '16px', fontWeight: '600' }}>
                  Active Requests ({activeRequests.length})
                </h3>
                <div className="space-y-2">
                  {activeRequests.slice(0, 3).map(req => (
                    <div key={req.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-gray-700" style={{ fontSize: '14px' }}>
                        Request #{req.id}
                      </span>
                      <Badge variant="outline">
                        {req.status}
                      </Badge>
                    </div>
                  ))}
                  {activeRequests.length > 3 && (
                    <button
                      onClick={() => onNavigate('requests')}
                      className="text-[#2F5DFF] hover:underline w-full text-center"
                      style={{ fontSize: '14px' }}
                    >
                      View all {activeRequests.length} requests
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Additional Information */}
      <Card className="border-gray-300">
        <CardContent className="p-6">
          <h3 className="text-gray-900 mb-4" style={{ fontSize: '18px', fontWeight: '600' }}>
            Borrowing Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-gray-700 mb-2" style={{ fontSize: '14px', fontWeight: '600' }}>
                Loan Period
              </h4>
              <p className="text-gray-600" style={{ fontSize: '14px' }}>
                Standard loan period is 7 days with option to extend if available.
              </p>
            </div>
            <div>
              <h4 className="text-gray-700 mb-2" style={{ fontSize: '14px', fontWeight: '600' }}>
                Pickup Location
              </h4>
              <p className="text-gray-600" style={{ fontSize: '14px' }}>
                Equipment Room A or designated location based on category.
              </p>
            </div>
            <div>
              <h4 className="text-gray-700 mb-2" style={{ fontSize: '14px', fontWeight: '600' }}>
                Return Policy
              </h4>
              <p className="text-gray-600" style={{ fontSize: '14px' }}>
                Items must be returned in the same condition. Late fees apply after grace period.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
