const progressCircle = document.getElementById('circle__progress-bar');
const startStopBtn = document.querySelector('.start-stop-btn');
const currTime = document.querySelector('.timer');
const settingsModal = document.querySelector('.settings');
const applySettingsBtn = document.getElementById('btn__apply');
const overlay = document.querySelector('#overlay');
const pomTimeInput = document.querySelector('#pomodoro');
const shortTimeInput = document.querySelector('#short-break');
const longTimeInput = document.querySelector('#long-break');
const coral = document.querySelector('#coral');
const cyan = document.querySelector('#cyan');
const purple = document.querySelector('#purple');
const kumbh = document.querySelector('#kumbh');
const roboto = document.querySelector('#roboto');
const mono = document.querySelector('#mono');

let userSettings = JSON.parse(localStorage.getItem('settings'));

const hexCoral = '#f87070';
const hexPurple = '#D881F8';
const hexCyan = '#70f3f8';

if (userSettings === null) {
  userSettings = {
    pomTime: 25,
    shortBreak: 5,
    longBreak: 30,
    currSession: 25,
    fontFamily: 'Kumbh Sans',
    fontId: 'kumbh',
    color: 'coral',
    hexColor: hexCoral,
    pomodoroCompleted: [
      {
        count: 0,
        date: '',
      },
    ],
    pauseTime: 0,
    // setIntervalVal used to clear timer interval
    setIntervalVal: 0,
    countSession: 1,
  };
  localStorage.setItem('settings', JSON.stringify(userSettings));
}
setSettings(userSettings);
applySettingStyles(userSettings);

// Get radius from progress circle
let radius = progressCircle.r.baseVal.value;
// Calculate the circumference = 2πr
let circumference = Math.round(2 * Math.PI * radius);
progressCircle.style.strokeDasharray = circumference;

/**
 *  The radius will give us the precise length of the circles border or stroke and assign it
 * to the stroke-dasharray of the circle and take out the dash-array and offset from the id
 * assigned to the progress circle
 */

// Set progress on scale between 0 and 100
const setProgress = function (percent) {
  progressCircle.style.strokeDashoffset =
    circumference - percent * circumference;
};

/**
 * Start, Pause and Restart event listner
 *
 */
startStopBtn.addEventListener('click', function (e) {
  console.log(e);
  if (startStopBtn.innerText === 'PAUSE') {
    clearInterval(userSettings['setIntervalVal']);
    userSettings.pauseTime =
      parseFloat(currTime.innerText.substring(0, 2), 10) +
      parseFloat(currTime.innerText.substring(3), 10) / 60;
    startStopBtn.innerText = 'RESTART';
    startStopBtn.classList.add('restart');
  } else if (startStopBtn.innerText === 'RESTART') {
    startTimer(parseFloat(userSettings.pauseTime, 10), currTime);
    startStopBtn.classList.remove('restart');
    startStopBtn.innerText = 'Pause';
  } else if (startStopBtn.innerText === 'START') {
    if (parseInt(currTime.innerText) === parseInt(userSettings.pomTime)) {
      document.querySelector('.pom').classList.add('active');
      document.querySelector('.short').classList.remove('active');
      startTimer(userSettings.pomTime, currTime);
    } else if (
      parseInt(currTime.innerText) === parseInt(userSettings.shortBreak)
    ) {
      document.querySelector('.pom').classList.remove('active');
      document.querySelector('.short').classList.add('active');
      startTimer(userSettings.shortBreak, currTime);
    } else if (
      parseInt(currTime.innerText) === parseInt(userSettings.longBreak)
    ) {
      document.querySelector('.short').classList.remove('active');
      document.querySelector('.long').classList.add('active');
      startTimer(userSettings.longBreak, currTime);
    }
    startStopBtn.innerText = 'Pause';
  }
});

// Event listener to open settings modal
document.querySelector('#settings-icon').addEventListener('click', function () {
  settingsModal.classList.remove('hidden');
  overlay.classList.remove('hidden');
});

// Event lisnter to close settings modal using the x at the top right corner
document
  .querySelector('.settings__close-icon')
  .addEventListener('click', function () {
    settingsModal.classList.add('hidden');
    overlay.classList.add('hidden');
  });

// Event listener for applying settings

applySettingsBtn.addEventListener('click', function (e) {
  e.preventDefault();
  userSettings.pomTime = pomTimeInput.value;
  userSettings.shortBreak = shortTimeInput.value;
  userSettings.longBreak = longTimeInput.value;
  userSettings.color = checkColorSelected().attributes.id.value;
  userSettings.hexColor = setHexColor(checkColorSelected());
  checkFontSelected();
  localStorage.setItem('settings', JSON.stringify(userSettings));
  applySettingStyles(userSettings);
  console.log(userSettings);
  settingsModal.classList.add('hidden');
  overlay.classList.add('hidden');
});

