import React from 'react';
import MyLoans from './MyLoans'
import RequestsScreen from './RequestsScreen';
import ReturnsContent from './ReturnsContent';
import { useState } from 'react';
import EquipmentCatalog from './EquipmentCatalog';
import EquipmentCardDetailed from './EquipmentCardDetailed';
import Sidebar from './Sidebar';

// --- Navigation Items ---
const navItems = [
    { name: 'Dashboard', icon: '🏠', page: 'dashboard', active: false }, // Home
    { name: 'Equipment', icon: '📦', page: 'equipment', active: true }, // Package (Box)
    { name: 'Requests', icon: '📄', page: 'requests', active: false }, // Document (FileText)
    { name: 'My Loans', icon: '💳', page: 'loans', active: false }, // Credit Card (CreditCard)
    { name: 'Returns', icon: '🔄', page: 'returns', active: false }, // Refresh (RotateCcw)
    { name: 'Reports', icon: '📈', page: 'reports', active: false }, // New item for screenshot
];





const Header = ({ setIsSidebarOpen }) => (
    <header className="sticky top-0 z-20 flex items-center justify-between w-full p-4 bg-white z-30 border-b border-gray-100 shadow-md md:shadow-none">
        {/* Menu Button for Mobile */}
        <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 mr-2">
            <span className="w-6 h-6 flex items-center justify-center text-2xl">☰</span>
        </button>

        {/* User Actions & Profile */}
        <div className="flex items-center ml-auto sm:ml-4 space-x-4 w-full justify-end">
            {/* Notifications */}
            <button className="relative p-2 text-gray-500 transition-colors rounded-full hover:bg-gray-100">
                <span className="w-6 h-6 flex items-center justify-center text-2xl">🔔</span>
                <span className="absolute top-0 right-0 block w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
            </button>

            {/* Profile */}
            <div className="flex items-center p-2 transition-colors rounded-lg hover:bg-gray-100 cursor-pointer">
                <div className="relative">
                    <div className="flex items-center justify-center w-8 h-8 font-semibold text-white bg-green-500 rounded-full">
                        SW
                    </div>
                </div>
                <div className="hidden ml-3 text-sm font-semibold md:block">
                    <p className="text-gray-800">Sarah Williams</p>
                    <p className="text-xs font-normal text-gray-500">Staff</p>
                </div>
            </div>
        </div>
    </header>
);

// --- Dashboard Component (Unchanged) ---
const StatsCard = ({ title, number, statusText, icon: IconChar, iconColor, bgColor, borderColor }) => (
    <div className="p-6 bg-white border border-gray-100 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <div className={`p-1.5 rounded-full border ${borderColor} ${bgColor}`}>
                <span className={`w-4 h-4 flex items-center justify-center text-lg ${iconColor}`}>{IconChar}</span>
            </div>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-1">{number}</div>
        <p className="text-sm text-gray-500">{statusText}</p>
    </div>
);

