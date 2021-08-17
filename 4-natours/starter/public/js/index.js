/* eslint-disable */
import '@babel/polyfill';
import {login, logout} from './login';
import {displayMap} from './mapbox';


console.log('Hello from parcel');

//DOm elements
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form');
const logoutBtn = document.querySelector('.nav__el--logout');
if(mapBox){
    const locations = JSON.parse(mapBox.dataset.locations);
    displayMap(locations);
}

if(logoutBtn) logoutBtn.addEventListener('click',logout);


if(loginForm){
    loginForm.addEventListener('submit',el => {
        el.preventDefault();
        //values
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        console.log(email,password);
        login(email, password);
    });
};
