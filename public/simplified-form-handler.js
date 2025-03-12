// Enhanced Form Handler for eBuzzzMedia
// This handles all form submissions for the website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize form handlers
    initFormHandlers();
    
    // Initialize success modal functionality
    initSuccessModal();
});

// Form submission handler
function initFormHandlers() {
    // Consultation Form
    const consultationForm = document.getElementById('consultation-form');
    if (consultationForm) {
        consultationForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            submitBtn.disabled = true;
            
            try {
                // Gather form data
                const formData = {
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    date: document.getElementById('date').value,
                    time: document.getElementById('time').value,
                    message: document.getElementById('message').value,
                    type: 'consultation'
                };
                
                // Submit to backend
                const response = await fetch('/api/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                }).catch((error) => {
                    console.error('Network error:', error);
                    throw new Error('Network error. Please check your connection and try again.');
                });
                
                const responseData = await response.json();
                
                if (response.ok && responseData.success) {
                    // Show success modal
                    showSuccessModal();
                    
                    // Store in localStorage for demonstration
                    storeSubmission(formData);
                    
                    // Reset the form
                    this.reset();
                } else {
                    throw new Error(responseData.message || 'Failed to submit form');
                }
            } catch (error) {
                // Show error message
                console.error('Form submission error:', error);
                alert(`Error submitting form: ${error.message || 'Please try again'}`);
            } finally {
                // Restore button state
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // Contact Form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            try {
                // Gather form data
                const formData = {
                    name: document.getElementById('contact-name').value,
                    email: document.getElementById('contact-email').value,
                    message: document.getElementById('contact-message').value,
                    type: 'contact'
                };
                
                // Submit to backend
                const response = await fetch('/api/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                }).catch((error) => {
                    console.error('Network error:', error);
                    throw new Error('Network error. Please check your connection and try again.');
                });
                
                const responseData = await response.json();
                
                if (response.ok && responseData.success) {
                    // Show success modal
                    showSuccessModal();
                    
                    // Store in localStorage for demonstration
                    storeSubmission(formData);
                    
                    // Reset the form
                    this.reset();
                } else {
                    throw new Error(responseData.message || 'Failed to submit form');
                }
            } catch (error) {
                // Show error message
                console.error('Contact form submission error:', error);
                alert(`Error sending message: ${error.message || 'Please try again'}`);
            } finally {
                // Restore button state
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // Custom Package Form
    const customPackageCta = document.querySelector('.custom-package-cta .cta-button');
    if (customPackageCta) {
        customPackageCta.addEventListener('click', async function(e) {
            e.preventDefault();
            
            // Only proceed if we're collecting services first
            const checkboxes = document.querySelectorAll('.option-item input[type="checkbox"]:checked');
            if (checkboxes.length === 0) {
                alert('Please select at least one service for your custom package.');
                return;
            }
            
            // Show loading state
            const originalBtnText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            this.disabled = true;
            
            try {
                // Collect all selected services
                const services = {
                    marketing: {
                        socialMedia: document.querySelector('input[value="social-media"]')?.checked || false,
                        seo: document.querySelector('input[value="seo"]')?.checked || false,
                        ads: document.querySelector('input[value="ads"]')?.checked || false,
                        email: document.querySelector('input[value="email"]')?.checked || false
                    },
                    development: {
                        webDev: document.querySelector('input[value="web-dev"]')?.checked || false,
                        landing: document.querySelector('input[value="landing"]')?.checked || false,
                        aiSolutions: document.querySelector('input[value="ai-solutions"]')?.checked || false,
                        appDev: document.querySelector('input[value="app-dev"]')?.checked || false
                    },
                    writing: {
                        blog: document.querySelector('input[value="blog"]')?.checked || false,
                        adCopy: document.querySelector('input[value="ad-copy"]')?.checked || false,
                        linkedin: document.querySelector('input[value="linkedin"]')?.checked || false,
                        marketingCopy: document.querySelector('input[value="marketing-copy"]')?.checked || false
                    }
                };
                
                // Create a readable list of selected services
                const selectedServicesList = Object.entries(services)
                    .flatMap(([category, items]) => 
                        Object.entries(items)
                            .filter(([_, selected]) => selected)
                            .map(([service, _]) => {
                                // Convert camelCase to readable format
                                return service
                                    .replace(/([A-Z])/g, ' $1')
                                    .replace(/^./, str => str.toUpperCase());
                            })
                    )
                    .join(', ');
                
                // Store selected services in session storage
                sessionStorage.setItem('customPackageServices', JSON.stringify(services));
                
                // If consultation form exists, fill it with custom package info
                const consultationSection = document.getElementById('consultation');
                
                // Use GSAP if available, otherwise use scrollIntoView
                if (window.gsap) {
                    gsap.to(window, {
                        duration: 1,
                        scrollTo: {
                            y: consultationSection,
                            offsetY: 80
                        },
                        ease: "power3.inOut",
                        onComplete: fillConsultationForm
                    });
                } else {
                    consultationSection.scrollIntoView({ behavior: 'smooth' });
                    setTimeout(fillConsultationForm, 1000);
                }
                
                function fillConsultationForm() {
                    // Add a note to the message field
                    const messageField = document.getElementById('message');
                    if (messageField) {
                        messageField.value = "I'm interested in a custom package with the following services: " + selectedServicesList;
                    }
                }
                
                // If the user doesn't go to the consultation form, we could also 
                // submit the custom package form directly with AJAX
                /* 
                // Direct submission of custom package request
                const formData = {
                    name: "Custom Package Request", // Placeholder
                    email: "placeholder@example.com", // Placeholder
                    message: `Custom package request with services: ${selectedServicesList}`,
                    services: services,
                    type: 'custom-package'
                };
                
                // You could uncomment this for direct submission without consultation form
                // But would need to collect user details first
                */
            } catch (error) {
                console.error('Error processing custom package:', error);
                alert('There was an error processing your request. Please try again.');
            } finally {
                // Restore button state
                this.innerHTML = originalBtnText;
                this.disabled = false;
            }
        });
    }
    
    // Package buttons (Get Started)
    const packageButtons = document.querySelectorAll('.package-card .cta-button');
    packageButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (!this.parentElement.classList.contains('custom')) {
                e.preventDefault();
                
                // Get package info
                const packageName = this.parentElement.querySelector('h3').textContent;
                const packagePrice = this.parentElement.querySelector('.package-price').textContent;
                
                // Smooth scroll to consultation form
                const consultationSection = document.getElementById('consultation');
                
                // Use GSAP if available, otherwise use scrollIntoView
                if (window.gsap) {
                    gsap.to(window, {
                        duration: 1,
                        scrollTo: {
                            y: consultationSection,
                            offsetY: 80
                        },
                        ease: "power3.inOut",
                        onComplete: fillPackageInfo
                    });
                } else {
                    consultationSection.scrollIntoView({ behavior: 'smooth' });
                    setTimeout(fillPackageInfo, 1000);
                }
                
                function fillPackageInfo() {
                    // Add package info to the message field
                    const messageField = document.getElementById('message');
                    if (messageField) {
                        messageField.value = `I'm interested in the ${packageName} (${packagePrice}) package.`;
                    }
                }
            }
        });
    });
}

