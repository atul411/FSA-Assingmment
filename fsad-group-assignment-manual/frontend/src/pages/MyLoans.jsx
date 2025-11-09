import React, { useState, useMemo, useEffect } from 'react';

// --- ICON PLACEHOLDERS ---
// Replaced the lucide-react import. Please substitute these placeholder components
// with your actual SVG components (e.g., import { SearchIcon } from './icons').
const IconPlaceholder = ({ name, className, 'aria-hidden': ariaHidden, ...props }) => (
  <div
    className={`${className || ''} flex items-center justify-center bg-gray-200 rounded-sm text-xs font-semibold text-gray-700`}
    aria-hidden={ariaHidden}
    {...props}
    style={{ width: '1.25rem', height: '1.25rem', minWidth: '1.25rem', minHeight: '1.25rem' }}
    title={`Replace with ${name} SVG`}
  >
    {name.substring(0, 2)}
  </div>
);

const ClipboardList = (props) => <IconPlaceholder name="Requests" {...props} />;
const CreditCard = (props) => <IconPlaceholder name="Loans" {...props} />;
const Bell = (props) => <IconPlaceholder name="Bell" {...props} />;
const Search = (props) => <IconPlaceholder name="Search" {...props} />;
const CheckCircle = (props) => <IconPlaceholder name="Approved" {...props} />;
const Clock = (props) => <IconPlaceholder name="Pending/Date" {...props} />;
const Send = (props) => <IconPlaceholder name="Issued" {...props} />;
const Calendar = (props) => <IconPlaceholder name="Calendar" {...props} />;
const MapPin = (props) => <IconPlaceholder name="Location" {...props} />;
const ListFilter = (props) => <IconPlaceholder name="Filter" {...props} />;

// We'll fetch requests and loans from the backend API instead of using hard-coded mocks.
// Endpoints used (adjust if your backend exposes different routes):
//  - GET http://localhost:5001/api/requests
//  - GET http://localhost:5001/api/loans


// --- UTILITY COMPONENTS ---

// Helper function to get status colors and icon for REQUESTS
const getRequestStatusProps = (status) => {
  switch (status) {
    case 'Approved':
      return { color: 'text-green-600', bg: 'bg-green-100', icon: CheckCircle };
    case 'Pending':
      return { color: 'text-yellow-600', bg: 'bg-yellow-100', icon: Clock };
    case 'Issued':
      return { color: 'text-indigo-600', bg: 'bg-indigo-100', icon: Send };
    default:
      return { color: 'text-gray-600', bg: 'bg-gray-100', icon: CheckCircle };
  }
};

// Helper function to get status colors and icon for LOANS
const getLoanStatusProps = (status) => {
  switch (status) {
    case 'Active':
      return { color: 'text-indigo-600', bg: 'bg-indigo-100', icon: CreditCard };
    case 'Returned':
      return { color: 'text-gray-600', bg: 'bg-gray-200', icon: CheckCircle };
    case 'Overdue':
      return { color: 'text-red-600', bg: 'bg-red-100', icon: Clock };
    default:
      return { color: 'text-gray-600', bg: 'bg-gray-100', icon: CreditCard };
  }
};


