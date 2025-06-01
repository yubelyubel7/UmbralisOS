// blackjack
// last updated: 10/8/2024

const debug = true; // to debug log messages
const suits = ["C", "D", "H", "S"];
const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K"];
const ACE_VALUE = 11;

const hand = new Map();
const aceCount = new Map();
const cardSfx = new Audio("assets/sfx/new_card.mp3");
const gameOverSfx = new Audio("assets/sfx/card_game_over.wav");

var hiddenCard;
var deck = [];
var canHit = true;
var canStay = true;
var firstTime = true;
var sounds = true;
var animationDelay = 500;

var hitBtn;
var stayBtn;
var soundsBtn;
var playAgainBtn;

// Variables to control sound
let soundsEnabled = false;
let soundsInitialized = false;
let audioContext = null;

window.onload = function()
{
    // Get original onload code
    const originalOnload = window.onload;
    
    // Set up the sounds button to initialize audio on first click
    document.getElementById("sounds-btn").addEventListener("click", function() {
        // Initialize sounds on first click
        initializeSounds();
        
        // Toggle sounds on/off
        soundsEnabled = !soundsEnabled;
        this.style.color = soundsEnabled ? "yellow" : "white";
        
        // Play a test sound if enabled
        if (soundsEnabled) {
            playSound("sounds/click.mp3");
        }
    });
    
    hitBtn = document.getElementById("hit-btn");
    stayBtn = document.getElementById("stay-btn");
    soundsBtn = document.getElementById("sounds-btn");
    playAgainBtn = document.getElementById("play-again-btn");

    hitBtn.addEventListener("click", hit);
    stayBtn.addEventListener("click", stay);
    soundsBtn.addEventListener("click", toggleSound);
    playAgainBtn.addEventListener("click", playAgain);
    playAgainBtn.style.visibility = "hidden";

    // Create hand total display elements
    createHandTotalElements();
    
    startGame();
}

// Create elements to display hand totals
function createHandTotalElements() {
    // Player total
    let playerTotal = document.createElement("div");
    playerTotal.id = "player-total";
    playerTotal.className = "hand-total";
    document.getElementById("player-hand").after(playerTotal);
    
    // Dealer total
    let dealerTotal = document.createElement("div");
    dealerTotal.id = "dealer-total";
    dealerTotal.className = "hand-total";
    document.getElementById("dealer-hand").after(dealerTotal);
    
    // Initialize with zero values
    playerTotal.innerText = "Player: 0";
    dealerTotal.innerText = "Dealer: 0 + ?";
}

// Update the displayed hand totals
function updateHandTotals() {
    document.getElementById("player-total").innerText = "Player: " + getHand("player");
    
    // Only show real dealer total after the hidden card is revealed
    if (canHit) {
        // Show only the visible card's value during gameplay
        let visibleValue = hand.get("dealer");
        document.getElementById("dealer-total").innerText = "Dealer: " + visibleValue + " + ?";
    } else {
        document.getElementById("dealer-total").innerText = "Dealer: " + getHand("dealer");
    }
}

async function startGame()
{
    let ms = firstTime ? 0 : animationDelay;
    
    // Reset the hand values
    hand.set("dealer", 0);
    hand.set("player", 0);
    aceCount.set("dealer", 0);
    aceCount.set("player", 0);
    
    // Update display with zeroes
    updateHandTotals();

    buildDeck();
    shuffleDeck();
    
    // Note: These lines are now redundant but kept for clarity
    // hand.set("dealer", 0);
    // hand.set("player", 0);
    // aceCount.set("dealer", 0);
    // aceCount.set("player", 0);

    addHiddenCard();
    await wait(ms);
    addCardTo("dealer");
    await wait(ms);

    addCardTo("player");
    await wait(ms);
    addCardTo("player");
    
    canHit = true;
    canStay = true;
    firstTime = false;
}

function buildDeck()
{
    for(i = 0; i < suits.length; i++)
    {
        for(j = 0; j < values.length; j++)
        {
            deck.push(values[j] + "-" + suits[i]);
        }
    }
}

function shuffleDeck()
{
    let currentIndex = deck.length;

    while (currentIndex != 0)
    {

        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // swapping cards
        [deck[currentIndex], deck[randomIndex]] = [deck[randomIndex], deck[currentIndex]];
    }
}

function addCardTo(subject)
{
    let card = deck.pop();
    let value = getCardValue(card);
    
    addValueToHand(value, subject);
    spawnCard(createCard(card), subject);
    updateHandTotals(); // Update totals after adding a card
}

