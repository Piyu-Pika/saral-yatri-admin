// Subsidy Scheme Model
export class SubsidyScheme {
  constructor(data = {}) {
    this.id = data.id || '';
    this.schemeName = data.scheme_name || '';
    this.subsidyType = data.subsidy_type || '';
    this.discountPercentage = data.discount_percentage || 0;
    this.maxDiscountAmount = data.max_discount_amount || 0;
    this.validityPeriod = data.validity_period || 365;
    this.budgetAllocated = data.budget_allocated || 0;
    this.budgetUtilized = data.budget_utilized || 0;
    this.beneficiariesCount = data.beneficiaries_count || 0;
    this.isActive = data.is_active || true;
    this.description = data.description || '';
    this.termsAndConditions = data.terms_and_conditions || '';
    this.createdAt = data.created_at ? new Date(data.created_at) : new Date();
    this.updatedAt = data.updated_at ? new Date(data.updated_at) : new Date();

    // Eligibility criteria
    this.eligibilityCriteria = {
      ageRange: {
        min: data.eligibility_criteria?.age_range?.min || null,
        max: data.eligibility_criteria?.age_range?.max || null,
      },
      requiredDocuments: data.eligibility_criteria?.required_documents || [],
      incomeLimit: data.eligibility_criteria?.income_limit || null,
    };
  }

  // Get subsidy type display
  getSubsidyTypeDisplay() {
    const typeMap = {
      'student': 'Student Concession',
      'senior_citizen': 'Senior Citizen',
      'disabled': 'Disabled Person',
      'low_income': 'Low Income',
      'government_employee': 'Government Employee',
      'military': 'Military Personnel',
    };
    return typeMap[this.subsidyType] || this.subsidyType;
  }

  // Calculate budget utilization percentage
  getBudgetUtilizationPercentage() {
    if (this.budgetAllocated === 0) return 0;
    return Math.round((this.budgetUtilized / this.budgetAllocated) * 100);
  }

  // Get remaining budget
  getRemainingBudget() {
    return Math.max(0, this.budgetAllocated - this.budgetUtilized);
  }

  // Check if budget is exhausted
  isBudgetExhausted() {
    return this.budgetUtilized >= this.budgetAllocated;
  }

  // Calculate discount amount for given fare
  calculateDiscount(originalFare) {
    const percentageDiscount = (originalFare * this.discountPercentage) / 100;
    return Math.min(percentageDiscount, this.maxDiscountAmount);
  }

  // Calculate final fare after discount
  calculateFinalFare(originalFare) {
    const discount = this.calculateDiscount(originalFare);
    return Math.max(0, originalFare - discount);
  }

  // Check if user meets age criteria
  meetsAgeCriteria(userAge) {
    if (!userAge) return false;
    
    const { min, max } = this.eligibilityCriteria.ageRange;
    
    if (min !== null && userAge < min) return false;
    if (max !== null && userAge > max) return false;
    
    return true;
  }

  // Get required documents display
  getRequiredDocumentsDisplay() {
    const documentMap = {
      'student_id': 'Student ID Card',
      'age_proof': 'Age Proof',
      'senior_citizen_card': 'Senior Citizen Card',
      'disability_certificate': 'Disability Certificate',
      'income_certificate': 'Income Certificate',
      'government_id': 'Government Employee ID',
      'military_id': 'Military ID',
      'aadhaar': 'Aadhaar Card',
    };

    return this.eligibilityCriteria.requiredDocuments.map(
      doc => documentMap[doc] || doc
    );
  }

  // Get age range display
  getAgeRangeDisplay() {
    const { min, max } = this.eligibilityCriteria.ageRange;
    
    if (min !== null && max !== null) {
      return `${min} - ${max} years`;
    } else if (min !== null) {
      return `${min}+ years`;
    } else if (max !== null) {
      return `Up to ${max} years`;
    }
    
    return 'No age restriction';
  }

  // Get scheme status
  getSchemeStatus() {
    if (!this.isActive) return 'Inactive';
    if (this.isBudgetExhausted()) return 'Budget Exhausted';
    return 'Active';
  }

  // Get scheme summary
  getSchemeSummary() {
    return {
      id: this.id,
      schemeName: this.schemeName,
      subsidyType: this.getSubsidyTypeDisplay(),
      discountPercentage: this.discountPercentage,
      maxDiscountAmount: this.maxDiscountAmount,
      budgetUtilization: this.getBudgetUtilizationPercentage(),
      beneficiariesCount: this.beneficiariesCount,
      status: this.getSchemeStatus(),
      ageRange: this.getAgeRangeDisplay(),
    };
  }

  // Convert to plain object
  toJSON() {
    return {
      id: this.id,
      scheme_name: this.schemeName,
      subsidy_type: this.subsidyType,
      discount_percentage: this.discountPercentage,
      max_discount_amount: this.maxDiscountAmount,
      validity_period: this.validityPeriod,
      budget_allocated: this.budgetAllocated,
      budget_utilized: this.budgetUtilized,
      beneficiaries_count: this.beneficiariesCount,
      is_active: this.isActive,
      description: this.description,
      terms_and_conditions: this.termsAndConditions,
      created_at: this.createdAt.toISOString(),
      updated_at: this.updatedAt.toISOString(),
      eligibility_criteria: {
        age_range: this.eligibilityCriteria.ageRange,
        required_documents: this.eligibilityCriteria.requiredDocuments,
        income_limit: this.eligibilityCriteria.incomeLimit,
      },
    };
  }
}