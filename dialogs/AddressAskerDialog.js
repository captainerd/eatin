import React, { useEffect } from 'react';

import ReactDOM from 'react-dom';
import AddressAsker from '../AddressAsker';
function AddressAskerDialog(props) {

    const translate = props.translate;

    useEffect(() => {
        window.dialog_c.push(handleYes)


    }, [])
    const handleYes = (e) => {

        if (
            JSON.parse(window.localStorage.getItem('user')).position !== null
            && typeof JSON.parse(window.localStorage.getItem('user')).position !== 'undefined'

        ) {
            if (typeof props.onOk === 'function') {
                props.onOk();

                window.lloadpos();




            }
        }
        document.getElementById("lrdialog").style.display = "none";
        ReactDOM.unmountComponentAtNode(document.getElementById('mdl-dialog2'));
    }

    return (
        <>
            <div id="innerdialog" >
                <div style={{ minWidth: '360px' }}>
                    <div className=" mdl-color-text--grey-600">
                        <h4>{translate('Your Address')}  </h4>

                    </div>

                    <div className="mdl-color-text--grey-600">

                        {translate('Please type your address')}

                    </div>
                    <AddressAsker translate={translate} AutoConfirm={true} />
                    <div className="mdl-dialog__actions">
                        <button type="button" onClick={e => handleYes(e)} className=" mdl-button--colored mdl-button mdl-js-button mdl-button--raised">{translate('Ok')}</button>
                    </div>

                </div>
            </div>
        </>
    );
}

export default AddressAskerDialog;