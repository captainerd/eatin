import React, { useEffect, useState } from 'react';

import ReactDOM from 'react-dom';







function SendingOrder(props) {

    const translate = props.translate
    const [ordermsg, setOrdermsg] = useState('');
    const [minutes, setMinutes] = useState('');
    const [waiting, setWaiting] = useState(false);
    const [canceled, setCanceled] = useState(false);



    //orderId
    const closeDialog = () => {
        document.getElementById("lrdialog").style.display = "none";
        ReactDOM.unmountComponentAtNode(document.getElementById('mdl-dialog2'));
    }
    const handleYes = (e) => {
        if (typeof props.onYes === 'function') {
            props.onYes();

            document.getElementById("lrdialog").style.display = "none";
            ReactDOM.unmountComponentAtNode(document.getElementById('mdl-dialog2'));
        }
    }
    useEffect(() => {
        setOrdermsg(translate('Connecting to the store...'))

        window.placeorder.send(JSON.stringify({ for: 'order', Agent: navigator.userAgent, order_id: props.orderId.id, AuthToken: JSON.parse(window.localStorage.getItem('user')).AuthToken }));
        window.placeorder.onmessage = (e) => {


            if (e.data === 'server-ok') {

                if (props.orderId.method == 'paypal') {
                    setOrdermsg(translate('Awaiting payment..'));
                } else {
                    setOrdermsg(translate('Sending your order to the store..'));
                }
            }
            if (e.data === 'store-offline') {
                setOrdermsg(translate('Sorry, store appears offline.'));
                setTimeout(() => {
                    closeDialog()
                }, 3000);

            }
            if (e.data === 'store-send') {
                setOrdermsg(translate('Your order has been send. Waiting for store to reply.'));

            }
            if (e.data.substr(0, 12) === 'store-reply:') {
                let la = e.data;

                la = la.substr(12, la.length);
                la = JSON.parse(la);
                if (la.status === 'ok') {
                    setWaiting(true);
                    setOrdermsg(la.message);
                    setMinutes(la.delivery_time)

                } else {
                    setCanceled(true)
                    setOrdermsg(la.message);
                }



                //ws.close();
            }


        }


        //        return () => ws.close();
    }, []);

    useEffect(() => {
        if (typeof window.componentHandler !== 'undefined') window.componentHandler.upgradeAllRegistered();
    });


    return (
        <>
            <div id="innerdialog" className="mdl-tabs mdl-js-tabs">

                <div style={{ padding: '8px' }}>
                    {!waiting && !canceled && (
                        <>
                            <div id="p2" style={{ height: '50px', width: '100%' }} className="mdl-progress mdl-js-progress mdl-progress__indeterminate"></div>
                            <div style={{ padding: '10px' }}>
                                <h6 style={{ color: '#919191' }}>  <i style={{ color: '#23db16', fontSize: '32px' }} className="material-icons ">sync</i> {translate("Please wait, don't close this window")}</h6>
                                <h6 style={{ color: '#919191' }}>   {ordermsg}</h6>
                            </div>

                        </>

                    )}

                    {canceled && (
                        <div style={{ padding: '10px' }}>
                            <div style={{ display: 'inline-block' }}>
                                <i style={{ color: '#f2513f', fontSize: '32px' }} className="material-icons ">error</i>

                            </div>
                            <div style={{ display: 'inline-block' }}>
                                <h6 style={{ color: '#919191' }}>{translate('Sorry, store canceled the order.!')}</h6>
                            </div>

                            {ordermsg !== '' && (
                                <div>

                                    <h6 style={{ color: '#919191' }}>     {translate('Message from store:')}</h6> {ordermsg}

                                </div>



                            )}
                            <div className="mdl-dialog__actions">
                                <button type="button" onClick={e => closeDialog()} className=" mdl-button--colored mdl-button mdl-js-button mdl-button--raised">Ok</button>
                            </div>
                        </div>




                    )}
                    {waiting && (

                        <div style={{ padding: '10px' }}>
                            <div style={{ display: 'inline-block' }}>
                                <i style={{ color: '#23db16', fontSize: '32px' }} className="material-icons ">check_circle</i>

                            </div>
                            <div style={{ display: 'inline-block' }}>
                                <h6 style={{ color: '#919191' }}> {translate('Thank you, store now prepares your order.!')}</h6>
                            </div>

                            <div>
                                <h6 style={{ color: '#919191' }}> {translate('You will recieve aprox it in:')}</h6>
                                <div className="numberCircle">{minutes}'</div>
                            </div>
                            <h6 style={{ color: '#919191' }}>{translate('minutes')}.
                        <br />
                                {translate('For any issues and or to change your order please call: ')} {props.phone}

                            </h6>
                            {ordermsg !== '' && (
                                <div>

                                    <h6 style={{ color: '#919191' }}>     {translate('Message from store:')}</h6> {ordermsg}

                                </div>



                            )}

                            <div className="mdl-dialog__actions">
                                <button type="button" onClick={e => handleYes()} className=" mdl-button--colored mdl-button mdl-js-button mdl-button--raised">Ok</button>
                            </div>
                        </div>



                    )}

                </div>
            </div>
        </>
    );
}

export default SendingOrder;