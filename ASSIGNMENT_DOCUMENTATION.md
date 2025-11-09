# School Equipment Lending Portal - Development Documentation

## Project Overview
**Course:** SE ZG503 FULL STACK APPLICATION DEVELOPMENT  
**Assignment:** Web Application Development  
**Submission Date:** 10th November 2025  
**Weightage:** 25%

## Table of Contents
1. [Project Architecture](#project-architecture)
2. [Manual Development (Phase 1)](#manual-development-phase-1)
3. [AI-Assisted Development (Phase 2)](#ai-assisted-development-phase-2)
4. [Feature Comparison](#feature-comparison)
5. [AI Usage Log and Reflection](#ai-usage-log-and-reflection)
6. [Technical Documentation](#technical-documentation)

## Project Architecture

### Technology Stack
- **Frontend:** React + Vite
- **UI Framework:** Tailwind CSS + Shadcn UI
- **State Management:** React Context API
- **Backend:** .NET Core 8 + C#
- **Database:** MSSQL 
- **Authentication:** JWT
- **Version Control:** Git

### System Architecture
```
├── Frontend (React)
│   ├── Authentication Module
│   ├── Equipment Management
│   ├── Request Handling
│   ├── Dashboard
│   └── Admin Panel
│
├── Backend (.net Core)
│   ├── User Management
│   ├── Item CRUD
│   ├── Request Processing
│   ├── Analytics
│   └── Authentication
│
└── Database (sql)
    ├── User Table
    ├── Item Table
    └── Request Table
```

## Manual Development (Phase 1)

### Implementation Approach
1. **Backend Development**
   - Implemented RESTful APIs using .NET Core 
   - Set up SQL schemas and models
   - Implemented JWT authentication
   - Created middleware for role-based access

2. **Frontend Development**
   - Created reusable UI components
   - Implemented responsive design
   - Set up routing and navigation
   - Integrated with backend APIs

### Core Features Implemented
1. **User Authentication & Roles**
   - Login/signup functionality
   - Role-based access control
   - JWT token management

2. **Equipment Management**
   - CRUD operations for equipment
   - Equipment status tracking
   - Category management

3. **Borrowing & Return System**
   - Request submission
   - Approval workflow
   - Return processing
   - Conflict prevention

4. **Dashboard**
   - Equipment listing
   - Search and filtering
   - Status overview

## AI-Assisted Development (Phase 2)

### AI Tools Used
- **GitHub Copilot**: Primary code generation assistance
- **Claude**: Architecture and problem-solving assistance
- **VS Code AI Extensions**: Code refactoring and optimization

### Improvements Made with AI
1. **Code Quality**
   - Enhanced error handling
   - Improved type safety
   - Better code organization
   - Automated testing implementation

2. **Feature Enhancements**
   - Real-time notifications
   - Advanced search capabilities
   - Performance optimizations
   - Enhanced UI/UX

3. **Documentation**
   - Automated API documentation
   - Enhanced code comments
   - Better type definitions

## Feature Comparison

| Feature | Manual Version | AI-Assisted Version |
|---------|---------------|-------------------|
| Authentication | Basic JWT | Enhanced JWT with refresh tokens |
| UI Components | Basic components | Reusable component library |
| Error Handling | Basic try-catch | Comprehensive error management |
| Testing | Minimal tests | Extensive test coverage |
| Documentation | Basic README | Comprehensive documentation |
| Performance | Basic optimization | Advanced caching and optimization |

## AI Usage Log and Reflection

### How AI Tools Were Used

1. **Initial Setup and Boilerplate**
   - Used GitHub Copilot for project structure
   - Generated basic component templates
   - Set up configuration files

2. **Complex Features**
   - Authentication system enhancement
   - Real-time notification system
   - Advanced search functionality

3. **Testing and Documentation**
   - Test case generation
   - API documentation
   - Type definitions

### Benefits of AI Assistance
1. **Development Speed**
   - Faster boilerplate generation
   - Quick implementation of common patterns
   - Reduced time in documentation

2. **Code Quality**
   - Consistent coding patterns
   - Better error handling
   - Improved type safety

3. **Learning Outcomes**
   - Exposure to best practices
   - Understanding of complex patterns
   - Better documentation habits

### Challenges Faced
1. **Integration Issues**
   - Sometimes generated code needed significant modification
   - Context understanding limitations
   - Version compatibility issues

2. **Learning Curve**
   - Understanding AI tool capabilities
   - Prompt engineering learning
   - Validating generated code

### Reflection on AI Usage

#### Positive Aspects
1. Significantly improved development speed
2. Introduced to new patterns and practices
3. Better code organization and documentation
4. Enhanced testing coverage

#### Areas for Improvement
1. Need for better prompt engineering
2. More careful validation of generated code
3. Better integration of AI tools in workflow

## Technical Documentation

### API Documentation

#### Authentication Endpoints
The following API routes are used to handle user authentication within the EduLend backend:
```
POST /api/auth/signin
POST /api/auth/login
POST /api/auth/refresh
```

#### Equipment Endpoints
The following API routes manage lending item operations such as creation, updates, availability checks, and deletion:
```
- POST /api/lending-items/add – Add a new lending item
- PUT /api/lending-items/{id} – Update an existing item by ID
- DELETE /api/lending-items/{id} – Delete an item by ID
- GET /api/lending-items/{id}/availability – Check availability of a specific item
- GET /api/lending-items – Retrieve all lending items
```

#### Request Endpoints
The following API routes handle equipment request operations including submission, status updates, returns, and overdue tracking:
```
- POST /api/requests/requestItem – Submit a new equipment request
- POST /api/requests/openRequests – Retrieve open requests
- PUT /changeStatus – Update the status of a request
- POST /api/requests/{requestId}/return – Mark an item as returned
- GET /api/requests/overdue – Fetch overdue requests
```

### Database Schema
The EduLend database is designed to manage users, lending items, and borrowing requests within an educational lending system. It stores essential information about students, staff, and administrators, along with the items available for lending and the requests made to borrow them. The schema ensures proper relationships between users, items, and requests, supporting key operations such as authentication, item management, and request tracking.


| Role     | Action                                                                 | Affected Table     |
|----------|------------------------------------------------------------------------|--------------------|
| Student  | Registers account                                                      | User               |
| Student  | Submits equipment request                                              | Request            |
| System   | Validates JWT and role                                                 | User               |
| System   | Checks item availability                                               | LendingItem        |
| Admin    | Adds new equipment to inventory                                        | LendingItem        |
| Admin    | Approves or rejects request                                            | Request            |
| System   | Updates request status                                                 | Request            |
| Student  | Returns item                                                           | Request            |
| System   | Flags overdue if `ReturnedDate` > `EndDate` or null                   | Request            |
| Admin    | Updates item condition and quantity                                    | LendingItem        |

#### User Schema
```javascript
{
  id: Number,
  name: String,
  email: String,
  schoolId: String,
  password: String,
  role: Enum['student', 'staff', 'admin']
}
```

#### Equipment Schema
```javascript
{
  id: Number,
  name: String,
  category: String,
  condition: String,
  quantity: Number,
  availability: Enum['In Stock', 'Out of Stock'],
  adminId: Number,
  userId: Number
}
```

#### Request Schema
```javascript
{
  id: Number,
  itemId: Number,
  schoolId: Number,
  startDate: Date,
  endDate: Date,
  returnedDate: Date | null,
  status: Enum['Pending', 'Approved', 'Rejected', 'Returned'],
  adminId: Number
}
```

### Security Measures
1. JWT Authentication
2. Role-based access control
3. Input validation
4. XSS protection
5. Rate limiting

### Performance Optimizations
1. Database indexing
2. Caching strategies
3. Lazy loading
4. Image optimization
5. Bundle size optimization

## Deployment Instructions

1. **Backend Deployment**
```bash
cd backend
dotnet run --project EduLend
```

2. **Frontend Deployment**
```bash
cd frontend
npm install
npm run build
npm run preview
```

3. **Environment Variables**
```
DATABASE_URL="Server=DESKTOP-FI1EJ2S;Database=EduLendDb;Trusted_Connection=True;Encrypt=True;TrustServerCertificate=True;"
JWT_SECRET=your_jwt_secret
```

## Conclusion

The AI-assisted development process significantly improved the quality and features of the application while reducing development time. Key learnings include:

1. Effective use of AI tools for boilerplate and common patterns
2. Importance of understanding and validating AI-generated code
3. Balance between AI assistance and manual development
4. Enhanced documentation and testing practices

The final product demonstrates both the benefits and limitations of AI-assisted development while meeting all project requirements effectively.