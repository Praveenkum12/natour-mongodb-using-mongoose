import axios from 'axios';
import { showAlert } from './alert';

export const signup = async function (name, email, password, passwordConfirm) {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: {
        name,
        email,
        password,
        passwordConfirm,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Sign up succcessfully!!');
      window.setTimeout(function () {
        location.assign('/');
      }, 100);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
