// Admin Service for all admin-related API calls
import ApiService from './api';

class AdminService {
  // Dashboard & Statistics
  async getSystemStats() {
    return ApiService.get('/admin/stats');
  }

  // Revenue Reports
  async getRevenueReport(params = {}) {
    return ApiService.get('/admin/reports/revenue', params);
  }

  // Bus Utilization Reports
  async getBusUtilizationReport(params = {}) {
    return ApiService.get('/admin/reports/utilization/buses', params);
  }

  // Subsidy Management
  async getSubsidySchemes() {
    return ApiService.get('/admin/subsidies/schemes');
  }

  async createSubsidyScheme(schemeData) {
    return ApiService.post('/admin/subsidies/schemes', schemeData);
  }

  async updateSubsidyScheme(id, schemeData) {
    return ApiService.put(`/admin/subsidies/schemes/${id}`, schemeData);
  }

  async getSubsidyReport(params = {}) {
    return ApiService.get('/admin/subsidies/reports', params);
  }

  // Compliance Reports
  async getComplianceReport() {
    return ApiService.get('/admin/compliance/report');
  }

  // Bus Management (Admin)
  async registerBus(busData) {
    return ApiService.post('/buses/admin/register', busData);
  }

  async updateBusStatus(busId, statusData) {
    return ApiService.put(`/buses/admin/${busId}/status`, statusData);
  }

  async assignDriverToBus(busId, driverId) {
    return ApiService.post(`/buses/admin/${busId}/assign-driver`, {
      driver_id: driverId,
    });
  }

  async assignConductorToBus(busId, conductorId) {
    return ApiService.post(`/buses/admin/${busId}/assign-conductor`, {
      conductor_id: conductorId,
    });
  }

  async assignRouteToBus(busId, routeId) {
    return ApiService.post(`/buses/admin/${busId}/assign-route`, {
      route_id: routeId,
    });
  }

  // Conductor Management (Admin)
  async registerConductor(conductorData) {
    return ApiService.post('/conductor/admin/register', conductorData);
  }

  async getAllConductors() {
    return ApiService.get('/conductor/admin/all');
  }

  async getAvailableConductors() {
    return ApiService.get('/conductor/admin/available');
  }

  async linkConductorToBus(conductorId, busId) {
    return ApiService.post('/conductor/admin/link-to-bus', {
      conductor_id: conductorId,
      bus_id: busId,
    });
  }

  async deactivateConductor(conductorId) {
    return ApiService.put(`/conductor/admin/${conductorId}/deactivate`);
  }

  // Route Management (Admin)
  async createRoute(routeData) {
    return ApiService.post('/routes/admin', routeData);
  }

  async updateRoute(routeId, routeData) {
    return ApiService.put(`/routes/admin/${routeId}`, routeData);
  }

  async getAllRoutes() {
    return ApiService.get('/routes/admin');
  }

  async getRouteById(routeId) {
    return ApiService.get(`/routes/admin/${routeId}`);
  }

  // Station Management (Admin)
  async createStation(stationData) {
    return ApiService.post('/stations/admin', stationData);
  }

  async updateStation(stationId, stationData) {
    return ApiService.put(`/stations/admin/${stationId}`, stationData);
  }

  async getAllStations() {
    return ApiService.get('/stations/admin');
  }

  async getStationById(stationId) {
    return ApiService.get(`/stations/admin/${stationId}`);
  }

  // User Verification
  async verifyUser(verificationData) {
    return ApiService.post('/auth/verification/verify-user', verificationData);
  }

  // Additional utility methods
  async getAllBuses() {
    return ApiService.get('/buses/admin/all');
  }

  async getBusById(busId) {
    return ApiService.get(`/buses/admin/${busId}`);
  }

  async getAllDrivers() {
    return ApiService.get('/drivers/admin/all');
  }

  async getAvailableDrivers() {
    return ApiService.get('/drivers/admin/available');
  }
}

export default new AdminService();