# Transport Management System - Admin Panel

A React-based admin panel for managing a public transport system with comprehensive API integration for bus management, route planning, subsidy administration, and reporting.

## Features

### 🚌 Bus Management
- Register and manage bus fleet
- Track bus status and compliance
- Assign drivers and conductors
- Monitor vehicle specifications and maintenance

### 🗺️ Route & Station Management
- Create and manage bus routes
- Add and configure bus stations
- Optimize route planning and scheduling

### 👥 User Management
- User verification and authentication
- Subsidy eligibility management
- Role-based access control

### 💰 Subsidy Administration
- Create and manage subsidy schemes
- Track budget utilization
- Generate subsidy reports

### 📊 Comprehensive Reporting
- Revenue reports and analytics
- Bus utilization metrics
- Compliance monitoring
- Real-time dashboard

## API Integration

The application integrates with a comprehensive REST API with the following endpoints:

### Authentication
- `POST /api/v1/auth/login` - Admin login with JWT token response

### Admin Dashboard
- `GET /api/v1/admin/stats` - System statistics and overview
- `GET /api/v1/admin/reports/revenue` - Revenue reports
- `GET /api/v1/admin/reports/utilization/buses` - Bus utilization reports
- `GET /api/v1/admin/compliance/report` - Compliance status

### Bus Management
- `POST /api/v1/buses/admin/register` - Register new bus
- `PUT /api/v1/buses/admin/:id/status` - Update bus status
- `POST /api/v1/buses/admin/:id/assign-driver` - Assign driver
- `POST /api/v1/buses/admin/:id/assign-conductor` - Assign conductor

### Route Management
- `POST /api/v1/routes/admin` - Create new route
- `PUT /api/v1/routes/admin/:id` - Update route
- `GET /api/v1/routes/admin` - Get all routes

### Subsidy Management
- `GET /api/v1/admin/subsidies/schemes` - Get subsidy schemes
- `POST /api/v1/admin/subsidies/schemes` - Create subsidy scheme
- `GET /api/v1/admin/subsidies/reports` - Subsidy reports

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AdminDashboard.js
│   ├── BusManagement.js
│   ├── Header.js
│   └── Sidebar.js
├── hooks/              # Custom React hooks
│   ├── useAuth.js      # Authentication hook
│   └── useApi.js       # API call hooks
├── models/             # Data models
│   ├── User.js
│   ├── Bus.js
│   ├── Route.js
│   ├── Station.js
│   └── SubsidyScheme.js
├── pages/              # Page components
│   ├── Home.js
│   └── Login.js
├── services/           # API services
│   ├── api.js          # Base API service
│   ├── authService.js  # Authentication service
│   └── adminService.js # Admin API calls
└── utils/              # Utility functions
    ├── constants.js    # Application constants
    └── helpers.js      # Helper functions
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Backend API server running on port 3001

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd transport-admin-panel
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
```

Edit `.env` file:
```
REACT_APP_API_BASE_URL=http://localhost:3001
REACT_APP_ENV=development
```

4. Start the development server
```bash
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000)

### Demo Login
For testing purposes, use these credentials:
- **Username:** admin
- **Password:** admin123

## API Response Format

The application expects API responses in the following format:

### Success Response
```json
{
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "error": "Error message",
  "details": "Detailed error description"
}
```

### Authentication Response
```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user_id",
      "username": "admin",
      "email": "admin@gov.in",
      "role": "system_admin",
      "is_verified": true
    },
    "expires_at": "2025-10-26T17:52:22.058416793+05:30"
  },
  "message": "Login successful"
}
```

## Available Scripts

### `npm start`
Runs the app in development mode on [http://localhost:3000](http://localhost:3000)

### `npm test`
Launches the test runner in interactive watch mode

### `npm run build`
Builds the app for production to the `build` folder

### `npm run eject`
**Note: This is a one-way operation!** Removes the single build dependency and copies all configuration files.

## Features Implementation Status

- ✅ Authentication system with JWT
- ✅ Admin dashboard with statistics
- ✅ Bus management (CRUD operations)
- ✅ API service layer with error handling
- ✅ Responsive design
- ✅ Model classes for data management
- 🚧 Route management (UI ready, API integration pending)
- 🚧 Subsidy management (UI ready, API integration pending)
- 🚧 Comprehensive reporting (UI ready, API integration pending)
- 🚧 User management (UI ready, API integration pending)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
