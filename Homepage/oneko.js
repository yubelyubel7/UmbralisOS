// oneko.js: https://github.com/adryd325/oneko.js

(function oneko() {
  const isReducedMotion =
    window.matchMedia(`(prefers-reduced-motion: reduce)`) === true ||
    window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;

  if (isReducedMotion) return;

  const nekoEl = document.createElement("div");

  let nekoPosX = 32;
  let nekoPosY = 32;

  let mousePosX = 0;
  let mousePosY = 0;

  let frameCount = 0;
  let idleTime = 0;
  let idleAnimation = null;
  let idleAnimationFrame = 0;

  const nekoSpeed = 10;
  const catSize = 100; // Size displayed on screen (doubled from original 32)
  const spriteSize = 30; // Original sprite size in the sprite sheet
  const spriteSets = {
    idle: [[-3, -3]],
    alert: [[-7, -3]],
    scratchSelf: [
      [-5, 0],
      [-6, 0],
      [-7, 0],
    ],
    scratchWallN: [
      [0, 0],
      [0, -1],
    ],
    scratchWallS: [
      [-7, -1],
      [-6, -2],
    ],
    scratchWallE: [
      [-2, -2],
      [-2, -3],
    ],
    scratchWallW: [
      [-4, 0],
      [-4, -1],
    ],
    tired: [[-3, -2]],
    sleeping: [
      [-2, 0],
      [-2, -1],
    ],
    N: [
      [-1, -2],
      [-1, -3],
    ],
    NE: [
      [0, -2],
      [0, -3],
    ],
    E: [
      [-3, 0],
      [-3, -1],
    ],
    SE: [
      [-5, -1],
      [-5, -2],
    ],
    S: [
      [-6, -3],
      [-7, -2],
    ],
    SW: [
      [-5, -3],
      [-6, -1],
    ],
    W: [
      [-4, -2],
      [-4, -3],
    ],
    NW: [
      [-1, 0],
      [-1, -1],
    ],
  };

  // Replace the heart animation CSS with speech bubble styling
  const style = document.createElement('style');
  style.innerHTML = `
    .speech-bubble {
      position: absolute;
      background: white;
      border: 2px solid #000;
      border-radius: 12px;
      padding: 8px 12px;
      font-size: 14px;
      font-family: "Comic Sans MS", cursive, sans-serif;
      color: #000;
      z-index: 2147483647;
      box-shadow: 2px 2px 5px rgba(0,0,0,0.2);
      max-width: 150px;
      text-align: center;
      transform-origin: bottom left;
      animation: bubblePop 2s ease-in-out forwards;
    }
    
    .speech-bubble:after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 20px;
      border-width: 10px 10px 0;
      border-style: solid;
      border-color: white transparent;
      display: block;
      width: 0;
    }
    
    .speech-bubble:before {
      content: '';
      position: absolute;
      bottom: -12px;
      left: 18px;
      border-width: 12px 12px 0;
      border-style: solid;
      border-color: #000 transparent;
      display: block;
      width: 0;
    }
    
    @keyframes bubblePop {
      0% { transform: scale(0); opacity: 0; }
      20% { transform: scale(1.1); opacity: 1; }
      30% { transform: scale(1); opacity: 1; }
      80% { transform: scale(1); opacity: 1; }
      100% { transform: scale(0.8); opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  // Replace explodeHearts with showSpeechBubble
  function showSpeechBubble() {
    // Remove any existing speech bubbles first
    const existingBubbles = document.querySelectorAll('.speech-bubble');
    existingBubbles.forEach(bubble => bubble.parentNode.removeChild(bubble));
    
    const parent = nekoEl.parentElement;
    const rect = nekoEl.getBoundingClientRect();
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    
    // Create and position speech bubble
    const bubble = document.createElement('div');
    bubble.className = 'speech-bubble';
    bubble.textContent = "Oi! Stop that!";
    
    // Position above the cat's head
    const bubbleLeft = rect.left + rect.width/4 + scrollLeft;
    const bubbleTop = rect.top - 10 + scrollTop;
    
    bubble.style.left = `${bubbleLeft}px`;
    bubble.style.top = `${bubbleTop}px`;
    
    parent.appendChild(bubble);
    
    // Make the cat scratch (scratchWallN animation)
    idleAnimation = "scratchWallN";
    idleAnimationFrame = 0;
    
    // Save current animation state to restore later
    const originalIdleTime = idleTime;
    idleTime = 0; // Reset idle time to prevent other animations
    
    // Create a scratching animation loop
    const scratchInterval = setInterval(() => {
      idleAnimationFrame++;
      setSprite("scratchWallN", idleAnimationFrame);
      
      // Stop scratching after 1 second
      if (idleAnimationFrame > 10) {
        clearInterval(scratchInterval);
        resetIdleAnimation();
        idleTime = originalIdleTime;
      }
    }, 100);
    
    // Remove the bubble after animation completes
    setTimeout(() => {
      if (bubble.parentNode) {
        parent.removeChild(bubble);
      }
    }, 2000);
  }

  function init() {
    nekoEl.id = "oneko";
    nekoEl.ariaHidden = true;
    nekoEl.style.width = `${catSize}px`;
    nekoEl.style.height = `${catSize}px`;
    nekoEl.style.position = "fixed";
    nekoEl.style.pointerEvents = "auto"; // Changed from "none" to make clickable
    nekoEl.style.imageRendering = "pixelated";
    nekoEl.style.left = `${nekoPosX - catSize/2}px`;
    nekoEl.style.top = `${nekoPosY - catSize/2}px`;
    nekoEl.style.zIndex = 2147483647;
    nekoEl.style.cursor = "pointer"; // Add pointer cursor on hover

    let nekoFile = "./oneko.png"
    const curScript = document.currentScript
    if (curScript && curScript.dataset.cat) {
      nekoFile = curScript.dataset.cat
    }
    nekoEl.style.backgroundImage = `url(${nekoFile})`;
    
    // Scale the background image proportionally to the cat size
    const sheetWidth = 8 * spriteSize * (catSize/spriteSize);  // 8 sprites wide
    const sheetHeight = 4 * spriteSize * (catSize/spriteSize); // 4 sprites tall
    nekoEl.style.backgroundSize = `${sheetWidth}px ${sheetHeight}px`;
    
    document.body.appendChild(nekoEl);

    // Update this line to use the new function
    nekoEl.addEventListener('click', showSpeechBubble);

    document.addEventListener("mousemove", function (event) {
      mousePosX = event.clientX;
      mousePosY = event.clientY;
    });

    window.requestAnimationFrame(onAnimationFrame);
  }

  let lastFrameTimestamp;

  function onAnimationFrame(timestamp) {
    // Stops execution if the neko element is removed from DOM
    if (!nekoEl.isConnected) {
      return;
    }
    if (!lastFrameTimestamp) {
      lastFrameTimestamp = timestamp;
    }
    if (timestamp - lastFrameTimestamp > 100) {
      lastFrameTimestamp = timestamp
      frame()
    }
    window.requestAnimationFrame(onAnimationFrame);
  }

  function setSprite(name, frame) {
    const sprite = spriteSets[name][frame % spriteSets[name].length];
    // Calculate the sprite position using the scale ratio
    const scaleFactor = catSize/spriteSize;
    nekoEl.style.backgroundPosition = `${sprite[0] * spriteSize * scaleFactor}px ${sprite[1] * spriteSize * scaleFactor}px`;
  }

  function resetIdleAnimation() {
    idleAnimation = null;
    idleAnimationFrame = 0;
  }

  function idle() {
    idleTime += 1;

    // every ~ 20 seconds
    if (
      idleTime > 10 &&
      Math.floor(Math.random() * 200) == 0 &&
      idleAnimation == null
    ) {
      let avalibleIdleAnimations = ["sleeping", "scratchSelf"];
      if (nekoPosX < catSize) {
        avalibleIdleAnimations.push("scratchWallW");
      }
      if (nekoPosY < catSize) {
        avalibleIdleAnimations.push("scratchWallN");
      }
      if (nekoPosX > window.innerWidth - catSize) {
        avalibleIdleAnimations.push("scratchWallE");
      }
      if (nekoPosY > window.innerHeight - catSize) {
        avalibleIdleAnimations.push("scratchWallS");
      }
      idleAnimation =
        avalibleIdleAnimations[
          Math.floor(Math.random() * avalibleIdleAnimations.length)
        ];
    }

    switch (idleAnimation) {
      case "sleeping":
        if (idleAnimationFrame < 8) {
          setSprite("tired", 0);
          break;
        }
        setSprite("sleeping", Math.floor(idleAnimationFrame / 4));
        if (idleAnimationFrame > 192) {
          resetIdleAnimation();
        }
        break;
      case "scratchSelf":
        // Slow down the scratchSelf animation by only advancing frames every 3 counts
        // This makes each scratch frame last 3 times longer
        setSprite("scratchSelf", Math.floor(idleAnimationFrame / 3));
        if (idleAnimationFrame > 27) { // 9 frames * 3 = 27 total animation duration
          resetIdleAnimation();
        }
        break;
      case "scratchWallN":
      case "scratchWallS":
      case "scratchWallE":
      case "scratchWallW":
        setSprite(idleAnimation, idleAnimationFrame);
        if (idleAnimationFrame > 9) {
          resetIdleAnimation();
        }
        break;
      default:
        setSprite("idle", 0);
        return;
    }
    idleAnimationFrame += 1;
  }

  function frame() {
    frameCount += 1;
    const diffX = nekoPosX - mousePosX;
    const diffY = nekoPosY - mousePosY;
    const distance = Math.sqrt(diffX ** 2 + diffY ** 2);

    // Change this line to make the cat come closer to the cursor
    // Original: if (distance < nekoSpeed || distance < catSize * 1.5) {
    if (distance < nekoSpeed || distance < catSize * 1.0) { // Reduced from 1.5 to 0.3
      idle();
      return;
    }

    idleAnimation = null;
    idleAnimationFrame = 0;

    if (idleTime > 1) {
      setSprite("alert", 0);
      // count down after being alerted before moving
      idleTime = Math.min(idleTime, 7);
      idleTime -= 1;
      return;
    }

    let direction;
    direction = diffY / distance > 0.5 ? "N" : "";
    direction += diffY / distance < -0.5 ? "S" : "";
    direction += diffX / distance > 0.5 ? "W" : "";
    direction += diffX / distance < -0.5 ? "E" : "";
    setSprite(direction, frameCount);

    nekoPosX -= (diffX / distance) * nekoSpeed;
    nekoPosY -= (diffY / distance) * nekoSpeed;

    nekoPosX = Math.min(Math.max(catSize/2, nekoPosX), window.innerWidth - catSize/2);
    nekoPosY = Math.min(Math.max(catSize/2, nekoPosY), window.innerHeight - catSize/2);

    nekoEl.style.left = `${nekoPosX - catSize/2}px`;
    nekoEl.style.top = `${nekoPosY - catSize/2}px`;
  }

  init();
})();

// Taken from https://github.com/adryd325/oneko.js/, edited and explained with assistance from chatgpt and copilot