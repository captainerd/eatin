import React, { InputVal, useEffect, useState } from 'react';
import Input from '../CompoViews/Input'
import ReactDOM from 'react-dom';
import { UseAxios, sendToast } from '../functions/Functions';
import smallloader from '../images/smallloader.gif';


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

function DialogSMSpin(props) {
    const [isinvalid, setisinavlid] = useState(false)
    const translate = props.translate
    const [isloaded, setisloaded] = useState(false)

    useEffect(() => {
      
    

        loadScript('https://www.gstatic.com/firebasejs/7.9.0/firebase-auth.js', function () {
           
            checkloaded()


        });


    }, []);



    useEffect(() => {
        if (typeof window.componentHandler !== 'undefined') window.componentHandler.upgradeAllRegistered();
    });
    const closeDialog = (e) => {
        document.getElementById("lrdialog2").style.display = "none";
        ReactDOM.unmountComponentAtNode(document.getElementById('mdl-dialog'));
    }


    function checkloaded() {


       
        
            let grph = props.phone;

            if (grph.substr(0, 2) === '69') {
                grph = '+30' + grph;
            }
            SendSMS(grph)

      

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

                setisloaded(true)

            }).catch(function (error) {

                if (error.code === 'auth/invalid-phone-number') {
                    if (typeof props.wrong_phone === 'function') {
                        props.wrong_phone();
                        closeDialog();
                    }

                }

                //   console.error('Error during signInWithPhoneNumber', error);
                //  window.alert('Error during signInWithPhoneNumber:\n\n'
                //       + error.code + '\n\n' + error.message);

            });
    }
    const handleYes = (e) => {
        if (typeof props.onPin === 'function') {

            if (document.getElementById('enter_sms_pin').value === "") {

                setisinavlid('')
                return;
            }

            checkWhat();
        }
    }
    const checkWhat = async () => {
        let ppin = document.getElementById('enter_sms_pin').value;

        window.confirmationResult.confirm(ppin).then(function (result) {


            props.onPin({ pin: document.getElementById('enter_sms_pin').value, verify: window.verifycode });

            document.getElementById("lrdialog2").style.display = "none";
            ReactDOM.unmountComponentAtNode(document.getElementById('mdl-dialog'));

        }).catch(function (error) {
            setisinavlid(translate('Wrong pin code'))
            sendToast(translate('Wrong pin code'))
        });



    }

    return (
        <>
            <div id="innerdialog" >
                <div className=" mdl-card__supporting-text">
                    <h4>{translate('Confirm phone:')}  </h4>

                </div>
                <div style={{ padding: '5px' }} className="mdl-color-text--grey-600">
                    {isloaded && (<>{translate('Enter bellow the PIN code you recieved in your phone via SMS.')}</>)}


                    {!isloaded && (
                        <>
                            <br />
                            <br />
                            <img src={smallloader} alt="loading" />
                            <br />
                            {translate('Please wait, we are going to send you an SMS....')}
                        </>
                    )}
                </div>

                <div className="  mdl-card__supporting-text">

                    <Input isinvalid={isinvalid} style={{ width: '100%' }} type="text" text={translate("Enter PIN code")} id="enter_sms_pin" icon="fiber_pin" />
                </div>
                <div className="mdl-dialog__actions">

                    <button type="button" onClick={e => closeDialog(e)} className="mdl-button mdl-js-button mdl-button--raised">{translate('Cancel')}</button>
                    <button disabled={!isloaded} type="button" onClick={e => handleYes(e)} className=" mdl-button--colored mdl-button mdl-js-button mdl-button--raised">
                        Ok


                    </button>
                </div>

            </div>
        </>
    );
}

export default DialogSMSpin;