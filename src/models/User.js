// User Model
export class User {
  constructor(data = {}) {
    this.id = data.id || '';
    this.username = data.username || '';
    this.email = data.email || '';
    this.phone = data.phone || '';
    this.role = data.role || 'passenger';
    this.isVerified = data.is_verified || false;
    this.isActive = data.is_active || true;
    this.createdAt = data.created_at ? new Date(data.created_at) : new Date();
    this.updatedAt = data.updated_at ? new Date(data.updated_at) : new Date();
    this.dateOfBirth = data.date_of_birth ? new Date(data.date_of_birth) : null;
    this.subsidyEligible = data.subsidy_eligible || null;
  }

  // Check if user is admin
  isAdmin() {
    return this.role === 'system_admin';
  }

  // Check if user is conductor
  isConductor() {
    return this.role === 'conductor';
  }

  // Check if user is driver
  isDriver() {
    return this.role === 'driver';
  }

  // Get formatted creation date
  getFormattedCreatedAt() {
    return this.createdAt.toLocaleDateString('en-IN');
  }

  // Get age from date of birth
  getAge() {
    if (!this.dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  // Convert to plain object
  toJSON() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      phone: this.phone,
      role: this.role,
      is_verified: this.isVerified,
      is_active: this.isActive,
      created_at: this.createdAt.toISOString(),
      updated_at: this.updatedAt.toISOString(),
      date_of_birth: this.dateOfBirth ? this.dateOfBirth.toISOString() : null,
      subsidy_eligible: this.subsidyEligible,
    };
  }
}