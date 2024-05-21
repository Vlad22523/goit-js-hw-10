import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const input = document.querySelector('input#datetime-picker');
const startBtn = document.querySelector('button[type="button"]');
const timeDays = document.querySelector('span[data-days]');
const timeMinutes = document.querySelector('span[data-minutes]');
const timeHours = document.querySelector('span[data-hours]');
const timeSeconds = document.querySelector('span[data-seconds]');

startBtn.addEventListener('click', startTimer);

let userSelectedDate = null;
startBtn.disabled = true;
input.disabled = false;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];

    if (selectedDate.getTime() <= Date.now()) {
      iziToast.error({
        message: 'Please choose a date in the future',
      });
      startBtn.disabled = true;
    } else {
      userSelectedDate = selectedDate.getTime();
      startBtn.disabled = false;
    }
  },
};

flatpickr(input, options);

function startTimer() {
  if (!userSelectedDate) {
    return;
  }
  input.disabled = true;
  const intervalId = setInterval(() => {
    const now = new Date();
    const totalMs = userSelectedDate - now.getTime();
    const time = convertMs(totalMs);
    changeTimes(time);
    startBtn.disabled = true;
    if (totalMs <= 0) {
      clearInterval(intervalId);
      input.disabled = false;
      changeTimes({ days: '00', hours: '00', minutes: '00', seconds: '00' });
      iziToast.success({
        message: 'Countdown finished!',
      });
    }
  }, 1000);
}

function changeTimes({ days, hours, minutes, seconds }) {
  timeDays.textContent = `${days}`;
  timeHours.textContent = `${hours}`;
  timeMinutes.textContent = `${minutes}`;
  timeSeconds.textContent = `${seconds}`;
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = padTime(Math.floor(ms / day));
  // Remaining hours
  const hours = padTime(Math.floor((ms % day) / hour));
  // Remaining minutes
  const minutes = padTime(Math.floor(((ms % day) % hour) / minute));
  // Remaining seconds
  const seconds = padTime(Math.floor((((ms % day) % hour) % minute) / second));

  return { days, hours, minutes, seconds };
}

function padTime(value) {
  return String(value).padStart(2, '0');
}
