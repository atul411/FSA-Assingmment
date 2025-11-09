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
const ListFilter = (props) => <IconPlaceholder name="Filter" {...props} />; 



// --- API INTEGRATION ---
const fetchReturns = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/returns');
    if (!response.ok) throw new Error('Failed to fetch returns');
    return await response.json();
  } catch (error) {
    throw new Error(`Error fetching returns: ${error.message}`);
  }
};

const processReturn = async (loanId) => {
  try {
    const response = await fetch(`http://localhost:5000/api/returns/${loanId}/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to process return');
    return await response.json();
  } catch (error) {
    throw new Error(`Error processing return: ${error.message}`);
  }
};

// --- UTILITY COMPONENTS ---




// New Card Component for the Returns Screen
const ReturnItemCard = ({ item, onProcessReturn }) => {
    const isOverdue = item.status === 'Overdue';
    const [isProcessing, setIsProcessing] = useState(false);

    const handleProcessReturn = async () => {
        setIsProcessing(true);
        try {
            await processReturn(item.loanId);
            onProcessReturn(item.loanId);
        } catch (error) {
            console.error(error);
            alert('Failed to process return. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transition duration-150 hover:shadow-xl">
            <div className="flex items-start space-x-4">
                {/* Equipment Image/Placeholder */}
                <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                    <img
                        src={item.imageUrl}
                        alt={item.equipmentName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://placehold.co/100x100/6b7280/ffffff?text=N/A';
                        }}
                    />
                </div>

                {/* Return Details */}
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-semibold text-gray-800 truncate">
                            {item.equipmentName}
                        </h3>
                        {/* Status Badge */}
                        <div className={`flex items-center space-x-1 px-3 py-1 text-sm font-medium rounded-full text-red-600 bg-white border border-gray-200 shadow-sm`}>
                            <Clock className={`w-4 h-4 text-red-600`} aria-hidden="true" />
                            <span>{item.status}</span>
                        </div>
                    </div>

                    <p className="text-sm text-gray-500 mb-3">
                        <span className="font-medium text-gray-600">Loan ID:</span> {item.loanId}
                    </p>

                    <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600 mt-2">
                        {/* Borrower Info */}
                        <div className="flex items-center space-x-2">
                            <ClipboardList className="w-4 h-4 text-indigo-500" aria-hidden="true" />
                            <span>{item.loanedTo}</span>
                        </div>
                        {/* Due Date */}
                        <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-red-500" aria-hidden="true" />
                            <span>Due: {item.due}</span>
                        </div>
                    </div>

                    {/* Overdue/Fee Details */}
                    {isOverdue && (
                        <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
                            <p className="text-sm font-semibold text-red-700">
                                {item.daysLate} days overdue
                            </p>
                            <p className="text-xs text-red-600 mt-1">
                                Estimated late fee: ${item.fee.toFixed(2)}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Action Button for Returns */}
            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                <button
                    onClick={handleProcessReturn}
                    disabled={isProcessing}
                    className={`px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg shadow-md transition duration-150 transform hover:scale-[1.01] ${
                        isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'
                    }`}
                >
                    {isProcessing ? 'Processing...' : 'Process Return'}
                </button>
            </div>
        </div>
    );
};




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


const ReturnsContent = ({ searchTerm }) => {
    const [activeTab, setActiveTab] = useState('Total Active');
    const [returns, setReturns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadReturns = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchReturns();
                setReturns(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadReturns();
    }, []);

    const handleProcessReturn = async (loanId) => {
        setReturns(prevReturns => prevReturns.filter(r => r.loanId !== loanId));
    };

    // --- STATS CALCULATION for Returns ---
    const totalActiveCount = returns.length;
    const overdueCount = returns.filter(r => r.status === 'Overdue').length;
    const onTimeCount = returns.filter(r => r.status === 'OnTime').length;

    const statsCards = [
        { title: 'Total Active', count: totalActiveCount, status: 'Total Active', icon: CheckCircle, color: 'text-green-600', iconBg: 'bg-green-100' },
        { title: 'Overdue', count: overdueCount, status: 'Overdue', icon: ListFilter, color: 'text-red-600', iconBg: 'bg-red-100' },
        { title: 'On Time', count: onTimeCount, status: 'On Time', icon: CheckCircle, color: 'text-blue-600', iconBg: 'bg-blue-100' },
    ];

    const tabs = [
        { name: 'Total Active', status: 'Total Active', count: totalActiveCount },
        { name: 'Overdue', status: 'Overdue', count: overdueCount },
        { name: 'On Time', status: 'On Time', count: onTimeCount },
    ];

    const filteredReturns = useMemo(() => {
        if (loading || error) return [];
        
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        
        // Step 1: Filter by Tab Status
        let statusFiltered = returns;
        if (activeTab !== 'Total Active') {
            const targetStatus = activeTab === 'On Time' ? 'OnTime' : activeTab;
            statusFiltered = returns.filter(item => item.status === targetStatus);
        }

        // Step 2: Filter by Search Term (Equipment Name)
        if (!searchTerm) {
            return statusFiltered;
        }

        return statusFiltered.filter(item => 
            item.equipmentName.toLowerCase().includes(lowerCaseSearchTerm) ||
            item.loanedTo.toLowerCase().includes(lowerCaseSearchTerm)
        );
    }, [activeTab, searchTerm, returns, loading, error]);
    
    // The image provided does not show a list of items for the 'On Time' status, 
    // but the functionality is included here for completeness.

    return (
        <div className='px-8'>
            {/* Title */}
            <div className="flex justify-start items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Returns & Due Tracking</h2>
                    <p className="text-gray-500 mt-1">Process equipment returns and track due dates</p>
                </div>
            </div>

            {/* --- STATS CARD ROW --- */}
            {/* Using LoanStatsCard for styling consistency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statsCards.map(card => (
                    <LoanStatsCard 
                        key={card.title}
                        title={card.title} 
                        count={card.count} 
                        icon={card.icon} 
                        color={card.color} 
                        iconBg={card.iconBg} 
                    />
                ))}
            </div>


            {/* Tab Navigation */}
            <div>
            <div className="bg-white p-2 rounded-xl shadow-md flex space-x-4 mb-8 border border-gray-100 overflow-x-auto">
                {tabs.map((tab) => {
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
                            <span>{tab.name} ({tab.count})</span>
                        </button>
                    );
                })}
            </div>

            {/* Returns List */}
            <div className="space-y-6">
                {loading ? (
                    <div className="text-center p-12 bg-white rounded-xl shadow-lg border border-gray-100">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading returns...</p>
                    </div>
                ) : error ? (
                    <div className="text-center p-12 bg-red-50 rounded-xl shadow-lg border border-red-100">
                        <Clock className="w-10 h-10 mx-auto text-red-400 mb-4" aria-hidden="true" />
                        <h3 className="text-xl font-semibold text-red-700">Error Loading Returns</h3>
                        <p className="text-red-600 mt-2">{error}</p>
                    </div>
                ) : filteredReturns.length > 0 ? (
                    filteredReturns.map(item => (
                        <ReturnItemCard 
                            key={item.id} 
                            item={item} 
                            onProcessReturn={handleProcessReturn}
                        />
                    ))
                ) : (
                    <div className="text-center p-12 bg-white rounded-xl shadow-lg border border-gray-100">
                        <Clock className="w-10 h-10 mx-auto text-gray-400 mb-4" aria-hidden="true" />
                        <h3 className="text-xl font-semibold text-gray-700">No {activeTab.toLowerCase()} items to process</h3>
                        <p className="text-gray-500 mt-2">All equipment is currently on time or has been processed.</p>
                    </div>
                )}
            </div>
            </div>
        </div>
    );
};


export default ReturnsContent;