const RequestCard = ({ request }) => {
  const { icon: StatusIcon, color } = getRequestStatusProps(request.status);

  const handleAction = (action) => {
    console.log(`Action: ${action} on Request ID: ${request.id}`);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transition duration-150 hover:shadow-xl">
      <div className="flex items-start space-x-4">
        {/* Equipment Image/Placeholder */}
        <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
          <img
            src={request.imageUrl}
            alt={request.equipmentName}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/100x100/6b7280/ffffff?text=N/A';
            }}
          />
        </div>

        {/* Request Details */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-semibold text-gray-800 truncate">
              {request.equipmentName}
            </h3>
            {/* Status Badge */}
            <div className={`flex items-center space-x-1 px-3 py-1 text-sm font-medium rounded-full ${color} bg-white border border-gray-200 shadow-sm`}>
              <StatusIcon className={`w-4 h-4 ${color}`} aria-hidden="true" />
              <span>{request.status}</span>
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-3">
            <span className="font-medium text-gray-600">Request ID:</span> {request.id}
          </p>

          <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600 mt-2">
            {/* Requester Info */}
            <div className="flex items-center space-x-2">
              <ClipboardList className="w-4 h-4 text-indigo-500" aria-hidden="true" />
              <span>{request.requesterId}</span>
            </div>
            {/* Location */}
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-indigo-500" aria-hidden="true" />
              <span>{request.location}</span>
            </div>
            {/* Period */}
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-indigo-500" aria-hidden="true" />
              <span>{request.period}</span>
            </div>
            {/* Requested Date */}
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-indigo-500" aria-hidden="true" />
              <span>Requested: {request.requestedDate}</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100">
            <p className="text-xs font-semibold uppercase text-gray-500 mb-1">Reason:</p>
            <p className="text-gray-700 italic">{request.reason}</p>
          </div>
        </div>
      </div>

      {/* --- ACTION BUTTONS --- */}
      {/* Show Approve/Reject for Pending requests */}
      {request.status === 'Pending' && (
        <div className="mt-4 pt-4 border-t border-gray-100 flex space-x-3">
          <button
            onClick={() => handleAction('Approve')}
            className="flex items-center space-x-1 px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-150 transform hover:scale-[1.01]"
          >
            <CheckCircle className="w-4 h-4" aria-hidden="true" />
            <span>Approve</span>
          </button>
          <button
            onClick={() => handleAction('Reject')}
            className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-red-600 transition duration-150 transform hover:scale-[1.01]"
          >
            Reject
          </button>
        </div>
      )}

      {/* Show Issue Equipment for Approved requests */}
      {request.status === 'Approved' && (
        <div className="mt-4 pt-4 border-t border-gray-100 flex space-x-3">
          <button
            onClick={() => handleAction('Issue')}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-150 transform hover:scale-[1.01]"
          >
            Issue Equipment
          </button>
        </div>
      )}
    </div>
  );
};

const LoanCard = ({ loan }) => {
  const { icon: StatusIcon, color } = getLoanStatusProps(loan.status);

  const isOverdue = loan.status === 'Overdue';

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transition duration-150 hover:shadow-xl">
      <div className="flex items-start space-x-4">
        {/* Equipment Image/Placeholder */}
        <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
          <img
            src={loan.imageUrl}
            alt={loan.equipmentName}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/100x100/6b7280/ffffff?text=N/A';
            }}
          />
        </div>

        {/* Loan Details */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-semibold text-gray-800 truncate">
              {loan.equipmentName}
            </h3>
            {/* Status Badge */}
            <div className={`flex items-center space-x-1 px-3 py-1 text-sm font-medium rounded-full ${color} bg-white border border-gray-200 shadow-sm`}>
              <StatusIcon className={`w-4 h-4 ${color}`} aria-hidden="true" />
              <span>{loan.status}</span>
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-3">
            <span className="font-medium text-gray-600">Loan ID:</span> {loan.id}
          </p>

          <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600 mt-2">
            {/* Borrower Info */}
            <div className="flex items-center space-x-2">
              <ClipboardList className="w-4 h-4 text-indigo-500" aria-hidden="true" />
              <span>{loan.borrowerId}</span>
            </div>
            {/* Location */}
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-indigo-500" aria-hidden="true" />
              <span>{loan.location}</span>
            </div>
            {/* Loan Date */}
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-indigo-500" aria-hidden="true" />
              <span>Loaned: {loan.loanDate}</span>
            </div>
            {/* Return Date */}
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-indigo-500" aria-hidden="true" />
              <span>Return By: {loan.returnDate}</span>
            </div>
          </div>

          {/* Days Remaining / Overdue Info */}
          <div className={`mt-4 pt-3 border-t ${isOverdue ? 'border-red-200' : 'border-gray-100'}`}>
            <p className={`text-sm font-semibold ${isOverdue ? 'text-red-700' : 'text-green-700'}`}>
              {isOverdue
                ? `OVERDUE by ${-loan.daysRemaining} days`
                : `Return in ${loan.daysRemaining} days`
              }
            </p>
          </div>
        </div>
      </div>

      {/* Action Button for Active/Overdue Loans */}
      {loan.status !== 'Returned' && (
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={() => console.log(`Attempt Return on Loan ID: ${loan.id}`)}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-150 transform hover:scale-[1.01]"
          >
            Mark as Returned
          </button>
        </div>
      )}
    </div>
  );
};


