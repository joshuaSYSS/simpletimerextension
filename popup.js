let timer;
let timeLeft = 0;
let isRunning = false;

const timerElement = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');
const alarmSound = document.getElementById('alarmSound');

function updateDisplay() {
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;
    timerElement.textContent = `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
}

function padZero(num) {
    return num.toString().padStart(2, '0');
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        timer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplay();
            } else {
                stopTimer();
                alarmSound.play();
                chrome.notifications.create(
                    "name-for-notification",
                    {
                      type: "basic",
                      iconUrl: chrome.runtime.getURL("image.png"),
                      title: "This is a notification",
                      message: "hello there!",
                    },
                    function () {}
                  );
            }
        }, 1000);
    }
}

function stopTimer() {
    isRunning = false;
    clearInterval(timer);
}

function resetTimer() {
    stopTimer();
    timeLeft = 0;
    updateDisplay();
}

startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);

timerElement.addEventListener('input', () => {
    const [hours, minutes, seconds] = timerElement.textContent.split(':').map(Number);
    timeLeft = hours * 3600 + minutes * 60 + seconds;
});

timerElement.addEventListener('blur', updateDisplay);

updateDisplay();