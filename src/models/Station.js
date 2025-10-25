// Station Model
export class Station {
  constructor(data = {}) {
    this.id = data.id || '';
    this.stationCode = data.station_code || '';
    this.stationName = data.station_name || '';
    this.stationType = data.station_type || 'regular';
    this.isAccessible = data.is_accessible || false;
    this.isActive = data.is_active || true;
    this.createdAt = data.created_at ? new Date(data.created_at) : new Date();
    this.updatedAt = data.updated_at ? new Date(data.updated_at) : new Date();

    // Location information
    this.location = {
      latitude: data.location?.latitude || 0,
      longitude: data.location?.longitude || 0,
      address: data.location?.address || '',
    };

    // Facilities
    this.facilities = data.facilities || [];

    // Operating hours
    this.operatingHours = {
      openTime: data.operating_hours?.open_time || '05:00',
      closeTime: data.operating_hours?.close_time || '23:00',
    };

    // Contact information
    this.contactInfo = {
      phone: data.contact_info?.phone || '',
      email: data.contact_info?.email || '',
    };

    // Additional info
    this.connectedRoutes = data.connected_routes || [];
    this.platformCount = data.platform_count || 1;
  }

  // Get station type display
  getStationTypeDisplay() {
    const typeMap = {
      'major': 'Major Terminal',
      'regular': 'Regular Stop',
      'depot': 'Bus Depot',
      'interchange': 'Interchange',
    };
    return typeMap[this.stationType] || this.stationType;
  }

  // Check if station has specific facility
  hasFacility(facility) {
    return this.facilities.includes(facility);
  }

  // Get formatted facilities list
  getFormattedFacilities() {
    const facilityMap = {
      'waiting_room': 'Waiting Room',
      'restroom': 'Restroom',
      'parking': 'Parking',
      'food_court': 'Food Court',
      'wifi': 'WiFi',
      'atm': 'ATM',
      'ticket_counter': 'Ticket Counter',
      'information_desk': 'Information Desk',
    };

    return this.facilities.map(facility => facilityMap[facility] || facility);
  }

  // Check if station is currently open
  isCurrentlyOpen() {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const [openHour, openMinute] = this.operatingHours.openTime.split(':').map(Number);
    const [closeHour, closeMinute] = this.operatingHours.closeTime.split(':').map(Number);
    
    const openTime = openHour * 60 + openMinute;
    const closeTime = closeHour * 60 + closeMinute;
    
    if (closeTime > openTime) {
      // Same day operation
      return currentTime >= openTime && currentTime <= closeTime;
    } else {
      // Overnight operation
      return currentTime >= openTime || currentTime <= closeTime;
    }
  }

  // Get operating hours display
  getOperatingHoursDisplay() {
    return `${this.operatingHours.openTime} - ${this.operatingHours.closeTime}`;
  }

  // Calculate distance to another station (using Haversine formula)
  getDistanceTo(otherStation) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(otherStation.location.latitude - this.location.latitude);
    const dLon = this.toRadians(otherStation.location.longitude - this.location.longitude);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(this.location.latitude)) * 
              Math.cos(this.toRadians(otherStation.location.latitude)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return Math.round(distance * 100) / 100; // Round to 2 decimal places
  }

  // Helper method to convert degrees to radians
  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  // Get station summary
  getStationSummary() {
    return {
      id: this.id,
      stationCode: this.stationCode,
      stationName: this.stationName,
      stationType: this.getStationTypeDisplay(),
      address: this.location.address,
      isAccessible: this.isAccessible,
      isActive: this.isActive,
      connectedRoutesCount: this.connectedRoutes.length,
      facilitiesCount: this.facilities.length,
    };
  }

  // Convert to plain object
  toJSON() {
    return {
      id: this.id,
      station_code: this.stationCode,
      station_name: this.stationName,
      station_type: this.stationType,
      is_accessible: this.isAccessible,
      is_active: this.isActive,
      created_at: this.createdAt.toISOString(),
      updated_at: this.updatedAt.toISOString(),
      location: this.location,
      facilities: this.facilities,
      operating_hours: this.operatingHours,
      contact_info: this.contactInfo,
      connected_routes: this.connectedRoutes,
      platform_count: this.platformCount,
    };
  }
}