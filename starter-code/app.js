const progressCircle = document.getElementById('circle__progress-bar');
const startStopBtn = document.getElementById('start-stop-btn');
const currTime = document.querySelector('.timer');
const settingsModal = document.querySelector('.settings');
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

if (userSettings === null) {
  userSettings = {
    pomTime: 1,
    shortBreak: 5,
    longBreak: 30,
    fontFamily: 'Kumbh Sans',
    fontId: 'kumbh',
    color: 'coral',
  };
}
setSettings(userSettings);
applySettingStyles(userSettings);
// Get radius from progress circle
let radius = progressCircle.r.baseVal.value;
// Calculate the circumference = 2πr
let circumference = 2 * Math.PI * radius;
progressCircle.style.strokeDasharray = circumference;
/**
 *  The radius will give us the precise length of the circles border or stroke and assign it
 * to the stroke-dasharray of the circle and take out the dash-array and offset from the id
 * assigned to the progress circle
 */

// Set progress on scale between 0 and 100
const setProgress = function (precent, timer) {
  progressCircle.style.strokeDashoffset =
    circumference - (precent / 100) * circumference;
};

startStopBtn.addEventListener('click', function () {
  console.log(userSettings.pomTime);
  console.log(currTime);
  startTimer(userSettings.pomTime, currTime);
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

document.getElementById('btn__apply').addEventListener('click', function (e) {
  e.preventDefault();
  userSettings.pomTime = pomTimeInput.value;
  userSettings.shortBreak = shortTimeInput.value;
  userSettings.longBreak = longTimeInput.value;
  userSettings.color = checkColorSelected().attributes.id.value;
  checkFontSelected();
  localStorage.setItem('settings', JSON.stringify(userSettings));
  applySettingStyles(userSettings);
  console.log(userSettings);
  settingsModal.classList.add('hidden');
  overlay.classList.add('hidden');
});

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

function applySettingStyles({ fontFamily, color }) {
  document.querySelector('.wrapper').style.fontFamily = fontFamily;
  progressCircle.style.stroke = color;
  document.querySelector('.active').style.backgroundColor = color;
}

function startTimer(duration, display) {
  let timer = duration * 60;
  let minutes = duration;
  let ratio = (minutes / timer) * 100;
  let percent = 100;
  let seconds = 0;

  setInterval(function () {
    percent -= ratio;
    setProgress(percent);
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    display.textContent = minutes + ':' + seconds;

    // --timer decrements timer until it is less than 0
    if (--timer < 0) {
      clearInterval();
      timer = 0;
      progressCircle.style.strokeDashoffset = 0;
      // timer = duration; // uncomment this line to reset timer automatically after reaching 0
    }
  }, 1000);
}