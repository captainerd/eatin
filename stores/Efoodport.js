import React, { useEffect, useState } from 'react';
import Input from '../CompoViews/Input'
import { UseAxios, sendToast, InputVal } from '../functions/Functions';
import smallloader from '../images/smallloader.gif';

var lwait = false;
var tell = '';
var ws = {
    onopen: function () { },
    onmessage: function () { },
    close: function () { },

}

function Efoodport(props) {
    const translate = props.translate;
    const [lwait, setlwait] = useState(false);
    const [loader, setLoader] = useState(false);
    const [importing, setimporting] = useState('');

    const [invalidefood, setinvalidefood] = useState(false);

    const efoodImport = async () => {
        if (InputVal('efood').replace('https://www.e-food.gr/delivery/', '') === InputVal('efood')) {
            setinvalidefood('Please type a valid efood store link');
        } else {
            setlwait(true);

            setinvalidefood(false);
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ for: 'efood_import', Agent: navigator.userAgent, AuthToken: JSON.parse(window.localStorage.getItem('user')).AuthToken, store_id: props.edit, efood_import: InputVal('efood') }))
            } else {
                tell = JSON.stringify({ for: 'efood_import', Agent: navigator.userAgent, AuthToken: JSON.parse(window.localStorage.getItem('user')).AuthToken, store_id: props.edit, efood_import: InputVal('efood') });
                ws = new WebSocket(window.websockets)

            }


        }
    }


    useEffect(() => {

        window.componentHandler.upgradeAllRegistered();
    });

    useEffect(() => {
        ws = new WebSocket(window.websockets);
        return () => ws.close();
    }, []);
    ws.onopen = () => {

        if (tell !== '') ws.send(tell);

    }
    ws.onmessage = async (e) => {
        if (e.data === 'server-ok') {
            try {
                let la = await UseAxios({ store_id: props.edit, efood_import: InputVal('efood') }, 'stores/efood_import');
                setimporting(InputVal('efood').replace('https://www.e-food.gr/delivery/', ''));
                setlwait(false);
                if (la.status == 'ok') {
                    sendToast('Imported: ' + importing + ' found: ' + la.cats + ' categories and ' + la.products + ' products');
                    window.location.reload();
                    return;
                }
                if (la.status == 'not-found') {
                    sendToast(translate('Import failed: E-food Store not found'));
                    return;
                }
            } catch (err) {
                sendToast(translate('Error'));

            }
        }
        setimporting(e.data)
    }

    return (
        <>
            <div style={{ padding: '3px', margin: '3px', minWidth: '340px', overflow: 'hidden', width: '100%' }} className=" mdl-cell--7-col mdl-shadow--2dp">
                <div style={{ cursor: 'pointer' }} className="mdl-layout__header-row mdl-card__supporting-text">
                    <h4>{translate('E-Food Import')}</h4></div>
                {translate('With this form you can import an existing menu from e-food, enter bellow the url like https://www.e-food.gr/delivery/menu/store_name and press  import')}
                <Input text='E-Food URL' isinvalid={invalidefood} style={{ width: '70%' }} type="text" id="efood" />

                <button disabled={loader} onClick={efoodImport} className="mdl-button mdl-js-ripple-effect mdl-js-button  mdl-button--raised mdl-button--colored">
                    {!loader && <>   {translate('Import')}</>}
                    <img className="center-align" style={{ padding: '0', alignself: 'center', width: '30px', height: '30px', display: loader ? 'inline-block' : 'none' }} src={smallloader} alt={"loading..."} />

                </button>
                {lwait && (<>
                    <br />
                    {translate('Please while importing')} {importing}
                    <div id="p2" className="mdl-progress mdl-js-progress mdl-progress__indeterminate"></div>

                </>)}
            </div>
        </>
    )
}


export default Efoodport;