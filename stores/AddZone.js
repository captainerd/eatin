import React, { useState, useEffect } from 'react';
import Input from '../CompoViews/Input'
import { InputVal, UseAxios, sendToast, isNumeric } from '../functions/Functions';
import smallloader from '../images/smallloader.gif';
import '../css/store.css';
import spotpng from '../images/spot.png';
import spotpngf from '../images/spotfirst.png';
import DeliveryMap from './DeliveryMap';
import ReactDOM from 'react-dom';

var otherzones = [];
var GetCordinates = [];
var SelectedPayments = [];
var firstload = false;
var poly = '';
var map = '';
var storelat = 0;
var storelng = 0;


function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export function AddZone(props) {
    const translate = props.translate;


    const payOpts = [

        { id: 'cash', label: translate('Cash') },
        { id: 'credit_card', label: translate('Credit card') },
        { id: 'wireless_pos', label: translate('Wireless POS') },
        { id: 'paypal', label: translate('Paypal') },

    ]

    const [loader, setLoader] = useState(false);

    const [paymentOpts, setPaymentOpts] = useState([]);
    const [fstate, setFstate] = useState({
        delivery_area: [],
        errors: {
            delivery_area: false,
            payment_options: false,
            delivery_time: false,

        },
    });
    useEffect(() => {

        loadInfo();


    }, []);
    useEffect(() => {
        window.componentHandler.upgradeAllRegistered();
    });

    const loadInfo = async () => {
        if (typeof props.zone === 'undefined') {
            //  //console.log(props.coordinates);
            initMap(props.coordinates);
            let la = await UseAxios({ store_id: props.edit, id: props.edit, do: 'list' }, 'stores/delivery_zones');
            otherzones = la.other_zones;

            firstload = true;
            initMap(props.coordinates);
            return;

        }
        let la = await UseAxios({ id: props.zone, do: 'list' }, 'stores/delivery_zones');

        if (la.status === 'ok') {

            let lo = [];
            let i = 0;

            firstload = true;
            GetCordinates = la.zone.delivery_area;
            otherzones = la.other_zones;


            if (typeof la.zone.delivery_time !== 'undefined') document.getElementById('delivery_time').value = la.zone.delivery_time;
            if (typeof la.zone.zone_name !== 'undefined') document.getElementById('zone_name').value = la.zone.zone_name;
            if (typeof la.zone.min_order !== 'undefined') document.getElementById('min_order').value = la.zone.min_order;

            var nodeList = document.querySelectorAll('.mdl-textfield');


            Array.prototype.forEach.call(nodeList, function (elem) {
                if (typeof elem.MaterialTextfield !== 'undefined') elem.MaterialTextfield.checkDirty();
            });

            initMap(props.coordinates);



        }
    }
    function CreatePoly() {


        if (typeof otherzones !== 'undefined') {

            otherzones.map(item => {
                let colo = getRandomColor();
                let la = new google.maps.Polygon({ map: map, path: item, strokeColor: colo, strokeOpacity: 1, strokeWeight: 2, fillColor: colo, fillOpacity: 0.20 });



            })
        }
        if (typeof GetCordinates === 'undefined') return;
        if (firstload == true && typeof google !== 'undefined') {
            poly = new google.maps.Polygon({ map: map, path: GetCordinates, strokeColor: '#1F00FF', strokeOpacity: 0.8, strokeWeight: 2, fillColor: "#007DFF", fillOpacity: 0.35 });




            firstload = false;
        }


    }
    function handlePlaceSelect(a) {
        //console.log(a)
    }
    function initMap(cor) {


        /*global google*/ // To disable any eslint 'google not defined' errors
        map = new google.maps.Map(document.getElementById('map'), {
            center: new google.maps.LatLng(cor.lat, cor.lng),
            zoom: 15,
            scaleControl: true,
            clickableIcons: false,
            streetViewControl: false,
            mapTypeControl: false,
            draggableCursor: 'crosshair',

        });
        let strokeColor = '#1F00FF';
        var isClosed = false;
        var marker = [];

        poly = new google.maps.Polyline({ map: map, path: [], strokeColor: strokeColor, strokeOpacity: 1.0, strokeWeight: 2 });
        CreatePoly();
        // Create a div to hold the control.
        var controlDiv = document.createElement('div');


        var controlMarkerUI = BuildGoogleButton('Undo', '<i style="color: #404040" class="material-icons">undo</i>');
        controlMarkerUI.addEventListener('click', function () {
            if (poly.getPath().length > 0) {
                if (typeof marker[poly.getPath().length - 1] !== 'undefined') marker[poly.getPath().length - 1].setMap(null);
                poly.getPath().pop();

                isClosed = false;
                let path = poly.getPath();
                poly.setMap(null);
                GetCordinates = [];
                poly = new google.maps.Polyline({ map: map, path, strokeColor, strokeOpacity: 1.0, strokeWeight: 2 });
            }
        });
        controlDiv.appendChild(controlMarkerUI);
        controlMarkerUI = BuildGoogleButton('Reset', '<i style="color: #404040" class="material-icons">delete</i>');
        controlDiv.appendChild(controlMarkerUI);
        controlMarkerUI.addEventListener('click', function () {
            while (poly.getPath().length > 0) {
                if (typeof marker[poly.getPath().length - 1] !== 'undefined') marker[poly.getPath().length - 1].setMap(null);
                poly.getPath().pop();


            }
            GetCordinates = [];
            poly.setMap(null);
            poly = new google.maps.Polyline({ map: map, path: [], strokeColor, strokeOpacity: 1.0, strokeWeight: 2 });
            isClosed = false;
        });


        controlDiv.appendChild(controlMarkerUI);



        map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(controlDiv);
        google.maps.event.addListener(map, 'click', function (clickEvent) {


            if (isClosed)
                return;
            var markerIndex = poly.getPath().length;
            var isFirstMarker = markerIndex === 0;
            let iconmap = '';
            if (poly.getPath().length === 0) {
                iconmap = spotpngf;
            } else {
                iconmap = spotpng;
            }

            marker[markerIndex] = new google.maps.Marker({ map: map, position: clickEvent.latLng, draggable: true, icon: iconmap });

            if (isFirstMarker) {

                google.maps.event.addListener(marker[markerIndex], 'click', function () {


                    if (isClosed) return;
                    var path = poly.getPath();
                    poly.setMap(null);
                    poly = new google.maps.Polygon({ map: map, path: path, strokeColor: strokeColor, strokeOpacity: 0.8, strokeWeight: 2, fillColor: "#007DFF", fillOpacity: 0.35 });
                    isClosed = true;
                    fillCordinates(poly);


                });
            }
            //change coordinates of point when a marker is dragged
            google.maps.event.addListener(marker[markerIndex], 'drag', function (dragEvent) {
                poly.getPath().setAt(markerIndex, dragEvent.latLng);
                if (isClosed) fillCordinates(poly);
            });

            poly.getPath().push(clickEvent.latLng);

            if (isClosed) fillCordinates(poly);
        });

        if (typeof props.zone === 'undefined') {
            while (poly.getPath().length > 0) {
                if (typeof marker[poly.getPath().length - 1] !== 'undefined') marker[poly.getPath().length - 1].setMap(null);
                poly.getPath().pop();


            }
            GetCordinates = [];
            poly.setMap(null);
            poly = new google.maps.Polyline({ map: map, path: [], strokeColor, strokeOpacity: 1.0, strokeWeight: 2 });
            isClosed = false;
        }
    }
    function fillCordinates(poly) {

        var bounds = [];
        for (var i = 0; i < poly.getPath().length; i++) {
            var point = {
                lat: poly.getPath().getAt(i).lat(),
                lng: poly.getPath().getAt(i).lng()
            };
            bounds.push(point);
        }
        //Console log our array with the points.
        GetCordinates = bounds;


    }
    function BuildGoogleButton(text, icon) {
        var controlMarkerUI = document.createElement('button');
        controlMarkerUI.style.cursor = 'pointer';
        controlMarkerUI.style.backgroundColor = '#ffffff';
        controlMarkerUI.style.height = '38px';
        controlMarkerUI.style.width = '40px';
        controlMarkerUI.innerHTML = icon;
        controlMarkerUI.style.marginLeft = '10px';
        controlMarkerUI.style.marginTop = '10px';
        controlMarkerUI.title = text;
        controlMarkerUI.style.border = '0px none';
        controlMarkerUI.style.margin = '10px';
        controlMarkerUI.style.padding = '0px';
        controlMarkerUI.style.boxShadow = ' rgba(0, 0, 0, 0.3) 0px 1px 4px -1px';
        controlMarkerUI.classList.add("gm-control-active");
        return controlMarkerUI;

    }
    const saveChanges = async () => {
        setLoader(true);

        let founderror = false;

        if (GetCordinates.length === 0) {
            fstate.errors.delivery_area = true;
            founderror = true;
        } else {
            fstate.errors.delivery_area = false;
        }
        if (!isNumeric(InputVal('delivery_time'))) {
            fstate.errors.delivery_time = '';
            founderror = true;
        } else {
            fstate.errors.delivery_time = false;
        }
        if (InputVal('min_order') === '') {
            fstate.errors.min_order = '';
            founderror = true;
        } else {
            fstate.errors.min_order = false;
        }
        if (InputVal('zone_name') === '') {
            fstate.errors.zone_name = '';
            founderror = true;
        } else {
            fstate.errors.zone_name = false;
        }
        if (!founderror) {
            let what = 'add';
            let zone = 0;
            if (typeof props.zone !== 'undefined') {
                what = 'update';
                zone = props.zone;
            }
            let myObj = {
                do: what,
                name: InputVal('zone_name'),
                min_order: InputVal('min_order'),
                delivery_time: InputVal('delivery_time'),
                area: GetCordinates,
                store_id: props.edit,
                zone: zone,



            }
            let la = await UseAxios(myObj, 'stores/delivery_zones');
            if (la.status === 'zone-exists') {
                sendToast(translate('Error: Zone already exists with that name'));
                return;
            }
            if (la.status === 'ok') {
                sendToast(translate('Saved'));
            
                ReactDOM.render(

                    <DeliveryMap translate={translate} edit={props.edit} coordinates={{ lat: storelat, lng: storelng }} />

                    , document.getElementById('page-content'));
            } else {
                sendToast('Error');
            }


        }
        setFstate({ ...fstate })
        setLoader(false);

    }
    const DeleteZone = async () => {
        let la = await UseAxios({ do: 'delete', zone: props.zone, store_id: props.edit }, 'stores/delivery_zones');

        if (la.status === 'ok') {
            sendToast('Deleted');
            ReactDOM.render(

                <DeliveryMap edit={props.edit} coordinates={{ lat: storelat, lng: storelng }} />

                , document.getElementById('page-content'));
        } else {
            sendToast(translate('Error'));
        }
    }
    return (
        <>
            <div style={{ padding: '3px', margin: '3px', minWidth: '340px', width: '100%' }} className=" mdl-cell--7-col mdl-shadow--2dp">
                <div className="mdl-layout__header-row mdl-card__supporting-text">
                    <h4>{translate('Delivery')}</h4></div>



                <Input isinvalid={fstate.errors.zone_name} type="text" defaultValue={window.newstoreadding ? "Zone 1" : ""} style={{ width: '100%' }} text={translate("Zone name")} id="zone_name" icon="category" />
                <div className={fstate.errors.delivery_area ? "invalidlabel tabledate_divc" : "tabledate_divc"}>
                    <i className="material-icons tableDate_icon " >map</i> <label className={"div_option"}>{translate("Enclose supported area")}</label>  </div>
                <div style={{ width: '100%', height: '350px' }} id="map"></div>
                <Input isinvalid={fstate.errors.delivery_time} type="text" style={{ width: '100%' }} text={translate("Delivery time in minutes")} id="delivery_time" icon="directions_bike" />
                <Input isinvalid={fstate.errors.min_order} type="text" style={{ width: '100%' }} text={translate("Min order")} id="min_order" icon="attach_money" />
                <div className="mdl-card__actions mdl-card--border">
                    <div className="center-align">
                        {typeof props.zone !== 'undefined' &&
                            <button style={{ margin: '15px' }} onClick={DeleteZone} className="mdl-button mdl-js-button mdl-button--raised mdl-button--accent">
                                {translate("Delete")}
                            </button>}

                        <button style={{ margin: '15px' }} disabled={loader} onClick={saveChanges} className="mdl-button mdl-js-ripple-effect mdl-js-button  mdl-button--raised mdl-button--colored">
                            {!loader && <>{translate("Save")}</>}
                            <img className="center-align" style={{ padding: '0', alignself: 'center', width: '30px', height: '30px', display: loader ? 'inline-block' : 'none' }} src={smallloader} alt={"loading..."} />

                        </button>





                    </div>
                </div>

            </div>
        </>
    )
}

export default AddZone;