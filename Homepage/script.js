// Fix Paint window click alignment issues

// Variable to track the highest z-index for windows
let highestZIndex = 1000;

// Function to bring a window to the front
function bringToFront(window) {
    // Increase the highest z-index
    highestZIndex++;
    
    // Set the window's z-index to the new highest value
    window.style.zIndex = highestZIndex;
    
    console.log(`Bringing window to front with z-index: ${highestZIndex}`);
}

// Paint application functions
function togglePaint() {
    const paintWindow = document.getElementById('paint-window');
    
    if (paintWindow.style.display === 'none') {
        // Open paint window
        paintWindow.style.display = 'flex';
        
        // Center the paint window
        centerPaintWindow();
        
        // Bring to front when opened
        bringToFront(paintWindow);
        
        // Add active class to paint icon
        document.querySelector('.paint-icon').classList.add('active');
        
        // Create and show webcam speech bubble
        showWebcamSpeechBubble("You think YOU can draw??? Nahh fam, I'm better, I'd win");
        
        // Hide speech bubble after 5 seconds
        setTimeout(() => {
            hideWebcamSpeechBubble();
        }, 5000);
    } else {
        // Close paint window
        paintWindow.style.display = 'none';
        document.querySelector('.paint-icon').classList.remove('active');
        
        // Hide speech bubble
        hideWebcamSpeechBubble();
    }
}

// Function to center the paint window
function centerPaintWindow() {
    const paintWindow = document.getElementById('paint-window');
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    
    // Only set position if not maximized
    if (!paintWindow.classList.contains('maximized')) {
        paintWindow.style.left = '50%';
        paintWindow.style.marginLeft = '-400px'; // Half of the window width
        paintWindow.style.top = Math.max(50, (viewportHeight - 550) / 2) + 'px';
    }
}

// Function to create and show UmbralisTalk
function showWebcamSpeechBubble(text) {
    // First, remove any existing UmbralisTalk
    hideWebcamSpeechBubble();
    
    // Find the webcam container for positioning reference
    const webcamContainer = document.querySelector('.webcam-container');
    
    if (!webcamContainer) {
        console.error('Webcam container not found');
        return;
    }
    
    // Switch to a random talking image
    const webcamImage = document.querySelector('.webcam-frame img');
    if (webcamImage) {
        // Store current image in a data attribute to restore later
        webcamImage.dataset.previousSrc = webcamImage.src;
        
        // Choose randomly between talking images
        const talkImages = ['../IMG/streamertalk1.png', '../IMG/streamertalk2.png', '../IMG/streamertalk3.png'];
        const randomIndex = Math.floor(Math.random() * talkImages.length);
        webcamImage.src = talkImages[randomIndex];
    }
    
    // Get position of webcam container
    const rect = webcamContainer.getBoundingClientRect();
    
    // Create new UmbralisTalk at document body level
    let umbralisTalk = document.createElement('div');
    umbralisTalk.className = 'umbralis-talk';
    
    // Position relative to webcam but using fixed positioning
    umbralisTalk.style.position = 'fixed';
    umbralisTalk.style.top = (rect.top + 20) + 'px';
    umbralisTalk.style.left = (rect.right + 20) + 'px';
    umbralisTalk.style.zIndex = '2147483647'; // Maximum possible z-index
    
    // Set UmbralisTalk text
    umbralisTalk.textContent = text;
    
    // Append to body instead of webcam container
    document.body.appendChild(umbralisTalk);
    
    console.log('UmbralisTalk created and shown with talking image');
}

// Function to hide UmbralisTalk
function hideWebcamSpeechBubble() {
    const umbralisTalk = document.querySelector('.umbralis-talk');
    if (umbralisTalk) {
        umbralisTalk.remove(); // Remove completely instead of just hiding
        
        // Restore previous random image
        const webcamImage = document.querySelector('.webcam-frame img');
        if (webcamImage && webcamImage.dataset.previousSrc) {
            webcamImage.src = webcamImage.dataset.previousSrc;
            delete webcamImage.dataset.previousSrc;
        }
    }
}

function closePaint() {
    document.getElementById('paint-window').style.display = 'none';
    document.querySelector('.paint-icon').classList.remove('active');
    hideWebcamSpeechBubble();
}

function minimizePaint() {
    document.getElementById('paint-window').style.display = 'none';
    document.querySelector('.paint-icon').classList.remove('active');
}

