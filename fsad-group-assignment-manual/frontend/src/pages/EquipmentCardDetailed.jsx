import React from 'react';
import StatusPill from './StatusPill';

const EquipmentCardDetailed = ({ name, description, status, available, total, category, imgUrl, tagColor, isSimple = false }) => {

    if (isSimple) {
        // Render the simpler version used on the original dashboard
        return (
            <div className="relative w-full overflow-hidden bg-white rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer">
                <div className="relative w-full h-48 overflow-hidden rounded-t-xl">
                    <img
                        src={imgUrl}
                        alt={category}
                        className="object-cover w-full h-full"
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/d1d5db/4b5563?text=Image+Load+Error'; }}
                    />
                </div>
                <div className={`absolute top-3 right-3 px-3 py-1 text-xs font-semibold text-white uppercase rounded-full ${tagColor} shadow-md`}>
                    {category}
                </div>
            </div>
        );
    }

    // Render the detailed version for the Equipment Catalog screen
    return (
        <div className="w-full bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer">
            <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative w-full h-48 md:h-full overflow-hidden">
                    <img
                        src={imgUrl}
                        alt={name}
                        className="object-cover w-full h-full"
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/d1d5db/4b5563?text=Image+Load+Error'; }}
                    />
                    <div className={`absolute top-3 right-3 px-3 py-1 text-xs font-semibold text-white uppercase rounded-full ${tagColor} shadow-md`}>
                        {category}
                    </div>
                </div>

                <div className="p-4 space-y-3">
                    <h3 className="text-lg font-bold text-gray-800">{name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{description}</p>

                    <div className="pt-2 border-t border-gray-100">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2">
                                <StatusPill status={status} />
                                <span className="text-gray-600">
                                    {available}/{total} available
                                </span>
                            </div>
                            <button className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors">
                                Details
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EquipmentCardDetailed;