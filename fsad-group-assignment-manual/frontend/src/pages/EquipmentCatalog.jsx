import React from "react";
import EquipmentCardDetailed from './EquipmentCardDetailed';
import { useState } from "react";


// --- UTILITY COMPONENTS (Icons) ---
// Using inline SVGs for clarity in search/dropdown buttons

const catalogItems = [
    {
        name: 'Digital Camera Canon EOS',
        description: 'Professional DSLR camera with 24MP sensor and 4K video recording',
        status: 'Excellent',
        available: 3,
        total: 5,
        category: 'Camera',
        imgUrl: 'https://placehold.co/600x400/1e293b/ffffff?text=Camera+Gear',
        tagColor: 'bg-slate-700',
    },
    {
        name: 'Compound Microscope',
        description: 'High-power optical microscope with 1000x magnification',
        status: 'Good',
        available: 7,
        total: 10,
        category: 'Lab',
        imgUrl: 'https://placehold.co/600x400/065f46/ffffff?text=Lab+Equipment',
        tagColor: 'bg-blue-800',
    },
    {
        name: 'Football Set',
        description: 'Professional size 5 football with pump and carrying bag',
        status: 'Good',
        available: 8,
        total: 8,
        category: 'Sports',
        imgUrl: 'https://placehold.co/600x400/9a3412/ffffff?text=Sports+Balls',
        tagColor: 'bg-orange-800',
    },
    {
        name: 'Acoustic Guitar',
        description: 'Yamaha acoustic guitar with case and tuner',
        status: 'Excellent',
        available: 2,
        total: 4,
        category: 'Music',
        imgUrl: 'https://placehold.co/600x400/581c87/ffffff?text=Musical+Instrument',
        tagColor: 'bg-purple-800',
    },
];

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.3-4.3"></path>
    </svg>
);

const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
        <path d="m6 9 6 6 6-6"></path>
    </svg>
);


const EquipmentCatalog = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const filteredItems = catalogItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (categoryFilter === 'all' || item.category.toLowerCase() === categoryFilter)
    );

    return (<main className="flex-grow p-4 space-y-8 bg-gray-50 md:p-8">
        <div className="flex items-start justify-between">
            <section className="space-y-1">
                <h1 className="text-3xl font-bold text-gray-800">Equipment Catalog</h1>
                <p className="text-gray-600">
                    Browse and manage all available equipment
                </p>
            </section>

            <button className="flex items-center px-4 py-2 text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 transition-colors shrink-0">
                <span className="text-xl font-light mr-1.5">+</span> Add Equipment
            </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
            {/* Search Input */}
            <div className="relative flex-grow">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <SearchIcon />
                </div>
                <input
                    type="text"
                    placeholder="Search equipment..."
                    className="w-full py-3 pl-10 pr-4 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onChange={(e) => { 
                        console.log(e.target.value);
                        setSearchTerm(e.target.value); 
                    }}
                />
            </div>

            {/* Categories Dropdown */}
            <div className="relative shrink-0 w-full sm:w-auto">
                <select
                    className="appearance-none w-full py-3 pl-4 pr-10 text-sm bg-white border border-gray-200 rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    defaultValue="all"
                    onChange={(e) => setCategoryFilter(e.target.value)}
                >
                    <option value="all">All Categories</option>
                    <option value="camera">Camera</option>
                    <option value="lab">Lab</option>
                    <option value="sports">Sports</option>
                    <option value="music">Music</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <ChevronDownIcon />
                </div>
            </div>
        </div>

        {/* Item Count */}
        <p className="text-sm text-gray-500 font-medium pt-2">
            {filteredItems.length * 2} items found
        </p>

        {/* Equipment List - Displaying two items per row on desktop */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {/* Render catalog items twice to match the visual density of the screenshot */}
            {filteredItems.map((item, index) => (
                <EquipmentCardDetailed key={`item-${index}`} {...item} />
            ))}
            {filteredItems.slice(0, 2).map((item, index) => (
                <EquipmentCardDetailed key={`item-extra-${index}`} {...item} name={`Vintage ${item.name}`} />
            ))}
        </div>
    </main>);
};

export default EquipmentCatalog;