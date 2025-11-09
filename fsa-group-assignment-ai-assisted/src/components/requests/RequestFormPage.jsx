import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { ArrowLeft, Calendar as CalendarIcon, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Badge } from '../ui/badge';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export const RequestFormPage = ({ equipment, onNavigate }) => {
  const { currentUser, createRequest, requests } = useApp();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [reason, setReason] = useState('');
  const [pickupLocation, setPickupLocation] = useState('Equipment Room A');
  const [showConflict, setShowConflict] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates');
      return;
    }

    if (endDate < startDate) {
      toast.error('End date must be after start date');
      return;
    }

    // Check for conflicts
    const hasConflict = requests.some(r => {
      if (r.equipmentId !== equipment.id) return false;
      if (!['Approved', 'Issued'].includes(r.status)) return false;
      
      return (
        (startDate >= r.startDate && startDate <= r.endDate) ||
        (endDate >= r.startDate && endDate <= r.endDate) ||
        (startDate <= r.startDate && endDate >= r.endDate)
      );
    });

    if (hasConflict && equipment.available === 0) {
      setShowConflict(true);
      return;
    }

    if (currentUser) {
      createRequest({
        equipmentId: equipment.id,
        userId: currentUser.id,
        startDate,
        endDate,
        reason,
        pickupLocation,
        status: 'Pending',
      });

      toast.success('Request submitted successfully!');
      onNavigate('my-loans');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <Button
        variant="ghost"
        onClick={() => onNavigate('equipment-detail', equipment)}
        className="gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Equipment
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Equipment Summary */}
        <Card className="lg:col-span-1 border-gray-300">
          <CardHeader>
            <CardTitle>Equipment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative h-48 bg-gray-100 rounded-lg overflow-hidden">
              <ImageWithFallback
                src={equipment.image}
                alt={equipment.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-gray-900 mb-2" style={{ fontSize: '16px', fontWeight: '600' }}>
                {equipment.name}
              </h3>
              <div className="flex gap-2 mb-3">
                <Badge variant="outline">{equipment.category}</Badge>
                <Badge variant="outline">{equipment.condition}</Badge>
              </div>
              <p className="text-gray-600" style={{ fontSize: '14px' }}>
                {equipment.available}/{equipment.quantity} available
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Request Form */}
        <Card className="lg:col-span-2 border-gray-300">
          <CardHeader>
            <CardTitle>Borrowing Request</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {showConflict && (
                <div className="flex items-start gap-2 p-4 bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-[#F59E0B]" style={{ fontSize: '14px', fontWeight: '600' }}>
                      Date Conflict Detected
                    </p>
                    <p className="text-[#F59E0B]/80" style={{ fontSize: '13px' }}>
                      This equipment is already booked for the selected dates. Try different dates or join the waitlist.
                    </p>
                    <div className="mt-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-[#F59E0B] border-[#F59E0B]/20"
                        onClick={() => setShowConflict(false)}
                      >
                        Choose Different Dates
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Start Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild className="border-gray-300">
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, 'PPP') : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white border-gray-300" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>End Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild className="border-gray-300">
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, 'PPP') : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white border-gray-300" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pickupLocation">Pickup Location *</Label>
                <Select value={pickupLocation} onValueChange={setPickupLocation}>
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="Select pickup location" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-300">
                    <SelectItem value="Equipment Room A">Equipment Room A</SelectItem>
                    <SelectItem value="Equipment Room B">Equipment Room B</SelectItem>
                    <SelectItem value="Science Lab">Science Lab</SelectItem>
                    <SelectItem value="Music Room">Music Room</SelectItem>
                    <SelectItem value="Sports Center">Sports Center</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Purpose / Reason *</Label>
                <Textarea
                  className="border-gray-300"
                  id="reason"
                  placeholder="Briefly describe how you plan to use this equipment..."
                  rows={4}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-start gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-blue-900" style={{ fontSize: '14px', fontWeight: '600' }}>
                    Borrowing Terms
                  </p>
                  <ul className="text-blue-800 list-disc list-inside mt-2 space-y-1" style={{ fontSize: '13px' }}>
                    <li>Equipment must be returned by the end date</li>
                    <li>Late returns may incur fees</li>
                    <li>Items must be returned in the same condition</li>
                    <li>Approval typically takes 1-2 business days</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onNavigate('equipment-detail', equipment)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#2F5DFF] hover:bg-[#2548CC]">
                  Submit Request
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
