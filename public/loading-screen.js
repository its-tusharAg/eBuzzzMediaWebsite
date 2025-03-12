// Loading Screen Handler with Minimum Display Time
(function() {
    // Record when the loading screen started
    const startTime = Date.now();
    
    // Minimum time the loading screen should be visible (in ms)
    const MIN_DISPLAY_TIME = 2000; // 1 second minimum
    
    // Maximum time the loading screen can be shown (in ms)
    const MAX_DISPLAY_TIME = 3000; // 3 seconds maximum
    
    // Function to remove the loading screen
    function removeLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            // Add the hidden class to trigger the fade-out
            loadingScreen.classList.add('loading-screen-hidden');
            
            // Enable page scrolling
            document.body.style.overflow = 'auto';
            document.body.classList.add('content-loaded');
            
            // Remove from DOM after transition completes
            setTimeout(function() {
                if (loadingScreen.parentNode) {
                    loadingScreen.parentNode.removeChild(loadingScreen);
                    console.log('Loading screen removed after transition');
                }
            }, 500);
        }
    }
    
    // Function to ensure minimum display time is respected
    function handleLoadingScreenRemoval() {
        const currentTime = Date.now();
        const elapsedTime = currentTime - startTime;
        
        if (elapsedTime < MIN_DISPLAY_TIME) {
            // Not enough time has passed, wait until minimum time is reached
            const remainingTime = MIN_DISPLAY_TIME - elapsedTime;
            console.log(`Loading screen will be removed in ${remainingTime}ms to ensure minimum display time`);
            setTimeout(removeLoadingScreen, remainingTime);
        } else {
            // Minimum time has passed, remove immediately
            removeLoadingScreen();
        }
    }
    
    // Make sure the body is initially set to hidden overflow
    document.body.style.overflow = 'hidden';
    
    // Set up event listeners and timers
    
    // Handle page load events
    window.addEventListener('load', handleLoadingScreenRemoval);
    
    // Check if already loaded
    if (document.readyState === 'complete') {
        handleLoadingScreenRemoval();
    }
    
    // Set a maximum time limit
    setTimeout(removeLoadingScreen, MAX_DISPLAY_TIME);
    
    // Track animation events on the loading bar
    const loadingBar = document.querySelector('.loading-bar-progress');
    if (loadingBar) {
        loadingBar.addEventListener('animationend', function() {
            // When loading bar animation completes, check if minimum time has passed
            handleLoadingScreenRemoval();
        });
    }
})();