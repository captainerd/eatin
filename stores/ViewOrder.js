import React, { useEffect, useState } from 'react';

import ReactDOM from 'react-dom';
import { UseAxios, sendToast, InputVal } from '../functions/Functions';
import Select from '../CompoViews/Select';




var ttimer = '';

var selecCan = '';


function PrintElem(elem) {


    var mywindow = window.open('', 'PRINT', 'height=400,width=600');

    mywindow.document.write('<html><head><title></title>');
    mywindow.document.write('</head><body >');
    mywindow.document.write(document.getElementById(elem).innerHTML.replace('NUMmin', InputVal('delivery_time') + 'min'));
    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
  //  mywindow.focus(); // necessary for IE >= 10*/
    mywindow.onafterprint = function() { 
       
        setTimeout(  mywindow.close(),10);
    }
   mywindow.print();
    

    return true;
}

function ViewOrder(props) {
    const [invalidcancel, setinvalidcancel] = useState(false);

    const translate = props.translate;

    var cancelReason = [

        { label: translate('Client wanted to cancel'), id: 'canceled_by_client' },
        { label: translate('Client not found'), id: 'client_not_found' },
        { label: translate('Wrong order'), id: 'wrong_order' },
        { label: translate('Other'), id: 'other_reason' },


    ]


    //orderId
    const closeDialog = async () => {
        PrintElem('toPrint');
        selecCan = '';
        if (typeof props.onYes === 'function') {
            //   let la = await UseAxios({ order_id: props.order._id.oid, delivery_time: InputVal('delivery_time'), message: InputVal('message') }, 'stores/cancel_order');
            //  props.onYes(0);
        }
        document.getElementById("lrdialog").style.display = "none";
        ReactDOM.unmountComponentAtNode(document.getElementById('mdl-dialog2'));
    }
    const handleYes = async (e) => {
        selecCan = '';

        if (typeof props.onYes === 'function') {
            //   let la = await UseAxios({ order_id: props.order._id.oid, delivery_time: InputVal('delivery_time'), message: InputVal('message') }, 'stores/accept_order');
            //  props.onYes(1);
        }
        document.getElementById("lrdialog").style.display = "none";
        ReactDOM.unmountComponentAtNode(document.getElementById('mdl-dialog2'));

    }
    useEffect(() => {


        selecCan = '';

        return () => {
            clearTimeout(ttimer)
            document.title = ' '
        }


    }, []);

    useEffect(() => {
        if (typeof window.componentHandler !== 'undefined') window.componentHandler.upgradeAllRegistered();
    });
    const CancelSelect = async (e) => {
        selecCan = e;
        if (e.id === 'other_reason') {
            document.getElementById('canceling_order').value = "";
        }
    }
    const checkCanceling = async () => {
        let reason = '';
        if (selecCan.id === 'other_reason') {
            if (InputVal('canceling_order').length > 4) {

                reason = InputVal('canceling_order');
            }
        } else {
            reason = selecCan.id;

        }



        if (reason !== '' && typeof reason !== 'undefined') {
            setinvalidcancel(false)

            let la = await UseAxios({ order_id: props.order._id.oid, message: reason, va: 1, }, 'stores/cancel_order');

            if (la.status === 'ok') {

                sendToast(translate('Order canceled'))
                handleYes();
            }
        } else {
            setinvalidcancel('')
        }

    }
    const checkUnCanceling = async () => {
        let reason = '';

        let la = await UseAxios({ order_id: props.order._id.oid, va: 3, }, 'stores/cancel_order');

        if (la.status === 'ok') {
            sendToast(translate('Order changed to normal'))
            handleYes();
        }
    }



    return (
        <>
            <div id="innerdialog" className="mdl-tabs mdl-js-tabs">
                <div style={{ maxHeight: '70vh', overflowX: 'auto' }}>

                    <table style={{ padding: '8px', width: '100%', fontSize: '16px', color: '#525252', textAlign: 'left', maxHeight: '300px', overflowX: 'auto' }}>

                        <tr><td style={{ textAlign: 'center' }}>{props.order.date}</td></tr>
                        <tr><td> </td></tr>
                        <tr><td><h4>{props.order.store_name}</h4> </td></tr>


                        {props.order.products.map(itema => (
                            <>
                                <tr><td style={{ textAlign: 'left' }}>{itema.qnty} x {itema.gr_name} - </td><td>{parseFloat(itema.unitprice * 1).toFixed(2)}€</td></tr>
                                {itema.notes && (
                                    <>
                                        <tr><td style={{ textAlign: 'left', color: 'blue' }}>({itema.notes}) </td></tr>
                                    </>

                                )}
                                {Object.keys(itema.options).map(key => (
                                    <>
                                        <tr  ><td style={{ textAlign: 'left', color: '#7E0065' }}>   ^---- + {itema.options[key].gr_name} ({parseFloat(itema.options[key].price * 1).toFixed(2)}€) </td></tr>

                                    </>



                                ))}


                            </>



                        ))}
                        <tr><td> </td></tr>
                        <tr><td><b>{translate('Delivery:')}</b> {props.order.pickup === 'pickup' ? (<p style={{ color: 'red' }}>Client will visit store</p>) : (<p style={{ color: 'blue' }}>Delivery to home</p>)} ( {props.order.delivery_time} ') </td></tr>

                        <tr><td><b>{translate('Final total:')}</b> {parseFloat(props.order.total * 1).toFixed(2)}€ <b> {translate('Method:')}</b> {props.order.method} </td></tr>
                        <tr><td><b>{translate('Client:')}</b> {props.order.name} Phone: {props.order.address.phone} ({props.order.phone})</td></tr>
                        <tr><td>{props.order.address.street_name} {props.order.address.street_number} {props.order.address.city} {props.order.address.district} {props.order.address.postal_code}</td></tr>
                        <tr><td><b>{translate('Bell:')}</b> {props.order.address.bell}  <b>{translate('Floor:')}</b> {props.order.address.floor}</td></tr>
                        <tr><td>   </td></tr>
                        <tr><td style={{ color: '#7E0065' }}> {translate('Comments:')} <b> {props.order.cart_notes} </b> </td></tr>
                    </table>
                    {props.order.confirmed !== 0 && props.order.confirmed !== 2 && (
                        <>
                            <Select isinvalid={invalidcancel} style={{ width: '100%' }} id="canceling_order" options={cancelReason} onSelect={(e) => CancelSelect(e)} label={translate("Reason to cancel")} icon="cancel" />
                            <input onClick={(e) => checkCanceling()} type="button" value="cancel" />
                        </>)}

                    {props.order.confirmed === 2 &&
                        (
                            <>

                                <input onClick={(e) => checkUnCanceling()} type="button" value="Un-cancel" />

                            </>)}


                </div>

















                <div id="toPrint" style={{ display: 'none' }} >
                <table style={{ paddingBottom: '4px', width: '100%', fontSize: '16px' }}>
                        <tr><td>{props.order.store_name.toUpperCase()}</td></tr>
                        <tr><td style={{ textAlign: 'center' }}><center>{window.sitename} Delivery</center></td></tr>
                        <tr><td style={{ textAlign: 'center' }}><center>** {translate("IS NOT A RECEIPT")} **</center></td></tr>
                        <tr><td style={{ textAlign: 'center' }}>** {translate("ORDER FORM")} **</td></tr>
                        <tr><td style={{ textAlign: 'center' }}><center>** {props.order.date} **</center></td></tr>
                        <tr><td style={{ textAlign: 'center' }}>** {translate("Order_2")}: {props.order.fake_id} **</td></tr>
                        <tr><td> </td></tr>
                        <tr><td> </td></tr>


                        {props.order.products.map(itema => (
                            <>
                                <tr><td style={{ textAlign: 'left' }}>{itema.qnty} x {itema.gr_name.toUpperCase()} - </td><td>{parseFloat(itema.unitprice * 1).toFixed(2)}€</td></tr>
                                {itema.notes && (
                                    <>
                                        <tr><td style={{ textAlign: 'left' }}>({itema.notes}) </td></tr>
                                    </>

                                )}
                                {Object.keys(itema.options).map(key => (
                                    <>
                                        <tr  ><td style={{ textAlign: 'left' }}>   ^---- + {itema.options[key].gr_name.toUpperCase()} ({parseFloat(itema.options[key].price * 1).toFixed(2)}€) </td></tr>

                                    </>



                                ))}


                            </>



                        ))}
                        <tr><td> </td></tr>
                        <tr><td> </td></tr>
                        <tr><td>=======================</td></tr>
                        <tr><td><center>{translate("TOTAL")} {parseFloat(props.order.total * 1).toFixed(2)}€</center></td></tr>
                        <tr><td>=======================</td></tr>
                        <tr><td> {props.order.method} - NUMmin</td></tr>
                        <tr><td><center>### {translate("ADDRESS")}:  ###</center></td></tr>
                        <tr><td>{translate("FULL NAME")}: {props.order.name}</td></tr>
                        <tr><td>{translate("CELLPHONE")}: {props.order.address.phone}</td></tr>
                        <tr><td>{translate("CITY")}: {props.order.address.city} {props.order.address.district} {props.order.address.postal_code}</td></tr>
                        <tr><td>{translate("STR.NAME")}: {props.order.address.street_name} {props.order.address.street_number}</td></tr>
                        <tr><td>{translate("BELL")}: {props.order.address.bell}  </td></tr>
                        <tr><td>{translate("FLOOR")}: {props.order.address.floor}  </td></tr>
                        <tr><td>{translate("COMMENTS")}: {props.order.cart_notes}  </td></tr>
                    </table>
                </div>
                <div className="mdl-dialog__actions">

                    <button type="button" onClick={e => closeDialog(e)} className="mdl-button mdl-js-button mdl-button--raised">Print</button>
                    <button type="button" onClick={e => handleYes(e)} className=" mdl-button--colored mdl-button mdl-js-button mdl-button--raised">Ok</button>
                </div>

            </div>
        </>
    );
}

export default ViewOrder;