function maximizePaint() {
    const paintWindow = document.getElementById('paint-window');
    if (paintWindow.classList.contains('maximized')) {
        paintWindow.classList.remove('maximized');
        // Restore previous position
        paintWindow.style.left = '50%';
        paintWindow.style.marginLeft = '-400px';
        paintWindow.style.top = '100px';
    } else {
        paintWindow.classList.add('maximized');
        // Reset positioning for maximized state
        paintWindow.style.left = '0';
        paintWindow.style.top = '0';
        paintWindow.style.marginLeft = '0';
    }
}

// Make the window draggable
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing paint window drag');
    
    // Make the paint window draggable by its titlebar
    const paintTitlebar = document.querySelector('#paint-window .window-titlebar');
    const paintWindow = document.getElementById('paint-window');
    
    if (!paintTitlebar || !paintWindow) {
        console.error('Paint titlebar or window not found');
        return;
    }
    
    let isDragging = false;
    let offsetX, offsetY;
    
    // Modified mousedown handler for Paint window
    paintTitlebar.addEventListener('mousedown', function(e) {
        if (paintWindow.classList.contains('maximized')) return;
        
        // Bring window to front when clicked
        bringToFront(paintWindow);
        
        isDragging = true;
        
        // Get the actual position rather than computed style
        const rect = paintWindow.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        
        // Direct positioning without transforms
        paintWindow.style.left = (e.clientX - offsetX) + 'px';
        paintWindow.style.top = (e.clientY - offsetY) + 'px';
        paintWindow.style.marginLeft = '0'; // Remove margin-based centering when dragging
    });
    
    document.addEventListener('mouseup', function() {
        isDragging = false;
    });
});

// Add event listener for Companion toggle
document.addEventListener('DOMContentLoaded', function() {
    // Set up companion toggle event listener
    const companionToggle = document.getElementById('companion-toggle');
    if (companionToggle) {
        companionToggle.addEventListener('change', function() {
            if (this.checked) {
                // Companion is being enabled
                showWebcamSpeechBubble("Oh, feeling lonely ain't we? Have another Umbralis");
                
                // Hide speech bubble after 5 seconds
                setTimeout(() => {
                    hideWebcamSpeechBubble();
                }, 5000);
            } else {
                // Companion is being disabled
                hideWebcamSpeechBubble();
            }
        });
    }
});

// Umbralisgotchi application functions
function toggleUmbralisgotchi() {
    const umbralisgotchiWindow = document.getElementById('umbralisgotchi-window');
    
    if (umbralisgotchiWindow.style.display === 'none') {
        // Open Umbralisgotchi window
        umbralisgotchiWindow.style.display = 'flex';
        
        // Center the window
        centerUmbralisgotchiWindow();
        
        // Bring to front when opened
        bringToFront(umbralisgotchiWindow);
        
        // Add active class to icon
        document.querySelector('.umbralisgotchi-icon').classList.add('active');
        
        // Create and show webcam speech bubble
        showWebcamSpeechBubble("Oi, if little Umbralisgotchi dies, you'll be dead too...");
        
        // Hide speech bubble after 5 seconds
        setTimeout(() => {
            hideWebcamSpeechBubble();
        }, 5000);
    } else {
        // Close Umbralisgotchi window
        umbralisgotchiWindow.style.display = 'none';
        document.querySelector('.umbralisgotchi-icon').classList.remove('active');
        
        // Hide speech bubble
        hideWebcamSpeechBubble();
    }
}

// Function to center the Umbralisgotchi window
function centerUmbralisgotchiWindow() {
    const umbralisgotchiWindow = document.getElementById('umbralisgotchi-window');
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    
    // Only set position if not maximized
    if (!umbralisgotchiWindow.classList.contains('maximized')) {
        umbralisgotchiWindow.style.left = '50%';
        umbralisgotchiWindow.style.marginLeft = '-157px'; // Half of the iframe width
        umbralisgotchiWindow.style.top = Math.max(50, (viewportHeight - 321) / 2) + 'px';
    }
}

// Fixed Umbralisgotchi application functions
function closeUmbralisgotchi() {
    const umbralisgotchiWindow = document.getElementById('umbralisgotchi-window');
    umbralisgotchiWindow.style.display = 'none';
    document.querySelector('.umbralisgotchi-icon').classList.remove('active');
    hideWebcamSpeechBubble();
    console.log('Closing Umbralisgotchi');
}

