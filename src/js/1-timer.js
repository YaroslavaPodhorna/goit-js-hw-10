import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";


const datetimePicker = document.querySelector("#datetime-picker");
const startButton = document.querySelector("[data-start]");
const daysValue = document.querySelector("[data-days]");
const hoursValue = document.querySelector("[data-hours]");
const minutesValue = document.querySelector("[data-minutes]");
const secondsValue = document.querySelector("[data-seconds]");

let userSelectedDate = null;
let timerInterval = null;


const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const now = new Date();
    const selectedDate = selectedDates[0];

    if (selectedDate <= now) {
      iziToast.error({
        title: "Error",
        position: "topRight",
        message: "Please choose a date in the future",
      });
      startButton.disabled = true;
    } else {
      startButton.disabled = false;
      userSelectedDate = selectedDate;
    }
  },
};

flatpickr(datetimePicker, options);

startButton.addEventListener("click", () => {
  if (!userSelectedDate) return;

  startButton.disabled = true;
  datetimePicker.disabled = true;

  timerInterval = setInterval(() => {
    const now = new Date();
    const timeRemaining = userSelectedDate - now;

    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      datetimePicker.disabled = false;
      iziToast.success({
        title: "Done",
        position: "topRight",
        message: "The countdown is over!",
      });
      return;
    }

    updateTimerDisplay(convertMs(timeRemaining));
  }, 1000);
});

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, "0");
}

function updateTimerDisplay({ days, hours, minutes, seconds }) {
  daysValue.textContent = addLeadingZero(days);
  hoursValue.textContent = addLeadingZero(hours);
  minutesValue.textContent = addLeadingZero(minutes);
  secondsValue.textContent = addLeadingZero(seconds);
}
