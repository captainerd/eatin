import React, { useState, useEffect } from 'react'
import Select from './CompoViews/Select'
import ReactDOM from 'react-dom';
import Home from './Home';
import MapConfirm from './dialogs/MapConfirm';
import { UseAxios, sendToast, InputVal } from './functions/Functions';
var lat = 0;
window.geolocated = false;
var lng = 0;
var mdlInit = null;
var the_timer = null;
var session = '';

function makeSession(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function AddressAsker(props) {
    const translate = props.translate
    const [fselect, setFselect] = useState({
        address: [],

    });
    async function MapDialog(cords, callback) {

        ReactDOM.render(<>

            <MapConfirm translate={translate} geo={cords} onYes={(e) => callback()} />

        </>, document.getElementById('mdl-dialog'));
        document.getElementById("lrdialog2").style.display = "block";

    }

    const [isinvalid, setisinvalid] = useState(false);
    useEffect(() => {
        if (typeof window.componentHandler !== 'undefined') window.componentHandler.upgradeAllRegistered();
        session = makeSession(25);
        let myPos = JSON.parse(window.localStorage.getItem('user'));
        if (typeof myPos.position !== 'undefined') {
            let la = {
                result: myPos.position
            }


            mdlInit = setInterval(() => {
                let lo = document.getElementById('address_hm_s').parentElement.MaterialTextfield;
                if (lo !== null && typeof lo !== 'undefined') {
                    if (la.result !== null) document.getElementById('address_hm_s').parentElement.MaterialTextfield.change(la.result.street_name + ' ' + la.result.street_number + ', ' + la.result.city + ', ' + la.result.district + ', ' + la.result.postal_code);
                    clearInterval(mdlInit)
                }
            }, 200);


        }
    }, []);
    const handlecity = async (geo, what) => {
        let la = '';

        clearTimeout(the_timer);
        if (typeof geo === 'object') the_timer = setTimeout(() => handlecity(true, what), 800);
        if (typeof geo === 'object') return


        la = await UseAxios({ lat: lat, lng: lng, query: InputVal(what), session: session }, 'geolocation/autocomplete');

        if (la.status === 'ok') {
            fselect.address = la.options


            setFselect({ ...fselect });
        } else {
            sendToast('Error');
        }



    }
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {

            //  x.innerHTML = "Geolocation is not supported by this browser.";
        }
    }
    async function showPosition(position) {

        let la = await UseAxios({ latlng: position.coords.latitude + ',' + position.coords.longitude }, 'geolocation/reverse_lookup')
        if (la.status === 'ok') {
            let myPos = JSON.parse(window.localStorage.getItem('user'));
            myPos.position = la.result
            myPos.position.coordinates = null;
            myPos.position.lat = position.coords.latitude;
            myPos.position.lng = position.coords.longitude;

            localStorage.setItem("user", JSON.stringify(myPos)); //local storage

   

            if (isinvalid) document.getElementById('address_hm_s').value = la.result.street_name + ' ' + la.result.street_number + ', ' + la.result.city + ', ' + la.result.district + ', ' + la.result.postal_code;
            if (!isinvalid) document.getElementById('address_hm_s').parentElement.MaterialTextfield.change(la.result.street_name + ' ' + la.result.street_number + ', ' + la.result.city + ', ' + la.result.district + ', ' + la.result.postal_code);

            if (props.AutoConfirm && window.localStorage.getItem('map') === null) {
                MapDialog({ lat: myPos.position.lat, lng: myPos.position.lng }, function () {
                    if (typeof props.confirmed === 'function') props.confirmed();
                })
            } else {
                // props.confirmed();
            }

        }


    }
    const OnSelected = async (e) => {
        window.localStorage.removeItem('map')
        let info = atob(e.id);
        info = JSON.parse(info);

        session = makeSession(50);

        let myPos = JSON.parse(window.localStorage.getItem('user'));
        myPos.position = info;
        myPos.position.lat = info.position.coordinates[0];
        myPos.position.lng = info.position.coordinates[1];





        localStorage.setItem("user", JSON.stringify(myPos)); //local storage
        if (props.AutoConfirm && window.localStorage.getItem('map') === null) {
            MapDialog({ lat: myPos.position.lat, lng: myPos.position.lng }, function () {
                if (typeof props.confirmed === 'function') props.confirmed();
            })
        } else {
            if (typeof props.confirmed === 'function') props.confirmed();
        }





    }
    const ConfirLocation = (e) => {
        let myPos = JSON.parse(window.localStorage.getItem('user'));

        if (typeof myPos.position === 'undefined' || myPos.position == null) {
            setisinvalid(window.translate('Please type your address'))
        } else {

            if (!props.AutoConfirm && window.localStorage.getItem('map') === null) {
                MapDialog({ lat: myPos.position.lat, lng: myPos.position.lng }, function () {
                    ReactDOM.render(<Home translate={props.translate} />, document.getElementById('page-content'));
                }
                );
            } else {
                ReactDOM.render(<Home translate={props.translate} />, document.getElementById('page-content'));
            }

        }


    }
    return (
        <div style={{ padding: '4px' }} className="center-align">

            <div style={{ display: 'block', width: '100%' }}>

                <div style={{ display: 'block', width: '100%' }}>


                    <Select isinvalid={isinvalid} className="search_addr_home" onSelect={(e) => OnSelected(e)} showGoogle={true} autocomplete={true} onChange={(e) => handlecity(e, 'address_hm_s')} options={fselect.address} id="address_hm_s" placeholder=" " label={window.translate('Address')} icon="where_to_vote" type="text" />

                    <div className="main_gps_icon" >
                        <i onClick={(e) => getLocation()} className="material-icons">gps_fixed</i>
                    </div>
                </div>
                {!props.AutoConfirm && <button onClick={ConfirLocation} className="mdl-button mdl-js-ripple-effect mdl-js-button  mdl-button--raised mdl-button--colored">

                    {window.translate('Go')}
                </button>}
            </div>

        </div>

    )
}

export default AddressAsker;