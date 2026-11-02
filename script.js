// this logs a check in the browser console so we know the JS file is loading properly.
console.log('JavaScript file is linked correctly.');

// this grabs all the important elements from the page so the game logic can control them.
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');
const feedback = document.getElementById('feedback');
const startBtn = document.getElementById('startBtn');
const releaseBtn = document.getElementById('releaseBtn');
const resetBtn = document.getElementById('resetBtn');
// Give each control an individual variable
const powerBreaker = document.getElementById('powerBreaker');
const floodgateControl = document.getElementById('floodgateControl');
const safetyValve = document.getElementById('safetyValve');

const gateElement = document.getElementById('gate1'); // Level 1 will only have one floodgate

// Declare elements for the circuit panel
const circuitPanel = document.getElementById('circuitPanel');
const closeCircuitBtn = document.getElementById('closeCircuitBtn');
const testCircuitBtn = document.getElementById('testCircuitBtn');
// Declare elements for the circuit wires
const wire1 = document.getElementById('wire1');
const wire2 = document.getElementById('wire2');
const wire3 = document.getElementById('wire3');

const circuitFeedback = document.getElementById('circuitFeedback');


const flow = document.getElementById('flow');
const reservoirWater = document.getElementById('reservoirWater');
const villageWater = document.getElementById('villageWater');

// Create and declare game state variables 
let powerOn = false; // The pumping station has no power
let gateOpen = false; // The floodgate starts closed
let valveOpen = true; // The safety valve starts open
let gameStarted = false; // This indicates the player hasn't started the round yet

let gameOver = false; // This indicates the game has not ended yet
let seconds = 60;
let score = 0;
let timerId = null;
let animationId = null;

// Each variable will keep track of how many times its wire has rotated
let wire1Rotation = 0;
let wire2Rotation = 0;
let wire3Rotation = 0;


// Create a function to update the UI
function updateDisplay() {

  // Update the floodgate
  if (gateOpen) {
    gateElement.classList.add('open');
  } else {
    gateElement.classList.remove('open');
  }

  // Update the power breaker indicator
  if (powerOn) {
    powerBreaker.classList.add('active');
  } else {
    powerBreaker.classList.remove('active');
  }

  // Update the floodgate control indicator
  if (gateOpen) {
    floodgateControl.classList.add('active');
  } else {
    floodgateControl.classList.remove('active');
  }

  // Update the safety valve indicator. If the safety valve is closed, it's indicator should turn green.
  if (!valveOpen) {
    safetyValve.classList.add('active');
  } else {
    safetyValve.classList.remove('active');
  }

  // Update the floodgate status
  const gateStatus = document.getElementById('status1');

  if (gateOpen) {
    gateStatus.textContent = 'Floodgate: Open';
  } else {
    gateStatus.textContent = 'Floodgate: Closed';
  }

  // Update the timer and score
  timerDisplay.textContent = seconds;
  scoreDisplay.textContent = score;

  // Enable or disable the controls
  if (gameStarted && !gameOver) { // 
    powerBreaker.disabled = false;
    floodgateControl.disabled = false;
    safetyValve.disabled = false;
    releaseBtn.disabled = false;
  } else { //
    powerBreaker.disabled = true;
    floodgateControl.disabled = true;
    safetyValve.disabled = true;
    releaseBtn.disabled = true;
  }
}



// Create a function that ends the round and shows either a win or lose message depending on the results or what happened.
function finishGame(won, message) {
  gameOver = true;
  clearInterval(timerId);
  feedback.textContent = message;
  if (won) {
    score = 100 + seconds * 2;
    flow.classList.add('running');
    reservoirWater.style.height = '18%';
  }
  updateDisplay();
}


// Create a function for the power breaker
function togglePower() { 
  // The power should already be off but if it's on, clicking the breaker turns it off. 
  // And if it's off clicking the breaker opens the circuit panel.
  if (!gameStarted || gameOver) return;

  if (!powerOn) {
    circuitPanel.hidden = false;
    feedback.textContent = 'Repair the electrical circuit to restore power.';
  } else {
    powerOn = false;
    feedback.textContent = 'Power has been turned off.';
    updateDisplay();
  }
}

// Create a function to close the panel
function closeCircuitPanel() { // It will allow the player to leave the puzzle and come back later
  circuitPanel.hidden = true;
}

// Create the rotation functions
function rotateWire1() {
  console.log('Wire 1 was clicked'); // temporarily here to make sure its being called
  wire1Rotation = (wire1Rotation + 1) % 4; // the remainder is there to loop the rotation state back to 0 so the numbers stay between 0 and 3.
  wire1.querySelector('.wire-shape').style.transform = `rotate(${wire1Rotation * 90}deg)`; // this will take the rotation value, multiply it by 90, and apply the resulting angle to the element.
}

function rotateWire2() {
  wire2Rotation = (wire2Rotation + 1) % 4;
  wire2.querySelector('.wire-shape').style.transform = `rotate(${wire2Rotation * 90}deg)`;
}

