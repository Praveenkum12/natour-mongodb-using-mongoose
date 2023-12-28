import axios from 'axios';
import { showAlert } from './alert';

export const logout = async function () {
  try {
    await axios('/api/v1/users/logout');
    // this helps to reload the server
    location.reload(true);
    location.assign('/');
  } catch (err) {
    showAlert('error', 'Error on Logging out. Try again!');
  }
};
