let highestZIndex = 1000;

function bringToFront(window) {
    highestZIndex++;
    window.style.zIndex = highestZIndex;
}

function togglePaint() {
    const paintWindow = document.getElementById('paint-window');
    
    if (paintWindow.style.display === 'none') {
        paintWindow.style.display = 'flex';
        centerPaintWindow();
        bringToFront(paintWindow);
        document.querySelector('.paint-icon').classList.add('active');
        showWebcamSpeechBubble("You think YOU can draw??? Nahh fam, I'm better, I'd win");
        
        setTimeout(() => {
            hideWebcamSpeechBubble();
        }, 5000);
    } else {
        paintWindow.style.display = 'none';
        document.querySelector('.paint-icon').classList.remove('active');
        hideWebcamSpeechBubble();
    }
}

function centerPaintWindow() {
    const paintWindow = document.getElementById('paint-window');
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    
    if (!paintWindow.classList.contains('maximized')) {
        paintWindow.style.left = '50%';
        paintWindow.style.marginLeft = '-400px';
        paintWindow.style.top = Math.max(50, (viewportHeight - 550) / 2) + 'px';
    }
}

function showWebcamSpeechBubble(text) {
    hideWebcamSpeechBubble();
    
    const webcamContainer = document.querySelector('.webcam-container');
    
    if (!webcamContainer) {
        return;
    }
    
    const webcamImage = document.querySelector('.webcam-frame img');
    if (webcamImage) {
        webcamImage.dataset.previousSrc = webcamImage.src;
        
        const talkImages = ['../IMG/streamertalk1.png', '../IMG/streamertalk2.png', '../IMG/streamertalk3.png'];
        const randomIndex = Math.floor(Math.random() * talkImages.length);
        webcamImage.src = talkImages[randomIndex];
    }
    
    const rect = webcamContainer.getBoundingClientRect();
    
    let umbralisTalk = document.createElement('div');
    umbralisTalk.className = 'umbralis-talk';
    
    umbralisTalk.style.position = 'fixed';
    umbralisTalk.style.top = (rect.top + 20) + 'px';
    umbralisTalk.style.left = (rect.right + 20) + 'px';
    umbralisTalk.style.zIndex = '2147483647';
    
    umbralisTalk.textContent = text;
    
    document.body.appendChild(umbralisTalk);
}

