// Application Constants

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    VERIFY_USER: '/auth/verification/verify-user',
  },
  ADMIN: {
    STATS: '/admin/stats',
    REVENUE_REPORT: '/admin/reports/revenue',
    UTILIZATION_REPORT: '/admin/reports/utilization/buses',
    COMPLIANCE_REPORT: '/admin/compliance/report',
  },
  BUSES: {
    ADMIN_REGISTER: '/buses/admin/register',
    ADMIN_ALL: '/buses/admin/all',
    ADMIN_STATUS: (id) => `/buses/admin/${id}/status`,
    ADMIN_ASSIGN_DRIVER: (id) => `/buses/admin/${id}/assign-driver`,
    ADMIN_ASSIGN_CONDUCTOR: (id) => `/buses/admin/${id}/assign-conductor`,
    ADMIN_ASSIGN_ROUTE: (id) => `/buses/admin/${id}/assign-route`,
  },
  ROUTES: {
    ADMIN_CREATE: '/routes/admin',
    ADMIN_ALL: '/routes/admin',
    ADMIN_UPDATE: (id) => `/routes/admin/${id}`,
    ADMIN_GET: (id) => `/routes/admin/${id}`,
  },
  STATIONS: {
    ADMIN_CREATE: '/stations/admin',
    ADMIN_ALL: '/stations/admin',
    ADMIN_UPDATE: (id) => `/stations/admin/${id}`,
    ADMIN_GET: (id) => `/stations/admin/${id}`,
  },
  SUBSIDIES: {
    SCHEMES: '/admin/subsidies/schemes',
    CREATE_SCHEME: '/admin/subsidies/schemes',
    UPDATE_SCHEME: (id) => `/admin/subsidies/schemes/${id}`,
    REPORTS: '/admin/subsidies/reports',
  },
  CONDUCTORS: {
    ADMIN_REGISTER: '/conductor/admin/register',
    ADMIN_ALL: '/conductor/admin/all',
    ADMIN_AVAILABLE: '/conductor/admin/available',
    ADMIN_LINK_BUS: '/conductor/admin/link-to-bus',
    ADMIN_DEACTIVATE: (id) => `/conductor/admin/${id}/deactivate`,
  },
};

// User Roles
export const USER_ROLES = {
  SYSTEM_ADMIN: 'system_admin',
  TRANSPORT_OFFICER: 'transport_officer',
  FINANCE_OFFICER: 'finance_officer',
  CONDUCTOR: 'conductor',
  DRIVER: 'driver',
  PASSENGER: 'passenger',
};

// Bus Types
export const BUS_TYPES = {
  ORDINARY: 'ordinary',
  AC: 'ac',
  DELUXE: 'deluxe',
  VOLVO: 'volvo',
};

// Bus Status
export const BUS_STATUS = {
  ACTIVE: 'active',
  PARKED: 'parked',
  MAINTENANCE: 'maintenance',
  OUT_OF_SERVICE: 'out_of_service',
  BREAKDOWN: 'breakdown',
};

// Route Types
export const ROUTE_TYPES = {
  CITY: 'city',
  INTERCITY: 'intercity',
  EXPRESS: 'express',
  LOCAL: 'local',
};

// Station Types
export const STATION_TYPES = {
  MAJOR: 'major',
  REGULAR: 'regular',
  DEPOT: 'depot',
  INTERCHANGE: 'interchange',
};

// Subsidy Types
export const SUBSIDY_TYPES = {
  STUDENT: 'student',
  SENIOR_CITIZEN: 'senior_citizen',
  DISABLED: 'disabled',
  LOW_INCOME: 'low_income',
  GOVERNMENT_EMPLOYEE: 'government_employee',
  MILITARY: 'military',
};

// Report Periods
export const REPORT_PERIODS = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
  CUSTOM: 'custom',
};

// Compliance Issues
export const COMPLIANCE_ISSUES = {
  FITNESS_EXPIRED: 'fitness_expired',
  INSURANCE_EXPIRED: 'insurance_expired',
  PERMIT_EXPIRED: 'permit_expired',
  POLLUTION_CERT_EXPIRED: 'pollution_cert_expired',
  TAX_EXPIRED: 'tax_expired',
};

// Station Facilities
export const STATION_FACILITIES = {
  WAITING_ROOM: 'waiting_room',
  RESTROOM: 'restroom',
  PARKING: 'parking',
  FOOD_COURT: 'food_court',
  WIFI: 'wifi',
  ATM: 'atm',
  TICKET_COUNTER: 'ticket_counter',
  INFORMATION_DESK: 'information_desk',
};

// Document Types
export const DOCUMENT_TYPES = {
  STUDENT_ID: 'student_id',
  AGE_PROOF: 'age_proof',
  SENIOR_CITIZEN_CARD: 'senior_citizen_card',
  DISABILITY_CERTIFICATE: 'disability_certificate',
  INCOME_CERTIFICATE: 'income_certificate',
  GOVERNMENT_ID: 'government_id',
  MILITARY_ID: 'military_id',
  AADHAAR: 'aadhaar',
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  API: 'YYYY-MM-DD',
  DATETIME: 'DD/MM/YYYY HH:mm',
  TIME: 'HH:mm',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
};

// Colors for charts and status indicators
export const COLORS = {
  PRIMARY: '#1976d2',
  SECONDARY: '#dc004e',
  SUCCESS: '#4caf50',
  WARNING: '#ff9800',
  ERROR: '#f44336',
  INFO: '#2196f3',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_DATA: 'userData',
  TOKEN_EXPIRY: 'tokenExpiry',
  THEME: 'theme',
  LANGUAGE: 'language',
};