function minimizeUmbralisgotchi() {
    const umbralisgotchiWindow = document.getElementById('umbralisgotchi-window');
    umbralisgotchiWindow.style.display = 'none';
    document.querySelector('.umbralisgotchi-icon').classList.remove('active');
    console.log('Minimizing Umbralisgotchi');
}

function maximizeUmbralisgotchi() {
    const umbralisgotchiWindow = document.getElementById('umbralisgotchi-window');
    console.log('Maximizing/restoring Umbralisgotchi');
    
    if (umbralisgotchiWindow.classList.contains('maximized')) {
        umbralisgotchiWindow.classList.remove('maximized');
        // Restore previous position
        centerUmbralisgotchiWindow();
    } else {
        // Set margin to 0 before adding maximized class to prevent any position issues
        umbralisgotchiWindow.style.marginLeft = '0';
        umbralisgotchiWindow.classList.add('maximized');
        // Reset positioning for maximized state
        umbralisgotchiWindow.style.left = '0';
        umbralisgotchiWindow.style.top = '0';
    }
}

// Improved drag functionality for Umbralisgotchi window
document.addEventListener('DOMContentLoaded', function() {
    // Make the Umbralisgotchi window draggable by its titlebar
    const umbralisgotchiTitlebar = document.querySelector('#umbralisgotchi-window .window-titlebar');
    const umbralisgotchiWindow = document.getElementById('umbralisgotchi-window');
    
    if (!umbralisgotchiTitlebar || !umbralisgotchiWindow) {
        console.error('Umbralisgotchi titlebar or window not found');
        return;
    }
    
    let isDragging = false;
    let offsetX, offsetY;
    
    // Modified mousedown handler for Umbralisgotchi window
    umbralisgotchiTitlebar.addEventListener('mousedown', function(e) {
        if (umbralisgotchiWindow.classList.contains('maximized')) return;
        
        // Bring window to front when clicked
        bringToFront(umbralisgotchiWindow);
        
        // Set margin to 0 FIRST and update position to prevent jump
        const rect = umbralisgotchiWindow.getBoundingClientRect();
        umbralisgotchiWindow.style.left = rect.left + 'px';
        umbralisgotchiWindow.style.top = rect.top + 'px';
        umbralisgotchiWindow.style.marginLeft = '0';
        
        // Now get position again after the style changes
        const updatedRect = umbralisgotchiWindow.getBoundingClientRect();
        
        isDragging = true;
        offsetX = e.clientX - updatedRect.left;
        offsetY = e.clientY - updatedRect.top;
        
        e.preventDefault();
        console.log('Started dragging Umbralisgotchi window');
    });
    
    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        
        // Direct positioning without transforms
        umbralisgotchiWindow.style.left = (e.clientX - offsetX) + 'px';
        umbralisgotchiWindow.style.top = (e.clientY - offsetY) + 'px';
    });
    
    document.addEventListener('mouseup', function() {
        isDragging = false;
    });
});

// Umusic application functions
function toggleUmusic() {
    const umusicWindow = document.getElementById('umusic-window');
    
    if (umusicWindow.style.display === 'none') {
        // Open Umusic window
        umusicWindow.style.display = 'flex';
        
        // Center the window
        centerUmusicWindow();
        
        // Bring to front when opened
        bringToFront(umusicWindow);
        
        // Add active class to icon
        document.querySelector('.umusic-icon').classList.add('active');
        
        // Create and show webcam speech bubble
        showWebcamSpeechBubble("Music? Listen to my playlist fam, it's FIRE STRAIGHT UP LIT");
        
        // Hide speech bubble after 5 seconds
        setTimeout(() => {
            hideWebcamSpeechBubble();
        }, 5000);
    } else {
        // Close Umusic window
        umusicWindow.style.display = 'none';
        document.querySelector('.umusic-icon').classList.remove('active');
        
        // Hide speech bubble
        hideWebcamSpeechBubble();
    }
}

// Function to center the Umusic window
function centerUmusicWindow() {
    const umusicWindow = document.getElementById('umusic-window');
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    
    // Only set position if not maximized
    if (!umusicWindow.classList.contains('maximized')) {
        umusicWindow.style.left = '50%';
        umusicWindow.style.marginLeft = '-300px'; // Half of the 600px width
        
        // Center vertically, accounting for titlebar height
        const totalHeight = 250 + 30; // iframe height + titlebar height
        umusicWindow.style.top = Math.max(20, (viewportHeight - totalHeight) / 2) + 'px';
    }
}

function closeUmusic() {
    document.getElementById('umusic-window').style.display = 'none';
    document.querySelector('.umusic-icon').classList.remove('active');
    hideWebcamSpeechBubble();
}

