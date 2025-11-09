import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { useApp } from '../../contexts/AppContext';
import { format, differenceInDays } from 'date-fns';
import { 
  RotateCcw, 
  Search,
  User,
  Calendar,
  AlertCircle,
  CheckCircle2,
  DollarSign,
  Package
} from 'lucide-react';
import { toast } from 'sonner';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export const ReturnsPage = ({ onNavigate }) => {
  const { currentUser, requests, equipment, users, markAsReturned } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [returnCondition, setReturnCondition] = useState('Good');
  const [returnNotes, setReturnNotes] = useState('');
  const [fine, setFine] = useState(0);

  const issuedRequests = useMemo(() => {
    return requests.filter(r => ['Issued', 'Overdue'].includes(r.status));
  }, [requests]);

  const searchedRequests = useMemo(() => {
    if (!searchQuery) return issuedRequests;
    
    return issuedRequests.filter(req => {
      const user = users.find(u => u.id === req.userId);
      const eq = equipment.find(e => e.id === req.equipmentId);
      
      return (
        user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        eq?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [issuedRequests, searchQuery, users, equipment]);

  const handleReturnClick = (request) => {
    setSelectedRequest(request);
    
    // Calculate fine for overdue items
    const today = new Date();
    const daysOverdue = Math.max(0, differenceInDays(today, request.endDate));
    const calculatedFine = daysOverdue > 0 ? daysOverdue * 2 : 0; // $2 per day
    
    setFine(calculatedFine);
    setReturnCondition('Good');
    setReturnNotes('');
  };

  const confirmReturn = () => {
    if (!selectedRequest) return;

    markAsReturned(selectedRequest.id, returnCondition, returnNotes, fine);
    toast.success('Equipment returned successfully!');
    
    setSelectedRequest(null);
  };

  const getDaysOverdue = (request) => {
    const today = new Date();
    return Math.max(0, differenceInDays(today, request.endDate));
  };

  const ReturnCard = ({ request }) => {
    const eq = equipment.find(e => e.id === request.equipmentId);
    const user = users.find(u => u.id === request.userId);
    const daysOverdue = getDaysOverdue(request);
    const isOverdue = daysOverdue > 0;

    if (!eq || !user) return null;

    return (
      <Card className={`hover:shadow-md transition-shadow ${isOverdue ? 'border-[#EF4444]/30' : ''}`}>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="w-full lg:w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              <ImageWithFallback
                src={eq.image}
                alt={eq.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-gray-900 mb-1" style={{ fontSize: '16px', fontWeight: '600' }}>
                    {eq.name}
                  </h3>
                  <p className="text-gray-500" style={{ fontSize: '14px' }}>
                    Loan ID: {request.id}
                  </p>
                </div>
                {isOverdue ? (
                  <Badge className="bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20" variant="outline">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Overdue
                  </Badge>
                ) : (
                  <Badge className="bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20" variant="outline">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-gray-600" style={{ fontSize: '14px' }}>
                  <User className="w-4 h-4" />
                  <span>{user.name}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600" style={{ fontSize: '14px' }}>
                  <Calendar className="w-4 h-4" />
                  <span>Due: {format(request.endDate, 'MMM d, yyyy')}</span>
                </div>
              </div>

              {isOverdue && (
                <div className="flex items-start gap-2 p-3 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-[#EF4444] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-[#EF4444]" style={{ fontSize: '14px', fontWeight: '600' }}>
                      {daysOverdue} {daysOverdue === 1 ? 'day' : 'days'} overdue
                    </p>
                    <p className="text-[#EF4444]/80" style={{ fontSize: '13px' }}>
                      Estimated late fee: ${(daysOverdue * 2).toFixed(2)}
                    </p>
                  </div>
                </div>
              )}

              {(['admin', 'staff'].includes(currentUser?.role || '')) && (
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    className="bg-[#2F5DFF] hover:bg-[#2548CC]"
                    onClick={() => handleReturnClick(request)}
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Process Return
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const overdueCount = searchedRequests.filter(r => getDaysOverdue(r) > 0).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-gray-900 mb-2">Returns & Due Tracking</h1>
          <p className="text-gray-600">
            Process equipment returns and track due dates
          </p>
        </div>

        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by name, equipment, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 mb-1" style={{ fontSize: '14px' }}>Issued Equipment</p>
                <p className="text-gray-900" style={{ fontSize: '28px', fontWeight: '700' }}>
                  {searchedRequests.length}
                </p>
              </div>
              <Package className="w-8 h-8 text-[#2F5DFF]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 mb-1" style={{ fontSize: '14px' }}>Overdue Items</p>
                <p className="text-gray-900" style={{ fontSize: '28px', fontWeight: '700' }}>
                  {overdueCount}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-[#EF4444]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 mb-1" style={{ fontSize: '14px' }}>Total Late Fees</p>
                <p className="text-gray-900" style={{ fontSize: '28px', fontWeight: '700' }}>
                  $
                  {searchedRequests
                    .reduce((acc, req) => acc + getDaysOverdue(req) * 2, 0)
                    .toFixed(2)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-[#10B981]" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {searchedRequests.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No issued equipment to display</p>
        ) : (
          searchedRequests.map(request => (
            <ReturnCard key={request.id} request={request} />
          ))
        )}
      </div>

      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="bg-white max-w-lg">
          <DialogHeader>
            <DialogTitle>Process Equipment Return</DialogTitle>
            <DialogDescription>
              Mark this equipment as returned and record its condition.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Equipment Condition</Label>
              <Select value={returnCondition} onValueChange={setReturnCondition}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300">
                  <SelectItem value="Excellent">Excellent</SelectItem>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Fair">Fair</SelectItem>
                  <SelectItem value="Poor">Poor</SelectItem>
                  <SelectItem value="Damaged">Damaged</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Return Notes</Label>
              <Textarea
                placeholder="Add any notes about the condition or return process..."
                value={returnNotes}
                onChange={(e) => setReturnNotes(e.target.value)}
              />
            </div>

            {fine > 0 && (
              <div className="space-y-2">
                <Label>Late Fee</Label>
                <div className="flex items-center gap-2">
                  <DollarSign className="text-gray-500" />
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={fine}
                    onChange={(e) => setFine(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <p className="text-sm text-gray-500">
                  Late fee calculated at $2/day overdue. You can adjust if needed.
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedRequest(null)}
            >
              Cancel
            </Button>
            <Button onClick={confirmReturn}>
              Complete Return
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};