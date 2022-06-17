const headerPom = document.querySelector('#pom');
const headerShort = document.querySelector('#short-break-header');
const headerLong = document.querySelector('#long-break-header');
const headerIndicator = document.querySelector('.indicator');

const progressCircle = document.getElementById('circle__progress-bar');
const startStopBtn = document.querySelector('.start-stop-btn');
const currTime = document.querySelector('.timer');

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
    pomodoroCompleted: {
      count: 0,
      date: [],
    },
    pauseTime: 0,
    // setIntervalVal used to clear timer interval
    setIntervalVal: 0,
    countSession: 1,
  };
  localStorage.setItem('settings', JSON.stringify(userSettings));
}
userSettings.currSession = userSettings.pomTime;
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
function setProgress(percent) {
  progressCircle.style.strokeDashoffset =
    circumference - percent * circumference;
}

/**
 * Start, Pause and Restart event listner
 *
 */
startStopBtn.addEventListener('click', function (e) {
  if (startStopBtn.innerText === 'RESTART') {
    startTimer(parseFloat(userSettings.pauseTime, 10), currTime);
    startStopBtn.classList.remove('restart');
    startStopBtn.innerText = 'PAUSE';
  } else if (startStopBtn.innerText === 'PAUSE') {
    pauseTimer();
  } else if (startStopBtn.innerText === 'START') {
    startTimer(userSettings.currSession, currTime);
    startStopBtn.innerText = 'PAUSE';
  }
});

function pauseTimer() {
  clearInterval(userSettings['setIntervalVal']);
  userSettings.pauseTime =
    parseFloat(currTime.innerText.substring(0, 2), 10) +
    parseFloat(currTime.innerText.substring(3), 10) / 60;
  startStopBtn.innerText = 'RESTART';
  startStopBtn.classList.add('restart');
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
  let timeRemainingSeconds =
    userSettings.currSession * 60 * percentTimeRemaining;
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
      currentDate = new Date();
      // --timer decrements timer until it is less than 0
      if (--timeRemainingSeconds < 0) {
        timeRemainingSeconds = 0;
        progressCircle.style.strokeDashoffset = 0;
        startStopBtn.innerText = 'Start';
        if (userSettings.countSession === 7) {
          userSettings.countSession = 0;
          userSettings['pomodoroCompleted'].count += 1;
          userSettings['pomodoroCompleted'].date = [
            currentDate,
            currentDate.getTime(),
          ];
          handleLongBreak();
        } else if (userSettings.countSession % 2 !== 0) {
          handleShortBreak();
        } else if (userSettings.countSession % 2 === 0) {
          handlePom();
        }
        clearInterval(userSettings.setIntervalVal);
        localStorage.setItem('settings', JSON.stringify(userSettings));
      }
      percentTimeRemaining = calcPercent(timeRemainingSeconds);
      return countdown;
    })(),
    1000
  );
}

function setPomodoroTimer() {
  currTime.innerText =
    userSettings.pomTime < 10
      ? '0' + userSettings.pomTime + ':00'
      : userSettings.pomTime + ':00';
  userSettings.currSession = userSettings.pomTime;
}

function handlePom() {
  setPomodoroTimer();
  pomodoroIndicatorStyle();
  userSettings.countSession++;
  // headerPom.classList.add(`active`);
  // headerPom.classList.add(`${userSettings.color}-color`);
  // headerPom.classList.remove(`inactive`);
  // headerShort.classList.remove(`active`);
  // headerShort.classList.remove(`${userSettings.color}-color`);
  // headerLong.classList.remove(`active`);
  // headerLong.classList.remove(`${userSettings.color}-color`);
  // !headerShort.classList.contains('inactive')
  //   ? headerShort.classList.add('inactive')
  //   : '';
  // !headerLong.classList.contains('inactive')
  //   ? headerLong.classList.add('inactive')
  //   : '';
}

function handleShortBreak() {
  userSettings.countSession++;
  setShortBreakTime();
  shortBreakIndicatorStyle();
}

function handleLongBreak() {
  longBreakIndicatorStyle();
  // headerPom.classList.add('inactive');
  // headerLong.classList.remove('inactive');
  // headerPom.classList.remove(`active`);
  // headerPom.classList.remove(`${userSettings.color}-color`);
  // headerLong.classList.add(`active`);
  // headerLong.classList.add(`${userSettings.color}-color`);
  // headerShort.classList.remove(`active`);
  // headerShort.classList.remove(`${userSettings.color}-color`);
  setLongBreakTime();
}

function setShortBreakTime() {
  currTime.innerText =
    userSettings.shortBreak < 10
      ? '0' + userSettings.shortBreak + ':00'
      : userSettings.shortBreak + ':00';
  userSettings.currSession = userSettings.shortBreak;
}

function setLongBreakTime() {
  currTime.innerText =
    userSettings.longBreak < 10
      ? '0' + userSettings.longBreak + ':00'
      : userSettings.longBreak + ':00';
  userSettings.currSession = userSettings.longBreak;
}

/**
 * Move Timer indicator
 */

headerPom.addEventListener('click', function () {
  pomodoroIndicatorStyle();
  setPomodoroTimer();
});

headerShort.addEventListener('click', function () {
  shortBreakIndicatorStyle();
  setShortBreakTime();
});

headerLong.addEventListener('click', function () {
  longBreakIndicatorStyle();
  setLongBreakTime();
});

/**
 * Change style of heading indicator for what session the user is in
 */
function pomodoroIndicatorStyle() {
  headerIndicator.style.left = '2%';
  // headerIndicator.style.backgroundColor = `${userSettings.color}-color`;
  !headerPom.classList.contains('active-session')
    ? headerPom.classList.add('active-session')
    : '';
  headerShort.classList.remove('active-session');
  headerLong.classList.remove('active-session');
}

function shortBreakIndicatorStyle() {
  document.querySelector('.indicator').style.left = 'calc((98%/3))';
  !headerShort.classList.contains('active-session')
    ? headerShort.classList.add('active-session')
    : '';
  headerPom.classList.remove('active-session');
  headerLong.classList.remove('active-session');
}

function longBreakIndicatorStyle() {
  document.querySelector('.indicator').style.left = 'calc(2*(98%/3))';
  !headerLong.classList.contains('active-session')
    ? headerLong.classList.add('active-session')
    : '';
  headerPom.classList.remove('active-session');
  headerShort.classList.remove('active-session');
}