function minimizeUmusic() {
    document.getElementById('umusic-window').style.display = 'none';
    document.querySelector('.umusic-icon').classList.remove('active');
}

function maximizeUmusic() {
    const umusicWindow = document.getElementById('umusic-window');
    if (umusicWindow.classList.contains('maximized')) {
        umusicWindow.classList.remove('maximized');
        // Restore previous position
        centerUmusicWindow();
    } else {
        // Set margin to 0 before adding maximized class to prevent any position issues
        umusicWindow.style.marginLeft = '0';
        umusicWindow.classList.add('maximized');
        // Reset positioning for maximized state
        umusicWindow.style.left = '0';
        umusicWindow.style.top = '0';
    }
}

// Add draggable functionality for Umusic window
document.addEventListener('DOMContentLoaded', function() {
    // Make the Umusic window draggable by its titlebar
    const umusicTitlebar = document.querySelector('#umusic-window .window-titlebar');
    const umusicWindow = document.getElementById('umusic-window');
    
    if (umusicTitlebar && umusicWindow) {
        let isDragging = false;
        let offsetX, offsetY;
        
        umusicTitlebar.addEventListener('mousedown', function(e) {
            if (umusicWindow.classList.contains('maximized')) return;
            
            // Bring window to front when clicked
            bringToFront(umusicWindow);
            
            // Set margin to 0 FIRST and update position to prevent jump
            const rect = umusicWindow.getBoundingClientRect();
            umusicWindow.style.left = rect.left + 'px';
            umusicWindow.style.top = rect.top + 'px';
            umusicWindow.style.marginLeft = '0';
            
            // Now get position again after the style changes
            const updatedRect = umusicWindow.getBoundingClientRect();
            
            isDragging = true;
            offsetX = e.clientX - updatedRect.left;
            offsetY = e.clientY - updatedRect.top;
            
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            
            // Direct positioning without transforms
            umusicWindow.style.left = (e.clientX - offsetX) + 'px';
            umusicWindow.style.top = (e.clientY - offsetY) + 'px';
        });
        
        document.addEventListener('mouseup', function() {
            isDragging = false;
        });
    }
});

// Test Your Luck application functions
function toggleLuck() {
    const luckWindow = document.getElementById('luck-window');
    
    if (luckWindow.style.display === 'none') {
        // Open Test Your Luck window
        luckWindow.style.display = 'flex';
        
        // Center the window
        centerLuckWindow();
        
        // Bring to front when opened
        bringToFront(luckWindow);
        
        // Add active class to icon
        document.querySelector('.luck-icon').classList.add('active');
        
        // Create and show webcam speech bubble
        showWebcamSpeechBubble("Dont worry fam, may luck come by you fr fr");
        
        // Hide speech bubble after 5 seconds
        setTimeout(() => {
            hideWebcamSpeechBubble();
        }, 5000);
    } else {
        // Close Test Your Luck window
        luckWindow.style.display = 'none';
        document.querySelector('.luck-icon').classList.remove('active');
        
        // Hide speech bubble
        hideWebcamSpeechBubble();
    }
}

// Function to center the Test Your Luck window
function centerLuckWindow() {
    const luckWindow = document.getElementById('luck-window');
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    
    // Only set position if not maximized
    if (!luckWindow.classList.contains('maximized')) {
        luckWindow.style.left = '50%';
        luckWindow.style.marginLeft = '-250px'; // Half of the window width
        luckWindow.style.top = Math.max(50, (viewportHeight - 400) / 2) + 'px';
    }
}

function closeLuck() {
    document.getElementById('luck-window').style.display = 'none';
    document.querySelector('.luck-icon').classList.remove('active');
    hideWebcamSpeechBubble();
}

function minimizeLuck() {
    document.getElementById('luck-window').style.display = 'none';
    document.querySelector('.luck-icon').classList.remove('active');
}

function maximizeLuck() {
    const luckWindow = document.getElementById('luck-window');
    if (luckWindow.classList.contains('maximized')) {
        luckWindow.classList.remove('maximized');
        // Restore previous position
        centerLuckWindow();
    } else {
        // Set margin to 0 before adding maximized class to prevent any position issues
        luckWindow.style.marginLeft = '0';
        luckWindow.classList.add('maximized');
        // Reset positioning for maximized state
        luckWindow.style.left = '0';
        luckWindow.style.top = '0';
    }
}

