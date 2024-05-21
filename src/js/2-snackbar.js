import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');

form.addEventListener('submit', createPromise);

function createPromise(event) {
  event.preventDefault();

  const delayInput = event.target.elements.delay;
  const stateInput = event.target.elements.state;
  const delay = parseInt(delayInput.value);
  const state = stateInput.value;

  containsPromise(delay, state)
    .then(result => {
      iziToast.success({
        title: 'Success',
        message: `Fulfilled after ${result} ms`,
      });
    })
    .catch(error => {
      iziToast.error({
        title: 'Error',
        message: `Rejected after ${error} ms`,
      });
    });
}

function containsPromise(delay, state) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });
}
