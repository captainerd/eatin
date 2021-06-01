import React, { useEffect, useState, useRef } from 'react';
import Input from '../CompoViews/Input'
import Select from '../CompoViews/Select'
import { InputVal, UseAxios, sendToast } from '../functions/Functions';
import Multiselect from '../CompoViews/Multiselect'
import TimePicker from 'react-times';
import 'react-times/css/material/default.css';
import smallloader from '../images/smallloader.gif';
import '../css/store.css';
import Loading from '../Loading'




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
function timeConvert(n) {
    var num = n;
    var hours = (num / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    if (rhours < 10) {
        rhours = '0' + rhours;
    }
    if (rminutes < 10) {
        rminutes = '0' + rminutes;
    }
    return rhours + ":" + rminutes;
}

//for requiring a script loaded asynchronously.
function loadScript(src, callback) {
    var s,
        r,
        t;
    r = false;
    s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = src;
    s.async = true;
    s.onload = s.onreadystatechange = function () {
        ////console.log( this.readyState ); //uncomment this line to see which ready states are called.
        if (!r && (!this.readyState || this.readyState == 'complete')) {
            r = true;
            callback();
        }
    };
    t = document.getElementsByTagName('script')[0];
    t.parentNode.insertBefore(s, t);
}

function EditaStore(props) {
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
    const [siteselected, Setsiteselected] = useState({ options: [] });

    const [loading, setLoading] = useState(true);

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




        weekDates.map((item) => {

            datesWork.days[item.id] = {
                time_open: '00:00',
                time_close: '00:00',
                label: item.label,
                is_open: true,

            }


        });

        loadCategories();
        loadStoreInfo();

        SetdatesWork({ days: datesWork.days });
        document.getElementById('tablediv').style.maxHeight = '390px';
        geolocate();
    }, []);
    const loadStoreInfo = async () => {
        let la = await UseAxios({ id: props.edit, do: 'list' }, 'stores/edit_store');
        if (la.status === 'ok') {
            let timeOb = {};
            Object.keys(la.store.schedule).map(item => {


                datesWork.days[item].is_open = la.store.schedule[item].is_open;



                datesWork.days[item].time_open = timeConvert(la.store.schedule[item].time_open);
                datesWork.days[item].time_close = timeConvert(la.store.schedule[item].time_close);

            });
            SetdatesWork({ days: datesWork.days });

            document.getElementById('store_address').value = la.store.street_name + ', ' + la.store.street_number + ', ' + la.store.city + ', ' + la.store.postal_code;
            document.getElementById('store_name').value = la.store.store_name;
            fstate.address.lat = la.store.lat;
            fstate.address.lng = la.store.lng;
            fstate.address.obj = {
                street_name: la.store.street_name,
                street_number: la.store.street_number,
                postal_code: la.store.postal_code,
                city: la.store.city,
                district: la.store.district,
                country: la.store.country,

            }
            setFstate({ ...fstate });




            document.getElementById('store_description').value = la.store.store_description;
            document.getElementById('company_name').value = la.store.company_name;
            document.getElementById('company_vat').value = la.store.company_vat;
            document.getElementById('phone').value = la.store.phone;
            document.getElementById('phone2').value = la.store.phone2;

            document.getElementById('logo_prev').style.backgroundImage = 'url(' + window.assetsurl + la.store.logo + ')';
            document.getElementById('logo_prev').style.maxHeight = '200px';
            document.getElementById('logo_prev').style.height = '200px';
            let newun = [];
            Object.keys(la.store.categories).map(item => {

                sitecats.options.map((itema) => {

                    if (itema.id === item) {
                        siteselected.options.push(itema);
                    } else {
                        newun.push(itema)
                    }


                })



            });

            setTimeout(() => {
                Setsiteselected(siteselected);

            }, 5000);






            initMap({ lat: la.store.lat, lng: la.store.lng });

        }
        setLoading(false);

    }
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
            //console.log(fstate);

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
            //  document.getElementById('tablediv').style.maxHeight = '390px';
        } else {
            //   document.getElementById('tablediv').style.maxHeight = '32px';
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

        /*
                if (InputVal('logo_file') === '') {
                    fstate.errors.logo = '';
                    founderror = true;
                } else {
                    fstate.errors.logo = false;
                }*/


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
                store: props.edit

            }

            var formData = new FormData();


            formData.append("image", fileup);
            formData.append("cover", fileup2);
            formData.append("data", JSON.stringify(myObj));
            formData.append("do", 'update');
            setLoader(true);
            let la = await UseAxios(formData, 'stores/edit_store');
            if (la.status === 'url-exists') {
                fstate.errors.store_name = translate('This store name exists already');
                sendToast(translate('This store name exists already'));
                setFstate({ ...fstate });
                setLoader(false);
                return;

            }
            if (la.status === 'ok') {
                sendToast(translate('Information updated'));
            } else {
                sendToast('Error');
            }



            setLoader(false);
        }
    }
    const  deleteStore = async () => {
       let r = window.confirm("Delete????????");

       if (r == true) {
       let la = await UseAxios({store_id: props.edit},'admin/delete_store')
       if (la.status === 'ok') sendToast('Store deleted.');
      }  

    }
    const geolocate = function () {
        if (navigator.geolocation && !window.geolocated) {

            navigator.geolocation.getCurrentPosition(function (position) {
                var geolocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                initMap(geolocation);
                lat = position.coords.latitude;
                lng = position.coords.longitude;


                /*global google*/ // To disable any eslint 'google not defined' errors
                var circle = new google.maps.Circle(
                    { center: geolocation, radius: position.coords.accuracy });
                //                autocomplete.setBounds(circle.getBounds());
            });

        }
    }

    const OnSelectedCats = (e) => {
        categories = e;
        //console.log(categories);
    }

    return (
        <>
            {loading && <Loading />}
            <div style={loading ? { display: 'none' } : { padding: '3px', margin: '3px', minWidth: '340px', overflow: 'hidden', width: '100%' }} className=" mdl-cell--7-col mdl-shadow--2dp">
                <div className="mdl-layout__header-row mdl-card__supporting-text">
                    <h4>{translate('Edit Store')}</h4></div>

                <div style={{ width: '100%', height: '150px' }} id="map"></div>
                <TimePicker
                    theme="material"
                    onTimeChange={handleTimepick}
                    time={timeComp}
                    withoutIcon={true}
                    ref={test}
                />

                <Select defaultValue=" " onSelect={(e) => OnSelected(e)} isinvalid={fstate.errors.address} showGoogle={true} autocomplete={true} onChange={(e) => onClickAddress(e)} options={storeAddress.options} style={{ width: '100%' }} label={translate("Store address")} id="store_address" icon="where_to_vote" />

                <Input defaultValue=" " isinvalid={fstate.errors.store_name} type="text" style={{ width: '100%' }} text={translate("Store name")} id="store_name" icon="store" />

                <div className="tabledate_divc">
                    <i style={{ cursor: 'pointer' }} onClick={toggleTable} className="material-icons tableDate_icon mdl-color-text--primary">alarm</i>

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
                <Multiselect defaultValue=" " onSelect={(e) => OnSelectedCats(e)} isinvalid={fstate.errors.categories} selected={siteselected.options} options={sitecats.options} style={{ width: '100%' }} label={translate("Categories")} id="store_categoriesv" icon="notes" />

                <Input defaultValue=" " isinvalid={fstate.errors.description} type="text" style={{ width: '100%' }} text={translate("Store information")} id="store_description" icon="store" />
                <Input defaultValue=" " isinvalid={fstate.errors.company} type="text" style={{ width: '50%' }} text={translate("Company name")} id="company_name" icon="business_center" />
                <Input defaultValue=" " isinvalid={fstate.errors.vat} type="text" style={{ width: '50%' }} text={translate("VAT Number")} id="company_vat" icon="business_center" />
                <Input defaultValue=" " isinvalid={fstate.errors.phone} type="text" style={{ width: '50%' }} text={translate("Phone")} id="phone" icon="phone" />
                <Input type="text" style={{ width: '50%' }} text={translate("Phone 2")} id="phone2" icon="phone" />
                <div id="logo_prev" onClick={togglePicture} className='logo_prev' >




                </div>
                <Input defaultValue=" " isinvalid={fstate.errors.logo} type="text" onClick={(e) => document.getElementById('logo_file').click()} style={{ width: '100%' }} defaultValue=" " text={translate("Logo (400x400 pixels)")} id="logo" icon="attach_file" />
                <input placeholder="" onChange={handleOnChange_file_add} id="logo_file" type="file" style={{ display: 'none' }} />

                <Input defaultValue=" " isinvalid={fstate.errors.logo} type="text" onClick={(e) => document.getElementById('cover_file').click()} style={{ width: '100%' }} defaultValue=" " text={translate("Cover (1280x720 pixels)")} id="cover" icon="attach_file" />
                <input placeholder="" onChange={handleOnChange_file_add} id="cover_file" type="file" style={{ display: 'none' }} />


                <div className="mdl-card__actions mdl-card--border">
                    <div className="center-align">
{JSON.parse(window.localStorage.getItem('user')).role === 3 &&
<>
<button style={{marginRight: '30px'}} disabled={loader} onClick={(e) => deleteStore()} className="mdl-button mdl-js-ripple-effect mdl-js-button  mdl-button--raised mdl-button--accent">
                            {!loader && <>Delete</>}
                            <img className="center-align" style={{ padding: '0', alignself: 'center', width: '30px', height: '30px', display: loader ? 'inline-block' : 'none' }} src={smallloader} alt={"loading..."} />

                        </button>

</>}

                        <button disabled={loader} onClick={saveChanges} className="mdl-button mdl-js-ripple-effect mdl-js-button  mdl-button--raised mdl-button--colored">
                            {!loader && <>Save</>}
                            <img className="center-align" style={{ padding: '0', alignself: 'center', width: '30px', height: '30px', display: loader ? 'inline-block' : 'none' }} src={smallloader} alt={"loading..."} />

                        </button></div>
                </div>

            </div>
        </>
    );
}

export default EditaStore;