import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import Input from '../CompoViews/Input';
import Select from '../CompoViews/Select';
import { removeClass, UseAxios, sendToast, InputVal, isNumeric } from '../functions/Functions';

var GeoLocated = false;
var nextStep = false;
var reGetCordinates = false;
var the_timer = '';
var lat = '';
var lng = '';
var session = makeSession(50);
var who = '';
function makeSession(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function GetStreetOb(str) {
    if (typeof str === 'undefined') {
        return false;
    }
    //an den vrethei parsing.
    //elada, patra, niarxou 15. = street=niarxou num=15
    //kapoy ekei makria 15 = street=makria num=18
    //perioxh, polh, patriaxou ioakeim 15 = street=patriarxou iakeim (duo lekseis)
    //polh tin agnow, alla me ena replace apo to apotelesma auth menei.
    var res = str.split(",");
    var found = false;
    var myOb = {};
    myOb.street = '';
    if (res.length > 1) {
        res.forEach(function (item, index) {
            var lo = item.split(' ');
            if (isNumeric(lo[lo.length - 1])) {
                found = true;
                myOb.number = lo[lo.length - 1];
                lo.forEach(function (item2, index2) {
                    if (index2 < lo.length - 1) {
                        if (item2 !== '' && index2 < lo.length - 2) {
                            myOb.street += item2 + ' ';
                        } else {
                            myOb.street += item2;
                        }
                    }
                });
            }
        });
        if (found === true) return myOb;
    }
    var res = str.split(" ");
    var myOb = {};
    res.forEach(function (item, index) {
        var la = index + 1;
        if (la < res.length) {
            if (isNumeric(res[la].replace(',', ''))) {
                myOb.street = res[index].replace(',', '');

                myOb.number = res[la].replace(',', '');
            }
        }
    });
    return myOb;
}


var OnceSelected = '';

function AddAddress(props) {
    const translate = props.translate
    const [fselect, setFselect] = useState({
        address: [],
        city: [],
        postal: [],
        street: []
    });
    const [fstate, setFstate] = useState({
        errors: {
            phone1: false,
            phone2: false,
            address: false,
            bell: false,
            floor: false,
            emoticon: '',
        },
        buttonmsg: translate('Next'),
        address: {
            lat: '',
            lng: '',
            obj: {},

        }
    });



    const handleNext = async (e) => {
        let founderror = false;
        if (nextStep === false) {
            if (OnceSelected !== InputVal('address')) {
                fstate.address.obj = {};
                fstate.address.lat = '';
                fstate.address.lng = '';
            }


            if (InputVal('phone1').replace('+', '00').replace('-', '').length < 10 || !isNumeric(InputVal('phone1').replace('+', '00').replace('-', ''))) {



                fstate.errors.phone1 = 'Invalid phone';
                founderror = true;
            } else {
                fstate.errors.phone1 = false;
                fstate.address.phone1 = InputVal('phone1').replace('+', '00').replace('-', '');
            }

            if (InputVal('phone2') !== '') {
                if (InputVal('phone2').replace('+', '00').replace('-', '').length < 10 || !isNumeric(InputVal('phone2').replace('+', '00').replace('-', ''))) {


                    fstate.errors.phone2 = 'Invalid phone';
                    founderror = true;

                } else {
                    fstate.errors.phone2 = false;
                    if (InputVal('phone2').length > 9) fstate.address.phone2 = InputVal('phone2').replace('+', '00').replace('-', '');
                }
            } else {
                fstate.errors.phone2 = false;
                if (InputVal('phone2').length > 9) fstate.address.phone2 = InputVal('phone2').replace('+', '00').replace('-', '');

            }

            if (InputVal('address').length < 3) {
                fstate.errors.address = 'Please type your address';
                founderror = true;
            } else {
                fstate.errors.address = false;
                fstate.address.typed = InputVal('address');
            }

            if (InputVal('floor').length < 1) {
                fstate.errors.floor = '';
                founderror = true;
            } else {
                fstate.errors.floor = false;
                fstate.address.floor = InputVal('floor');
            }

            if (InputVal('bell').length < 1) {
                fstate.errors.bell = '';
                founderror = true;
            } else {
                fstate.errors.bell = false;
                fstate.address.bell = InputVal('bell');
            }
            if (fstate.address.lat === '') {

                let la = GetStreetOb(fstate.address.typed);
                fstate.address.obj.street_number = la.number;
                fstate.address.obj.street_name = la.street;
                reGetCordinates = true;


            }

            setFstate({ ...fstate });
            if (!founderror) {





                // document.getElementById('norm').style.display = 'none';
                //  document.getElementById('second').style.display = 'block';

                fstate.buttonmsg = 'Save';
                setFstate({ ...fstate });
                if (fstate.address.lat.length === 0) {

                    fstate.errors.city = '';
                    fstate.errors.postal_code = '';
                    fstate.errors.emoticon = 'sentiment_very_dissatisfied';
                    setFstate({ ...fstate });

                }

                nextStep = true;

            }
        }

        if (nextStep === true) {
            let founderror = false;

            if (InputVal('street_name').length < 3) {
                fstate.errors.street_name = '';
                founderror = true;
            } else {
                fstate.errors.street_name = false;
            }
            if (InputVal('city').length < 3) {
                fstate.errors.city = '';
                founderror = true;
            } else {
                fstate.errors.city = false;
            }
            if (InputVal('postal_code').length < 3) {
                fstate.errors.postal_code = '';
                founderror = true;
            } else {
                fstate.errors.postal_code = false;
            }
            if (InputVal('street_number').length < 1) {
                fstate.errors.street_number = '';
                founderror = true;
            } else {
                fstate.errors.street_number = false;
            }

            if (InputVal('postal_code').replace(' ', '').length < 5) {

                founderror = true;
                fstate.errors.postal_code = ' ';
            }

            if (founderror) {
                setFstate({ ...fstate });
                return;
            }
            if (fstate.address.lat.length === 0) {

                let postal = InputVal('postal_code').replace(' ', '');
                postal = postal.substr(0, 3) + ' ' + postal.substr(3, 5);

                let res = await UseAxios({ what: 'postal_code', hint: postal }, 'geolocation/locate_address');

                if (res != undefined) {
                    //console.log(res);

                    if (res[0].lng != null) {


                        fstate.errors.postal_code = false;
                        fstate.address.lat = res[0].lat;
                        fstate.address.lng = res[0].lng;
                        fstate.address.obj = {
                            street_name: InputVal('street_name'),
                            street_number: InputVal('street_number'),
                            postal_code: postal,
                            city: InputVal('city'),
                            country: 'Greece',
                        }

                        let res2 = await UseAxios({ newAddress: fstate.address }, 'users/save_address');
                        if (res2.status === 'ok') {
                            //kleise
                            closeSaved();
                        }
                        //save
                    }



                }

            }

            fstate.address.typed = fstate.address.obj.street_name + ', ' + fstate.address.obj.street_number + ', ' + fstate.address.obj.city + ', ' + fstate.address.obj.district + ', ' + fstate.address.obj.postal_code;

            setFstate({ ...fstate });
            let res = await UseAxios({ newAddress: fstate.address }, 'users/save_address');
            if (res.status === 'ok') {
                //kleise
                closeSaved();
            }

        }







    }
    const closeSaved = () => {
        fstate.errors = {
            phone1: false,
            phone2: false,
            address: false,
            bell: false,
            floor: false,
            emoticon: '',
        }
        fstate.buttonmsg = 'Next';
        fstate.address = {
            lat: '',
            lng: '',
            obj: {},

        }
        GeoLocated = false;
        nextStep = false;
        reGetCordinates = false;

        who = '';
        setFstate({ ...fstate });
        sendToast(translate('Address added!'));
        if (typeof props.onClose === 'function') {
            props.onClose();
        }


        document.getElementById("lrdialog").style.display = "none";
        ReactDOM.unmountComponentAtNode(document.getElementById('mdl-dialog2'));

    }
    const handlefloor = (e) => {

        if (!isNumeric(e.target.value)) {

            var la = e.target;

            setTimeout(function () {

                la.value = '';
            }, 50);

        }
    }


    const handleLocType = (e) => {



    }

    const closeDialog = () => {
        document.getElementById("lrdialog").style.display = "none";
        ReactDOM.unmountComponentAtNode(document.getElementById('lrdialog'));
    }

    window.geolocated = false;




    const handlecity = async (geo, what) => {
        let la = '';

        clearTimeout(the_timer);
        if (typeof geo === 'object') the_timer = setTimeout(() => handlecity(true, what), 800);
        if (typeof geo === 'object') return
        if (what === 'address') {

            la = await UseAxios({ lat: lat, lng: lng, query: InputVal(what), session: session }, 'geolocation/autocomplete');
        }
        if (la.status === 'ok') {
            fselect[what] = la.options
            setFselect({ ...fselect });
        } else {
            sendToast(translate('Error'));
        }



    }

    const handleGeo = (geo) => {
        if (GeoLocated === false) {
            initMap(geo);
            GeoLocated = true;
        }

    }


    useEffect(() => {





        document.getElementById("address").parentNode.addEventListener("mdl-componentupgraded", function (e) { removeClass(document.getElementById("address").parentNode, "has-placeholder"); });

        window.componentHandler.upgradeAllRegistered();

    });

    useEffect(() => {


        geolocate();
        return () => {
            // //console.log("componentWillUnmount");

        };
    }, []);

    const handle_SelNext = (e) => {
        let la = atob(e.id);
        la = JSON.parse(la);

        fstate.address.lat = la.lat;
        fstate.address.lng = la.lng;



        fstate.address.obj = {
            street_name: la.region,
            street_number: InputVal('street_number'),
            postal_code: la.postal_code,
            city: la.city,
            country: 'Greece',
        }

        //console.log(la);

        setFstate({ ...fstate });
        initMap(fstate.address);

    }
    const OnSelected = async (e) => {
        OnceSelected = e.label;
        let info = atob(e.id);
        info = JSON.parse(info);

        session = makeSession(50);


        fstate.address.lat = info.position.coordinates[0];
        fstate.address.lng = info.position.coordinates[1];
        fstate.address.obj = {
            street_name: info.street_name,
            street_number: info.street_number,
            postal_code: info.postal_code,
            district: info.district,
            city: info.city,
            country: info.country,
        }
        setFstate({ ...fstate });


        initMap({ lat: info.position.coordinates[0], lng: info.position.coordinates[1] });


    }
    const geolocate = function () {
        if (navigator.geolocation && !window.geolocated) {

            navigator.geolocation.getCurrentPosition(function (position) {
                var geolocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                lat = position.coords.latitude;
                lng = position.coords.longitude;
                initMap(geolocation);


                /*global google*/ // To disable any eslint 'google not defined' errors
                var circle = new google.maps.Circle(
                    { center: geolocation, radius: position.coords.accuracy });
                //                autocomplete.setBounds(circle.getBounds());
            });
            window.geolocated = true;
        }
    }
    function initMap(geo) {
        // The location of Uluru

        // The map, centered at Uluru
        /*global google*/ // To disable any eslint 'google not defined' errors
        var map = new google.maps.Map(
            document.getElementById('map'),
            {
                zoom: 15,
                center: geo,
                streetViewControl: false,
                mapTypeControl: false
            });
        /*global google*/ // To disable any eslint 'google not defined' errors
        var marker = new google.maps.Marker({ position: geo, map: map });

    }

    return (
        <>

            <div id="map"></div>

            <div id="innerdialog"  >
                <div style={{ maxWidth: '446px', padding: '10px' }} className="controlforms">

                    <div className="mdl-layout__header-row mdl-card__supporting-text">

                        <h4>{translate('Delivery information')}</h4>

                    </div>


                    <div style={{ width: '100%' }} id="norm">

                        <Select style={{ width: '100%' }} showGoogle={true} autocomplete={true} onSelect={(e) => OnSelected(e)} onChange={(e) => handlecity(e, 'address')} options={fselect.address} isinvalid={fstate.errors.address} id="address" placeholder=" " label={translate('Address')} icon="where_to_vote" type="text" />

                        <Input style={{ width: '100%' }} isinvalid={fstate.errors.phone1} id="phone1" text={translate('Phone')} icon="phone" type="text" />
                        {/* <Input isinvalid={fstate.errors.phone2} id="phone2" style={{ width: '150px' }} text={'Phone 2'} icon="hide" type="text" />*/}



                        <Input isinvalid={fstate.errors.bell} id="bell" style={{ width: '70%' }} text={translate('Door-bell name')} icon="notifications_none" type="text" />

                        <Input isinvalid={fstate.errors.floor} id="floor" style={{ width: '30%' }} text={translate('Floor')} onChange={(e) => handlefloor(e)} icon="business" type="number" min="-5" max="200" />



                        <hr></hr>

                    </div>
                    <div style={{ display: 'none' }} id="second">

                        <i className={"material-icons icon-indicator"}>{fstate.errors.emoticon}</i>


                        <Select onSelect={(e) => handle_SelNext(e)} options={fselect.street_name} autocomplete={true} style={{ width: 'calc(100% - 80px)' }} defaultValue={fstate.address.obj.street_name} isinvalid={fstate.errors.street_name} onClick={(e) => handlecity(e, 'address')} onChange={(e) => handlecity(e, 'street_name')} id="street_name" placeholder=" " label={'Street name'} icon="where_to_vote" type="text" />
                        <Select options={fselect.street_number} autocomplete={true} style={{ width: '80px' }} defaultValue={fstate.address.obj.street_number} isinvalid={fstate.errors.street_number} onChange={handleLocType} id="street_number" placeholder=" " label={'Number'} icon="hide" type="text" />
                        <Select onSelect={(e) => handle_SelNext(e)} options={fselect.city} autocomplete={true} style={{ width: 'calc(100% - 110px)' }} defaultValue={fstate.address.obj.city} isinvalid={fstate.errors.city} onChange={handleLocType} id="city" onChange={(e) => handlecity(e, 'city')} placeholder=" " label={'City'} icon="where_to_vote" type="text" />

                        <Select onSelect={(e) => handle_SelNext(e)} options={fselect.postal_code} autocomplete={true} style={{ width: '110px' }} defaultValue={fstate.address.obj.postal_code} isinvalid={fstate.errors.postal_code} onChange={(e) => handlecity(e, 'postal_code')} id="postal_code" placeholder=" " label={'Postal code'} icon="hide" type="text" />




                    </div>
                </div>
            </div>
            <div className="mdl-dialog__actions">

                <button type="button" onClick={e => closeDialog(e)} className="mdl-button mdl-js-button mdl-button--raised">{translate('Close')}</button>
                <button type="button" onClick={e => handleNext(e)} className=" mdl-button--colored mdl-button mdl-js-button mdl-button--raised">{fstate.buttonmsg}</button>
            </div>



        </>

    )
}



export default AddAddress;