function hideWebcamSpeechBubble() {
    const umbralisTalk = document.querySelector('.umbralis-talk');
    if (umbralisTalk) {
        umbralisTalk.remove();
        
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
        paintWindow.style.left = '50%';
        paintWindow.style.marginLeft = '-400px';
        paintWindow.style.top = '100px';
    } else {
        paintWindow.classList.add('maximized');
        paintWindow.style.left = '0';
        paintWindow.style.top = '0';
        paintWindow.style.marginLeft = '0';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const paintTitlebar = document.querySelector('#paint-window .window-titlebar');
    const paintWindow = document.getElementById('paint-window');
    
    if (!paintTitlebar || !paintWindow) {
        return;
    }
    
    let isDragging = false;
    let offsetX, offsetY;
    
    paintTitlebar.addEventListener('mousedown', function(e) {
        if (paintWindow.classList.contains('maximized')) return;
        
        bringToFront(paintWindow);
        
        isDragging = true;
        
        const rect = paintWindow.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        
        paintWindow.style.left = (e.clientX - offsetX) + 'px';
        paintWindow.style.top = (e.clientY - offsetY) + 'px';
        paintWindow.style.marginLeft = '0';
    });
    
    document.addEventListener('mouseup', function() {
        isDragging = false;
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const companionToggle = document.getElementById('companion-toggle');
    if (companionToggle) {
        companionToggle.addEventListener('change', function() {
            if (this.checked) {
                showWebcamSpeechBubble("Oh, feeling lonely ain't we? Have another Umbralis");
                
                setTimeout(() => {
                    hideWebcamSpeechBubble();
                }, 5000);
            } else {
                hideWebcamSpeechBubble();
            }
        });
    }
});

function toggleUmbralisgotchi() {
    const umbralisgotchiWindow = document.getElementById('umbralisgotchi-window');
    
    if (umbralisgotchiWindow.style.display === 'none') {
        umbralisgotchiWindow.style.display = 'flex';
        centerUmbralisgotchiWindow();
        bringToFront(umbralisgotchiWindow);
        document.querySelector('.umbralisgotchi-icon').classList.add('active');
        showWebcamSpeechBubble("Oi, if little Umbralisgotchi dies, you'll be dead too...");
        
        setTimeout(() => {
            hideWebcamSpeechBubble();
        }, 5000);
    } else {
        umbralisgotchiWindow.style.display = 'none';
        document.querySelector('.umbralisgotchi-icon').classList.remove('active');
        hideWebcamSpeechBubble();
    }
}

function centerUmbralisgotchiWindow() {
    const umbralisgotchiWindow = document.getElementById('umbralisgotchi-window');
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    
    if (!umbralisgotchiWindow.classList.contains('maximized')) {
        umbralisgotchiWindow.style.left = '50%';
        umbralisgotchiWindow.style.marginLeft = '-157px';
        umbralisgotchiWindow.style.top = Math.max(50, (viewportHeight - 321) / 2) + 'px';
    }
}

function closeUmbralisgotchi() {
    const umbralisgotchiWindow = document.getElementById('umbralisgotchi-window');
    umbralisgotchiWindow.style.display = 'none';
    document.querySelector('.umbralisgotchi-icon').classList.remove('active');
    hideWebcamSpeechBubble();
}

function minimizeUmbralisgotchi() {
    const umbralisgotchiWindow = document.getElementById('umbralisgotchi-window');
    umbralisgotchiWindow.style.display = 'none';
    document.querySelector('.umbralisgotchi-icon').classList.remove('active');
}

function maximizeUmbralisgotchi() {
    const umbralisgotchiWindow = document.getElementById('umbralisgotchi-window');
    
    if (umbralisgotchiWindow.classList.contains('maximized')) {
        umbralisgotchiWindow.classList.remove('maximized');
        centerUmbralisgotchiWindow();
    } else {
        umbralisgotchiWindow.style.marginLeft = '0';
        umbralisgotchiWindow.classList.add('maximized');
        umbralisgotchiWindow.style.left = '0';
        umbralisgotchiWindow.style.top = '0';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const umbralisgotchiTitlebar = document.querySelector('#umbralisgotchi-window .window-titlebar');
    const umbralisgotchiWindow = document.getElementById('umbralisgotchi-window');
    
    if (!umbralisgotchiTitlebar || !umbralisgotchiWindow) {
        return;
    }
    
    let isDragging = false;
    let offsetX, offsetY;
    
    umbralisgotchiTitlebar.addEventListener('mousedown', function(e) {
        if (umbralisgotchiWindow.classList.contains('maximized')) return;
        
        bringToFront(umbralisgotchiWindow);
        
        const rect = umbralisgotchiWindow.getBoundingClientRect();
        umbralisgotchiWindow.style.left = rect.left + 'px';
        umbralisgotchiWindow.style.top = rect.top + 'px';
        umbralisgotchiWindow.style.marginLeft = '0';
        
        const updatedRect = umbralisgotchiWindow.getBoundingClientRect();
        
        isDragging = true;
        offsetX = e.clientX - updatedRect.left;
        offsetY = e.clientY - updatedRect.top;
        
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        
        umbralisgotchiWindow.style.left = (e.clientX - offsetX) + 'px';
        umbralisgotchiWindow.style.top = (e.clientY - offsetY) + 'px';
    });
    
    document.addEventListener('mouseup', function() {
        isDragging = false;
    });
});

function toggleUmusic() {
    const umusicWindow = document.getElementById('umusic-window');
    
    if (umusicWindow.style.display === 'none') {
        umusicWindow.style.display = 'flex';
        centerUmusicWindow();
        bringToFront(umusicWindow);
        document.querySelector('.umusic-icon').classList.add('active');
        showWebcamSpeechBubble("Music? Listen to my playlist fam, it's FIRE STRAIGHT UP LIT");
        
        setTimeout(() => {
            hideWebcamSpeechBubble();
        }, 5000);
    } else {
        umusicWindow.style.display = 'none';
        document.querySelector('.umusic-icon').classList.remove('active');
        hideWebcamSpeechBubble();
    }
}

function centerUmusicWindow() {
    const umusicWindow = document.getElementById('umusic-window');
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    
    if (!umusicWindow.classList.contains('maximized')) {
        umusicWindow.style.left = '50%';
        umusicWindow.style.marginLeft = '-300px';
        
        const totalHeight = 250 + 30;
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
        centerUmusicWindow();
    } else {
        umusicWindow.style.marginLeft = '0';
        umusicWindow.classList.add('maximized');
        umusicWindow.style.left = '0';
        umusicWindow.style.top = '0';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const umusicTitlebar = document.querySelector('#umusic-window .window-titlebar');
    const umusicWindow = document.getElementById('umusic-window');
    
    if (umusicTitlebar && umusicWindow) {
        let isDragging = false;
        let offsetX, offsetY;
        
        umusicTitlebar.addEventListener('mousedown', function(e) {
            if (umusicWindow.classList.contains('maximized')) return;
            
            bringToFront(umusicWindow);
            
            const rect = umusicWindow.getBoundingClientRect();
            umusicWindow.style.left = rect.left + 'px';
            umusicWindow.style.top = rect.top + 'px';
            umusicWindow.style.marginLeft = '0';
            
            const updatedRect = umusicWindow.getBoundingClientRect();
            
            isDragging = true;
            offsetX = e.clientX - updatedRect.left;
            offsetY = e.clientY - updatedRect.top;
            
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            
            umusicWindow.style.left = (e.clientX - offsetX) + 'px';
            umusicWindow.style.top = (e.clientY - offsetY) + 'px';
        });
        
        document.addEventListener('mouseup', function() {
            isDragging = false;
        });
    }
});

function toggleLuck() {
    const luckWindow = document.getElementById('luck-window');
    
    if (luckWindow.style.display === 'none') {
        luckWindow.style.display = 'flex';
        centerLuckWindow();
        bringToFront(luckWindow);
        document.querySelector('.luck-icon').classList.add('active');
        showWebcamSpeechBubble("Dont worry fam, may luck come by you fr fr");
        
        setTimeout(() => {
            hideWebcamSpeechBubble();
        }, 5000);
    } else {
        luckWindow.style.display = 'none';
        document.querySelector('.luck-icon').classList.remove('active');
        hideWebcamSpeechBubble();
    }
}

function centerLuckWindow() {
    const luckWindow = document.getElementById('luck-window');
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    
    if (!luckWindow.classList.contains('maximized')) {
        luckWindow.style.left = '50%';
        luckWindow.style.marginLeft = '-250px';
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
        centerLuckWindow();
    } else {
        luckWindow.style.marginLeft = '0';
        luckWindow.classList.add('maximized');
        luckWindow.style.left = '0';
        luckWindow.style.top = '0';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const luckTitlebar = document.querySelector('#luck-window .window-titlebar');
    const luckWindow = document.getElementById('luck-window');
    
    if (luckTitlebar && luckWindow) {
        let isDragging = false;
        let offsetX, offsetY;
        
        luckTitlebar.addEventListener('mousedown', function(e) {
            if (luckWindow.classList.contains('maximized')) return;
            
            bringToFront(luckWindow);
            
            const rect = luckWindow.getBoundingClientRect();
            luckWindow.style.left = rect.left + 'px';
            luckWindow.style.top = rect.top + 'px';
            luckWindow.style.marginLeft = '0';
            
            const updatedRect = luckWindow.getBoundingClientRect();
            
            isDragging = true;
            offsetX = e.clientX - updatedRect.left;
            offsetY = e.clientY - updatedRect.top;
            
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            
            luckWindow.style.left = (e.clientX - offsetX) + 'px';
            luckWindow.style.top = (e.clientY - offsetY) + 'px';
        });
        
        document.addEventListener('mouseup', function() {
            isDragging = false;
        });
    }
});

function toggleBlackjack() {
    const blackjackWindow = document.getElementById('blackjack-window');
    
    if (blackjackWindow.style.display === 'none') {
        blackjackWindow.style.display = 'flex';
        centerBlackjackWindow();
        bringToFront(blackjackWindow);
        document.querySelector('.blackjack-icon').classList.add('active');
        showWebcamSpeechBubble("LETS GOOOO GAMBLINGGG LETS GOOOOOO GAMBLINGGGGGGG!!!!");
        
        setTimeout(() => {
            hideWebcamSpeechBubble();
        }, 5000);
    } else {
        blackjackWindow.style.display = 'none';
        document.querySelector('.blackjack-icon').classList.remove('active');
        hideWebcamSpeechBubble();
    }
}

function centerBlackjackWindow() {
    const blackjackWindow = document.getElementById('blackjack-window');
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    
    if (!blackjackWindow.classList.contains('maximized')) {
        blackjackWindow.style.left = '50%';
        blackjackWindow.style.marginLeft = '-250px';
        blackjackWindow.style.top = Math.max(50, (viewportHeight - 450) / 2) + 'px';
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
        blackjackWindow.classList.remove('maximized');
        blackjackWindow.style.width = '';
        blackjackWindow.style.height = '';
        centerBlackjackWindow();
    } else {
        blackjackWindow.style.marginLeft = '0';
        blackjackWindow.classList.add('maximized');
        blackjackWindow.style.left = '0';
        blackjackWindow.style.top = '0';
    }
    
    bringToFront(blackjackWindow);
}

document.addEventListener('DOMContentLoaded', function() {
    const blackjackTitlebar = document.querySelector('#blackjack-window .window-titlebar');
    const blackjackWindow = document.getElementById('blackjack-window');
    
    if (blackjackTitlebar && blackjackWindow) {
        let isDragging = false;
        let offsetX, offsetY;
        
        blackjackTitlebar.addEventListener('mousedown', function(e) {
            if (blackjackWindow.classList.contains('maximized')) return;
            
            bringToFront(blackjackWindow);
            
            const rect = blackjackWindow.getBoundingClientRect();
            blackjackWindow.style.left = rect.left + 'px';
            blackjackWindow.style.top = rect.top + 'px';
            blackjackWindow.style.marginLeft = '0';
            
            const updatedRect = blackjackWindow.getBoundingClientRect();
            
            isDragging = true;
            offsetX = e.clientX - updatedRect.left;
            offsetY = e.clientY - updatedRect.top;
            
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            
            blackjackWindow.style.left = (e.clientX - offsetX) + 'px';
            blackjackWindow.style.top = (e.clientY - offsetY) + 'px';
        });
        
        document.addEventListener('mouseup', function() {
            isDragging = false;
        });
    }
});

let errorSound;
document.addEventListener('DOMContentLoaded', function() {
    errorSound = new Audio('../IMG/error.mp3');
    errorSound.load();
});

window.addEventListener('message', function(event) {
    if (event.data === 'unlucky-close-window') {
        showWebcamSpeechBubble("Uh oh! Unlucky!! Get rekt nerd xd xd");
        
        setTimeout(() => {
            closeLuck();
        }, 2000);
        
        setTimeout(() => {
            if (errorSound) {
                errorSound.currentTime = 0;
                
                const playPromise = errorSound.play();
                
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                    }).catch(error => {
                    });
                }
            }
            
            const flashOverlay = document.createElement('div');
            flashOverlay.style.position = 'fixed';
            flashOverlay.style.top = '0';
            flashOverlay.style.left = '0';
            flashOverlay.style.width = '100%';
            flashOverlay.style.height = '100%';
            flashOverlay.style.backgroundColor = 'white';
            flashOverlay.style.zIndex = '9999';
            document.body.appendChild(flashOverlay);
            
            setTimeout(() => {
                window.location.href = "https://yubelyubel7.github.io/bdeath/";
            }, 300);
        }, 3500);
    }
});

document.addEventListener('DOMContentLoaded', function() {
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
    
    function setRandomStreamerImage() {
        const randomIndex = Math.floor(Math.random() * streamerImages.length);
        webcamImage.src = streamerImages[randomIndex];
    }
    
    setRandomStreamerImage();
    
    setInterval(function() {
        if (!document.querySelector('.umbralis-talk')) {
            setRandomStreamerImage();
        }
    }, Math.floor(Math.random() * 1000) + 1000);
});

// Used Chatgpt and Copilot to help create certain functions, while taking code snippets from older works.