function addHiddenCard()
{
    hiddenCard = document.createElement("img");
    hiddenCard.src = "assets/cards/hidden.png";

    spawnCard(hiddenCard, "dealer");
}

function spawnCard(card, subject)
{
    playSound(cardSfx);
    document.getElementById(subject+"-hand").appendChild(card);
}

function createCard(card)
{
    let img = document.createElement("img");

    img.src = "assets/cards/" + card + ".png";

    return img;
}

function addValueToHand(value, subject)
{
    let currentValue = hand.get(subject);
    let newValue = currentValue + value;

    hand.set(subject, newValue);

    log("adding " + value + " to " + subject);
    
    if(value == ACE_VALUE)
    {
        adjustAceCount(1, subject);
    }
}

async function hit()
{
    if(!canHit)
    {
        return;
    }

    addCardTo("player");

    if(getHand("player") > 21)
    {
        await wait(animationDelay);
        await stay();
    }
}

async function stay()
{
    if(!canStay)
    {
        return;
    }

    canStay = false;
    canHit = false;

    while (hand.get("dealer") < 17)
    {
        await addCardTo("dealer");
        await wait(animationDelay * 1.5);
    }

    await wait(animationDelay * 0.25);
    revealCard();
    await wait(animationDelay);
    checkWinner();
}

function getHand(subject)
{
    while(hand.get(subject) > 21 && aceCount.get(subject) > 0)
    {
        addValueToHand(-10, subject);
        adjustAceCount(-1, subject);
    }

    let value = hand.get(subject);
    return value;
}

function revealCard()
{
    let card = deck.pop();
    hiddenCard.src = createCard(card).src;

    addValueToHand(getCardValue(card), "dealer");
    playSound(cardSfx);
    updateHandTotals(); // Update totals after revealing hidden card
}

function checkWinner()
{
    let status = document.getElementById("game-status");
    let dealer = getHand("dealer");
    let player = getHand("player");

    if (player > 21)
    {
        status.innerText = "Dealer won!\nPlayer busted";
    }
    else if (dealer > 21)
    {
        status.innerText = "Player won!\nDealer busted";
    }
    else if (player === dealer)
    {
        status.innerText = "Draw!";
    }
    else
    {
        status.innerText = player > dealer ? "Player won!" : "Dealer won!";
    }

    playSound(gameOverSfx);
    endGame();
}

function endGame()
{
    playAgainBtn.style.visibility = "visible";
    playAgainBtn.focus(); 
    hitBtn.style.visibility = "hidden";
    stayBtn.style.visibility = "hidden";
}


function clearHands()
{
    document.getElementById("dealer-hand").innerHTML = '';
    document.getElementById("player-hand").innerHTML = '';
    
    // Remove the old total elements as well
    const playerTotal = document.getElementById("player-total");
    const dealerTotal = document.getElementById("dealer-total");
    if (playerTotal) playerTotal.remove();
    if (dealerTotal) dealerTotal.remove();
    
    // Re-create the total elements since they were cleared
    createHandTotalElements();
}

function playAgain()
{
    playAgainBtn.style.visibility = "hidden";
    hitBtn.style.visibility = "visible";
    stayBtn.style.visibility = "visible";
    document.getElementById("game-status").innerText = "";
    clearHands();
    startGame();
}

function adjustAceCount(increment, subject)
{
    aceCount.set(subject, aceCount.get(subject) + increment);
}

function getCardValue(card)
{
    let data = card.split("-");

    if(isNaN(data[0]))
    {
        if(data[0] == "A")
        {
            return ACE_VALUE;
        }

        return 10;
    }

    return parseInt(data[0]);
}

async function wait(ms)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

// used to cache images and display them faster
function preloadImages() {
    suits.forEach(suit => {
        values.forEach(value =>{
            let img = new Image();
            img.src = "assets/cards/" + value + "-" + suit + ".png";
        });
    });
}

function toggleSound()
{
    sounds = !sounds;
    
    soundsBtn.style.opacity = sounds ? 1 : 0.5;
}

function initializeSounds() {
    if (soundsInitialized) return;
    
    // Create audio context only after user interaction
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        soundsInitialized = true;
    } catch (e) {
        console.error("Web Audio API not supported:", e);
    }
}

// Function to play a sound only if enabled
function playSound(soundFile) {
    if (!soundsEnabled || !soundsInitialized) return;
    
    // Rest of your sound playing code
    const audio = new Audio(soundFile);
    audio.play().catch(e => console.error("Error playing sound:", e));
}

function log(message)
{
    if(!debug)
    {
        return;
    }

    console.log(message);
}

//taken from https://github.com/lucasdcampos/blackjack, altered, edited and explained with assistance from chatgpt