// Success Modal Functionality
function initSuccessModal() {
    // Close modal functionality
    const closeModalBtns = document.querySelectorAll('.close-modal');
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', closeSuccessModal);
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('success-modal');
        if (e.target === modal) {
            closeSuccessModal();
        }
    });
}

// Show success modal
function showSuccessModal() {
    const successModal = document.getElementById('success-modal');
    if (successModal) {
        successModal.classList.add('show');
        
        // Change message to include email notification
        const modalMessage = successModal.querySelector('p');
        if (modalMessage) {
            modalMessage.innerHTML = 'Your form has been submitted successfully. We\'ll get back to you soon.<br><br>A confirmation email has been sent to your inbox.';
        }
        
        // Animate success icon if GSAP is available
        if (window.gsap) {
            gsap.fromTo('.success-animation i', 
                { scale: 0, rotation: -180 },
                { scale: 1, rotation: 0, duration: 0.6, ease: "back.out(1.7)" }
            );
        }
    }
}

// Close success modal
function closeSuccessModal() {
    const successModal = document.getElementById('success-modal');
    if (successModal) {
        if (window.gsap) {
            gsap.to('.modal-content', {
                scale: 0.8,
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    successModal.classList.remove('show');
                    // Reset for next time
                    gsap.set('.modal-content', { scale: 1, opacity: 1 });
                }
            });
        } else {
            successModal.classList.remove('show');
        }
    }
}

// Store form submissions in localStorage (for demonstration)
function storeSubmission(data) {
    // Add timestamp
    data.timestamp = new Date().toISOString();
    
    // Get existing submissions or initialize empty array
    const submissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
    
    // Add new submission
    submissions.push(data);
    
    // Store updated submissions
    localStorage.setItem('formSubmissions', JSON.stringify(submissions));
    
    // Log for demonstration purposes
    console.log('Form submission stored:', data);
}