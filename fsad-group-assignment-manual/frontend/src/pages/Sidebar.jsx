import { useNavigate } from "react-router-dom";




function Sidebar({ isOpen, setIsOpen, activePage, setActivePage, navItems}) {
    const navigate = useNavigate();
    return (<aside className={`fixed z-30 flex flex-col justify-between h-full bg-white transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full w-0 md:w-64'} md:static md:flex-shrink-0 md:shadow-xl md:shadow-gray-100`}>
        {/* Sidebar Content */}
        <div className='flex flex-col flex-grow p-4'>
            {/* Logo */}
            <div className="flex items-center p-4 mb-8">
                <div className="flex items-center">
                    <span className="text-3xl font-extrabold text-indigo-600">E</span>
                    <span className="text-3xl font-extrabold text-blue-500">L</span>
                </div>
                <div className="ml-2 text-xs font-medium text-gray-500 flex flex-col leading-tight">
                    <span className="font-semibold text-gray-800">EduLend</span>
                    <span>School Equipment Lending</span>
                </div>
                <button onClick={() => setIsOpen(false)} className="md:hidden ml-auto p-1 rounded-full text-gray-500 hover:bg-gray-100">
                    <span className="w-6 h-6 flex items-center justify-center text-2xl rotate-90">☰</span>
                </button>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
                {navItems.map((item) => {
                    const isActive = item.page === activePage;
                    return (
                        <a
                            key={item.name}
                            href="#"
                            onClick={(e) => { e.preventDefault(); setActivePage(item.page); setIsOpen(false); }}
                            className={`flex items-center p-3 font-semibold rounded-lg transition-all ${isActive
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-indigo-600'
                                }`}
                        >
                            <span className="w-5 h-5 mr-3 flex items-center justify-center text-lg">{item.icon}</span>
                            {item.name}
                        </a>
                    );
                })}
            </nav>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-gray-100">
            <a
                href=""
                className="flex items-center p-3 text-gray-600 transition-colors rounded-lg hover:bg-gray-100 hover:text-red-500"
                onClick={() => {
                    console.log("Logging out...");
                    localStorage.removeItem("token");
                    navigate("/", { replace: true });
                }
                }
            >
                <span className="w-5 h-5 mr-3 flex items-center justify-center text-lg">🚪</span>
                Logout
            </a>
        </div>
    </aside>);
};

export default Sidebar;