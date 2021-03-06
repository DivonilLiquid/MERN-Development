/* eslint-disable */
import axios from 'axios';
import {showAlert} from './alert'

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/login',
      data: {
        email,
        password
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 500);
    }
  } catch (err) {
      // alert(err.response.data.message);
    showAlert('error', err.response.data.message);
  }
};
export const logout = async () => {
  try{
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:3000/api/v1/users/logout',
    });
    if(res.data.status = 'success'){
      showAlert('success', 'Logging Out!');
      location.reload(true);
    }
  }catch (err) {
    showAlert('error', 'Error Logging out! Try again');
  }
}

  
// console.log('Hello from js file');
