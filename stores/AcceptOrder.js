import React, { useEffect, useState } from 'react';

import ReactDOM from 'react-dom';
import { UseAxios, InputVal } from '../functions/Functions';
import Select from '../CompoViews/Select';
import Input from '../CompoViews/Input';


var deliveryTimeOpts = [
    { label: 10, id: 565659810 },
    { label: 15, id: 45654654 },
    { label: 20, id: 4564564123 },
    { label: 25, id: 8443121234864 },
    { label: 30, id: 156156786 },
    { label: 35, id: 12349456 },
    { label: 40, id: 1235476485 },
    { label: 45, id: 12456434485 },
    { label: 50, id: 1234564868 },
]

var flasher = false;
var ttimer = '';
function FlashTitle() {
    if (!flasher) {
        document.title = '####################### New order #######################'
        flasher = true;
    } else {
        document.title = ' '
        flasher = false;
    }
    ttimer = setTimeout(() => {
        FlashTitle()
    }, 500);


}



var audio = new Audio('/0001.wav');
function PrintElem(elem) {
    var mywindow = window.open('', 'PRINT', 'height=400,width=600');

    mywindow.document.write('<html><head><title></title>');
    mywindow.document.write('</head><body >');
    mywindow.document.write(document.getElementById(elem).innerHTML.replace('NUMmin', InputVal('delivery_time_adm') + 'min'));
    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    //  mywindow.focus(); // necessary for IE >= 10*/
      mywindow.onafterprint = function() { 
         
          setTimeout(  mywindow.close(),10);
      }
     mywindow.print();
      

    return true;
}

function AcceptOrder(props) {
    const translate = props.translate
    const [ordermsg, setOrdermsg] = useState('');




    //orderId
    const closeDialog = async () => {
        audio.currentTime = 0;
        audio.pause();
        
        audio.loop = false;
        if (typeof props.onYes === 'function') {
            let la = await UseAxios({ order_id: props.order._id.oid, delivery_time: InputVal('delivery_time_adm'), message: InputVal('message') }, 'stores/cancel_order');
            props.onYes(0);
        }
        document.getElementById("lrdialog").style.display = "none";
        ReactDOM.unmountComponentAtNode(document.getElementById('mdl-dialog2'));
        if (typeof window.LiveOrders === 'function')  window.LiveOrders();
    }
    const handleYes = async (e) => {
        PrintElem('toPrint');
        audio.currentTime = 0;
        audio.pause();
        audio.loop = false;
        if (typeof props.onYes === 'function') {
            let la = await UseAxios({ order_id: props.order._id.oid, delivery_time: InputVal('delivery_time_adm'), message: InputVal('message') }, 'stores/accept_order');
            props.onYes(1);
        }
        if (typeof window.LiveOrders === 'function') window.LiveOrders();
        document.getElementById("lrdialog").style.display = "none";
        ReactDOM.unmountComponentAtNode(document.getElementById('mdl-dialog2'));

    }
    useEffect(() => {
        FlashTitle()

        audio.loop = true;
        audio.play();
        document.getElementById('delivery_time_adm').value = props.order.delivery_time;

        return () => {
            clearTimeout(ttimer)
            document.title = ' '
        }


    }, []);

    useEffect(() => {
        if (typeof window.componentHandler !== 'undefined') window.componentHandler.upgradeAllRegistered();
    });
    const stopRing = () => {

        audio.pause()

    }

    return (
        <>
            <div id="innerdialog" className="mdl-tabs mdl-js-tabs">
                <div style={{ maxHeight: '60vh', overflowX: 'auto' }}>

                    <table onClick={(e) => stopRing()} style={{ padding: '8px', width: '100%', fontSize: '16px', color: '#525252', textAlign: 'left', maxHeight: '300px', overflowX: 'auto' }}>

                        <tr><td style={{ textAlign: 'center' }}>{props.order.date}</td></tr>
                        <tr><td> </td></tr>
                        <tr><td><h4>{props.order.store_name} ({props.order.zone})</h4> </td></tr>


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
                        <tr><td><b>{translate('Final total:')}</b> </td><td style={{ textAlign: 'left', color: '#7E0065' }}>{parseFloat(props.order.total * 1).toFixed(2)}€ </td></tr>
                        <tr><td> <b>{translate('Method:')}</b> </td><td style={{ textAlign: 'left', color: '#7E0065' }}>{props.order.method} </td></tr>
                        <tr><td><b>{translate('Delivery:')}</b> {props.order.pickup === 'pickup' ? (<p style={{ color: 'red' }}>{translate('Client will visit store')}</p>) : (<p style={{ color: 'blue' }}>{translate('Delivery to home')}</p>)}  </td></tr>

                        <tr><td><b>{translate('Client:')}</b> {props.order.name} {translate('Phone:')} {props.order.address.phone} ({props.order.phone})</td></tr>
                        <tr><td>{props.order.address.street_name} {props.order.address.street_number} {props.order.address.city} {props.order.address.district} {props.order.address.postal_code}</td></tr>
                        <tr><td><b>{translate('Bell:')}</b> {props.order.address.bell}  <b>{translate('Floor:')}</b> {props.order.address.floor}</td></tr>
                        <tr><td>   </td></tr>
                        <tr><td style={{ color: '#7E0065' }}> {translate('Comments:')} <b> {props.order.cart_notes} </b> </td></tr>
                    </table>
                </div>


                <Select style={{ width: '100%' }} label={translate("Estimated time")} id="delivery_time_adm" defaultValue={props.order.delivery_time} options={deliveryTimeOpts} icon="alarm" />
                <Input style={{ width: '100%' }} text={translate("Message to client (eg Reason to cancel)")} id="message" icon="category" type="text" />















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

                    <button type="button" onClick={e => closeDialog(e)} className="mdl-button mdl-js-button mdl-button--raised">{translate("Cancel")}</button>
                    <button type="button" onClick={e => handleYes(e)} className=" mdl-button--colored mdl-button mdl-js-button mdl-button--raised">{translate("Accept")}</button>
                </div>

            </div>
        </>
    );
}

export default AcceptOrder;