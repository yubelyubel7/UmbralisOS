document.addEventListener('DOMContentLoaded', function() {
    // Create audio element for startup sound
    const startupSound = new Audio('IMG/startup.mp3');
    
    // Try to play the startup sound (may be blocked by browser autoplay policy)
    const playPromise = startupSound.play();
    
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.log("Autoplay prevented, will play on first interaction:", error);
            
            // If autoplay is blocked, play on first user interaction
            const playOnInteraction = function() {
                startupSound.play();
                document.removeEventListener('click', playOnInteraction);
                document.removeEventListener('keydown', playOnInteraction);
            };
            
            document.addEventListener('click', playOnInteraction);
            document.addEventListener('keydown', playOnInteraction);
        });
    }
    
    // Get references to elements
    const adminUser = document.querySelector('.xp-user:first-child');
    const umbralisUser = document.querySelector('.xp-user:nth-child(2)');
    const errorImage = document.getElementById('access-error');
    
    // Add click event for Administrator user
    adminUser.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent any default action or bubbling
        e.stopPropagation();
        
        // Show error image
        errorImage.style.display = 'block';
        
        // Play error sound
        const errorSound = new Audio('IMG/error.mp3');
        errorSound.play().catch(err => console.log('Audio error:', err));
    });
    
    // Click the image to dismiss it
    errorImage.addEventListener('click', function() {
        this.style.display = 'none';
    });
    
    // Add click event for Umbralis user
    umbralisUser.addEventListener('click', function() {
        // Show a brief "logging in" effect
        this.style.backgroundColor = '#2a65b5';
        this.style.transform = 'scale(0.98)';
        
        // Short delay to show the "clicking" effect before redirecting
        setTimeout(() => {
            // Redirect to homepage
            window.location.href = 'Homepage/index.html';
        }, 500);
    });
    
    // Add click handler for power off button
    const powerOffBtn = document.querySelector('.xp-login-off');
    if (powerOffBtn) {
        powerOffBtn.addEventListener('click', function() {
            document.body.style.transition = 'background-color 2s';
            document.body.style.backgroundColor = '#000';
            
            // Fade out the content
            const loginMain = document.querySelector('.xp-login-main');
            if (loginMain) {
                loginMain.style.transition = 'opacity 2s';
                loginMain.style.opacity = '0';
            }
            
            // Show shutdown message after fade
            setTimeout(() => {
                document.body.innerHTML = '<div style="background:black; color:white; height:100vh; display:flex; align-items:center; justify-content:center; font-family:monospace;">It is now safe to turn off your computer.</div>';
            }, 2000);
        });
    }
});