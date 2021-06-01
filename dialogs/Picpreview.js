import React from 'react';

import ReactDOM from 'react-dom';
function Picpreview(props) {

    const translate = props.translate
    const closeDialog = () => {
        document.getElementById("lrdialog").style.display = "none";
        ReactDOM.unmountComponentAtNode(document.getElementById('mdl-dialog2'));
    }


    return (
        <>
            <div className="center-align">
                <img width="100%" src={window.assetsurl + props.text.replace('_80x80_', '_400x400_') + '?size=' + window.screen.width} onClick={closeDialog} alt="Preview" />
            </div>
            <button style={{ marginBottom: '10px' }} onClick={closeDialog} className="mdl-button mdl-js-button mdl-button--raised mdl-button--accent">
                {translate('Close')}
            </button>
        </>
    );
}

export default Picpreview;