import React from "react";





const StatusPill = ({ status }) => {
    let colorClass = '';
    switch (status) {
        case 'Excellent':
            colorClass = 'bg-green-100 text-green-700';
            break;
        case 'Good':
            colorClass = 'bg-yellow-100 text-yellow-700';
            break;
        default:
            colorClass = 'bg-gray-100 text-gray-700';
    }
    return (
        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${colorClass}`}>
            {status}
        </span>
    );
};

export default StatusPill;