
import React, { Suspense, lazy, useState, useEffect } from 'react';
import smallloader from '../images/smallloader.gif';


import axios from 'axios';
import ReactDOM from 'react-dom';
import Input from '../CompoViews/Input';

import { sendToast, validateEmail, UseAxios, InputVal } from '../functions/Functions';






function ForgotPassword(props) {
    const translate = props.translate;
    const [isinvalid, setIsinvalid] = useState({
        email: false,
    });
    const [loader, setLoader] = useState(false);

    // document.getElementById('preload').style.display = 'none';


    useEffect(() => {




        window.componentHandler.upgradeAllRegistered();
    });
    const saveChanges = async (e) => {
        e.preventDefault();

        if (!validateEmail(InputVal('email'))) {
            isinvalid.email = '';

        } else {
            isinvalid.email = false;
            let la = await UseAxios({ email: InputVal('email') }, 'users/forgot_password');
            if (typeof la !== 'undefined') {

                if (la.status === 'ok') {
                    closeDialog();
                    sendToast(translate('A new password has been emailed'));
                } else {
                    sendToast(translate('E-mail address not found'));
                }
            } else {
                sendToast(translate('Error'));
            }
        }
        setIsinvalid({ ...isinvalid });
    }

    const closeDialog = () => {
        document.getElementById("lrdialog").style.display = "none";
        ReactDOM.unmountComponentAtNode(document.getElementById('lrdialog'));
    }

    return (
        <>



            <div className="mdl-layout__header-row mdl-card__supporting-text">
                <h4>{translate('Recover account')}</h4>

            </div>
            <div style={{ padding: '5px' }} className="mdl-color-text--grey-600">
                {translate('Enter your e-mail and we will send you a new password')}
            </div>
            <div className="controlforms">
                <Input style={{ width: '100%' }} text={translate('Your E-Mail')} id="email" icon="account_circle" isinvalid={isinvalid.email} type="text" />

            </div>
            <div className="center-align">
                <button disabled={loader} onClick={saveChanges} className="mdl-button mdl-js-ripple-effect mdl-js-button  mdl-button--raised mdl-button--colored">
                    {!loader && <>{translate('Submit')}</>}
                    <img className="center-align" style={{ padding: '0', alignself: 'center', width: '30px', height: '30px', display: loader ? 'inline-block' : 'none' }} src={smallloader} alt={"loading..."} />

                </button></div>
            <div className="mdl-dialog__actions">
                <button id="closedialog" type="button" onClick={e => closeDialog(e)} className="mdl-button close">{translate('Close')}</button>
            </div>
        </>


    );
}



export default ForgotPassword;