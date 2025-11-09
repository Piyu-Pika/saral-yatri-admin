# 🏛️ Admin Portal Setup Guide

Complete setup guide for the Government Bus Transit System Admin Portal.

## 📋 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Initial Setup](#initial-setup)
- [Admin Account Creation](#admin-account-creation)
- [Configuration](#configuration)
- [Admin Portal Features](#admin-portal-features)
- [API Endpoints](#api-endpoints)
- [Testing the Admin Portal](#testing-the-admin-portal)
- [Security Best Practices](#security-best-practices)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

The Admin Portal provides government officials with comprehensive tools to:
- Monitor system statistics and real-time operations
- Generate revenue and financial reports
- Manage subsidy schemes and track expenditure
- Monitor bus utilization and fleet performance
- Review compliance status and safety reports
- Manage subsidy applications from citizens
- Track ticket expiry and system health

**Access Level**: System Administrator only

---

## 📦 Prerequisites

Before setting up the admin portal, ensure you have:

1. **Backend System Running**
   - Go 1.21+ installed
   - MongoDB 7.0+ running
   - Backend server started on port 8080 (or configured port)

2. **Environment Configuration**
   - `.env` file properly configured
   - Database connection established
   - JWT secret configured

3. **Network Access**
   - Access to the backend API endpoint
   - Proper firewall rules configured

---

## 🚀 Initial Setup

### Step 1: Start the Backend Server

```bash
# Navigate to project directory
cd government-bus-backend

# Ensure dependencies are installed
go mod download

# Start the server
go run main.go
```

Expected output:
```
🚀 Government Bus Transit System Starting...
✅ Database connected successfully
✅ Server running on port 8080
```

### Step 2: Verify Server Health

```bash
curl http://localhost:8080/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "Government Bus Transit System",
  "time": "2025-11-10T10:30:00Z"
}
```

---

## 👤 Admin Account Creation

### Method 1: Using Database Initialization Script

The system includes a cleanup script that creates a default admin account:

```bash
# Run the initialization script
go run cleanup_and_reset.go
```

This creates:
- **Username**: `admin`
- **Password**: `admin123`
- **Email**: `admin@gov.in`
- **Role**: `system_admin`

### Method 2: Manual Registration via API

```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@transport.gov.in",
    "password": "SecureAdminPass123!",
    "full_name": "System Administrator",
    "phone": "+91-9876543210",
    "role": "system_admin"
  }'
```

### Method 3: Direct Database Insert

If you have MongoDB access:

```javascript
// Connect to MongoDB
use government_bus_transit

// Create admin user
db.users.insertOne({
  username: "admin",
  email: "admin@gov.in",
  password: "$2a$10$hashed_password_here", // Use bcrypt to hash
  full_name: "System Administrator",
  phone: "+91-9876543210",
  role: "system_admin",
  is_verified: true,
  is_active: true,
  created_at: new Date(),
  updated_at: new Date()
})
```

---

## 🔐 Admin Login

### Step 1: Login to Get Access Token

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

**Response:**
```json
{
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "username": "admin",
      "email": "admin@gov.in",
      "role": "system_admin"
    }
  }
}
```

### Step 2: Save the Token

Store the token securely for subsequent API calls:

```bash
# Linux/Mac
export ADMIN_TOKEN="your_token_here"

# Windows (CMD)
set ADMIN_TOKEN=your_token_here

# Windows (PowerShell)
$env:ADMIN_TOKEN="your_token_here"
```

---

## ⚙️ Configuration

### Environment Variables

Ensure these are set in your `.env` file:

```env
# Server Configuration
PORT=8080
GIN_MODE=release

# Database
DATABASE_URL=mongodb://localhost:27017
DATABASE_NAME=government_bus_transit

# Security
JWT_SECRET=your-super-secret-jwt-key-change-in-production
ENCRYPTION_KEY=your-32-byte-encryption-key-here!!

# Government Settings
GOVT_DEPARTMENT=Transport Department
CITY_NAME=Smart City
STATE_CODE=IN

# Subsidy Configuration
SENIOR_CITIZEN_DISCOUNT=50
STUDENT_DISCOUNT=25
DISABLED_PERSON_DISCOUNT=75
BPL_DISCOUNT=90
WOMEN_NIGHT_DISCOUNT=100
FREEDOM_FIGHTER_DISCOUNT=100
```

### Admin-Specific Settings

For production deployments, consider:

```env
# Rate Limiting (requests per minute)
ADMIN_RATE_LIMIT=100

# Session Timeout (minutes)
ADMIN_SESSION_TIMEOUT=30

# Audit Logging
ENABLE_AUDIT_LOG=true
AUDIT_LOG_PATH=/var/log/admin-audit.log
```

---

## 🎛️ Admin Portal Features

### 1. Dashboard & System Statistics

**Endpoint**: `GET /api/v1/admin/stats`

View real-time system overview including:
- Active buses and routes
- Today's revenue and ticket sales
- Subsidy expenditure
- Registered users
- Real-time bus operations
- Compliance status

### 2. Revenue Reports

**Endpoint**: `GET /api/v1/admin/reports/revenue`

Generate financial reports with various time periods:
- Daily revenue
- Weekly trends
- Monthly summaries
- Yearly analysis
- Custom date ranges

### 3. Bus Utilization Reports

**Endpoint**: `GET /api/v1/admin/reports/utilization/buses`

Monitor fleet performance:
- Bus occupancy rates
- Route efficiency
- Peak hour analysis
- Underutilized buses

### 4. Subsidy Management

**Endpoints**:
- `GET /api/v1/admin/subsidies/schemes` - View all schemes
- `POST /api/v1/admin/subsidies/schemes` - Create new scheme
- `PUT /api/v1/admin/subsidies/schemes/:id` - Update scheme
- `GET /api/v1/admin/subsidies/reports` - Subsidy usage reports

Manage government subsidy programs:
- Senior citizen discounts
- Student concessions
- Disabled person benefits
- BPL (Below Poverty Line) schemes
- Freedom fighter passes

### 5. Compliance Monitoring

**Endpoint**: `GET /api/v1/admin/compliance/report`

Track vehicle compliance:
- Fitness certificate expiry
- Insurance validity
- Route permit status
- Pollution certificate status

### 6. Ticket Expiry Management

**Endpoints**:
- `GET /api/v1/admin/tickets/expiry/stats` - View expiry statistics
- `POST /api/v1/admin/tickets/expiry/check` - Force expiry check

Monitor and manage ticket lifecycle.

### 7. Subsidy Application Review

**Endpoints**:
- `GET /api/v1/admin/subsidy-applications/pending` - Pending applications
- `GET /api/v1/admin/subsidy-applications/stats` - Application statistics
- `GET /api/v1/admin/subsidy-applications/:id` - View specific application
- `PUT /api/v1/admin/subsidy-applications/:id/review` - Approve/reject

Review citizen subsidy applications.

---

## 📡 API Endpoints Reference

### Authentication Required

All admin endpoints require:
- Valid JWT token in Authorization header
- System admin role

**Header Format**:
```
Authorization: Bearer <your_admin_token>
```

### Complete Endpoint List

#### Dashboard
```
GET /api/v1/admin/stats
```

#### Revenue Reports
```
GET /api/v1/admin/reports/revenue
GET /api/v1/admin/reports/revenue?period=daily
GET /api/v1/admin/reports/revenue?period=weekly
GET /api/v1/admin/reports/revenue?period=monthly
GET /api/v1/admin/reports/revenue?period=yearly
GET /api/v1/admin/reports/revenue?period=custom&start_date=2025-10-01&end_date=2025-10-31
```

#### Bus Utilization
```
GET /api/v1/admin/reports/utilization/buses
GET /api/v1/admin/reports/utilization/buses?start_date=2025-10-01&end_date=2025-10-31
```

#### Subsidy Management
```
GET /api/v1/admin/subsidies/schemes
POST /api/v1/admin/subsidies/schemes
PUT /api/v1/admin/subsidies/schemes/:id
GET /api/v1/admin/subsidies/reports
GET /api/v1/admin/subsidies/reports?subsidy_type=senior_citizen
GET /api/v1/admin/subsidies/reports?subsidy_type=student&start_date=2025-10-01&end_date=2025-10-31
```

#### Compliance
```
GET /api/v1/admin/compliance/report
```

#### Ticket Expiry
```
GET /api/v1/admin/tickets/expiry/stats
POST /api/v1/admin/tickets/expiry/check
```

#### Subsidy Applications
```
GET /api/v1/admin/subsidy-applications/pending
GET /api/v1/admin/subsidy-applications/stats
GET /api/v1/admin/subsidy-applications/:id
PUT /api/v1/admin/subsidy-applications/:id/review
```

---

## 🧪 Testing the Admin Portal

### Automated Testing Script

Use the provided test script:

```bash
# Make script executable (Linux/Mac)
chmod +x test_admin_routes.sh

# Run tests
./test_admin_routes.sh
```

### Manual Testing Examples

#### 1. Get System Statistics

```bash
curl -X GET http://localhost:8080/api/v1/admin/stats \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

#### 2. Generate Revenue Report (Monthly)

```bash
curl -X GET "http://localhost:8080/api/v1/admin/reports/revenue?period=monthly" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

#### 3. Get Compliance Report

```bash
curl -X GET http://localhost:8080/api/v1/admin/compliance/report \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

#### 4. Create Subsidy Scheme

```bash
curl -X POST http://localhost:8080/api/v1/admin/subsidies/schemes \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "scheme_name": "Senior Citizen Discount 2025",
    "subsidy_type": "senior_citizen",
    "discount_percentage": 50,
    "max_discount_amount": 100,
    "min_fare_amount": 5,
    "eligibility_criteria": {
      "min_age": 60,
      "max_age": 100
    },
    "budget_allocation": {
      "total_budget": 1000000,
      "remaining_budget": 1000000
    },
    "is_active": true
  }'
```

#### 5. Review Subsidy Application

```bash
curl -X PUT http://localhost:8080/api/v1/admin/subsidy-applications/<application_id>/review \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "approved",
    "admin_comments": "All documents verified. Application approved."
  }'
```

---

## 🔒 Security Best Practices

### 1. Password Security

- Use strong passwords (minimum 12 characters)
- Include uppercase, lowercase, numbers, and special characters
- Change default passwords immediately
- Never share admin credentials

### 2. Token Management

- Store tokens securely (never in version control)
- Implement token rotation
- Set appropriate expiration times
- Use HTTPS in production

### 3. Access Control

- Limit admin access to authorized personnel only
- Implement IP whitelisting for admin endpoints
- Enable audit logging for all admin actions
- Regular access reviews

### 4. Network Security

```nginx
# Example Nginx configuration for admin endpoints
location /api/v1/admin {
    # IP whitelist
    allow 10.0.0.0/8;
    allow 192.168.1.0/24;
    deny all;
    
    # Rate limiting
    limit_req zone=admin burst=10;
    
    proxy_pass http://backend:8080;
}
```

### 5. Monitoring & Alerts

- Enable audit logging
- Set up alerts for suspicious activities
- Monitor failed login attempts
- Track API usage patterns

---

## 🐛 Troubleshooting

### Issue: Cannot Login as Admin

**Symptoms**: 401 Unauthorized or 403 Forbidden

**Solutions**:
1. Verify admin account exists in database
2. Check password is correct
3. Ensure role is set to `system_admin`
4. Verify `is_active` and `is_verified` are true

```bash
# Check admin user in MongoDB
mongo government_bus_transit
db.users.findOne({username: "admin"})
```

### Issue: Token Expired

**Symptoms**: 401 Unauthorized after some time

**Solution**: Login again to get a new token

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

### Issue: 404 Not Found on Admin Endpoints

**Symptoms**: Admin endpoints return 404

**Solutions**:
1. Verify server is running
2. Check API version in URL (`/api/v1/admin/...`)
3. Ensure admin routes are registered

### Issue: Empty Reports

**Symptoms**: Reports return empty data

**Solutions**:
1. Check if database has data
2. Verify date ranges are correct
3. Ensure tickets/buses exist in the system

```bash
# Check database collections
mongo government_bus_transit
db.tickets.count()
db.buses.count()
db.routes.count()
```

### Issue: Permission Denied

**Symptoms**: 403 Forbidden even with valid token

**Solutions**:
1. Verify user role is `system_admin`
2. Check admin middleware is applied
3. Ensure JWT secret matches

### Common Error Codes

| Code | Meaning | Solution |
|------|---------|----------|
| 400 | Bad Request | Check request body format |
| 401 | Unauthorized | Login and get valid token |
| 403 | Forbidden | Verify admin role |
| 404 | Not Found | Check endpoint URL |
| 500 | Server Error | Check server logs |

---

## 📊 Sample Workflows

### Daily Operations Workflow

1. **Morning Check**
   ```bash
   # Get system stats
   curl -X GET http://localhost:8080/api/v1/admin/stats \
     -H "Authorization: Bearer $ADMIN_TOKEN"
   ```

2. **Review Compliance**
   ```bash
   # Check compliance issues
   curl -X GET http://localhost:8080/api/v1/admin/compliance/report \
     -H "Authorization: Bearer $ADMIN_TOKEN"
   ```

3. **Check Pending Applications**
   ```bash
   # Get pending subsidy applications
   curl -X GET http://localhost:8080/api/v1/admin/subsidy-applications/pending \
     -H "Authorization: Bearer $ADMIN_TOKEN"
   ```

### Monthly Reporting Workflow

1. **Generate Revenue Report**
   ```bash
   curl -X GET "http://localhost:8080/api/v1/admin/reports/revenue?period=monthly" \
     -H "Authorization: Bearer $ADMIN_TOKEN"
   ```

2. **Subsidy Utilization Report**
   ```bash
   curl -X GET http://localhost:8080/api/v1/admin/subsidies/reports \
     -H "Authorization: Bearer $ADMIN_TOKEN"
   ```

3. **Bus Utilization Analysis**
   ```bash
   curl -X GET http://localhost:8080/api/v1/admin/reports/utilization/buses \
     -H "Authorization: Bearer $ADMIN_TOKEN"
   ```

---

## 📞 Support & Contact

### Technical Support
- **Email**: transport-tech@gov.in
- **Phone**: 1800-GOV-TRANSPORT
- **Emergency**: transport-emergency@gov.in

### Documentation
- [API Documentation](API_Documentation_Subsidy_Application_Routes.md)
- [Main README](README.md)
- [Deployment Guide](DEPLOYMENT.md)

---

## 🔄 Updates & Maintenance

### Regular Maintenance Tasks

1. **Weekly**
   - Review audit logs
   - Check system performance
   - Monitor disk space

2. **Monthly**
   - Update subsidy schemes
   - Review compliance reports
   - Backup database

3. **Quarterly**
   - Security audit
   - Update dependencies
   - Review access permissions

---

**Government Bus Transit System - Admin Portal**

*Empowering administrators to serve citizens better* 🏛️🚌