function rotateWire3() {
  wire3Rotation = (wire3Rotation + 1) % 4;
  wire3.querySelector('.wire-shape').style.transform = `rotate(${wire3Rotation * 90}deg)`;
  // (3 + 1 = 4) since 4 perfectly goes into 4, there is no remainder. So the value becomes 0. 
  // And since 0 * 90 = 0. It resets back to a 0 degree rotation, its original state.
}

// Create a circuit validation function
function testCircuit() {
  console.log('Wire rotations:', wire1Rotation, wire2Rotation, wire3Rotation); // just for testing
  if (wire1Rotation === 1 && wire2Rotation === 2 && wire3Rotation === 1) {
    powerOn = true;

    circuitFeedback.textContent = 'Circuit complete! Power has been restored.';
    feedback.textContent = 'Power restored! The floodgate controls are operational.';

    circuitPanel.hidden = true;
    updateDisplay();
  } else {
    circuitFeedback.textContent = 'The circuit is incomplete. Check the wire connections.';
  }
}



// Create a function for the floodgate control
function toggleFloodgate() {
  if (!gameStarted || gameOver) return;

  if (!powerOn) { // If the power is off it will display a message
    feedback.textContent = 'The floodgate requires power to operate.';
    return;
  }

  gateOpen = !gateOpen; // The status of the gate becomes true, so the gate is now open.

  if (gateOpen) { // If the gate is open it will display a message
    feedback.textContent = 'The floodgate is now open.';
  } else { // If the gate is open it will display a message
    feedback.textContent = 'The floodgate is now closed.';
  }

  updateDisplay();
}

// Create a function for the safety valve
function toggleSafetyValve() {
  if (!gameStarted || gameOver) return;

  valveOpen = !valveOpen; // The safety valve staus is reversed to false, so the safety valve is now closed

  if (valveOpen) { 
    feedback.textContent = 'The safety valve is open. Pressure is being released.';
  } else {
    feedback.textContent = 'The safety valve is closed. Pressure can build in the system.';
  }

  updateDisplay();
}


// this starts the timer and sets the game into play mode.
function startGame() {
  // if the game already started, don't start another timer.
  if (gameStarted) {
    return;
  }

  // remember that the game is running and disable the start button.
  gameStarted = true;
  startBtn.disabled = true;

  // tell the player what to do and update the buttons.
  feedback.textContent = 'The clock is running! Click the switches in the environment.';
  updateDisplay();

  // this takes one second off the timer every second.
  timerId = setInterval(() => {
    seconds--;

    // when the timer reaches zero, end the game. Otherwise, show the new time.
    if (seconds <= 0) {
      seconds = 0;
      finishGame(false, 'Time is up! Restart to try the puzzle again.');
    } else {
      updateDisplay();
    }
  }, 1000);
}


// this resets everything back to the starting state so the player can try again.

function resetGame() {
  clearInterval(timerId);
  clearTimeout(animationId);

  timerId = null;
  animationId = null;

  powerOn = false;
  gateOpen = false;
  valveOpen = true;

  gameStarted = false;
  gameOver = false;
  seconds = 60;
  score = 0;

  startBtn.disabled = false;
  circuitPanel.hidden = true; // This ensures the circuit panel is hidden whenever the player restarts.

  flow.classList.remove('running');
  reservoirWater.style.height = '76%';
  villageWater.classList.remove('full');

  feedback.textContent = 'Press Start to restore the water supply.';

  
  wire1Rotation = 0;
  wire2Rotation = 0;
  wire3Rotation = 0;

  wire1.querySelector('.wire-shape').style.transform = 'rotate(0deg)';
  wire2.querySelector('.wire-shape').style.transform = 'rotate(0deg)';
  wire3.querySelector('.wire-shape').style.transform = 'rotate(0deg)';

  circuitFeedback.textContent = 'Connect the wires to restore power.';


  updateDisplay();
}


// this connects each switch button to the correct function when the player clicks it.
powerBreaker.addEventListener('click', togglePower);
floodgateControl.addEventListener('click', toggleFloodgate);
safetyValve.addEventListener('click', toggleSafetyValve);

startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', resetGame);
closeCircuitBtn.addEventListener('click', closeCircuitPanel);

// Add event listeners for the wire buttons
wire1.addEventListener('click', rotateWire1);
wire2.addEventListener('click', rotateWire2);
wire3.addEventListener('click', rotateWire3);

testCircuitBtn.addEventListener('click', testCircuit);

// this checks the control statuses when trying to release the water
releaseBtn.addEventListener('click', () => {
  if (!gameStarted || gameOver) return;

  if (!powerOn) { // If the power is off it will display a message
    feedback.textContent = 'The pump cannot operate without power.';
  } else if (!gateOpen) { // If the gate is closed it will display a message
    feedback.textContent = 'The floodgate is closed. Water cannot pass through.';
  } else if (valveOpen) { // If the safety valave is open it will display a message
    feedback.textContent = 'The safety valve is open. Close it to build pressure.';
  } else { // If all else is not true it will display a success message
    finishGame(true, 'Success! Clean water is flowing to the village!');
  }
}); 
/* Basiccaly when the "Release Water" button is pressed it will first check if the power is on, 
if the gate is open, and if the safety valve is closed. */


// this runs once at the start so the game begins in a clean reset state.
resetGame();
