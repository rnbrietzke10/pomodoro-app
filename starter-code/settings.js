const settingsModal = document.querySelector('.settings');
const applySettingsBtn = document.getElementById('btn__apply');
const overlay = document.querySelector('#overlay');
const pomTimeInput = document.querySelector('#pomodoro');
const shortTimeInput = document.querySelector('#short-break');
const longTimeInput = document.querySelector('#long-break');

// Event listener to open settings modal
document.querySelector('#settings-icon').addEventListener('click', function () {
  settingsModal.classList.remove('hidden');
  overlay.classList.remove('hidden');
  pauseTimer();
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
  settingsModal.classList.add('hidden');
  overlay.classList.add('hidden');
  setPomodoroTimer();
  startStopBtn.innerText = 'START';
  startStopBtn.classList.remove('restart');
});

function setHexColor(colorSelected) {
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
  currTime.textContent =
    userSettings.currSession < 10
      ? '0' + userSettings.currSession + ':00'
      : userSettings.currSession + ':00';
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
  const currFont = checkFontSelected();
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
    try {
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
        default:
          break;
      }
    } catch (err) {}
  });

function applySettingStyles({ fontFamily, hexColor, color }) {
  document.querySelector('.wrapper').style.fontFamily = fontFamily;
  progressCircle.style.stroke = hexColor;
  document.querySelector('.active').classList.add(`${color}-color`);
}