const DashboardContent = () => {
    const [items, setItems] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [stats, setStats] = React.useState([]);

    React.useEffect(() => {
        fetchStats();
        fetchItems();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/dashboard/stats');
            if (!response.ok) {
                throw new Error('Failed to fetch stats');
            }
            const data = await response.json();
            
            // Transform API data to match our UI format
            const statsData = [
                {
                    title: 'Available',
                    number: data.availableItems || 0,
                    statusText: 'items ready to borrow',
                    icon: '📦',
                    iconColor: 'text-indigo-600',
                    bgColor: 'bg-indigo-50',
                    borderColor: 'border-indigo-400',
                },
                {
                    title: 'Total Borrowed',
                    number: data.borrowedItems || 0,
                    statusText: 'Currently in use',
                    icon: '✅',
                    iconColor: 'text-green-600',
                    bgColor: 'bg-green-50',
                    borderColor: 'border-green-400',
                },
                {
                    title: 'Pending',
                    number: data.pendingRequests || 0,
                    statusText: 'Awaiting approval',
                    icon: '🕐',
                    iconColor: 'text-yellow-600',
                    bgColor: 'bg-yellow-50',
                    borderColor: 'border-yellow-400',
                },
                {
                    title: 'Overdue',
                    number: data.overdueItems || 0,
                    statusText: 'Need attention',
                    icon: '⚠️',
                    iconColor: 'text-red-600',
                    bgColor: 'bg-red-50',
                    borderColor: 'border-red-400',
                }
            ];
            
            setStats(statsData);
        } catch (err) {
            console.error('Error fetching stats:', err);
            setError(err.message);
        }
    };

    const fetchItems = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/items');
            if (!response.ok) {
                throw new Error('Failed to fetch items');
            }
            const data = await response.json();
            setItems(data);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatItemData = (item) => ({
        name: item.name,
        description: item.description || 'No description available',
        status: item.status || 'Good',
        available: item.isAvailable ? 1 : 0,
        total: 1,
        category: item.category || 'Other',
        imgUrl: item.imageUrl || 'https://placehold.co/600x400/1e293b/ffffff?text=Equipment',
        tagColor: 'bg-slate-700'
    });

    return (
        <main className="flex-grow p-4 space-y-8 bg-gray-50 md:p-8">
            <section className="space-y-1">
                <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-gray-600">
                    Welcome back, <span className="font-semibold text-indigo-600">Sarah Williams!</span> Here's your equipment overview.
                </p>
            </section>

            <section>
                {loading ? (
                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="p-6 bg-white border border-gray-100 rounded-xl animate-pulse">
                                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                                <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-red-600 bg-red-50 p-4 rounded-lg">
                        Error loading statistics: {error}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
                        {stats.map((card, index) => (
                            <StatsCard key={index} {...card} />
                        ))}
                    </div>
                )}
            </section>

            <section className="pt-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-1">Available Equipment</h2>
                <p className="text-gray-600 mb-6">
                    Browse and borrow from our collection
                </p>

                {loading ? (
                    <div className="flex justify-center items-center min-h-[200px]">
                        <div className="text-gray-500">Loading equipment...</div>
                    </div>
                ) : error ? (
                    <div className="text-red-600 bg-red-50 p-4 rounded-lg">
                        Error: {error}
                    </div>
                ) : items.length === 0 ? (
                    <div className="text-gray-500 bg-gray-50 p-4 rounded-lg text-center">
                        No equipment available at the moment.
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {items.map((item, index) => (
                            <div key={item.id || index} className='col-span-1'>
                                <EquipmentCardDetailed {...formatItemData(item)} isSimple={true} />
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
};


// --- Dashboard() ---

export default function Dashboard() {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    const [activePage, setActivePage] = React.useState('dashboard'); // Start on the Equipment page
    const [searchTerm, setSearchTerm] = useState('');

    // Close sidebar on outside click (for mobile view)
    React.useEffect(() => {
        const handleOutsideClick = (event) => {
            const sidebar = document.querySelector('aside');
            if (isSidebarOpen && sidebar && !sidebar.contains(event.target)) {
                // Prevent closing if the menu button was clicked on mobile
                const isMenuButton = event.target.closest('header button.md\\:hidden');
                if (!isMenuButton) {
                    setIsSidebarOpen(false);
                }
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [isSidebarOpen]);

    const renderContent = () => {
        switch (activePage) {
            case 'dashboard':
                return <DashboardContent />;
            case 'equipment':
                return <EquipmentCatalog />;
            case 'requests':
                return <RequestsScreen />;
            case 'loans':
                return <MyLoans searchTerm={""} />;
            case 'returns':
                return <ReturnsContent searchTerm={searchTerm} />;
            case 'reports':
                return <DashboardContent />;
            default:
                return <DashboardContent />;
        }
    };

    return (
        <div className="flex h-screen overflow-hidden font-sans bg-gray-50">
            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar - remains fixed on desktop */}
            <Sidebar
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
                activePage={activePage}
                setActivePage={setActivePage}
                navItems={navItems}
            />

            {/* Main Content Area */}
            <div className="flex flex-col flex-grow w-full overflow-y-auto">
                <Header setIsSidebarOpen={setIsSidebarOpen} />
                {renderContent()}
            </div>
        </div>
    );
}