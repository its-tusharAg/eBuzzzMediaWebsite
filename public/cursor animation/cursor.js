// Simple, reliable custom cursor
document.addEventListener('DOMContentLoaded', function() {
    // Skip on touch devices
    if (('ontouchstart' in window) || navigator.maxTouchPoints > 0) {
        return;
    }
    
    // Apply custom cursor class to body
    document.body.classList.add('custom-cursor');
    
    // Create cursor elements
    const cursor = document.createElement('div');
    cursor.className = 'cursor';
    document.body.appendChild(cursor);
    
    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    document.body.appendChild(cursorDot);
    
    // Create trail elements
    const trailCount = 4;
    const trails = [];
    
    for (let i = 0; i < trailCount; i++) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.opacity = (0.6 - (i * 0.15)).toFixed(2);
        document.body.appendChild(trail);
        trails.push(trail);
    }
    
    // Track cursor position
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    // Store trail positions
    const trailPositions = [];
    for (let i = 0; i < trailCount; i++) {
        trailPositions.push({ x: 0, y: 0 });
    }
    
    // Mouse move handler
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Hover effect for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, .service-card, .package-card, .option-item');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            cursorDot.classList.add('hover');
            trails.forEach(trail => trail.classList.add('hover'));
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            cursorDot.classList.remove('hover');
            trails.forEach(trail => trail.classList.remove('hover'));
        });
    });
    
    // Click effect
    document.addEventListener('mousedown', () => {
        cursor.classList.add('click');
        cursorDot.classList.add('click');
        trails.forEach(trail => trail.classList.add('click'));
    });
    
    document.addEventListener('mouseup', () => {
        cursor.classList.remove('click');
        cursorDot.classList.remove('click');
        setTimeout(() => {
            trails.forEach(trail => trail.classList.remove('click'));
        }, 100);
    });
    
    // Hide when cursor leaves window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        cursorDot.style.opacity = '0';
        trails.forEach(trail => {
            trail.style.opacity = '0';
        });
    });
    
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        cursorDot.style.opacity = '1';
        trails.forEach((trail, i) => {
            trail.style.opacity = (0.6 - (i * 0.15)).toFixed(2);
        });
    });
    
    // Animation loop
    function updateCursor() {
        // Smooth follow for main cursor
        const easing = 0.2;
        cursorX += (mouseX - cursorX) * easing;
        cursorY += (mouseY - cursorY) * easing;
        
        // Apply positions without transforms
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
        
        // Dot follows cursor exactly
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
        
        // Update trail positions
        trailPositions.unshift({ x: mouseX, y: mouseY });
        trailPositions.pop();
        
        // Apply trail positions with delay
        trails.forEach((trail, i) => {
            const pos = trailPositions[Math.min(i * 2, trailPositions.length - 1)];
            trail.style.left = `${pos.x}px`;
            trail.style.top = `${pos.y}px`;
            
            // Size decreases for each trail element
            const scale = 1 - (i * 0.2);
            trail.style.transform = `translate(-50%, -50%) scale(${scale})`;
        });
        
        requestAnimationFrame(updateCursor);
    }
    
    // Fill initial positions array
    for (let i = 0; i < trailCount * 2; i++) {
        trailPositions.push({ x: mouseX, y: mouseY });
    }
    
    // Start the animation
    updateCursor();
});