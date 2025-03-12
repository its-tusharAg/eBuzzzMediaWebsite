document.addEventListener('DOMContentLoaded', function() {
    // Initialize all animations and interactions
    initParticles();
    // initCustomCursor(); // Removed - now handled by cursor.js
    initMagneticButtons();
    initScrollAnimations();
    initFormHandlers(); // Simplified - actual implementation moved to simplified-form-handler.js
    
    // Toggle Menu for Mobile
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    mobileMenu.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        navLinks.classList.toggle('active');
        
        // Transform hamburger to X
        const spans = mobileMenu.querySelectorAll('span');
        if (mobileMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
    
    // Close mobile menu when clicking on a link
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            if (navLinks.classList.contains('active')) {
                mobileMenu.click();
            }
        });
    });
    
    // Scroll to Top Button
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });
    
    scrollToTopBtn.addEventListener('click', function() {
        gsap.to(window, {
            duration: 1,
            scrollTo: {
                y: 0
            },
            ease: "power3.inOut"
        });
    });
    
    // Theme Toggle (Light/Dark Mode) with Animation
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const body = document.body;
    const themeOverlay = document.querySelector('.theme-transition-overlay');
    
    // Check for saved theme preference or use device preference
    const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark' || (!savedTheme && userPrefersDark)) {
        body.classList.replace('light-mode', 'dark-mode');
    }
    
    themeToggleBtn.addEventListener('click', function(e) {
        // Set the click position for the theme transition
        const x = e.clientX;
        const y = e.clientY;
        themeOverlay.style.setProperty('--x', x + 'px');
        themeOverlay.style.setProperty('--y', y + 'px');
        themeOverlay.classList.add('active');
        
        setTimeout(() => {
            if (body.classList.contains('light-mode')) {
                body.classList.replace('light-mode', 'dark-mode');
                localStorage.setItem('theme', 'dark');
                
                // Update particles color for dark mode
                if (window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS) {
                    window.pJSDom[0].pJS.particles.color.value = "#7e57c2";
                    window.pJSDom[0].pJS.particles.line_linked.color = "#7e57c2";
                }
            } else {
                body.classList.replace('dark-mode', 'light-mode');
                localStorage.setItem('theme', 'light');
                
                // Update particles color for light mode
                if (window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS) {
                    window.pJSDom[0].pJS.particles.color.value = "#6a5acd";
                    window.pJSDom[0].pJS.particles.line_linked.color = "#6a5acd";
                }
            }
            
            setTimeout(() => {
                themeOverlay.classList.remove('active');
            }, 500);
        }, 300);
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === document.getElementById('success-modal')) {
            document.querySelector('.close-modal').click();
        }
    });

    
    
    // Custom Package Option Toggle with Animation
    const serviceCheckboxes = document.querySelectorAll('.option-item input[type="checkbox"]');
    serviceCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // Animate the checkbox
            const checkmark = this.nextElementSibling;
            if (this.checked) {
                gsap.fromTo(checkmark, 
                    { scale: 1.2, rotation: -5 },
                    { scale: 1, rotation: 0, duration: 0.3, ease: "back.out(1.7)" }
                );
            }
        });
    });
    
    // Hero Background Parallax Effect
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
        window.addEventListener('mousemove', function(e) {
            const moveX = (e.clientX / window.innerWidth) * 20 - 10;
            const moveY = (e.clientY / window.innerHeight) * 20 - 10;
            
            gsap.to(heroBackground, {
                x: moveX,
                y: moveY,
                duration: 1,
                ease: "power2.out"
            });
        });
    }
    
    // Add parallax scrolling effect
    window.addEventListener('scroll', function() {
        const scrollPosition = window.pageYOffset;
        
        // Parallax for hero section
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            gsap.to(heroContent, {
                y: scrollPosition * 0.3,
                duration: 0.3,
                ease: "none"
            });
        }
    });
});

// Simplified Form Handler 
// Note: Most functionality moved to simplified-form-handler.js
function initFormHandlers() {
    // Form handling is now managed by simplified-form-handler.js
    console.log('Form handlers initialized via simplified-form-handler.js');
}

// Success Modal Function (kept for backward compatibility)
function showSuccessModal() {
    const successModal = document.getElementById('success-modal');
    if (successModal) {
        successModal.classList.add('show');
        
        // Animate success icon
        gsap.fromTo('.success-animation i', 
            { scale: 0, rotation: -180 },
            { scale: 1, rotation: 0, duration: 0.6, ease: "back.out(1.7)" }
        );
        
        // Set up close button
        const closeModal = document.querySelector('.close-modal');
        if (closeModal) {
            closeModal.addEventListener('click', function() {
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
            });
        }
    }
}

