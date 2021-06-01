import React, { useState,  lazy,useEffect } from 'react';
import ReactDOM from 'react-dom';
import Input from '../CompoViews/Input'
import { InputVal, UseAxios, sendToast } from '../functions/Functions';
import Multiselect from '../CompoViews/Multiselect'
import smallloader from '../images/smallloader.gif';
import Customize from '../dialogs/Customize';
import Select from '../CompoViews/Select'
import '../css/store.css';
import ProductStore from './ProductStore';
import AddZone from './AddZone';
import Store from '../Store';
 
var GetCordinatesStored = [];
var GetCordinates = [];
var SelectedPayments = [];
var firstload = false;
var poly = '';
var map = '';
var storelat = 0;

var storelng = 0;

function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
  }

export function DeliveryMap(props) {
    const translate = props.translate
    async function openColorDialog(callback) {

        ReactDOM.render(<>

            <Customize  translate={translate} onDone={async (e) => callback(e)} />

        </>, document.getElementById('mdl-dialog'));
        document.getElementById("lrdialog2").style.display = "block";

    }

    const payOpts = [

        { id: 'cash', label: translate('Cash') },
   //     { id: 'credit_card', label: translate('Credit card') },
        { id: 'wireless_pos', label: translate('Wireless POS') },
        { id: 'paypal', label: translate('Paypal') },
        { id: 'tickets', label: translate('Ticket Restaurant') },

    ]



    const [loader, setLoader] = useState(false);
    const [deftakeaway, setDeftakeaway] = useState(false);
    const [paymentOpts, setPaymentOpts] = useState([]);
    const [wldomain, setWldomain] = useState('');
    const [usedDomain, setUsedDomain] = useState('');
    const [selectedColor, setselectedColor] = useState('');
    const [fstate, setFstate] = useState({
        delivery_area: [],
        errors: {
            delivery_area: false,
            payment_options: false,
            delivery_time: false,

        },
    });
    const [mapzones, setMapzones] = useState({ z: [] });
    useEffect(() => {
        mapzones.z = [{ label: translate('Add Zone'), id: 'add' }]
        setMapzones({ ...mapzones })
        loadInfo();


    }, []);

    useEffect(() => {
        window.componentHandler.upgradeAllRegistered();
    });

    const loadInfo = async () => {
      
        let la = await UseAxios({ id: props.edit, do: 'list' }, 'stores/edit_delivery');

    
        if (la.status === 'ok') {

            let lo = [];
            let i = 0;
            if (typeof la.store.payment_options !== 'undefined') Object.keys(la.store.payment_options).map(item => {
                lo[i] = {

                    id: item
                }

                i++;
            });
            firstload = true;

            GetCordinatesStored = la.store.delivery_area;
            setWldomain(la.store.store_domain);
            setselectedColor(la.store.store_theme);
            setPaymentOpts(lo);

            var nodeList = document.querySelectorAll('.mdl-textfield');
            storelat = la.store.lat;
            storelng = la.store.lng;
            setDeftakeaway(la.store.take_away);
            la.store.zones.push(mapzones.z[0]);
            mapzones.z = la.store.zones;
            setMapzones({ ...mapzones });


            Array.prototype.forEach.call(nodeList, function (elem) {
                //     if (typeof elem.MaterialTextfield !== 'undefined' && elem.MaterialTextfield !== null) elem.MaterialTextfield.checkDirty();
            });




        }
    }
function handleColorselect(e)  {

    
    if (e != undefined && e != '') setselectedColor(e);
    window.componentHandler.upgradeAllRegistered();
 
}
 

    const saveChanges = async () => {

   
   
 
        setLoader(true);
        let founderror = false;
/*
        if (!validURL(InputVal('wldomain'))) {
 
            setUsedDomain(translate('Invalid URL'));
            sendToast(translate('Invalid URL'));
            setLoader(false);
            return;
        } else {
            setUsedDomain(false);
        }
*/
      //  setUsedDomain(false);

        if (SelectedPayments.length === 0) {
            fstate.errors.payment_options = '';
            founderror = true;
        } else {
            fstate.errors.payment_options = false;
        }
        let formData = {
            do: 'save',
            store: props.edit,
            take_away: document.getElementById('take_away').checked,
            delivery_time: InputVal('delivery_time'),
            store_domain: wldomain,
            store_theme: InputVal('color_theme'),
            payment_options: SelectedPayments,
        }
   
       // setWldomain(InputVal('wldomain'));
        if (!founderror) {
            let la = await UseAxios(formData, 'stores/edit_delivery');

            if (la.status === 'ok') {
               
               // setPaymentOpts(SelectedPayments);
                sendToast(translate('Changes saved'));
         
            
            
                if (window.newstoreadding == 1) {
 
ReactDOM.render(
<ProductStore translate={translate} edit={props.edit}  />

 

    , document.getElementById('page-content'));
                    window.newstoreadding = 0;

                } 




            } else {
                if (la.status === 'domain-in-use') {
                    setUsedDomain(translate('Domain is in use by another store'));
                }  
                    sendToast(translate('Error'));
                 
            }
           setFstate({ ...fstate });

        }
        
        setLoader(false);

    }


function setPaymentnew(e) {

    let lo = [];
    let i = 0;
      //   [{"id":"cash","label":"Μετρητά"},{"id":"wireless_pos","label":"Ασύρματο POS"},{"id":"paypal","label":"Paypal"}]



      e.map(item => {
        lo[i] = {

            id: item.id
       
        }
      //  console.log(item)
        i++;
    });

    setPaymentOpts( lo)
    SelectedPayments = e;

}

    const ZoneSelect = (e) => {
        if (e.id === 'add') {
            ReactDOM.render(

                <AddZone translate={translate} edit={props.edit} coordinates={{ lat: storelat, lng: storelng }} />

                , document.getElementById('page-content'));

        } else {
            ReactDOM.render(

                <AddZone translate={translate} zone={e.id} edit={props.edit} coordinates={{ lat: storelat, lng: storelng }} />

                , document.getElementById('page-content'));

        }
    }
    return (
        <>
            <div style={{ padding: '3px', margin: '3px', minWidth: '340px', width: '100%' }} className=" mdl-cell--7-col mdl-shadow--2dp">
                <div className="mdl-layout__header-row mdl-card__supporting-text">
                    <h4>{translate('Delivery')}</h4></div>



                <Select onSelect={(e) => ZoneSelect(e)} options={mapzones.z} label={translate("Zone")} style={{ width: '100%' }} id="delivery_zone" icon="map" />
                <Input defaultValue={deftakeaway} id="take_away" className="ToggleAvail" text={translate("Take away")} type="toggle" />

                <Multiselect defaultValue=" " selected={paymentOpts} onSelect={(e) => setPaymentnew(e) } isinvalid={fstate.errors.payment_options} options={payOpts} icon="payment" label={translate("Payment options")} style={{ width: '100%' }} id="payment_options" />
         
            
            {/*  <Input icon="language" isinvalid={usedDomain} style={{ width: '100%' }} defaultValue={wldomain} id="wldomain"  text={translate("Branded URL")} type="text" /> 
           

                <Input icon="format_paint"  onClick={(e) =>  openColorDialog(handleColorselect)} style={{ width: '100%' }} readonly={'readonly'} defaultValue={selectedColor} id="color_theme"  text={translate("Color theme")} type="text" />
        */}
                <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label is-dirty is-upgraded"  style={{width: '100%'}}>
                    <i class=" 	mdl-color-text--primary material-icons   ">camera</i>
     <img width="180px" height="180px" src={"https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=" + wldomain}></img>
              
                        <label style={{marginLeft: '30px'}} class="mdl-textfield__label " for="format_paint">{translate("Stores QR Code")}:</label> 
                        
                        </div>

            
              
                <div className="mdl-card__actions mdl-card--border">
                    <div className="center-align">
                        <button disabled={loader} onClick={saveChanges} className="mdl-button mdl-js-ripple-effect mdl-js-button  mdl-button--raised mdl-button--colored">
                            {!loader && <>{translate("Save")}</>}
                            <img className="center-align" style={{ padding: '0', alignself: 'center', width: '30px', height: '30px', display: loader ? 'inline-block' : 'none' }} src={smallloader} alt={"loading..."} />

                        </button></div>
                </div>
              
            </div>
        </>
    )
}

export default DeliveryMap;