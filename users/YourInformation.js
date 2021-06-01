
import React, { Suspense, lazy, useState, useEffect } from 'react';
import smallloader from '../images/smallloader.gif';


import Input from '../CompoViews/Input';



import { sendToast, validateEmail, InputVal, isNumeric, UseAxios } from '../functions/Functions';



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
    t = document.getElementsByTagName('head')[0];
    t.parentNode.insertBefore(s, t);
}

function YourInformation(props) {
    const translate = props.translate;
    const [fstate, setFstate] = useState({
        errors: {
            phone: false,
            firstname: false,
            lastname: false,
            email: false,
            phoneconfirm: false,
        },
        info: {},
        confirmphone: false,
        default: {
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
        }

    });
    const [loader, setLoader] = useState(false);

    //    document.getElementById('preload').style.display = 'none';


    const InitInfo = async () => {
        let get = {
            get: 1,
        }
        let la = await UseAxios({ do: get }, 'users/user_information');

        if (typeof la === 'undefined') {
            return;
        }
        if (la.status !== 'ok') {
            sendToast(translate('Error'));
            return;
        }
        if (typeof la.info.phone_unconfirmed !== 'undefined') {
            if (la.info.phone_unconfirmed !== la.info.phone && la.info.phone.substr(3,100) !== la.info.phone_unconfirmed) {
                fstate.confirmphone = true;
            }
        }
        if (typeof la.info.first_name !== 'undefined') {
            fstate.default.first_name = la.info.first_name;
        }
        if (typeof la.info.last_name !== 'undefined') {
            fstate.default.last_name = la.info.last_name;
        }
        if (typeof la.info.email !== 'undefined') {
            fstate.default.email = la.info.email;
        }
        if (typeof la.info.phone !== 'undefined') {
            fstate.default.phone = la.info.phone;
        }
        if (la.info.email !== window.user.email) {
            //    props.user.email = la.info.email;
            //            window.store.dispatch(updateUser(props.user));
        }
        setFstate({ ...fstate });
    }
    useEffect(() => {

        InitInfo();

        return () => {
            // //console.log("componentWillUnmount");

        };
    }, []);
    useEffect(() => {





        window.componentHandler.upgradeAllRegistered();
    });
    const saveChanges = async (e) => {
        e.preventDefault();
        setLoader(true);
        let founderror = false;

        let grph = InputVal('phone');

        if (grph.substr(0, 2) === '69') {
            document.getElementById('phone').value = '+30' + grph;
        }




        if (InputVal('phone').replace('+', '00').replace('-', '').length < 10 || !isNumeric(InputVal('phone').replace('+', '00').replace('-', ''))) {
            fstate.errors.phone = ' ';
            founderror = true;
        } else {
            fstate.errors.phone = false;
            fstate.info.phone = InputVal('phone').replace('-', '');
        }

        if (fstate.default.phone !== fstate.info.phone && InputVal('confirm_phone') === '') {
            fstate.confirmphone = true;
        
            window.isloaded2 = false;
            //  console.log('fortonei ena')
          


            loadScript('https://www.gstatic.com/firebasejs/7.9.0/firebase-auth.js', function () {
                window.isloaded2 = true;
                checkloaded()


            });

            // if (window.isloaded1 && window.isloaded2) checkloaded()
            UseAxios({ phone: fstate.info.phone }, 'users/set_phone');
            founderror = true;
        }




        if (InputVal('firstname').length < 3) {
            fstate.errors.firstname = '';
            founderror = true;
        } else {
            fstate.errors.firstname = false;
            fstate.info.firstname = InputVal('firstname');
        }
        if (InputVal('lastname').length < 3) {
            fstate.errors.lastname = '';
            founderror = true;
        } else {
            fstate.errors.lastname = false;
            fstate.info.lastname = InputVal('lastname');
        }
        if (!validateEmail(InputVal('email'))) {
            fstate.errors.email = '';
            founderror = true;
        } else {
            fstate.errors.email = false;
            fstate.info.email = InputVal('email');
        }
        if (!founderror && fstate.confirmphone == true && typeof window.confirmationResult !== 'undefined') {


            window.confirmationResult.confirm(InputVal('confirm_phone')).then(function (result) {




            }).catch(function (error) {
                //   setisinavlid(translate('Wrong pin code'))
                fstate.errors.confirmphone = '';
                sendToast(translate('Wrong pin code'))
                founderror = true;
            });



            fstate.info.phonepin = InputVal('confirm_phone');
            fstate.info.verify = window.verifycode;

        }
        if (!founderror) {

            let la = await UseAxios({ do: fstate.info }, 'users/user_information');
            if (la !== undefined) {

                if (la.status == 'email-exists') {
                    sendToast(translate('Email address already used'));
                }
                if (la.status == 'ok') {

                    if (typeof la.confirm_phone !== 'undefined') {
                        if (la.confirm_phone === '1') {




                            //   sendToast(translate('Check your SMS to get the PIN'));
                        } else {
                            document.getElementById('recaptcha_cnt').innerHTML = '';
                        }
                        if (la.confirm_phone === '0') {
                            fstate.confirmphone = false;

                        }
                    }
                    if (typeof la.confirm_email !== 'undefined') {
                        sendToast(translate('Check your email to confirm'));
                    }
                    sendToast(translate('Your information has been updated'));
                    if (typeof la.wrong_pin !== 'undefined') {
                        //          fstate.errors.confirmphone = '';

                    }
                    if (typeof la.new_phone !== 'undefined') {
                        fstate.default.phone = la.new_phone;

                    }

                } else {
                    sendToast(translate('Error'));
                }
            }
        }

        setFstate({ ...fstate });
        setLoader(false);

    }

    function checkloaded() {


        if ( window.isloaded2) {
            sendToast(translate('Please wait, we are going to send you an SMS....'))
           
            SendSMS(InputVal('phone'))

        }

    }
    function SendSMS(phone) {
        // phone  = phone.replace('0030')
        //  console.log(phone)
        /*global firebase, a*/
        /*eslint no-undef: "error"*/
        if (!window.recaptchaVerifier) window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha_cnt', {
            'size': 'invisible',
            'callback': function (recapchaToken) {
            }
        });
        if (!window.recaptchaVerifier) window.recaptchaVerifier.render().then(function (widgetId) {
            window.recaptchaWidgetId = widgetId;
        });



        window.firebase.auth().signInWithPhoneNumber(phone, window.recaptchaVerifier)
            .then(function (confirmationResult) {
                // SMS sent. Prompt user to type the code from the message, then sign the
                // user in with confirmationResult.confirm(code).
                //    console.log(confirmationResult.verificationId)
                window.confirmationResult = confirmationResult;
                window.verifycode = confirmationResult.verificationId
                fstate.confirmphone = true;
                setFstate({ ...fstate });
                sendToast(translate('Check your SMS to get the PIN'));
                //  setisloaded(true)

            }).catch(function (error) {

                if (error.code === 'auth/invalid-phone-number') {
                    fstate.errors.phone = ' ';
                    sendToast(translate('Phone number is incorrect'));
                    setFstate({ ...fstate });

                }

                //   console.error('Error during signInWithPhoneNumber', error);
                //  window.alert('Error during signInWithPhoneNumber:\n\n'
                //       + error.code + '\n\n' + error.message);

            });
    }

    return (
        <>



            <div style={{ padding: '3px', margin: '3px', minWidth: '340px' }} className=" mdl-cell--4-col mdl-cell--7-col-tablet mdl-shadow--2dp">

                <div className="mdl-layout__header-row mdl-card__supporting-text">
                    <h4>{translate('Your information')}</h4></div>

                <form action="#" id="loginForm">
                    <div className="controlforms">


                        <Input defaultValue={fstate.default.first_name} id="firstname" isinvalid={fstate.errors.firstname} style={{ width: '150px' }} text={translate('First name')} icon="perm_identity" type="text" />
                        <Input defaultValue={fstate.default.last_name} id="lastname" isinvalid={fstate.errors.lastname} style={{ width: '150px' }} text={translate('Last name')} icon="hide" type="text" />

                        <Input defaultValue={fstate.default.phone} style={fstate.confirmphone ? { width: '150px' } : {}} text={translate('Your Phone')} id="phone" icon="phone" isinvalid={fstate.errors.phone} type="text" />

                        {fstate.confirmphone ? (<Input style={fstate.confirmphone ? { width: '150px' } : {}} text={translate('Enter PIN')} id="confirm_phone" icon="fiber_pin" isinvalid={fstate.errors.confirmphone} type="text" />) : ('')}

                        <Input text={translate('Your E-Mail')} id="email" defaultValue={fstate.default.email} icon="account_circle" isinvalid={fstate.errors.email} type="text" />




                    </div>
                    <div style={{ marginTop: '28px' }} className="mdl-card__actions mdl-card--border">
                        <div className="center-align">
                            <button disabled={loader} onClick={saveChanges} className="mdl-button mdl-js-ripple-effect mdl-js-button  mdl-button--raised mdl-button--colored">
                                {!loader && <>{translate('Save')}</>}
                                <img className="center-align" style={{ padding: '0', alignself: 'center', width: '30px', height: '30px', display: loader ? 'inline-block' : 'none' }} src={smallloader} alt={"loading..."} />

                            </button></div>
                    </div>
                </form>
            </div>





        </>


    );
}



export default YourInformation;