// Simple Live2D control script
document.addEventListener('DOMContentLoaded', function() {
  // Get the companion toggle button
  const companionToggle = document.getElementById('companion-toggle');
  
  // Only initialize Live2D when button is clicked
  companionToggle.addEventListener('change', function() {
    if (this.checked) {
      // Button is checked, show/initialize Live2D
      showCompanion();
    } else {
      // Button is unchecked, hide Live2D
      hideCompanion();
    }
  });
  
  // Immediately hide any Live2D widget that might have appeared
  hideAnyExistingWidget();
});

function showCompanion() {
  console.log("Showing companion");
  
  // Check if widget already exists
  let widget = document.getElementById('live2d-widget');
  
  if (!widget) {
    // First time - initialize the Live2D widget
    console.log("Initializing Live2D for the first time");
    
    L2Dwidget.init({
      "model": {
        "jsonPath": "./koharu/model.json"
      },
      "display": {
        "position": "right",
        "width": 300,
        "height": 400,
        "hOffset": 0,
        "vOffset": 0
      },
      "mobile": {
        "show": true,
        "scale": 1.2
      }
    });
    
    // Give it a moment to initialize
    setTimeout(function() {
      widget = document.getElementById('live2d-widget');
      if (widget) {
        widget.style.display = 'block';
        widget.style.opacity = '1';
      } else {
        console.error("Widget not created after initialization");
      }
    }, 500);
  } else {
    // Widget exists, just show it
    widget.style.display = 'block';
    widget.style.opacity = '1';
  }
}

function hideCompanion() {
  console.log("Hiding companion");
  const widget = document.getElementById('live2d-widget');
  if (widget) {
    widget.style.opacity = '0';
    setTimeout(function() {
      widget.style.display = 'none';
    }, 300);
  }
}

function hideAnyExistingWidget() {
  // This ensures any automatically created widget is hidden initially
  setTimeout(function() {
    const widget = document.getElementById('live2d-widget');
    if (widget) {
      widget.style.display = 'none';
      widget.style.opacity = '0';
      console.log("Initial widget found and hidden");
    }
  }, 100);
}

// Taken from https://gist.github.com/win3zz/e2e8f9d43035d8378e35065ec4c5dd97