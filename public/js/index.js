import '@babel/polyfill';
import { login } from './logIn';
import { logout } from './logout';
import { updateSetting } from './updateSettings';
import { bookTour } from './stripe';
import { signup } from './signup';
import { showAlert } from './alert';

document.querySelector('.form-login')?.addEventListener('submit', function (e) {
  e.preventDefault();
  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;
  login(email, password);
});

document
  .querySelector('.form-signup')
  ?.addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.querySelector('#username').value;
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    const confirmPassword = document.querySelector('#confirm-password').value;
    signup(username, email, password, confirmPassword);
  });

document.querySelector('#log-out')?.addEventListener('click', function () {
  logout();
});

document
  .querySelector('.form-user-data')
  ?.addEventListener('submit', function (e) {
    e.preventDefault();
    // for multipart form data
    const form = new FormData();
    form.append('name', document.querySelector('#name').value);
    form.append('email', document.querySelector('#email').value);
    form.append('photo', document.querySelector('#photo').files[0]);

    updateSetting(form, 'data');
  });

document
  .querySelector('.form-user-password')
  ?.addEventListener('submit', function (e) {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';
    const passwordCurrent = document.querySelector('#password-current').value;
    const password = document.querySelector('#password').value;
    const passwordConfirm = document.querySelector('#password-confirm').value;
    updateSetting({ passwordCurrent, password, passwordConfirm }, 'password');
    document.querySelector('.btn--save-password').textContent = 'Save Password';
    document.querySelector('#password-current').value = '';
    document.querySelector('#password').value = '';
    document.querySelector('#password-confirm').value = '';
  });

document.getElementById('book-tour')?.addEventListener('click', function (e) {
  e.target.textContent = 'Processing...';
  const { tourId } = e.target.dataset;
  bookTour(tourId);
});

const alertMessage = document.querySelector('body').dataset.alert;
if (alert) showAlert('sucsess', alertMessage, 20);
