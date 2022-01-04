import flatpickr from "flatpickr";
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
    days: document.querySelector('[data-days]'), 
    hours: document.querySelector('[data-hours]'), 
    minutes: document.querySelector('[data-minutes]'), 
    seconds: document.querySelector('[data-seconds]'), 
    startBtn: document.querySelector('[data-start]'), 
}

refs.startBtn.disabled = true;
refs.startBtn.addEventListener('click', onStartBtnClick);

let selectedDate = null;


const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
      console.log(selectedDates[0]);
      selectedDate = selectedDates[0];
            
      if (selectedDate.getTime() > Date.now()) {
        refs.startBtn.disabled = false;
      } else {
        refs.startBtn.disabled = true;
        Notify.failure('Please choose a date in the future');
      }
  },
};

flatpickr('input#datetime-picker', options);

function onStartBtnClick() {
  const intervalId = setInterval(() => {
    const delta = selectedDate.getTime() - Date.now();
    
    if (delta <= 0) {
      clearInterval(intervalId);
      return;
    }
    
    updateLeftTime(convertMs(delta));
  }, 1000);    
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
    return value.toString().padStart(2, '0');
}

function updateLeftTime( { days, hours, minutes, seconds } ) {
    refs.days.textContent = addLeadingZero(days);
    refs.hours.textContent = addLeadingZero(hours);
    refs.minutes.textContent = addLeadingZero(minutes);
    refs.seconds.textContent = addLeadingZero(seconds);
}