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
    animationId = setTimeout(() => villageWater.classList.add('full'), 2400);
  }
  updateDisplay();
}


// Create a function for the power breaker
function togglePower() {
  if (!gameStarted || gameOver) return; // If the game has started and the game isn't over yet return something

  powerOn = !powerOn; 
  // This will reverse the current value of powerOn. If power is off, clicking the breaker turns it on. 
  // Clicking it again turns it off.

  if (powerOn) { // If the power is on it will display a confirmation message
    feedback.textContent = 'Power restored to the pumping station!';
  } else { // If power is off it will display a message indicating that it is off
    feedback.textContent = 'Power has been turned off.';
  }

  updateDisplay();
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
  gate1Open = false;
  gate2Open = false;
  powerReady = false;
  gameStarted = false;
  gameOver = false;
  seconds = 60;
  score = 0;
  startBtn.disabled = false;
  switches.forEach(button => button.classList.remove('active'));
  flow.classList.remove('running');
  reservoirWater.style.height = '76%';
  villageWater.classList.remove('full');
  feedback.textContent = 'Press Start to begin. Then click the three switches in the scene.';
  updateDisplay();
}

// this connects each switch button to the correct function when the player clicks it.
powerBreaker.addEventListener('click', togglePower);
floodgateControl.addEventListener('click', toggleFloodgate);
safetyValve.addEventListener('click', toggleSafetyValve);

startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', resetGame);

// this checks whether both gates are open before letting the player release the water.
releaseBtn.addEventListener('click', () => {
  if (!gameStarted || gameOver) return;
  if (gate1Open && gate2Open) {
    finishGame(true, 'Success! Clean water is flowing to the village!');
  } else {
    finishGame(false, 'The water was blocked by a closed gate. Restart and try another sequence.');
  }
});

// this runs once at the start so the game begins in a clean reset state.
resetGame();
