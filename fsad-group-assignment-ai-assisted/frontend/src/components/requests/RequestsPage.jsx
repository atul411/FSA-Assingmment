import React, { useMemo, useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { useApp } from '../../contexts/AppContext';
import { format } from 'date-fns';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Search,
  User,
  Package,
  Calendar,
  MapPin,
  FileText
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export const RequestsPage = ({ onNavigate }) => {
  const { currentUser, requests, equipment, users, updateRequestStatus } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [notes, setNotes] = useState('');

  const filteredRequests = useMemo(() => {
    if (currentUser?.role === 'student') {
      return requests.filter(r => r.userId === currentUser.id);
    }
    return requests;
  }, [requests, currentUser]);

  const searchedRequests = useMemo(() => {
    if (!searchQuery) return filteredRequests;
    
    return filteredRequests.filter(req => {
      const user = users.find(u => u.id === req.userId);
      const eq = equipment.find(e => e.id === req.equipmentId);
      
      return (
        user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        eq?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [filteredRequests, searchQuery, users, equipment]);

  const getStatusBadge = (status) => {
    const config = {
      Pending: { color: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20', icon: Clock },
      Approved: { color: 'bg-blue-500/10 text-blue-700 border-blue-500/20', icon: CheckCircle2 },
      Rejected: { color: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20', icon: XCircle },
      Issued: { color: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20', icon: CheckCircle2 },
      Returned: { color: 'bg-gray-500/10 text-gray-700 border-gray-500/20', icon: CheckCircle2 },
      Overdue: { color: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20', icon: XCircle },
      Waitlist: { color: 'bg-purple-500/10 text-purple-700 border-purple-500/20', icon: Clock },
    };

    const { color, icon: Icon } = config[status] || config.Pending;

    return (
      <Badge className={color} variant="outline">
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const handleAction = (request, action) => {
    setSelectedRequest(request);
    setActionType(action);
    setNotes('');
  };

  const confirmAction = () => {
    if (!selectedRequest || !actionType) return;

    const statusMap = {
      approve: 'Approved',
      reject: 'Rejected',
      issue: 'Issued',
    };

    updateRequestStatus(selectedRequest.id, statusMap[actionType], notes);
    
    const messages = {
      approve: 'Request approved successfully!',
      reject: 'Request rejected',
      issue: 'Equipment issued to borrower',
    };
    
    toast.success(messages[actionType]);
    setSelectedRequest(null);
    setActionType(null);
    setNotes('');
  };

  const RequestCard = ({ request }) => {
    const eq = equipment.find(e => e.id === request.equipmentId);
    const user = users.find(u => u.id === request.userId);

    if (!eq || !user) return null;

    const canApprove = ['admin', 'staff'].includes(currentUser?.role || '');
    const canIssue = request.status === 'Approved' && canApprove;

    return (
      <Card className="hover:shadow-md transition-shadow">
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
                    Request ID: {request.id}
                  </p>
                </div>
                {getStatusBadge(request.status)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-gray-600" style={{ fontSize: '14px' }}>
                  <User className="w-4 h-4" />
                  <span>{user.name} ({user.schoolId})</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600" style={{ fontSize: '14px' }}>
                  <Calendar className="w-4 h-4" />
                  <span>
                    {format(request.startDate, 'MMM d')} - {format(request.endDate, 'MMM d, yyyy')}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600" style={{ fontSize: '14px' }}>
                  <MapPin className="w-4 h-4" />
                  <span>{request.pickupLocation}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600" style={{ fontSize: '14px' }}>
                  <FileText className="w-4 h-4" />
                  <span>Requested: {format(request.requestDate, 'MMM d, yyyy')}</span>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-500 mb-1" style={{ fontSize: '12px', fontWeight: '600' }}>
                  Reason:
                </p>
                <p className="text-gray-700" style={{ fontSize: '14px' }}>
                  {request.reason}
                </p>
              </div>

              {canApprove && request.status === 'Pending' && (
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    className="bg-[#10B981] hover:bg-[#059669]"
                    onClick={() => handleAction(request, 'approve')}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-[#EF4444] border-[#EF4444]/20 hover:bg-[#EF4444]/10"
                    onClick={() => handleAction(request, 'reject')}
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                </div>
              )}

              {canIssue && (
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    className="bg-[#2F5DFF] hover:bg-[#2548CC]"
                    onClick={() => handleAction(request, 'issue')}
                  >
                    <Package className="w-4 h-4 mr-1" />
                    Issue Equipment
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const pendingRequests = searchedRequests.filter(r => r.status === 'Pending');
  const approvedRequests = searchedRequests.filter(r => r.status === 'Approved');
  const issuedRequests = searchedRequests.filter(r => r.status === 'Issued');
  const waitlistRequests = searchedRequests.filter(r => r.status === 'Waitlist');

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-gray-900 mb-2">Equipment Requests</h1>
          <p className="text-gray-600">
            Manage and process equipment loan requests
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

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pendingRequests.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approvedRequests.length})</TabsTrigger>
          <TabsTrigger value="issued">Issued ({issuedRequests.length})</TabsTrigger>
          <TabsTrigger value="waitlist">Waitlist ({waitlistRequests.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingRequests.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No pending requests</p>
          ) : (
            pendingRequests.map(request => (
              <RequestCard key={request.id} request={request} />
            ))
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {approvedRequests.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No approved requests</p>
          ) : (
            approvedRequests.map(request => (
              <RequestCard key={request.id} request={request} />
            ))
          )}
        </TabsContent>

        <TabsContent value="issued" className="space-y-4">
          {issuedRequests.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No issued equipment</p>
          ) : (
            issuedRequests.map(request => (
              <RequestCard key={request.id} request={request} />
            ))
          )}
        </TabsContent>

        <TabsContent value="waitlist" className="space-y-4">
          {waitlistRequests.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No waitlist requests</p>
          ) : (
            waitlistRequests.map(request => (
              <RequestCard key={request.id} request={request} />
            ))
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' && 'Approve Request'}
              {actionType === 'reject' && 'Reject Request'}
              {actionType === 'issue' && 'Issue Equipment'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'approve' && 'Approve this equipment request. The borrower will be notified.'}
              {actionType === 'reject' && 'Reject this equipment request. Please provide a reason.'}
              {actionType === 'issue' && 'Mark this equipment as issued to the borrower.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Notes (optional)</Label>
              <Textarea
                placeholder="Add any notes or comments..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedRequest(null)}
            >
              Cancel
            </Button>
            <Button
              className={actionType === 'reject' ? 'bg-[#EF4444] hover:bg-[#DC2626]' : ''}
              onClick={confirmAction}
            >
              {actionType === 'approve' && 'Approve Request'}
              {actionType === 'reject' && 'Reject Request'}
              {actionType === 'issue' && 'Issue Equipment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};