document.addEventListener('DOMContentLoaded', function() {
    const luckButton = document.getElementById('luckButton');
    const resultMessage = document.getElementById('resultMessage');
    
    const luckyMessages = [
        "Umbralis is awesome",
        "Did you know that 2+2=4?",
        "Always remember the incident of 06/06/2024....",
        "Umbralis is a tiefling. The best there is.",
        "Did you know? Now you know!",
        "Yo, can you give me some cash? I need to buy some new watches.",
        "Blah blah blah, something cool, blah blah blah",
        "Did you know about the Arowana? Often known as the asian dragon fish, it is a symbol of good luck and prosperity in many cultures.",
        "Have you heard about The Zacharies? World leading company in the field of everything.",
        "Have you tried playing Powins? Amazing game honestly, you should fund their kickstarter."
    ];
    
    luckButton.addEventListener('click', function() {
        const randomChance = Math.random();
        
        if (randomChance <= 0.1) {
            resultMessage.textContent = "BAD LUCK! CRASHING YOUR PC NOW! LOL!";
            resultMessage.style.color = "red";
            
            window.parent.postMessage('unlucky-close-window', '*');
            
        } else {
            const randomIndex = Math.floor(Math.random() * luckyMessages.length);
            resultMessage.textContent = luckyMessages[randomIndex];
            resultMessage.style.color = "green";
        }
    });
});