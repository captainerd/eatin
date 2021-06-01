import axios from 'axios';
export function sendToast(msg) {
    var notification = document.querySelector('.mdl-js-snackbar');
    notification.MaterialSnackbar.showSnackbar(
        {
            message: msg
        }
    );

}
export function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
export const InputVal = (id) => {

    if (document.getElementById(id) !== null) {
        return document.getElementById(id).value;
    } else {
        return '';
    }
}
export function update_User(user) {


    localStorage.setItem("user", JSON.stringify(user)); //local storage


}
export function validateEmail(email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; //eslint-disable-line
    return re.test(String(email).toLowerCase());
}

var toExecute = [];
var oldTimer = '';
var resdata = '';
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const UseAxios = async (what, url, site_url = window.apiurl) => {
    let method = 'POST'
    if (what === null) method = 'GET'

    if (typeof what === 'object' && what !== null) {
        what.AuthToken = JSON.parse(window.localStorage.getItem('user')).AuthToken;
        what.lang = JSON.parse(window.localStorage.getItem('user')).lang;
        if (typeof what.append === 'function') {
            what.append('AuthToken', JSON.parse(window.localStorage.getItem('user')).AuthToken);
            what.append('lang', JSON.parse(window.localStorage.getItem('user')).lang);
        }
    } else {
        what = {
            [what]: 1,
            AuthToken: JSON.parse(window.localStorage.getItem('user')).AuthToken,
            lang: JSON.parse(window.localStorage.getItem('user')).lang,
        }
    }

    if (method === 'GET') {
        what = null;
    }


    return axios({
        url: site_url + url + '',
        method: method,

        headers: {
            'Content-type': 'application/x-www-form-urlencoded',



        },
        data: what
    }).then(response => {
        if (response.data.error) {
            //alert(response.data.error);
        }
        let dt = response.data;
        return dt;


    }).catch(error => {
 
        if (typeof error.response !== 'undefined') {
            if (typeof error.response.data !== 'undefined'

                && error.response.data.statusText === 'Unauthorized'
                || error.response.data.error === 'logout'
            ) {
               
                if (window.pushState) window.history.pushState({}, null, '/');
                window.localStorage.removeItem('user');

                  window.location = '/';
            }


            return error.response;

        } else {
            if (error.name === 'Error') {
                window.launchError();
            }
            return error;
        }



    });

};
export function removeClass(element, classToRemove) {
    let classesString;
    classesString = element.className || "";
    if (classesString.indexOf(classToRemove) !== -1) {
        // classToRemove is present
        element.className = element.className.replace(new RegExp('(?:^|\\s)' + classToRemove + '(?:\\s|$)'), ' '); // from http://stackoverflow.com/a/2155786
    }
}
export function addClass(element, name) {
    let arr;

    arr = element.className.split(" ");
    if (arr.indexOf(name) == -1) {
        element.className += " " + name;
    }
} 