function setHexColor(colorSelected) {
  console.log(colorSelected.attributes.id.value);
  if (colorSelected.attributes.id.value === 'coral') {
    return hexCoral;
  } else if (colorSelected.attributes.id.value === 'cyan') {
    return hexCyan;
  } else {
    return hexPurple;
  }
}

function setSettings() {
  pomTimeInput.value = userSettings['pomTime'];
  shortTimeInput.value = userSettings['shortBreak'];
  longTimeInput.value = userSettings['longBreak'];
  document
    .getElementById(`${userSettings['fontId']}`)
    .classList.add('font-selected');
  document
    .getElementById(`${userSettings['color']}`)
    .classList.add('color-selected');
}

function checkColorSelected() {
  if (coral.classList.contains('color-selected')) {
    return coral;
  } else if (cyan.classList.contains('color-selected')) {
    return cyan;
  } else {
    return purple;
  }
}

function checkFontSelected() {
  if (kumbh.classList.contains('font-selected')) {
    userSettings.fontFamily = 'Kumbh Sans';
    userSettings.fontId = 'kumbh';
    return kumbh;
  } else if (roboto.classList.contains('font-selected')) {
    userSettings.fontFamily = 'Roboto Slab';
    userSettings.fontId = 'roboto';
    return roboto;
  } else {
    userSettings.fontFamily = 'Space Mono';
    userSettings.fontId = 'mono';
    return mono;
  }
}

// Event listener for font selection
document.querySelector('.font').addEventListener('click', function (e) {
  console.log(e.target.attributes.id.value);
  const currFont = checkFontSelected();
  console.log(currFont);
  currFont.classList.remove('font-selected');
  document
    .querySelector(`#${e.target.attributes.id.value}`)
    .classList.add('font-selected');
});

// Event listner to listen for what color is clicked
document.querySelector('.color').addEventListener('click', function (e) {
  const currColor = checkColorSelected();
  currColor.classList.remove('color-selected');
  document
    .querySelector(`#${e.target.attributes.id.value}`)
    .classList.add('color-selected');
});

// Change time value with arrow on number input
document
  .querySelector('.settings__time')
  .addEventListener('click', function (e) {
    const value = e.target.attributes.id.value;
    switch (value) {
      case 'pom-increase':
        pomTimeInput.value = parseInt(pomTimeInput.value) + 1;
        break;
      case 'short-increase':
        shortTimeInput.value = parseInt(shortTimeInput.value) + 1;
        break;
      case 'long-increase':
        longTimeInput.value = parseInt(longTimeInput.value) + 1;
        break;
      case 'pom-decrease':
        pomTimeInput.value = parseInt(pomTimeInput.value) - 1;
        break;
      case 'short-decrease':
        shortTimeInput.value = parseInt(shortTimeInput.value) - 1;
        break;
      case 'long-decrease':
        longTimeInput.value = parseInt(longTimeInput.value) - 1;
        break;
    }
  });

function applySettingStyles({ fontFamily, hexColor }) {
  document.querySelector('.wrapper').style.fontFamily = fontFamily;
  progressCircle.style.stroke = hexColor;
  document.querySelector('.active').style.backgroundColor = hexColor;
}

function calcPercent(timeRemainingSeconds) {
  /**
   * Turn time remaining in to seconds
   * See what percentage of the total time
   * Use that percentage to determine the percentage of the progress circle should be remaining
   */
  const totalTime = userSettings.currSession * 60;
  const percentRemaining = timeRemainingSeconds / totalTime;
  return percentRemaining;
}

function startTimer(duration, display) {
  // Set up initial precentage based on duration (Pomtimer, break, or long break)
  let percentTimeRemaining = calcPercent(duration * 60);
  // ⬇️ Need to figure out how to make this dynamic for all time intervals ⬇️
  let timeRemainingSeconds = 1500 * percentTimeRemaining;
  // Set Interval
  userSettings['setIntervalVal'] = setInterval(
    (function countdown() {
      setProgress(percentTimeRemaining);
      // Set time Remaining in minutes
      minutes = parseInt(timeRemainingSeconds / 60, 10);
      seconds = parseInt(timeRemainingSeconds % 60, 10);

      minutes = minutes < 10 ? '0' + minutes : minutes;
      seconds = seconds < 10 ? '0' + seconds : seconds;

      display.textContent = minutes + ':' + seconds;

      // --timer decrements timer until it is less than 0
      if (--timeRemainingSeconds < 0) {
        timeRemainingSeconds = 0;
        progressCircle.style.strokeDashoffset = 0;
        startStopBtn.innerText = 'Start';
        if (userSettings.countSession % 2 !== 0) {
          currTime.innerText = userSettings.shortBreak + ':00';
        } else if (userSettings.countSession === 7) {
          currTime.innerText = userSettings.longBreak + ':00';
        }
        clearInterval(userSettings.setIntervalVal);
      }
      percentTimeRemaining = calcPercent(timeRemainingSeconds);
      return countdown;
    })(),
    1000
  );
}

function addRemoveActiveClass(timerType) {}