// Add draggable functionality for Test Your Luck window
document.addEventListener('DOMContentLoaded', function() {
    // Make the Test Your Luck window draggable by its titlebar
    const luckTitlebar = document.querySelector('#luck-window .window-titlebar');
    const luckWindow = document.getElementById('luck-window');
    
    if (luckTitlebar && luckWindow) {
        let isDragging = false;
        let offsetX, offsetY;
        
        luckTitlebar.addEventListener('mousedown', function(e) {
            if (luckWindow.classList.contains('maximized')) return;
            
            // Bring window to front when clicked
            bringToFront(luckWindow);
            
            // Set margin to 0 FIRST and update position to prevent jump
            const rect = luckWindow.getBoundingClientRect();
            luckWindow.style.left = rect.left + 'px';
            luckWindow.style.top = rect.top + 'px';
            luckWindow.style.marginLeft = '0';
            
            // Now get position again after the style changes
            const updatedRect = luckWindow.getBoundingClientRect();
            
            isDragging = true;
            offsetX = e.clientX - updatedRect.left;
            offsetY = e.clientY - updatedRect.top;
            
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            
            // Direct positioning without transforms
            luckWindow.style.left = (e.clientX - offsetX) + 'px';
            luckWindow.style.top = (e.clientY - offsetY) + 'px';
        });
        
        document.addEventListener('mouseup', function() {
            isDragging = false;
        });
    }
});

// Blackjack application functions
function toggleBlackjack() {
    const blackjackWindow = document.getElementById('blackjack-window');
    
    if (blackjackWindow.style.display === 'none') {
        // Open Blackjack window
        blackjackWindow.style.display = 'flex';
        
        // Center the window
        centerBlackjackWindow();
        
        // Bring to front when opened
        bringToFront(blackjackWindow);
        
        // Add active class to icon
        document.querySelector('.blackjack-icon').classList.add('active');
        
        // Create and show webcam speech bubble
        showWebcamSpeechBubble("LETS GOOOO GAMBLINGGG LETS GOOOOOO GAMBLINGGGGGGG!!!!");
        
        // Hide speech bubble after 5 seconds
        setTimeout(() => {
            hideWebcamSpeechBubble();
        }, 5000);
    } else {
        // Close Blackjack window
        blackjackWindow.style.display = 'none';
        document.querySelector('.blackjack-icon').classList.remove('active');
        
        // Hide speech bubble
        hideWebcamSpeechBubble();
    }
}

// Function to center the Blackjack window
function centerBlackjackWindow() {
    const blackjackWindow = document.getElementById('blackjack-window');
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    
    // Only set position if not maximized
    if (!blackjackWindow.classList.contains('maximized')) {
        blackjackWindow.style.left = '50%';
        blackjackWindow.style.marginLeft = '-250px'; // Half of the window width (500px)
        blackjackWindow.style.top = Math.max(50, (viewportHeight - 450) / 2) + 'px';
        
        // Reset any inline size styling
        blackjackWindow.style.width = '';
        blackjackWindow.style.height = '';
    }
}

function closeBlackjack() {
    document.getElementById('blackjack-window').style.display = 'none';
    document.querySelector('.blackjack-icon').classList.remove('active');
    hideWebcamSpeechBubble();
}

function minimizeBlackjack() {
    document.getElementById('blackjack-window').style.display = 'none';
    document.querySelector('.blackjack-icon').classList.remove('active');
}

function maximizeBlackjack() {
    const blackjackWindow = document.getElementById('blackjack-window');
    
    if (blackjackWindow.classList.contains('maximized')) {
        // Restore to previous size
        blackjackWindow.classList.remove('maximized');
        
        // First remove any inline styles that might conflict
        blackjackWindow.style.width = '';
        blackjackWindow.style.height = '';
        
        // Restore previous position
        centerBlackjackWindow();
        
        console.log('Blackjack window restored');
    } else {
        // Store current position values for future restore if needed
        
        // Remove margins before maximizing
        blackjackWindow.style.marginLeft = '0';
        blackjackWindow.classList.add('maximized');
        
        // Set position for maximized state
        blackjackWindow.style.left = '0';
        blackjackWindow.style.top = '0';
        
        console.log('Blackjack window maximized');
    }
    
    // Bring window to front
    bringToFront(blackjackWindow);
}

