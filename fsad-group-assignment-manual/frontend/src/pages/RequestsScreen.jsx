import React, { useState, useMemo, useEffect } from 'react';

// --- ICON PLACEHOLDERS ---
// Replaced the lucide-react import. Please substitute these placeholder components
// with your actual SVG components (e.g., import { SearchIcon } from './icons').

// Base visual placeholder (maintains size/class structure)
const IconPlaceholder = ({ name, className, 'aria-hidden': ariaHidden, ...props }) => (
    <div
        className={`${className || ''} flex items-center justify-center bg-gray-200 rounded-sm text-xs font-semibold text-gray-700`}
        aria-hidden={ariaHidden}
        {...props}
        // These inline styles ensure the placeholder maintains the 1.25rem (w-5/h-5) size
        style={{ width: '1.25rem', height: '1.25rem', minWidth: '1.25rem', minHeight: '1.25rem' }}
        title={`Replace with ${name} SVG`}
    >
        {name.substring(0, 2)}
    </div>
);

// Specific Icon components used throughout the application
const ClipboardList = (props) => <IconPlaceholder name="Requests" {...props} />;
const Bell = (props) => <IconPlaceholder name="Bell" {...props} />;
const CheckCircle = (props) => <IconPlaceholder name="Approved" {...props} />;
const Clock = (props) => <IconPlaceholder name="Pending/Date" {...props} />;
const Send = (props) => <IconPlaceholder name="Issued" {...props} />;
const Calendar = (props) => <IconPlaceholder name="Calendar" {...props} />;
const MapPin = (props) => <IconPlaceholder name="Location" {...props} />;


// Requests will be fetched from the backend API instead of using hard-coded mock data.
// Endpoint used: GET http://localhost:5001/api/requests

// --- UTILITY COMPONENTS ---

// Helper function to get status colors and icon
const getStatusProps = (status) => {
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

const RequestCard = ({ request }) => {
  const { icon: StatusIcon, color } = getStatusProps(request.status);

  // Handle request actions with API calls
  const handleAction = async (action) => {
    try {
      const response = await fetch(`http://localhost:5001/api/requests/${request.id}/${action.toLowerCase()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} request`);
      }

      // Trigger a refresh of the requests list
      window.location.reload();
    } catch (error) {
      console.error(`Error ${action.toLowerCase()}ing request:`, error);
      alert(`Failed to ${action.toLowerCase()} request. Please try again.`);
    }
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
            {/* User Info */}
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
      {/* --- END ACTION BUTTONS --- */}

    </div>
  );
};


// --- MAIN SCREEN COMPONENT (App) ---
const RequestsScreen = () => {
  const [activeTab, setActiveTab] = useState('All'); // Changed default tab to 'All'

  // Requests state fetched from backend
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [errorRequests, setErrorRequests] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoadingRequests(true);
      setErrorRequests(null);
      try {
        const res = await fetch('http://localhost:5001/api/requests');
        if (!res.ok) throw new Error('Failed to fetch requests');
        const data = await res.json();
        // Map response conservatively to the UI shape
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

    fetchRequests();
  }, []);

  const tabs = [
    { name: 'Pending', status: 'Pending' },
    { name: 'Approved', status: 'Approved' },
    { name: 'Issued', status: 'Issued' },
    { name: 'All', status: 'All' },
  ];

  const filteredRequests = useMemo(() => {
    // Use the fetched requests; while loading, return empty array
    if (typeof requests === 'undefined' || requests === null) return [];

    // Step 1: Filter by Tab Status
    const statusFiltered = (activeTab === 'All')
      ? requests
      : requests.filter(request => request.status === activeTab);

    // Optionally filter out malformed entries and return
    return statusFiltered.filter(request => request && request.equipmentName);
  }, [activeTab, requests]);

  const getTabCount = (status) => {
    if (!Array.isArray(requests)) return 0;
    if (status === 'All') return requests.length;
    return requests.filter(req => req.status === status).length;
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans antialiased">

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto">

        {/* Content Body */}
        <main className="p-6 md:p-10 flex-1">
          <div className="max-w-7xl mx-auto">
            
            {/* Title (Secondary Search Bar Removed) */}
            <div className="flex justify-start items-center mb-6"> {/* Changed to justify-start */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900">My Requests</h2>
                <p className="text-gray-500 mt-1">View and track your equipment requests</p>
              </div>
            </div>

            {/* Tab Navigation (Filter Button Removed) */}
            <div className="bg-white p-2 rounded-xl shadow-md flex space-x-4 mb-8 border border-gray-100 overflow-x-auto">
              {tabs.map((tab) => {
                const count = getTabCount(tab.status);
                const isActive = activeTab === tab.status;
                
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
                    <span>{tab.name}</span>
                    <span
                      className={`px-2 py-0.5 text-xs font-bold rounded-full
                        ${isActive ? 'bg-white text-indigo-600' : 'bg-gray-200 text-gray-700'}
                      `}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Requests List */}
            <div className="space-y-6">
              {loadingRequests ? (
                <div className="text-center p-12 bg-white rounded-xl shadow-lg border border-gray-100">Loading requests...</div>
              ) : errorRequests ? (
                <div className="text-center p-6 bg-red-50 text-red-700 rounded-lg">Error loading requests: {errorRequests}</div>
              ) : filteredRequests.length > 0 ? (
                filteredRequests.map(request => (
                  <RequestCard key={request.id} request={request} />
                ))
              ) : (
                <div className="text-center p-12 bg-white rounded-xl shadow-lg border border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-700">No {activeTab} Requests Found</h3>
                  <p className="text-gray-500 mt-2">Check back later or try a different status tab.</p>
                </div>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default RequestsScreen;