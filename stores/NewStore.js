import React, { useEffect, useState, useRef } from 'react';
import Input from '../CompoViews/Input'
import Select from '../CompoViews/Select'
import { InputVal, UseAxios, sendToast } from '../functions/Functions';
import Multiselect from '../CompoViews/Multiselect'
import TimePicker from 'react-times';
import 'react-times/css/material/default.css';
import smallloader from '../images/smallloader.gif';
import '../css/store.css';
import ReactDOM from 'react-dom';
import AddZone from './AddZone';

let timeToChange = '';
let seletedDate = 'monday';
let tableopen = false;
let categories = [];
let fileup = '';
let fileup2 = '';
let hasbeenseen = false;

var lat = '';
var lng = '';
var the_timer = '';
var session = makeSession(50);
function makeSession(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
function NewStore(props) {
    const translate = props.translate



    const weekDates = [

        { id: 'monday', label: translate('Monday'), default: true },
        { id: 'tuesday', label: translate('Tuesday') },
        { id: 'wednesday', label: translate('Wednesday') },
        { id: 'thursday', label: translate('Thursday') },
        { id: 'friday', label: translate('Friday') },
        { id: 'saturday', label: translate('Saturday') },
        { id: 'sunday', label: translate('Sunday') },

    ]
    const [timeComp, SetTimeComp] = useState('00:00');
    const [storeAddress, SetStoreAddress] = useState({ options: [] });
    const [sitecats, Setsitecats] = useState({ options: [] });
    const [datesWork, SetdatesWork] = useState({ days: {} });
    const [loader, setLoader] = useState(false);
    const [fstate, setFstate] = useState({
        address: {
            lat: '',
            lng: '',
            obj: {},

        },
        errors: {
            address: false,
            logo: false,
            description: false,
            store_name: false,
            categories: false,
            phone: false,
            vat: false,
            company: false,
        },
    });
    const test = useRef(null);

    //    document.getElementById('preload').style.display = 'none';

    useEffect(() => {
        if (typeof window.componentHandler !== 'undefined') window.componentHandler.upgradeAllRegistered();
    });
    useEffect(() => {






        geolocate();



        weekDates.map((item) => {

            datesWork.days[item.id] = {
                time_open: '00:00',
                time_close: '00:00',
                label: item.label,
                is_open: true,

            }


        });

        loadCategories();

        document.getElementById('tablediv').style.maxHeight = '390px';
        SetdatesWork({ days: datesWork.days });
    }, []);

    const loadCategories = async () => {
        let la = await UseAxios({ do: 'list' }, 'stores/categories');
        if (la.status === 'ok') {
            sitecats.options = la.cats;
            Setsitecats({ ...sitecats });


        }
    }
    const onClickAddress = async (geo) => {
        let la = '';

        clearTimeout(the_timer);
        if (typeof geo === 'object') the_timer = setTimeout(() => onClickAddress(true), 800);
        if (typeof geo === 'object') return
        if (geo === true) {
            let la = await UseAxios({ session: session, lat: lat, lng: lng, query: InputVal('store_address') }, 'geolocation/autocomplete');

            SetStoreAddress(la);
        }
    }
    const OnSelected = async (e) => {
        let la = atob(e.id);
        la = JSON.parse(la);

        if (la.position.coordinates !== null) {

            fstate.address.lat = la.position.coordinates[0];
            fstate.address.lng = la.position.coordinates[1];
            fstate.address.obj = {
                street_name: la.street_name,
                street_number: la.street_number,
                postal_code: la.postal_code,
                city: la.city,
                district: la.district,
                country: la.country,

            }
            session = makeSession(50);
            setFstate({ ...fstate });


            initMap({ lat: fstate.address.lat, lng: fstate.address.lng });

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
    const handleTimepick = (e) => {
        // //console.log(timeToChange);


        SetTimeComp(e.hour + ':' + e.minute);

        datesWork.days[seletedDate][timeToChange] = e.hour + ':' + e.minute;

        //deftera, oles tis meres idio.
        //console.log(seletedDate);
        if (seletedDate === 'monday') {
            Object.keys(datesWork.days).map((item) => {
                datesWork.days[item][timeToChange] = e.hour + ':' + e.minute;


            });


        }
        SetdatesWork({ days: datesWork.days });
    }


    const handleisOpen = (e, we) => {


        datesWork.days[e].is_open = we.target.checked;


        SetdatesWork({ days: datesWork.days });


    }
    const handleOnChange_file_add = (e) => {
        if (e.target.files && e.target.files[0]) {
            //fileup = e.target.files[0];
            if (e.target.id === 'logo_file') {
                fileup = e.target.files[0];
                document.getElementById('logo').value = e.target.files[0].name;
            }

            if (e.target.id === 'cover_file') {
                fileup2 = e.target.files[0];
                document.getElementById('cover').value = e.target.files[0].name;
            }

            var reader = new FileReader();

            reader.onload = function (e) {
                //  if (this.width !== 400 || this.height !== 400)

                document.getElementById('logo_prev').style.backgroundImage = 'url(' + e.target.result + ')';
            }
            reader.readAsDataURL(e.target.files[0]);
            document.getElementById('logo_prev').style.maxHeight = '200px';
            document.getElementById('logo_prev').style.height = '200px';

        }
    }
    const showTable = () => {
        tableopen = true;
        hasbeenseen = true;
        document.getElementById('tablediv').style.maxHeight = '390px';
    }
    const toggleTable = (e) => {
        if (!tableopen) {
            hasbeenseen = true;
            tableopen = true;
            //   document.getElementById('tablediv').style.maxHeight = '390px';
        } else {
            //     document.getElementById('tablediv').style.maxHeight = '32px';
            tableopen = false;
        }
    }
    const toggleTablec = (e) => {
        tableopen = false;
        document.getElementById('tablediv').style.maxHeight = '32px';
    }
    const changeDayTime = (item, what) => {

        seletedDate = item;
        timeToChange = what;
        test.current.onFocus();

    }
    const togglePicture = (e) => {
        //  document.getElementById('logo_prev').style.maxHeight = '0px';
    }
    const saveChanges = async (e) => {
        //send data to server
        let founderror = false;

        if (typeof fstate.address.obj.postal_code === 'undefined' || fstate.address.lat === '' || typeof fstate.address.lat === 'undefined' || InputVal('store_address') === '') {

            fstate.errors.address = '';
            founderror = true;
        } else {

            fstate.errors.address = false;
        }
        if (categories.length === 0) {
            fstate.errors.categories = '';
            founderror = true;
        } else {
            fstate.errors.categories = false;
        }

        if (InputVal('store_name') === '') {
            fstate.errors.store_name = '';
            founderror = true;
        } else {
            fstate.errors.store_name = false;
        }
        if (InputVal('store_description') === '') {
            fstate.errors.description = '';
            founderror = true;
        } else {
            fstate.errors.description = false;
        }
        if (InputVal('company_name') === '') {
            fstate.errors.company = '';
            founderror = true;
        } else {
            fstate.errors.company = false;
        }
        if (InputVal('company_vat') === '') {
            fstate.errors.vat = '';
            founderror = true;
        } else {
            fstate.errors.vat = false;
        }
        if (InputVal('phone') === '') {
            fstate.errors.phone = '';
            founderror = true;
        } else {
            fstate.errors.phone = false;
        }


        if (InputVal('logo_file') === '') {
            fstate.errors.logo = '';
            founderror = true;
        } else {
            fstate.errors.logo = false;
        }


        setFstate({ ...fstate });


        if (!founderror) {

            let myObj = {
                store_name: InputVal('store_name'),
                store_address: fstate.address,
                store_description: InputVal('store_description'),
                company_name: InputVal('company_name'),
                company_vat: InputVal('company_vat'),
                phone: InputVal('phone'),
                phone2: InputVal('phone2'),
                store_categories: categories,
                store_schedule: datesWork.days,

            }

            var formData = new FormData();


            formData.append("image", fileup);
            formData.append("cover", fileup2);
            formData.append("data", JSON.stringify(myObj));
            setLoader(true);
            let la = await UseAxios(formData, 'stores/new_store');
            if (la.status === 'url-exists') {
                fstate.errors.store_name = 'This store name exists already';
                sendToast(translate('This store name exists already'));
                setFstate({ ...fstate });
                setLoader(false);
                return;

            }
            if (la.status === 'ok') {
                sendToast(translate('New store added'));


                window.reloadstores();

                window.newstoreadding = 1;

                ReactDOM.render( <AddZone translate={translate} edit={la.store_id} coordinates={{ lat: fstate.address.lat, lng: fstate.address.lng }} />
    
                    , document.getElementById('page-content'));


            } else {
                sendToast(translate('Error'));
            }



            setLoader(false);
        }
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

        }
    }
    const OnSelectedCats = (e) => {
        categories = e;

    }
    return (
        <>

            <div style={{ padding: '3px', margin: '3px', minWidth: '340px', overflow: 'hidden', width: '100%' }} className=" mdl-cell--7-col mdl-shadow--2dp">
                <div className="mdl-layout__header-row mdl-card__supporting-text">
                    <h4>{translate('New Store')}</h4></div>

                <div style={{ width: '100%', height: '150px' }} id="map"></div>
                <TimePicker
                    theme="material"
                    onTimeChange={handleTimepick}
                    time={timeComp}
                    withoutIcon={true}
                    ref={test}
                />

                <Select onSelect={(e) => OnSelected(e)} isinvalid={fstate.errors.address} showGoogle={true} autocomplete={true} onChange={(e) => onClickAddress(e)} options={storeAddress.options} style={{ width: '100%' }} label={translate("Store address")} id="store_address" icon="where_to_vote" />

                <Input isinvalid={fstate.errors.store_name} type="text" style={{ width: '100%' }} text={translate("Store name")} id="store_name" icon="store" />

                <div className="tabledate_divc">
                    <i style={{ cursor: 'pointer' }} onClick={toggleTable} className="material-icons mdl-color-text--primary tableDate_icon ">alarm</i>

                    <div tabindex="2" onFocus={showTable} id="tablediv" className="tabledate_div">


                        <table onClick={showTable} className="dateTimeTable">



                            <tr>   <td className="tablehead">{translate("Day")}</td>
                                <td className="tablehead">{translate("Work")}</td>
                                <td className="tablehead">{translate("Opens")}</td>
                                <td className="tablehead">{translate("Closes")}</td>  </tr>
                            {Object.keys(datesWork.days).map(item => (

                                < tr > <td className="dateTimeTable">{datesWork.days[item].label}</td>
                                    <td className="dateTimeTable">

                                        <Input defaultValue={datesWork.days[item].is_open} className="ToggleDate" text="" type="toggle" onChange={(e) => handleisOpen(item, e)} />






                                    </td>

                                    <td className="dateTimeTable">
                                        <a style={{ cursor: 'pointer' }} onClick={(e) => changeDayTime(item, 'time_open')}> {datesWork.days[item].time_open}</a>

                                    </td>
                                    <td className="dateTimeTable">

                                        <a style={{ cursor: 'pointer' }} onClick={(e) => changeDayTime(item, 'time_close')}>
                                            {datesWork.days[item].time_close}
                                        </a>
                                    </td>


                                </tr>



                            ))}
                        </table>
                        <i style={{ cursor: 'pointer' }} onClick={toggleTablec} className="expand_less_table material-icons tableDate_icon ">expand_less</i>
                    </div>
                </div>
                <Multiselect onSelect={(e) => OnSelectedCats(e)} isinvalid={fstate.errors.categories} options={sitecats.options} style={{ width: '100%' }} label={translate("Categories")} id="store_categories" icon="notes" />

                <Input defaultValue=" " isinvalid={fstate.errors.description} type="text" style={{ width: '100%' }} text={translate("Store information")} id="store_description" icon="store" />
                <Input isinvalid={fstate.errors.company} type="text" style={{ width: '50%' }} text={translate("Company name")} id="company_name" icon="business_center" />
                <Input isinvalid={fstate.errors.vat} type="text" style={{ width: '50%' }} text={translate("VAT Number")} id="company_vat" icon="business_center" />
                <Input isinvalid={fstate.errors.phone} type="text" style={{ width: '50%' }} text={translate("Phone")} id="phone" icon="phone" />
                <Input type="text" style={{ width: '50%' }} text={translate("Phone 2")} id="phone2" icon="phone" />
                <div id="logo_prev" onClick={togglePicture} className='logo_prev' >




                </div>
                <Input isinvalid={fstate.errors.logo} type="text" onClick={(e) => document.getElementById('logo_file').click()} style={{ width: '100%' }} defaultValue=" " text={translate("Logo (400x400 pixels)")} id="logo" icon="attach_file" />
                <input placeholder="hi" onChange={handleOnChange_file_add} id="logo_file" type="file" style={{ display: 'none' }} />

                <Input defaultValue=" " isinvalid={fstate.errors.logo} type="text" onClick={(e) => document.getElementById('cover_file').click()} style={{ width: '100%' }} defaultValue=" " text={translate("Cover (1280x720 pixels)")} id="cover" icon="attach_file" />
                <input placeholder="" onChange={handleOnChange_file_add} id="cover_file" type="file" style={{ display: 'none' }} />


                <div className="mdl-card__actions mdl-card--border">
                    <div className="center-align">
                        <button disabled={loader} onClick={saveChanges} className="mdl-button mdl-js-ripple-effect mdl-js-button  mdl-button--raised mdl-button--colored">
                            {!loader && <>{translate("Save")}</>}
                            <img className="center-align" style={{ padding: '0', alignself: 'center', width: '30px', height: '30px', display: loader ? 'inline-block' : 'none' }} src={smallloader} alt={"loading..."} />

                        </button></div>
                </div>

            </div>
        </>
    );
}

export default NewStore;