const Header = ({ searchTerm, setSearchTerm }) => (
  <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200 sticky top-0 z-10">
    <div className="flex items-center space-x-4">
      <h1 className="text-xl font-bold text-gray-800 hidden md:block">EduLend</h1>
      <Search className="w-5 h-5 text-gray-400 ml-4 hidden sm:block" aria-hidden="true" />
      <input
        type="text"
        placeholder="Search equipment, requests, or users..."
        aria-label="Search equipment, requests, or users"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="hidden md:block w-80 p-2 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>
    <div className="flex items-center space-x-4">
      <Bell className="w-6 h-6 text-gray-600 hover:text-indigo-600 cursor-pointer transition" role="img" aria-label="Notifications" />
      <div className="flex items-center space-x-2 border-l pl-4">
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-800">Emma Thompson</p>
          <p className="text-xs text-gray-500">Student</p>
        </div>
        <img
          src="https://placehold.co/40x40/3b82f6/ffffff?text=ET"
          alt="User Avatar"
          className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500"
        />
      </div>
    </div>
  </header>
);



// New Component for the Loan Status Cards
const LoanStatsCard = ({ title, count, icon: Icon, color, iconBg }) => (
  <div className="flex-1 bg-white p-6 rounded-xl shadow-md border border-gray-100 min-w-[200px]">
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">{count}</p>
      </div>
      <div className={`p-2 rounded-full ${iconBg} ${color}`}>
        <Icon className='w-6 h-6' aria-hidden="true" />
      </div>
    </div>
  </div>
);

