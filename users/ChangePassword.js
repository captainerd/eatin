
import React, { Suspense, lazy, useState, useEffect } from 'react';
import smallloader from '../images/smallloader.gif';


import Input from '../CompoViews/Input';
import { UseAxios } from '../functions/Functions';
import axios from 'axios'


function clearCookie(name, domain, path) {
    try {
        function Get_Cookie(check_name) {
            // first we'll split this cookie up into name/value pairs
            // note: document.cookie only returns name=value, not the other components
            var a_all_cookies = document.cookie.split(';'),
                a_temp_cookie = '',
                cookie_name = '',
                cookie_value = '',
                b_cookie_found = false;

            for (let i = 0; i < a_all_cookies.length; i++) {
                // now we'll split apart each name=value pair
                a_temp_cookie = a_all_cookies[i].split('=');

                // and trim left/right whitespace while we're at it
                cookie_name = a_temp_cookie[0].replace(/^\s+|\s+$/g, '');

                // if the extracted name matches passed check_name
                if (cookie_name == check_name) {
                    b_cookie_found = true;
                    // we need to handle case where cookie has no value but exists (no = sign, that is):
                    if (a_temp_cookie.length > 1) {
                        cookie_value = unescape(a_temp_cookie[1].replace(/^\s+|\s+$/g, ''));
                    }
                    // note that in cases where cookie is initialized but no value, null is returned
                    return cookie_value;
                    break;
                }
                a_temp_cookie = null;
                cookie_name = '';
            }
            if (!b_cookie_found) {
                return null;
            }
        }
        if (Get_Cookie(name)) {
            var domain = domain || document.domain;
            var path = path || "/";
            document.cookie = name + "=; expires=" + new Date + "; domain=" + domain + "; path=" + path;
        }
    }
    catch (err) { }
};


function sendToast(msg) {
    var notification = document.querySelector('.mdl-js-snackbar');
    notification.MaterialSnackbar.showSnackbar(
        {
            message: msg
        }
    );

}
const InputVal = (id) => {
    if (document.getElementById(id) != null) {
        return document.getElementById(id).value;
    } else {
        return '';
    }
}

function ChangePassword(props) {
    const translate = props.translate
    const [isinvalid, setIsinvalid] = useState({
        password: false,
        password_new: false,
    });
    const [loader, setLoader] = useState(false);

    //    document.getElementById('preload').style.display = 'none';




    useEffect(() => {




        window.componentHandler.upgradeAllRegistered();
    });
    const saveChanges = async (e) => {
        e.preventDefault();
        setLoader(true);
        let founderror = false;
        if (InputVal('password_old').length < 6) {
            isinvalid.password = '';
            founderror = true;
        } else {
            isinvalid.password = false;
        }

        if (InputVal('password_new').length < 6) {
            isinvalid.password_new = '';
            founderror = true;
        } else {
            isinvalid.password_new = false;
        }

        if (!founderror) {
            let myOb = {
                oldpassword: InputVal('password_old'),
                newpassword: InputVal('password_new'),
            }

            let res = await UseAxios(myOb, 'users/change_password');

            if (typeof res !== 'undefined') {
                if (res.status === 'ok') {
                    let user = JSON.parse(window.localStorage.getItem('user'));

                    user.AuthToken = res.AuthToken;

                    window.localStorage.setItem('user', JSON.stringify(user));
                    sendToast(translate('Password changed'));

                }
                if (res.status === 'wrong-password') {
                    sendToast(translate('Old password is wrong'));

                }
            } else {
                sendToast(translate('Error'));
            }
        }
        setIsinvalid({ ...isinvalid });
        setLoader(false);

    }
    const AnalCookie = (e) => {


        if (e.target.checked === true) {

            window.localStorage.setItem('analytics', true);

        } else {
            window.localStorage.removeItem('analytics');

            clearCookie('_gat', window.domain, '/');
            clearCookie('_ga', window.domain, '/');
            clearCookie('_gid', window.domain, '/');
            //clearCookie('_gid', '192.168.9.142', '/');

        }

    }


    return (
        <>



            <div style={{ padding: '3px', margin: '3px', minWidth: '340px' }} className=" mdl-cell--4-col mdl-cell--7-col-tablet mdl-shadow--2dp">

                <div className="mdl-layout__header-row mdl-card__supporting-text">
                    <h4>{translate('Security')}</h4></div>

                <Input text={translate('Your old password')} id="password_old" icon="lock_open" isinvalid={isinvalid.password} type="passwordWithEye" />

                <Input text={translate('Your password')} id="password_new" icon="lock_open" isinvalid={isinvalid.password_new} type="passwordWithEye" />

                <div style={{ height: '80px', paddingLeft: '30px', paddingTop: '30px' }}>
                    <Input type="checkbox" id="eatmypss" onClick={(e) => AnalCookie(e)} defaultChecked={window.localStorage.getItem('analytics')} text={translate('Statistic cookies')} />

                </div>


                <div className="mdl-card__actions mdl-card--border">
                    <div className="center-align">
                        <button type="submit" disabled={loader} onClick={saveChanges} className="mdl-button mdl-js-ripple-effect mdl-js-button  mdl-button--raised mdl-button--colored">
                            {!loader && <>{translate('Save')}</>}
                            <img className="center-align" style={{ padding: '0', alignself: 'center', width: '30px', height: '30px', display: loader ? 'inline-block' : 'none' }} src={smallloader} alt={"loading..."} />

                        </button></div>
                </div>

            </div>




        </>


    );
}


export default ChangePassword;