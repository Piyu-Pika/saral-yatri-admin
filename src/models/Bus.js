// Bus Model
export class Bus {
  constructor(data = {}) {
    this.id = data.id || '';
    this.busNumber = data.bus_number || '';
    this.fleetNumber = data.fleet_number || '';
    this.busType = data.bus_type || 'ordinary';
    this.isActive = data.is_active || true;
    this.currentStatus = data.current_status || 'parked';
    this.createdAt = data.created_at ? new Date(data.created_at) : new Date();
    this.updatedAt = data.updated_at ? new Date(data.updated_at) : new Date();
    
    // Vehicle compliance
    this.vehicleCompliance = {
      registrationNumber: data.vehicle_compliance?.registration_number || '',
      emissionStandard: data.vehicle_compliance?.emission_standard || '',
      fitnessExpiryDate: data.vehicle_compliance?.fitness_expiry_date ? 
        new Date(data.vehicle_compliance.fitness_expiry_date) : null,
      insuranceExpiryDate: data.vehicle_compliance?.insurance_expiry_date ? 
        new Date(data.vehicle_compliance.insurance_expiry_date) : null,
      permitExpiryDate: data.vehicle_compliance?.permit_expiry_date ? 
        new Date(data.vehicle_compliance.permit_expiry_date) : null,
      pollutionCertExpiry: data.vehicle_compliance?.pollution_cert_expiry ? 
        new Date(data.vehicle_compliance.pollution_cert_expiry) : null,
      taxExpiryDate: data.vehicle_compliance?.tax_expiry_date ? 
        new Date(data.vehicle_compliance.tax_expiry_date) : null,
    };

    // Specifications
    this.specifications = {
      seatingCapacity: data.specifications?.seating_capacity || 0,
      wheelchairSpaces: data.specifications?.wheelchair_spaces || 0,
      fuelType: data.specifications?.fuel_type || 'diesel',
      fuelCapacity: data.specifications?.fuel_capacity || 0,
      manufacturer: data.specifications?.manufacturer || '',
      model: data.specifications?.model || '',
      yearOfManufacture: data.specifications?.year_of_manufacture || new Date().getFullYear(),
      isAccessible: data.specifications?.is_accessible || false,
      hasAirConditioning: data.specifications?.has_air_conditioning || false,
      hasWifi: data.specifications?.has_wifi || false,
      hasGps: data.specifications?.has_gps || false,
    };

    // Assignments
    this.assignedRoute = data.assigned_route || null;
    this.assignedDriver = data.assigned_driver || null;
    this.assignedConductor = data.assigned_conductor || null;
  }

  // Check if bus is AC type
  isACBus() {
    return this.busType === 'ac';
  }

  // Check if bus is active and operational
  isOperational() {
    return this.isActive && this.currentStatus === 'active';
  }

  // Get status display text
  getStatusDisplay() {
    const statusMap = {
      'active': 'Active',
      'parked': 'Parked',
      'maintenance': 'Under Maintenance',
      'out_of_service': 'Out of Service',
      'breakdown': 'Breakdown',
    };
    return statusMap[this.currentStatus] || this.currentStatus;
  }

  // Check compliance status
  getComplianceStatus() {
    const now = new Date();
    const issues = [];

    if (this.vehicleCompliance.fitnessExpiryDate && this.vehicleCompliance.fitnessExpiryDate <= now) {
      issues.push('fitness_expired');
    }
    if (this.vehicleCompliance.insuranceExpiryDate && this.vehicleCompliance.insuranceExpiryDate <= now) {
      issues.push('insurance_expired');
    }
    if (this.vehicleCompliance.permitExpiryDate && this.vehicleCompliance.permitExpiryDate <= now) {
      issues.push('permit_expired');
    }
    if (this.vehicleCompliance.pollutionCertExpiry && this.vehicleCompliance.pollutionCertExpiry <= now) {
      issues.push('pollution_cert_expired');
    }

    return {
      isCompliant: issues.length === 0,
      issues,
    };
  }

  // Get days until expiry for a compliance item
  getDaysUntilExpiry(expiryDate) {
    if (!expiryDate) return null;
    const now = new Date();
    const diffTime = expiryDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  // Convert to plain object
  toJSON() {
    return {
      id: this.id,
      bus_number: this.busNumber,
      fleet_number: this.fleetNumber,
      bus_type: this.busType,
      is_active: this.isActive,
      current_status: this.currentStatus,
      created_at: this.createdAt.toISOString(),
      updated_at: this.updatedAt.toISOString(),
      vehicle_compliance: {
        registration_number: this.vehicleCompliance.registrationNumber,
        emission_standard: this.vehicleCompliance.emissionStandard,
        fitness_expiry_date: this.vehicleCompliance.fitnessExpiryDate?.toISOString(),
        insurance_expiry_date: this.vehicleCompliance.insuranceExpiryDate?.toISOString(),
        permit_expiry_date: this.vehicleCompliance.permitExpiryDate?.toISOString(),
        pollution_cert_expiry: this.vehicleCompliance.pollutionCertExpiry?.toISOString(),
        tax_expiry_date: this.vehicleCompliance.taxExpiryDate?.toISOString(),
      },
      specifications: this.specifications,
      assigned_route: this.assignedRoute,
      assigned_driver: this.assignedDriver,
      assigned_conductor: this.assignedConductor,
    };
  }
}