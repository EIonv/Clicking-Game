// Improved variable naming and extraction of repeated logic into functions
var canvasElement = document.getElementById("canvas");
var ctx = canvasElement.getContext("2d");

// Use template literals for dynamic values
const canvasSize = `${window.innerWidth}px ${window.innerHeight}px`;

canvasElement.width = window.innerWidth;
canvasElement.height = window.innerHeight;

let fillColor = "red"; // Initial color
let tempColor = "blue"; // Temporary color for the effect
let multiplier = 1;

function loadUserClicksFromLocalStorage() {
  const clicksCounter = document.getElementById("clicks");
  const clicks = localStorage.getItem("clicks");

  if (clicks) {
    clicksCounter.innerHTML = clicks;
  } else {
    clicksCounter.innerHTML = 0;
  }
}

function saveUserClicksToLocalStorage() {
  const clicksCounter = document.getElementById("clicks");
  localStorage.setItem("clicks", clicksCounter.innerHTML);
  multiplier = parseInt(document.getElementById("multiplier").innerHTML);
}

function saveUserMultiplierToLocalStorage() {
  const multiplierCounter = document.getElementById("multiplier");
  localStorage.setItem("multiplier", multiplierCounter.innerHTML);
}

function loadUserMultiplierFromLocalStorage() {
  const multiplierCounter = document.getElementById("multiplier");
  const multiplier = localStorage.getItem("multiplier");

  if (multiplier) {
    multiplierCounter.innerHTML = multiplier;
  } else {
    multiplierCounter.innerHTML = 1;
  }
  console.log(multiplierCounter.innerHTML);
}

function saveUserCostToLocalStorage() {
  const multiplierCost = document.getElementById("multiplier_cost");
  localStorage.setItem("multiplier_cost", multiplierCost.innerHTML);
}

function loadUserCostFromLocalStorage() {
  const multiplierCost = document.getElementById("multiplier_cost");
  const cost = localStorage.getItem("multiplier_cost");

  if (cost) {
    multiplierCost.innerHTML = cost;
  }
}

function drawCircle(fillColor) {
  ctx.fillStyle = fillColor;
  ctx.beginPath();
  ctx.arc(canvasElement.width / 2, canvasElement.height / 2, 100, 0, 2 * Math.PI);
  ctx.fill();
  ctx.closePath();
}

function innerAnimate(animationEnd) {
  if (!animationEnd) {
    canvasElement.style.transform = "translateX(-5px)";
    setTimeout(() => {
      canvasElement.style.transform = "";
      innerAnimate(); // Keep the effect going
    }, 50);
  }
}

function animateCircle() {
  let animationEnd = false;
  innerAnimate(animationEnd);
}

function isPointInCircle(x, y) {
  const centerX = canvasElement.width / 2;
  const centerY = canvasElement.height / 2;
  const radius = 100; // Radius of the circle

  // Calculate the distance from the center of the circle to the clicked point
  const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));

  // Check if the distance is less than or equal to the radius
  return distance <= radius;
}

function drawDotOnPoint(x, y) {
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.closePath();
}

function buyMultiplier() {
  const clicksCounter = document.getElementById("clicks");
  const multiplierCounter = document.getElementById("multiplier");
  const multiplierCost = document.getElementById("multiplier_cost");

  if (parseInt(multiplierCost.innerHTML) === 0) {
    multiplierCost.innerHTML = localStorage.getItem("multiplier_cost") || 10;
  }

  // if multiplier cost is less than or equal to the clicks
  if (parseInt(clicksCounter.innerHTML) < parseInt(multiplierCost.innerHTML)) {
    alert("Not enough clicks to purchase the multiplier.");
    return;
  }

  const clicks = parseInt(clicksCounter.innerHTML);
  const cost = parseInt(multiplierCost.innerHTML);

  if (clicks >= cost) {
    // Update the clicks counter to reflect the cost deducted
    clicksCounter.innerHTML = clicks - cost;
    // Update the multiplier counter
    multiplierCounter.innerHTML = 1 + document.getElementById("multiplier").innerHTML / 1.0;
    // Double the cost for the next purchase
    multiplierCost.innerHTML = cost * 2;

    multiplier = parseInt(multiplierCounter.innerHTML); // Update the multiplier variable
    console.log(multiplier);
  }

  // save the multiplier to local storage
  saveUserMultiplierToLocalStorage();
  saveUserCostToLocalStorage();
}

drawCircle(fillColor);
loadUserClicksFromLocalStorage();
loadUserMultiplierFromLocalStorage();
loadUserCostFromLocalStorage();

// if user clicks the buy button
document.getElementById("buy").addEventListener("click", buyMultiplier);

canvasElement.addEventListener("click", (event) => {
  const rect = canvasElement.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  // Only proceed if the click is within the circle
  if (isPointInCircle(x, y)) {
    fillColor = tempColor;
    drawCircle(fillColor);
    drawDotOnPoint(x, y);

    animateCircle();

    // Increment the clicks counter
    const clicksCounter = document.getElementById("clicks");

    clicksCounter.innerHTML = parseInt(clicksCounter.innerHTML) + multiplier;

    // Save the user clicks to local storage
    saveUserClicksToLocalStorage();
    saveUserMultiplierToLocalStorage();
    saveUserCostToLocalStorage();
  }
});