// Particles Background
function initParticles() {
    const particlesConfig = {
        particles: {
            number: {
                value: 120,
                density: {
                    enable: true,
                    value_area: 900
                }
            },
            color: {
                value: "#9c6eff"
            },
            shape: {
                type: "circle",
                stroke: {
                    width: 0,
                    color: "#000000"
                },
                polygon: {
                    nb_sides: 5
                }
            },
            opacity: {
                value: 0.7,
                random: true,
                anim: {
                    enable: true,
                    speed: 0.8,
                    opacity_min: 0.2,
                    sync: false
                }
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: true,
                    speed: 3,
                    size_min: 0.5,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: "#9c6eff",
                opacity: 0.3,
                width: 1
            },
            move: {
                enable: true,
                speed: 1.5,
                direction: "none",
                random: true,
                straight: false,
                out_mode: "out",
                bounce: false,
                attract: {
                    enable: true,
                    rotateX: 600,
                    rotateY: 1200
                }
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: {
                    enable: true,
                    mode: "bubble"
                },
                onclick: {
                    enable: true,
                    mode: "repulse"
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 140,
                    line_linked: {
                        opacity: 1
                    }
                },
                bubble: {
                    distance: 200,
                    size: 5,
                    duration: 2,
                    opacity: 0.8,
                    speed: 3
                },
                repulse: {
                    distance: 200,
                    duration: 0.4
                },
                push: {
                    particles_nb: 4
                },
                remove: {
                    particles_nb: 2
                }
            }
        },
        retina_detect: true
    };
    
    // Check if dark mode is active
    if (document.body.classList.contains('dark-mode')) {
        particlesConfig.particles.color.value = "#7e57c2";
        particlesConfig.particles.line_linked.color = "#7e57c2";
    }
    
    // Initialize particles
    if (window.particlesJS) {
        window.particlesJS('particles-js', particlesConfig);
    }
}

// Magnetic Buttons Effect
function initMagneticButtons() {
    // Skip on touch devices
    if (('ontouchstart' in window) || navigator.maxTouchPoints > 0) return;
    
    const magneticButtons = document.querySelectorAll('.magnetic-button');
    
    magneticButtons.forEach(button => {
        button.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const strength = 15; // Adjust the magnetic pull strength
            
            gsap.to(this, {
                duration: 0.3,
                x: x * strength / rect.width,
                y: y * strength / rect.height,
                ease: "power2.out"
            });
        });
        
        button.addEventListener('mouseleave', function() {
            gsap.to(this, {
                duration: 0.5,
                x: 0,
                y: 0,
                ease: "elastic.out(1, 0.3)"
            });
        });
    });
}

// Enhanced Scroll Animations with GSAP
function initScrollAnimations() {
    if (!window.gsap) return;
    
    // Register plugins
    if (window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
    }
    
    if (window.ScrollToPlugin) {
        gsap.registerPlugin(ScrollToPlugin);
    }
    
    // Text reveal animations for hero section
    const heroTitle = document.querySelector('.hero-section h1');
    const heroText = document.querySelector('.hero-section p');
    
    if (heroTitle && heroText) {
        // Split hero text into words if not already done
        splitTextIntoSpans(heroTitle);
        splitTextIntoSpans(heroText);
        
        // Animate words
        const heroTitleWords = heroTitle.querySelectorAll('.reveal-word');
        const heroTextWords = heroText.querySelectorAll('.reveal-word');
        
        gsap.fromTo(heroTitleWords, 
            {
                y: '100%',
                opacity: 0
            },
            {
                y: '0%',
                opacity: 1,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out",
                delay: 0.3
            }
        );
        
        gsap.fromTo(heroTextWords, 
            {
                y: '100%',
                opacity: 0
            },
            {
                y: '0%',
                opacity: 1,
                duration: 0.6,
                stagger: 0.05,
                ease: "power2.out",
                delay: 0.8
            }
        );
    }
    
    // Section animations
    const sections = document.querySelectorAll('.scroll-section');
    sections.forEach(section => {
        const sectionTitle = section.querySelector('.section-title');
        const sectionDesc = section.querySelector('.section-description');
        
        if (sectionTitle) {
            gsap.fromTo(sectionTitle, 
                {
                    y: 50,
                    opacity: 0
                },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: sectionTitle,
                        start: "top 80%",
                        toggleActions: "play none none none"
                    }
                }
            );
        }
        
        if (sectionDesc) {
            gsap.fromTo(sectionDesc, 
                {
                    y: 30,
                    opacity: 0
                },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: "power2.out",
                    delay: 0.2,
                    scrollTrigger: {
                        trigger: sectionDesc,
                        start: "top 80%",
                        toggleActions: "play none none none"
                    }
                }
            );
        }
    });
    
    // Service card animations
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        gsap.fromTo(card, 
            {
                y: 50,
                opacity: 0
            },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                delay: index * 0.1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: card,
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            }
        );
    });
    
    // Packages card animations
    const packageCards = document.querySelectorAll('.package-card');
    packageCards.forEach((card, index) => {
        gsap.fromTo(card, 
            {
                y: 50,
                opacity: 0,
                scale: 0.95
            },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.8,
                delay: index * 0.1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: card,
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            }
        );
    });
    
    // Contact section animations
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach((item, index) => {
        gsap.fromTo(item, 
            {
                x: -30,
                opacity: 0
            },
            {
                x: 0,
                opacity: 1,
                duration: 0.6,
                delay: index * 0.1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: item,
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            }
        );
    });
    
    // Form animations
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const formGroups = form.querySelectorAll('.form-group');
        
        gsap.fromTo(formGroups, 
            {
                y: 30,
                opacity: 0
            },
            {
                y: 0,
                opacity: 1,
                stagger: 0.1,
                duration: 0.6,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: form,
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            }
        );
    });
    
    // Setup smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                
                gsap.to(window, {
                    duration: 1,
                    scrollTo: {
                        y: targetElement,
                        offsetY: headerOffset
                    },
                    ease: "power3.inOut"
                });
            }
        });
    });
}

// Helper function to split text into spans
function splitTextIntoSpans(element) {
    if (!element || element.classList.contains('text-split')) return;
    
    const text = element.textContent.trim();
    element.textContent = '';
    element.classList.add('text-split');
    
    text.split(' ').forEach(word => {
        const span = document.createElement('span');
        span.className = 'reveal-word';
        span.textContent = word + ' ';
        element.appendChild(span);
    });
}