import React, { useMemo } from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useApp } from '../../contexts/AppContext';
import { format, differenceInDays } from 'date-fns';
import { Clock, CheckCircle2, XCircle, AlertCircle, Calendar, MapPin } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export const MyLoansPage = ({ onNavigate }) => {
  const { currentUser, requests, equipment, users } = useApp();

  const myRequests = useMemo(() => {
    return requests.filter(r => r.userId === currentUser?.id);
  }, [requests, currentUser]);

  const getStatusBadge = (status) => {
    const config = {
      Pending: { color: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20', icon: Clock },
      Approved: { color: 'bg-blue-500/10 text-blue-700 border-blue-500/20', icon: CheckCircle2 },
      Rejected: { color: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20', icon: XCircle },
      Issued: { color: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20', icon: CheckCircle2 },
      Returned: { color: 'bg-gray-500/10 text-gray-700 border-gray-500/20', icon: CheckCircle2 },
      Overdue: { color: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20', icon: AlertCircle },
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

  const getDaysRemaining = (request) => {
    if (request.status === 'Returned') return null;
    const today = new Date();
    const days = differenceInDays(request.endDate, today);
    
    if (days < 0) return { label: `${Math.abs(days)} days overdue`, color: 'text-[#EF4444]' };
    if (days === 0) return { label: 'Due today', color: 'text-[#F59E0B]' };
    if (days <= 3) return { label: `${days} days left`, color: 'text-[#F59E0B]' };
    return { label: `${days} days left`, color: 'text-gray-600' };
  };

  const RequestCard = ({ request }) => {
    const eq = equipment.find(e => e.id === request.equipmentId);
    const daysInfo = getDaysRemaining(request);

    if (!eq) return null;

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              <ImageWithFallback
                src={eq.image}
                alt={eq.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 mb-3">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
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
              </div>

              {daysInfo && (
                <p className={daysInfo.color} style={{ fontSize: '14px', fontWeight: '600' }}>
                  {daysInfo.label}
                </p>
              )}

              {request.notes && (
                <p className="text-gray-600 mt-2" style={{ fontSize: '14px' }}>
                  Note: {request.notes}
                </p>
              )}

              {request.fine && request.fine > 0 && (
                <div className="mt-2 p-2 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded">
                  <p className="text-[#EF4444]" style={{ fontSize: '14px', fontWeight: '600' }}>
                    Fine: ${request.fine.toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const activeLoans = myRequests.filter(r => ['Approved', 'Issued'].includes(r.status));
  const pendingRequests = myRequests.filter(r => r.status === 'Pending');
  const overdueLoans = myRequests.filter(r => r.status === 'Overdue');
  const historyRequests = myRequests.filter(r => ['Returned', 'Rejected'].includes(r.status));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 mb-2">My Loans</h1>
        <p className="text-gray-600">
          Track your borrowed equipment and request history
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 mb-1" style={{ fontSize: '14px' }}>Active Loans</p>
                <p className="text-gray-900" style={{ fontSize: '28px', fontWeight: '700' }}>
                  {activeLoans.length}
                </p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-[#10B981]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 mb-1" style={{ fontSize: '14px' }}>Pending</p>
                <p className="text-gray-900" style={{ fontSize: '28px', fontWeight: '700' }}>
                  {pendingRequests.length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-[#F59E0B]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 mb-1" style={{ fontSize: '14px' }}>Overdue</p>
                <p className="text-gray-900" style={{ fontSize: '28px', fontWeight: '700' }}>
                  {overdueLoans.length}
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
                <p className="text-gray-500 mb-1" style={{ fontSize: '14px' }}>Total History</p>
                <p className="text-gray-900" style={{ fontSize: '28px', fontWeight: '700' }}>
                  {myRequests.length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Requests Tabs */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active ({activeLoans.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingRequests.length})</TabsTrigger>
          <TabsTrigger value="overdue">Overdue ({overdueLoans.length})</TabsTrigger>
          <TabsTrigger value="history">History ({historyRequests.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-4">
          {activeLoans.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No active loans</p>
          ) : (
            activeLoans.map(request => (
              <RequestCard key={request.id} request={request} />
            ))
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {pendingRequests.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No pending requests</p>
          ) : (
            pendingRequests.map(request => (
              <RequestCard key={request.id} request={request} />
            ))
          )}
        </TabsContent>

        <TabsContent value="overdue" className="space-y-4">
          {overdueLoans.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No overdue loans</p>
          ) : (
            overdueLoans.map(request => (
              <RequestCard key={request.id} request={request} />
            ))
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {historyRequests.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No history yet</p>
          ) : (
            historyRequests.map(request => (
              <RequestCard key={request.id} request={request} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};