const MyLoansContent = ({ searchTerm }) => {
  const [activeTab, setActiveTab] = useState('Active');
  const [loans, setLoans] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loadingLoans, setLoadingLoans] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [errorLoans, setErrorLoans] = useState(null);
  const [errorRequests, setErrorRequests] = useState(null);

  useEffect(() => {
    // Fetch loans
    const fetchLoans = async () => {
      setLoadingLoans(true);
      setErrorLoans(null);
      try {
        const res = await fetch('http://localhost:5001/api/loans');
        if (!res.ok) throw new Error('Failed to fetch loans');
        const data = await res.json();
        // Map server response to expected shape (tolerant)
        const mapped = (data || []).map(item => ({
          id: item.id || item.loanId || item._id,
          equipmentName: item.equipmentName || item.name || item.title,
          status: item.status || item.loanStatus || 'Active',
          loanDate: item.loanDate || item.startDate || '',
          returnDate: item.returnDate || item.endDate || '',
          daysRemaining: typeof item.daysRemaining === 'number' ? item.daysRemaining : (item.daysRemaining || 0),
          borrowerId: item.borrowerId || item.userId || item.requesterId || '',
          location: item.location || item.storageLocation || '',
          imageUrl: item.imageUrl || item.image || '',
        }));
        setLoans(mapped);
      } catch (err) {
        setErrorLoans(err.message);
      } finally {
        setLoadingLoans(false);
      }
    };

    // Fetch requests
    const fetchRequests = async () => {
      setLoadingRequests(true);
      setErrorRequests(null);
      try {
        const res = await fetch('http://localhost:5001/api/requests');
        if (!res.ok) throw new Error('Failed to fetch requests');
        const data = await res.json();
        const mapped = (data || []).map(r => ({
          id: r.id || r.requestId || r._id,
          equipmentName: r.equipmentName || r.name || r.title,
          status: r.status || r.requestStatus || 'Pending',
          requesterId: r.requesterId || r.userId || '',
          reason: r.reason || r.note || '',
          period: r.period || `${r.startDate || ''} - ${r.endDate || ''}`,
          requestedDate: r.requestedDate || r.createdAt || '',
          location: r.location || r.storageLocation || '',
          imageUrl: r.imageUrl || r.image || '',
        }));
        setRequests(mapped);
      } catch (err) {
        setErrorRequests(err.message);
      } finally {
        setLoadingRequests(false);
      }
    };

    fetchLoans();
    fetchRequests();
  }, []);

  // --- STATS CALCULATION (from API data) ---
  const activeCount = loans.filter(l => l.status === 'Active').length;
  const overdueCount = loans.filter(l => l.status === 'Overdue').length;
  // Pending requests come from requests API
  const pendingReqCount = requests.filter(r => r.status === 'Pending').length;
  const totalHistoryCount = loans.length; // Active + Overdue + Returned

  const tabs = [
    { name: 'Active', status: 'Active', count: activeCount },
    { name: 'Pending', status: 'Pending', count: pendingReqCount },
    { name: 'Overdue', status: 'Overdue', count: overdueCount },
    { name: 'History', status: 'Returned', count: totalHistoryCount }, // Note: Total is used for history count
  ];

  const filteredLoans = useMemo(() => {
    const lowerCaseSearchTerm = (searchTerm || '').toLowerCase();

    // Filter based on Loan Status
    let statusFiltered = loans;
    if (activeTab !== 'All') {
      // 'History' tab maps to all loans for the list, otherwise filter by specific status
      const targetStatus = activeTab === 'History' ? 'All' : activeTab;
      statusFiltered = targetStatus === 'All' ? loans : loans.filter(loan => loan.status === targetStatus);
    }

    // Step 2: Filter by Search Term (Equipment Name)
    if (!searchTerm) {
      return statusFiltered;
    }

    return statusFiltered.filter(loan =>
      (loan.equipmentName || '').toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [activeTab, searchTerm, loans]);

  const getTabCount = (status) => {
    // Return counts defined above for the stats cards
    switch (status) {
      case 'Active': return activeCount;
      case 'Pending': return pendingReqCount;
      case 'Overdue': return overdueCount;
      case 'Returned': return totalHistoryCount; // Using total history for the list history tab count
      default: return 0;
    }
  };

  return (
    <div className="px-8">
      {/* Title */}
      <div className="flex justify-start items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">My Loans</h2>
          <p className="text-gray-500 mt-1">Track your borrowed equipment and request history</p>
        </div>
      </div>

      {/* --- STATS CARD ROW --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <LoanStatsCard
          title="Active Loans"
          count={activeCount}
          icon={CheckCircle}
          color="text-green-600"
          iconBg="bg-green-100"
        />
        <LoanStatsCard
          title="Pending"
          count={pendingReqCount}
          icon={Clock}
          color="text-yellow-600"
          iconBg="bg-yellow-100"
        />
        <LoanStatsCard
          title="Overdue"
          count={overdueCount}
          icon={ListFilter}
          color="text-red-600"
          iconBg="bg-red-100"
        />
        <LoanStatsCard
          title="Total History"
          count={totalHistoryCount}
          icon={Calendar}
          color="text-gray-600"
          iconBg="bg-gray-200"
        />
      </div>


      {/* Tab Navigation */}
      <div className="bg-white p-2 rounded-xl shadow-md flex space-x-4 mb-8 border border-gray-100 overflow-x-auto">
        {tabs.map((tab) => {
          const count = getTabCount(tab.status);
          const isActive = activeTab === tab.status;

          // Using status for key, but mapping 'Returned' to 'History' name
          const tabName = tab.name === 'Returned' ? 'History' : tab.name;

          return (
            <button
              key={tab.status}
              onClick={() => setActiveTab(tab.status)}
              className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-lg transition duration-150 flex items-center space-x-2
                ${isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
                }
              `}
            >
              <span>{tabName} ({count})</span>
            </button>
          );
        })}
      </div>

      {/* Loans List */}
      <div className="space-y-6">
        {activeTab === 'Pending' ? (
          loadingRequests ? (
            <div className="text-center p-12 bg-white rounded-xl shadow-lg border border-gray-100">Loading requests...</div>
          ) : errorRequests ? (
            <div className="text-center p-6 bg-red-50 text-red-700 rounded-lg">Error loading requests: {errorRequests}</div>
          ) : requests.length > 0 ? (
            requests.map(req => (
              <RequestCard key={req.id} request={req} />
            ))
          ) : (
            <div className="text-center p-12 bg-white rounded-xl shadow-lg border border-gray-100">
              <Clock className="w-10 h-10 mx-auto text-gray-400 mb-4" aria-hidden="true" />
              <h3 className="text-xl font-semibold text-gray-700">No pending requests</h3>
              <p className="text-gray-500 mt-2">All requests have been approved, issued, or rejected.</p>
            </div>
          )
        ) : loadingLoans ? (
          <div className="text-center p-12 bg-white rounded-xl shadow-lg border border-gray-100">Loading loans...</div>
        ) : filteredLoans.length > 0 ? (
          filteredLoans.map(loan => (
            <LoanCard key={loan.id} loan={loan} />
          ))
        ) : (
          <div className="text-center p-12 bg-white rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-700">No {activeTab.toLowerCase()} Loans Found</h3>
            <p className="text-gray-500 mt-2">You currently have no {activeTab.toLowerCase()} items.</p>
          </div>
        )}
      </div>
    </div>
  );
};


export default MyLoansContent;