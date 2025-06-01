document.addEventListener('DOMContentLoaded', function() {
    const startupSound = new Audio('IMG/startup.mp3');
    
    const playPromise = startupSound.play();
    
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.log("Autoplay prevented, will play on first interaction:", error);
            
            const playOnInteraction = function() {
                startupSound.play();
                document.removeEventListener('click', playOnInteraction);
                document.removeEventListener('keydown', playOnInteraction);
            };
            
            document.addEventListener('click', playOnInteraction);
            document.addEventListener('keydown', playOnInteraction);
        });
    }
    
    const adminUser = document.querySelector('.xp-user:first-child');
    const umbralisUser = document.querySelector('.xp-user:nth-child(2)');
    const errorImage = document.getElementById('access-error');
    
    adminUser.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        errorImage.style.display = 'block';
        
        const errorSound = new Audio('IMG/error.mp3');
        errorSound.play().catch(err => console.log('Audio error:', err));
    });
    
    errorImage.addEventListener('click', function() {
        this.style.display = 'none';
    });
    
    umbralisUser.addEventListener('click', function() {
        this.style.backgroundColor = '#2a65b5';
        this.style.transform = 'scale(0.98)';
        
        setTimeout(() => {
            window.location.href = 'Homepage/index.html';
        }, 500);
    });
    
    const powerOffBtn = document.querySelector('.xp-login-off');
    if (powerOffBtn) {
        powerOffBtn.addEventListener('click', function() {
            document.body.style.transition = 'background-color 2s';
            document.body.style.backgroundColor = '#000';
            
            const loginMain = document.querySelector('.xp-login-main');
            if (loginMain) {
                loginMain.style.transition = 'opacity 2s';
                loginMain.style.opacity = '0';
            }

            setTimeout(() => {
                document.body.innerHTML = '<div style="background:black; color:white; height:100vh; display:flex; align-items:center; justify-content:center; font-family:monospace;">It is now safe to turn off your computer.</div>';
            }, 2000);
        });
    }
});