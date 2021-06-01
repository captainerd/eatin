import React from 'react';

import ReactDOM from 'react-dom';
function DialogConfirm(props) {
    const translate = props.translate

    const closeDialog = (e) => {
       if (typeof props.onClose === 'function') props.onClose();
        document.getElementById("lrdialog2").style.display = "none";
        ReactDOM.unmountComponentAtNode(document.getElementById('mdl-dialog'));
    }
    const handleYes = (e) => {
        if (typeof props.onYes === 'function') {
            props.onYes();

            document.getElementById("lrdialog2").style.display = "none";
            ReactDOM.unmountComponentAtNode(document.getElementById('mdl-dialog'));
        }
    }

    return (
        <>
            <div id="innerdialog" className="mdl-tabs mdl-js-tabs">

                <div className="  mdl-card__supporting-text">

                    <i style={{ color: '#0d9ee0' }} className="material-icons">warning</i>
                    <div style={{ display: 'inline-block' }} dangerouslySetInnerHTML={{ __html: props.text }} />
                </div>
                <div className="mdl-dialog__actions">

                    <button type="button" onClick={e => closeDialog(e)} className="mdl-button mdl-js-button mdl-button--raised">{translate('Cancel')}</button>
                    <button type="button" onClick={e => handleYes(e)} className=" mdl-button--colored mdl-button mdl-js-button mdl-button--raised">{translate('Yes')}</button>
                </div>

            </div>
        </>
    );
}

export default DialogConfirm;