// Add draggable functionality for Blackjack window
document.addEventListener('DOMContentLoaded', function() {
    // Make the Blackjack window draggable by its titlebar
    const blackjackTitlebar = document.querySelector('#blackjack-window .window-titlebar');
    const blackjackWindow = document.getElementById('blackjack-window');
    
    if (blackjackTitlebar && blackjackWindow) {
        let isDragging = false;
        let offsetX, offsetY;
        
        blackjackTitlebar.addEventListener('mousedown', function(e) {
            if (blackjackWindow.classList.contains('maximized')) return;
            
            // Bring window to front when clicked
            bringToFront(blackjackWindow);
            
            // Set margin to 0 FIRST and update position to prevent jump
            const rect = blackjackWindow.getBoundingClientRect();
            blackjackWindow.style.left = rect.left + 'px';
            blackjackWindow.style.top = rect.top + 'px';
            blackjackWindow.style.marginLeft = '0';
            
            // Now get position again after the style changes
            const updatedRect = blackjackWindow.getBoundingClientRect();
            
            isDragging = true;
            offsetX = e.clientX - updatedRect.left;
            offsetY = e.clientY - updatedRect.top;
            
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            
            // Direct positioning without transforms
            blackjackWindow.style.left = (e.clientX - offsetX) + 'px';
            blackjackWindow.style.top = (e.clientY - offsetY) + 'px';
        });
        
        document.addEventListener('mouseup', function() {
            isDragging = false;
        });
    }
});

// Preload the error sound when the page loads
let errorSound;
document.addEventListener('DOMContentLoaded', function() {
    // Preload the error sound
    errorSound = new Audio('../IMG/error.mp3');
    // Preload by triggering a load
    errorSound.load();
});

// Listen for messages from iframes
window.addEventListener('message', function(event) {
    // Handle the 'unlucky' message from Test Your Luck app
    if (event.data === 'unlucky-close-window') {
        // Show speech bubble
        showWebcamSpeechBubble("Uh oh! Unlucky!! Get rekt nerd xd xd");
        
        // Close the luck window after a delay
        setTimeout(() => {
            closeLuck(); // This is the function that closes the luck window
        }, 2000);
        
        // Wait a moment, then play sound and redirect abruptly
        setTimeout(() => {
            // Make sure sound is ready to play again
            if (errorSound) {
                errorSound.currentTime = 0; // Reset to beginning
                
                // Use a promise to ensure sound starts playing before redirect
                const playPromise = errorSound.play();
                
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        // Sound started playing successfully
                        console.log("Error sound playing");
                    }).catch(error => {
                        // Sound failed to play, log error and continue
                        console.error("Error playing sound:", error);
                    });
                }
            }
            
            // Create a flash effect
            const flashOverlay = document.createElement('div');
            flashOverlay.style.position = 'fixed';
            flashOverlay.style.top = '0';
            flashOverlay.style.left = '0';
            flashOverlay.style.width = '100%';
            flashOverlay.style.height = '100%';
            flashOverlay.style.backgroundColor = 'white';
            flashOverlay.style.zIndex = '9999';
            document.body.appendChild(flashOverlay);
            
            // Give the sound a bit more time to start playing before redirecting
            setTimeout(() => {
                window.location.href = "https://yubelyubel7.github.io/bdeath/";
            }, 300); // Increased from 100ms to 300ms
        }, 3500);
    }
});

// Add this to your script.js file
document.addEventListener('DOMContentLoaded', function() {
    // Array of streamer images
    const streamerImages = [
        '../IMG/streamer1.png',
        '../IMG/streamer2.png', 
        '../IMG/streamer3.png',
        '../IMG/streamer4.png',
        '../IMG/streamer5.png',
        '../IMG/streamer6.png',
        '../IMG/streamer7.png',
        '../IMG/streamer8.png',
        '../IMG/streamer9.png'
    ];
    
    const webcamImage = document.querySelector('.webcam-frame img');
    
    // Function to set a random streamer image
    function setRandomStreamerImage() {
        // Get random index
        const randomIndex = Math.floor(Math.random() * streamerImages.length);
        
        // Update image source
        webcamImage.src = streamerImages[randomIndex];
        
        console.log(`Switched to ${streamerImages[randomIndex]}`);
    }
    
    // Set initial random image
    setRandomStreamerImage();
    
    // Change image randomly every 1-2 seconds
    setInterval(function() {
        // Only change if not speaking (no speech bubble visible)
        if (!document.querySelector('.umbralis-talk')) {
            setRandomStreamerImage();
        }
    }, Math.floor(Math.random() * 1000) + 1000); // Random interval between 1-2 seconds
});