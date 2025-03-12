// API Client for eBuzzzMedia
// This file handles simplified API calls for form submissions

// Base API URL - change in production
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api' 
  : '/api';

// Request timeout in milliseconds
const REQUEST_TIMEOUT = 30000;

// API error class for consistent error handling
class APIError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
    this.timestamp = new Date();
  }
  
  toString() {
    return `[${this.name}] ${this.status}: ${this.message}`;
  }
}

// Helper function to handle fetch with timeout
const fetchWithTimeout = async (url, options = {}) => {
  const controller = new AbortController();
  const { signal } = controller;
  
  const timeout = setTimeout(() => {
    controller.abort();
  }, REQUEST_TIMEOUT);
  
  try {
    const response = await fetch(url, { ...options, signal });
    clearTimeout(timeout);
    return response;
  } catch (error) {
    clearTimeout(timeout);
    if (error.name === 'AbortError') {
      throw new APIError('Request timed out', 408);
    }
    throw error;
  }
};

// Helper function for API requests with error handling
const apiRequest = async (endpoint, method = 'GET', body = null) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Setup request options
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  // Add body for non-GET requests
  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }
  
  try {
    // Make the request with timeout
    const response = await fetchWithTimeout(url, options);
    
    // Parse the response
    const data = await response.json();
    
    // Handle HTTP errors
    if (!response.ok) {
      throw new APIError(
        data.message || `Request failed with status ${response.status}`,
        response.status,
        data
      );
    }
    
    return data;
  } catch (error) {
    // Handle network errors
    if (!(error instanceof APIError)) {
      // Fallback handling for demonstration
      console.error('API error:', error);
      
      // For demonstration - in real life we wouldn't do this
      if (endpoint === '/submit') {
        console.log('Form data would be sent:', body);
        return { success: true, message: 'Form submitted (demo mode)' };
      }
      
      throw new APIError(
        error.message || 'Network error',
        0
      );
    }
    throw error;
  }
};

// Consultation API
const ConsultationAPI = {
  // Book a consultation
  bookConsultation: async (consultationData) => {
    try {
      return await apiRequest('/submit', 'POST', {
        ...consultationData,
        type: 'consultation'
      });
    } catch (error) {
      console.error('Error booking consultation:', error);
      throw error;
    }
  }
};

// Contact API
const ContactAPI = {
  // Submit contact form
  submitContactForm: async (contactData) => {
    try {
      return await apiRequest('/submit', 'POST', {
        ...contactData,
        type: 'contact'
      });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      throw error;
    }
  }
};

// Package API
const PackageAPI = {
  // Submit custom package request
  submitCustomPackage: async (packageData) => {
    try {
      return await apiRequest('/submit', 'POST', {
        ...packageData,
        type: 'custom-package'
      });
    } catch (error) {
      console.error('Error submitting custom package:', error);
      throw error;
    }
  }
};

// Error handling utilities
const ErrorHandlers = {
  // Display error message to user
  showErrorMessage: (error, elementId = 'error-message') => {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
      errorElement.textContent = error.message || 'An error occurred. Please try again.';
      errorElement.style.display = 'block';
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        errorElement.style.display = 'none';
      }, 5000);
    } else {
      // Fallback to alert if error element not found
      alert(error.message || 'An error occurred. Please try again.');
    }
  },
  
  // Handle form validation errors
  handleFormErrors: (error, form) => {
    if (!error.data || !error.data.errors) {
      ErrorHandlers.showErrorMessage(error);
      return;
    }
    
    // Clear previous errors
    const errorElements = form.querySelectorAll('.error-message');
    errorElements.forEach(el => {
      el.style.display = 'none';
    });
    
    const formGroups = form.querySelectorAll('.form-group');
    formGroups.forEach(group => {
      group.classList.remove('has-error');
    });
    
    // Display new errors
    Object.entries(error.data.errors).forEach(([field, message]) => {
      const formGroup = form.querySelector(`[data-field="${field}"]`) || 
                        form.querySelector(`.form-group:has(#${field})`);
      
      if (formGroup) {
        formGroup.classList.add('has-error');
        
        const errorElement = formGroup.querySelector('.error-message');
        if (errorElement) {
          errorElement.textContent = message;
          errorElement.style.display = 'block';
        }
      }
    });
  }
};

// Form handling utilities
const FormUtils = {
  // Serialize form data to JSON
  serializeForm: (form) => {
    const formData = new FormData(form);
    const data = {};
    
    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }
    
    return data;
  },
  
  // Set form loading state
  setFormLoading: (form, isLoading) => {
    const submitButton = form.querySelector('button[type="submit"]');
    if (!submitButton) return;
    
    if (isLoading) {
      const originalText = submitButton.textContent;
      submitButton.setAttribute('data-original-text', originalText);
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
      submitButton.disabled = true;
      form.classList.add('is-loading');
    } else {
      const originalText = submitButton.getAttribute('data-original-text');
      if (originalText) {
        submitButton.textContent = originalText;
      }
      submitButton.disabled = false;
      form.classList.remove('is-loading');
    }
  },
  
  // Clear form fields
  clearForm: (form) => {
    form.reset();
    
    // Clear any error states
    const formGroups = form.querySelectorAll('.form-group');
    formGroups.forEach(group => {
      group.classList.remove('has-error');
    });
    
    const errorElements = form.querySelectorAll('.error-message');
    errorElements.forEach(el => {
      el.style.display = 'none';
    });
  },
  
  // Store submission in localStorage (for demonstration)
  storeSubmission: (data) => {
    // Add timestamp
    data.timestamp = new Date().toISOString();
    
    // Get existing submissions or initialize empty array
    const submissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
    
    // Add new submission
    submissions.push(data);
    
    // Store updated submissions
    localStorage.setItem('formSubmissions', JSON.stringify(submissions));
    
    console.log('Form submission stored:', data);
  }
};

// Export API modules
window.ConsultationAPI = ConsultationAPI;
window.ContactAPI = ContactAPI;
window.PackageAPI = PackageAPI;
window.FormUtils = FormUtils;
window.ErrorHandlers = ErrorHandlers;