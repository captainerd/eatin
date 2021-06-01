

import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'core-js/features/array/find';
import 'core-js/features/array/includes';
import 'core-js/features/number/is-nan';
import React from 'react';
import ReactDOM from 'react-dom';
import Loader from './Loader';
import * as serviceWorker from './serviceWorker';

import axios from 'axios';


if (window.location.protocol !== 'https:') {
//  window.location.replace(`https:${window.location.href.substring(window.location.protocol.length)}`);
}



let user = {};

user = JSON.parse(localStorage.getItem('user'));
window.user = user;

//disabled for cordova, enabled for web production
window.pushState = false;

//domain for cookies GDPR, .domain.com
window.domain = '.www.eatin.gr'

//site name for titles etc.

if (typeof window.sitename !== 'string') window.sitename = 'EatIn.GR '
 


//server of api.


let dev_env = false;


if (!dev_env) {

window.apiurl = 'https://eatin.gr/api/'

//static assets, uploads, images etc. 
window.assetsurl = 'https://eatin.gr'

window.websockets = 'wss://eatin.gr/ws'
}

window.dialog_c = []; //will be dialog collection


if (dev_env) {


window.apiurl = 'http://192.168.9.172/api/'

//static assets, uploads, images etc. 
window.assetsurl = 'http://192.168.9.172'

window.websockets = 'wss://192.168.9.172/ws'


}


if (!window.user) {


    window.user = {
        role: 0,
        email: 'guest@' + window.sitename.toLowerCase(),
        AuthToken: 0,
        lang: 'gr',

    }
    window.localStorage.setItem('user', JSON.stringify(window.user))
}


if (JSON.parse(localStorage.getItem('user')).lang === 'gr') {

    require('./translation/greek.js');
}
if (JSON.parse(localStorage.getItem('user')).lang === 'en' || typeof JSON.parse(localStorage.getItem('user')).lang === 'undefined') {
    require('./translation/english.js');

} else {
    require('./translation/greek.js');
}

document.getElementById('signin_txt').innerText = window.translate('Sign in/Up')

//load google script
function loadScript(src, callback) {
    var s,
        r,
        t;
    r = false;
    s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = src;
    s.async = true;
    s.onload = s.onreadystatechange = function () {
        ////console.log( this.readyState ); //uncomment this line to see which ready states are called.
        if (!r && (!this.readyState || this.readyState == 'complete')) {
            r = true;
            callback();
        }
    };
    t = document.getElementsByTagName('script')[0];
    t.parentNode.insertBefore(s, t);
}

let googlesr = 'https://maps.googleapis.com/maps/api/js?key=&libraries=places&language=gr-el';
loadScript(googlesr, function () {
    //initMap();
});


//axios config
 
let firesr = 'https://www.gstatic.com/firebasejs/7.9.0/firebase-app.js';
loadScript(firesr, function () {
    var firebaseConfig = {

        

        apiKey: "AIzaSyBPYBoJv13DA8QUteQqxCtXPyKeh9-OYXQ",
        authDomain: "eatin-1c85e.firebaseapp.com",
        databaseURL: "https://eatin-1c85e.firebaseio.com",
        projectId: "eatin-1c85e",
        storageBucket: "eatin-1c85e.appspot.com",
        messagingSenderId: "196128031630",
        appId: "1:196128031630:web:576c765ecd3dc0e6901adf",
        measurementId: "G-6V9E17SZMK"
      };
      // Initialize Firebase
      window.firebase.initializeApp(firebaseConfig);


      firesr = 'https://www.gstatic.com/firebasejs/7.9.0/firebase-messaging.js';
      loadScript(firesr, function () {
          window.messaging = window.firebase.messaging();
          window.messaging.usePublicVapidKey("BAF5w0fDAO26bPvj_PcHmE0oA1UOEij7ZoVdc0Q8JXLasR9VW1-8riRmnrSclcSGrGd4f_Pfs_xo9BpC99d0X9g");

          window.messaging.getToken().then((currentToken) => {
            if (currentToken) {
               document.localStorage.setItem('firebase',currentToken);
           //   sendTokenToServer(currentToken);
           //   updateUIForPushEnabled(currentToken);
            } else {
              // Show permission request.
         //     console.log('No Instance ID token available. Request permission to generate one.');
              // Show permission UI.
           //   updateUIForPushPermissionRequired();
            //  setTokenSentToServer(false);
            }
          }).catch((err) => {
       //     console.log('An error occurred while retrieving token. ', err);
           // showToken('Error retrieving Instance ID token. ', err);
          //  setTokenSentToServer(false);
          });

     // console.log('mpike na')
          window.messaging.onTokenRefresh(() => {
              window.messaging.getToken().then((refreshedToken) => {
                document.localStorage.setItem('firebase',refreshedToken);
               // Indicate that the new Instance ID token has not yet been sent to the
               // app server.
              // setTokenSentToServer(false);
               // Send Instance ID token to app server.
             //  console.log(refreshedToken);
               // ...
             }).catch((err) => {
             //  console.log('Unable to retrieve refreshed token ', err);
               //showToken('Unable to retrieve refreshed token ', err);
             });
           });
      });

});




axios.interceptors.request.use(request => {
    ////console.log(request);
    // Edit request config
    return request;
}, error => {
    ////console.log(error);
    return Promise.reject(error);
});

axios.interceptors.response.use(response => {
    // //console.log(response);
    // Edit response config
    return response;
}, error => {
    // //console.log(error);
    return Promise.reject(error);
});



//ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA


serviceWorker.register();





ReactDOM.render(<Loader />, document.getElementById('root'));
//axios.defaults.headers.common['Authorization'] = window.store.getState().user.AuthToken;
//axios.defaults.headers.common['User-Agent'] = navigator.userAgent;

//document.getElementById("preload").style.display = "none";

