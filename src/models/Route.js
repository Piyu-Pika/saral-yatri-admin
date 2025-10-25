// Route Model
export class Route {
  constructor(data = {}) {
    this.id = data.id || '';
    this.routeNumber = data.route_number || '';
    this.routeName = data.route_name || '';
    this.routeType = data.route_type || 'city';
    this.startStationId = data.start_station_id || '';
    this.endStationId = data.end_station_id || '';
    this.totalDistance = data.total_distance || 0;
    this.estimatedDuration = data.estimated_duration || 0;
    this.baseFare = data.base_fare || 0;
    this.farePerKm = data.fare_per_km || 0;
    this.isActive = data.is_active || true;
    this.createdAt = data.created_at ? new Date(data.created_at) : new Date();
    this.updatedAt = data.updated_at ? new Date(data.updated_at) : new Date();
    
    // Stations array
    this.stations = (data.stations || []).map(station => ({
      stationId: station.station_id,
      sequenceNumber: station.sequence_number,
      distanceFromStart: station.distance_from_start,
      stationName: station.station_name || '',
      stationCode: station.station_code || '',
    }));

    // Additional route info
    this.startStationName = data.start_station_name || '';
    this.endStationName = data.end_station_name || '';
    this.assignedBuses = data.assigned_buses || [];
  }

  // Get route type display
  getRouteTypeDisplay() {
    const typeMap = {
      'city': 'City Route',
      'intercity': 'Intercity Route',
      'express': 'Express Route',
      'local': 'Local Route',
    };
    return typeMap[this.routeType] || this.routeType;
  }

  // Calculate fare for given distance
  calculateFare(distance) {
    return this.baseFare + (distance * this.farePerKm);
  }

  // Get estimated duration in hours and minutes
  getFormattedDuration() {
    const hours = Math.floor(this.estimatedDuration / 60);
    const minutes = this.estimatedDuration % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  // Get total stations count
  getTotalStations() {
    return this.stations.length;
  }

  // Get station by sequence number
  getStationBySequence(sequenceNumber) {
    return this.stations.find(station => station.sequenceNumber === sequenceNumber);
  }

  // Get distance between two stations
  getDistanceBetweenStations(fromSequence, toSequence) {
    const fromStation = this.getStationBySequence(fromSequence);
    const toStation = this.getStationBySequence(toSequence);
    
    if (!fromStation || !toStation) return 0;
    
    return Math.abs(toStation.distanceFromStart - fromStation.distanceFromStart);
  }

  // Calculate fare between two stations
  getFareBetweenStations(fromSequence, toSequence) {
    const distance = this.getDistanceBetweenStations(fromSequence, toSequence);
    return this.calculateFare(distance);
  }

  // Check if route is operational
  isOperational() {
    return this.isActive && this.assignedBuses.length > 0;
  }

  // Get route summary
  getRouteSummary() {
    return {
      id: this.id,
      routeNumber: this.routeNumber,
      routeName: this.routeName,
      startStation: this.startStationName,
      endStation: this.endStationName,
      totalDistance: this.totalDistance,
      estimatedDuration: this.getFormattedDuration(),
      baseFare: this.baseFare,
      totalStations: this.getTotalStations(),
      isActive: this.isActive,
    };
  }

  // Convert to plain object
  toJSON() {
    return {
      id: this.id,
      route_number: this.routeNumber,
      route_name: this.routeName,
      route_type: this.routeType,
      start_station_id: this.startStationId,
      end_station_id: this.endStationId,
      total_distance: this.totalDistance,
      estimated_duration: this.estimatedDuration,
      base_fare: this.baseFare,
      fare_per_km: this.farePerKm,
      is_active: this.isActive,
      created_at: this.createdAt.toISOString(),
      updated_at: this.updatedAt.toISOString(),
      stations: this.stations.map(station => ({
        station_id: station.stationId,
        sequence_number: station.sequenceNumber,
        distance_from_start: station.distanceFromStart,
        station_name: station.stationName,
        station_code: station.stationCode,
      })),
      start_station_name: this.startStationName,
      end_station_name: this.endStationName,
      assigned_buses: this.assignedBuses,
    };
  }
}