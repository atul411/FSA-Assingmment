import React, { useState, useMemo } from 'react';

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

// --- MOCK DATA ---
const mockRequests = [
  {
    id: 'r1',
    equipmentName: 'Digital Camera Canon EOS',
    status: 'Approved',
    requesterId: 'STU-2024-001',
    reason: 'Photography project for Art class',
    period: 'Oct 25 - Nov 1, 2025',
    requestedDate: 'Oct 20, 2025',
    location: 'Equipment Room A',
    imageUrl: 'https://placehold.co/100x100/3b82f6/ffffff?text=Camera',
  },
  {
    id: 'r2',
    equipmentName: 'Projector Epson X120',
    status: 'Pending',
    requesterId: 'STU-2024-002',
    reason: 'Presentation for History class',
    period: 'Nov 10 - Nov 12, 2025',
    requestedDate: 'Nov 8, 2025',
    location: 'Equipment Room B',
    imageUrl: 'https://placehold.co/100x100/ef4444/ffffff?text=Projector',
  },
  {
    id: 'r3',
    equipmentName: 'Laptop Macbook Pro M1',
    status: 'Issued',
    requesterId: 'STU-2024-003',
    reason: 'Software Development workshop',
    period: 'Current (Issued)',
    requestedDate: 'Oct 1, 2025',
    location: 'IT Storage',
    imageUrl: 'https://placehold.co/100x100/10b981/ffffff?text=Laptop',
  },
  {
    id: 'r4',
    equipmentName: 'Microphone Rode NT1',
    status: 'Pending',
    requesterId: 'STU-2024-004',
    reason: 'Podcast recording for Media Club',
    period: 'Dec 1 - Dec 5, 2025',
    requestedDate: 'Nov 25, 2025',
    location: 'Audio Studio C',
    imageUrl: 'https://placehold.co/100x100/f59e0b/ffffff?text=Mic',
  },
];

const mockLoans = [
  {
    id: 'l101',
    equipmentName: 'Digital Camera Canon EOS',
    status: 'Active',
    loanDate: 'Oct 25, 2025',
    returnDate: 'Nov 1, 2025',
    daysRemaining: 5,
    borrowerId: 'STU-2024-001',
    location: 'Equipment Room A',
    imageUrl: 'https://placehold.co/100x100/3b82f6/ffffff?text=Camera',
  },
  {
    id: 'l102',
    equipmentName: 'Telescope Celestron 130EQ',
    status: 'Overdue',
    loanDate: 'Sep 1, 2025',
    returnDate: 'Oct 1, 2025',
    daysRemaining: -35,
    borrowerId: 'STU-2024-005',
    location: 'Science Lab',
    imageUrl: 'https://placehold.co/100x100/f59e0b/ffffff?text=Scope',
  },
  {
    id: 'l103',
    equipmentName: 'Sound Mixer Yamaha MG10XU',
    status: 'Returned',
    loanDate: 'Aug 10, 2025',
    returnDate: 'Aug 15, 2025',
    borrowerId: 'STU-2024-006',
    location: 'Audio Studio C',
    imageUrl: 'https://placehold.co/100x100/10b981/ffffff?text=Mixer',
  },
];


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

  // --- STATS CALCULATION ---
  const activeCount = mockLoans.filter(l => l.status === 'Active').length;
  const overdueCount = mockLoans.filter(l => l.status === 'Overdue').length;
  // Assuming 'Pending' refers to the user's pending requests in the system.
  const pendingReqCount = mockRequests.filter(r => r.status === 'Pending').length;
  const totalHistoryCount = mockLoans.length; // Active + Overdue + Returned

  const tabs = [
    { name: 'Active', status: 'Active', count: activeCount },
    { name: 'Pending', status: 'Pending', count: pendingReqCount },
    { name: 'Overdue', status: 'Overdue', count: overdueCount },
    { name: 'History', status: 'Returned', count: totalHistoryCount }, // Note: Total is used for history count
  ];

  const filteredLoans = useMemo(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    // If 'Pending' is selected, we show the "No requests" message (empty list of loans).
    if (activeTab === 'Pending') {
      return [];
    }

    // Filter based on Loan Status
    let statusFiltered = mockLoans;
    if (activeTab !== 'All') {
      // 'History' tab maps to all loans for the list, otherwise filter by specific status
      const targetStatus = activeTab === 'History' ? 'All' : activeTab;
      statusFiltered = targetStatus === 'All' ? mockLoans : mockLoans.filter(loan => loan.status === targetStatus);
    }

    // Step 2: Filter by Search Term (Equipment Name)
    if (!searchTerm) {
      return statusFiltered;
    }

    return statusFiltered.filter(loan =>
      loan.equipmentName.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [activeTab, searchTerm]);

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
          <div className="text-center p-12 bg-white rounded-xl shadow-lg border border-gray-100">
            <Clock className="w-10 h-10 mx-auto text-gray-400 mb-4" aria-hidden="true" />
            <h3 className="text-xl font-semibold text-gray-700">No pending requests</h3>
            <p className="text-gray-500 mt-2">All requests have been approved, issued, or rejected.</p>
          </div>
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