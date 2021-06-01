import React, { useEffect, useState } from 'react';
import { UseAxios } from '../functions/Functions';
import ReactDOM from 'react-dom';
import Loading from '../Loading'
function DisplayText(props) {
    const translate = props.translate
    const [text, setText] = useState('')

    useEffect(() => {
        document.getElementById("lrdialog2").style.display = "block";
        if (!(typeof (window.componentHandler) == 'undefined')) {
            window.componentHandler.upgradeElements(document.getElementsByClassName("mdl-tabs"));

            //  componentHandler.upgradeAllRegistered();
        }
        window.dialog_c.push(closeDialog)

        loadText();
    }, [])
    const loadText = async () => {
        let lo = window.assetsurl;
        // alert(lo)
        let la = await UseAxios(null, '/texts/' + props.text, lo)


        if (props.extra !== null && typeof props.extra !== 'undefined') la = la.replace('{phone}', props.extra)
        setText(la)
    }

    const closeDialog = () => {
        document.getElementById("lrdialog2").style.display = "none";
        ReactDOM.unmountComponentAtNode(document.getElementById('mdl-dialog'));
    }


    return (
        <>
            <div className="center-align">
                <div className="HaveText">
                    {text.length === 0 && (

                        <Loading />


                    )}          {text}

                    <div style={{ height: '200px' }}></div>
                </div>

                <div >
                    <button style={{ marginTop: '6px' }} onClick={closeDialog} className="mdl-button mdl-js-button mdl-button--raised mdl-button--accent">
                        {translate('Close')}
                    </button>
                </div>
            </div>
        </>
    );
}

export default DisplayText;