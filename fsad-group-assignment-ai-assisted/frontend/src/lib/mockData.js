export const mockUsers = [
  {
    id: 'u1',
    name: 'Emma Thompson',
    email: 'emma.thompson@school.edu',
    role: 'student',
    schoolId: 'STU-2024-001',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma'
  },
  {
    id: 'u2',
    name: 'Michael Chen',
    email: 'michael.chen@school.edu',
    role: 'student',
    schoolId: 'STU-2024-002',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael'
  },
  {
    id: 'u3',
    name: 'Sarah Williams',
    email: 'sarah.williams@school.edu',
    role: 'staff',
    schoolId: 'STF-2024-001',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
  },
  {
    id: 'u4',
    name: 'David Martinez',
    email: 'david.martinez@school.edu',
    role: 'staff',
    schoolId: 'STF-2024-002',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David'
  },
  {
    id: 'u5',
    name: 'Dr. Patricia Johnson',
    email: 'patricia.johnson@school.edu',
    role: 'admin',
    schoolId: 'ADM-2024-001',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Patricia'
  },
  {
    id: 'u6',
    name: 'Dr. Robert Lee',
    email: 'robert.lee@school.edu',
    role: 'admin',
    schoolId: 'ADM-2024-002',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert'
  }
];

export const mockEquipment = [
  {
    id: 'e1',
    name: 'Digital Camera Canon EOS',
    category: 'Camera',
    condition: 'Excellent',
    quantity: 5,
    available: 3,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400',
    description: 'Professional DSLR camera with 24MP sensor and 4K video recording'
  },
  {
    id: 'e2',
    name: 'Compound Microscope',
    category: 'Lab',
    condition: 'Good',
    quantity: 10,
    available: 7,
    image: 'https://images.unsplash.com/photo-1582560475093-ba66accbc424?w=400',
    description: 'High-power optical microscope with 1000x magnification'
  },
  {
    id: 'e3',
    name: 'Football Set',
    category: 'Sports',
    condition: 'Good',
    quantity: 8,
    available: 8,
    image: 'https://images.unsplash.com/photo-1552318965-6e6be7484ada?w=400',
    description: 'Professional size 5 football with pump and carrying bag'
  },
  {
    id: 'e4',
    name: 'Acoustic Guitar',
    category: 'Music',
    condition: 'Excellent',
    quantity: 4,
    available: 2,
    image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400',
    description: 'Yamaha acoustic guitar with case and tuner'
  },
  {
    id: 'e5',
    name: 'Projector & Screen',
    category: 'AV',
    condition: 'Excellent',
    quantity: 6,
    available: 4,
    image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=400',
    description: '4K projector with portable screen and HDMI cables'
  },
  {
    id: 'e6',
    name: 'Laboratory Beaker Set',
    category: 'Lab',
    condition: 'Good',
    quantity: 15,
    available: 12,
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400',
    description: 'Complete glass beaker set with various sizes from 50ml to 1000ml'
  },
  {
    id: 'e7',
    name: 'Basketball',
    category: 'Sports',
    condition: 'Good',
    quantity: 12,
    available: 9,
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400',
    description: 'Official size 7 basketball with inflation pump'
  },
  {
    id: 'e8',
    name: 'Digital Piano Keyboard',
    category: 'Music',
    condition: 'Excellent',
    quantity: 3,
    available: 1,
    image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400',
    description: '88-key digital piano with weighted keys and sustain pedal'
  },
  {
    id: 'e9',
    name: 'Video Camera & Tripod',
    category: 'Camera',
    condition: 'Good',
    quantity: 4,
    available: 2,
    image: 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=400',
    description: '4K video camera with stabilization and professional tripod'
  },
  {
    id: 'e10',
    name: 'Wireless Microphone Set',
    category: 'AV',
    condition: 'Excellent',
    quantity: 8,
    available: 6,
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400',
    description: 'Professional wireless mic system with receiver and two handhelds'
  }
];

export const mockRequests = [
  {
    id: 'r1',
    equipmentId: 'e1',
    userId: 'u1',
    requestDate: new Date('2025-10-20'),
    startDate: new Date('2025-10-25'),
    endDate: new Date('2025-11-01'),
    reason: 'Photography project for Art class',
    pickupLocation: 'Equipment Room A',
    status: 'Approved',
    approvedBy: 'u5'
  },
  {
    id: 'r2',
    equipmentId: 'e2',
    userId: 'u2',
    requestDate: new Date('2025-10-22'),
    startDate: new Date('2025-10-28'),
    endDate: new Date('2025-11-05'),
    reason: 'Biology lab experiment',
    pickupLocation: 'Science Lab',
    status: 'Pending'
  },
  {
    id: 'r3',
    equipmentId: 'e4',
    userId: 'u1',
    requestDate: new Date('2025-10-15'),
    startDate: new Date('2025-10-18'),
    endDate: new Date('2025-10-25'),
    returnDate: new Date('2025-10-26'),
    reason: 'Music recital practice',
    pickupLocation: 'Music Room',
    status: 'Returned',
    approvedBy: 'u3'
  },
  {
    id: 'r4',
    equipmentId: 'e8',
    userId: 'u2',
    requestDate: new Date('2025-10-10'),
    startDate: new Date('2025-10-15'),
    endDate: new Date('2025-10-22'),
    reason: 'Piano practice for concert',
    pickupLocation: 'Music Room',
    status: 'Overdue',
    approvedBy: 'u3'
  },
  {
    id: 'r5',
    equipmentId: 'e5',
    userId: 'u1',
    requestDate: new Date('2025-10-28'),
    startDate: new Date('2025-11-02'),
    endDate: new Date('2025-11-04'),
    reason: 'Class presentation',
    pickupLocation: 'Equipment Room B',
    status: 'Issued',
    approvedBy: 'u4'
  },
  {
    id: 'r6',
    equipmentId: 'e9',
    userId: 'u2',
    requestDate: new Date('2025-10-27'),
    startDate: new Date('2025-11-01'),
    endDate: new Date('2025-11-08'),
    reason: 'Video documentary project',
    pickupLocation: 'Equipment Room A',
    status: 'Waitlist'
  }
];
