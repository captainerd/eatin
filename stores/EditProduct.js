import React, { useEffect, useState, useRef } from 'react';
import Input from '../CompoViews/Input'
import Select from '../CompoViews/Select'
import { InputVal, sendToast, UseAxios } from '../functions/Functions';
import Multiselect from '../CompoViews/Multiselect'
import TimePicker from 'react-times';
import 'react-times/css/material/default.css';
import smallloader from '../images/smallloader.gif';
import '../css/store.css';
import greekicon from '../images/greece.png';
import enicon from '../images/united-kingdom.png';

var catsdivc = false;
var firstload = false;
var fileup = '';
var seletedDate = '';
var SelectedCategory = [];
const flagOps = [
    { id: 'greek', label: '', img: greekicon, default: true },
    { id: 'english', label: '', img: enicon }
]

var selectedProduct = '';
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
export function EditProduct(props) {
    const translate = props.translate
    const test = useRef(null);
    const [loader, setLoader] = useState(false);
    const [loader2, setLoader2] = useState(false);
    const [loadercat, setLoadercat] = useState(true);
    const [catlist, setCatlist] = useState([]);
    const [productlist, setProductlist] = useState([]);
    const [catlistPro, setCatlistPro] = useState([]);

    const [fstate, setFstate] = useState({

        errors: {
            cat_en: false,
            cat_gr: false,
            price: false,
            editproduct_desc_en: false,
            editproduct_desc_gr: false,
            category: false,
            editproduct_name_en: false,
            editproduct_name_gr: false,

        },
    });

    const [grouplist, setGrouplist] = useState({ op: [] });
    const [editproduct_open, setProductOpen] = useState('00:00');
    const [editproduct_close, setProductClose] = useState('00:00');
    const [timeComp, SetTimeComp] = useState('00:00');
    const [ButtonLang, SetButtonLang] = useState(' ButtonLangAct ');
    const [SelCategory, setSelCategory] = useState([]);

    const [ButtonLangen, SetButtonLangen] = useState('   ');
    const [availGeneral, setavailGeneral] = useState(false);
    useEffect(() => {
        firstload = false;
        loadCats();
        showLang('gr', 'en');
    }, []);
    useEffect(() => {
        window.componentHandler.upgradeAllRegistered();
    });
    window.editPrudctreload = () => {
        loadCats();

    }
    const loadCats = async () => {
        if (!firstload) setLoadercat(true);

        let la = await UseAxios({ do: 'load', id: props.edit }, 'stores/get_products');
        if (la.status === 'ok') {
            window.ProductList = la.products;
            setProductlist(la.products);
        }

        la = await UseAxios({ do: 'load', id: props.edit }, 'stores/private_categories');


        if (la.status === 'ok') {
            try {
                setCatlist(la.cats);
                let ProCuts = [];
                la.cats.map(item => {
                    let MyObj = {
                        id: item._id.oid,
                        label: item.cat_gr
                    }
                    ProCuts.push(MyObj);

                    setCatlistPro(ProCuts);

                });
            } catch (error) {

            }
            if (!firstload) setLoadercat(false);



            firstload = true;

        }
    }


    const AddGroup = () => {
//        grouplista = grouplist;
        let posa = grouplist.op.length + 1;
        let grouplista =
        {
            error: false,
            error_en: false,
            en: ' ',
            error_price: false,
            id: posa,
            ops: [
                {
                    id: 1,
                    error: false,
                    error_en: false,
                    error_price: false,
                    en: ' ',
                }
            ],

        }

        grouplist.op.push(grouplista);
        setGrouplist({ ...grouplist });
        setTimeout(() => {
            showLang('gr', 'en');
        }, 200);


    }
    const AddOption = (e) => {
        e = e - 1;
        let NewOpt = {
            id: grouplist.op[e].ops.length + 1,
            error: false,
            error_en: false,
            error_price: false,
            en: ' ',

        }
        grouplist.op[e].ops.push(NewOpt);

        setGrouplist({ ...grouplist });
        setTimeout(() => {
            showLang('gr', 'en');
        }, 200);
    }
    const showLang = (e, a) => {

        if (e === 'gr') {
            SetButtonLang('ButtonLangAct');
            SetButtonLangen('');
        } else {
            SetButtonLang('');
            SetButtonLangen('ButtonLangAct');
        }

        var inputs = document.getElementById("diveditproduct").getElementsByTagName('input');
        for (var i = 0; i < inputs.length; i += 1) {
            let str = inputs[i].id;
            if (str !== str.replace('_' + e, '')) {
                inputs[i].parentElement.style.display = 'inline-block';
                let str5 = inputs[i].id;
                str5 = str5.replace('en', 'gr');
                // //console.log(InputVal(str5))
                if (inputs[i].value === ' ') inputs[i].value = '';
                inputs[i].placeholder = InputVal(str5);


            }
            if (str !== str.replace('_' + a, '')) {
                inputs[i].parentElement.style.display = 'none';
            }

        }

        window.componentHandler.upgradeAllRegistered();

    }
    const DelOption = (e) => {
        document.getElementById(e).style = 'display: none';
        var inputs = document.getElementById(e).getElementsByTagName('input');
        for (var i = 0; i < inputs.length; i += 1) {
            inputs[i].value = '';
            inputs[i].setAttribute('deleted', true);
        }
    }
    const SaveProduct = async (e) => {
        setLoader(true);
        let founderror = false;

        if (SelectedCategory.length === 0) {
            founderror = true;
            fstate.errors.category = '';
        } else {
            fstate.errors.category = false;
        }
        if (InputVal('editproduct_name_gr').length === 0) {
            founderror = true;
            fstate.errors.editproduct_name_gr = '';
        } else {
            fstate.errors.editproduct_name_gr = false;
        }
        if (InputVal('editproduct_name_en').length === 0) {
            founderror = true;
            fstate.errors.editproduct_name_en = '';
        } else {
            fstate.errors.editproduct_name_en = false;
        }
        if (InputVal('editproduct_desc_en').length === 0) {
            founderror = true;
            fstate.errors.editproduct_desc_en = '';
        } else {
            fstate.errors.editproduct_desc_en = false;
        }
        if (InputVal('editproduct_desc_gr').length === 0) {
            founderror = true;
            fstate.errors.editproduct_desc_gr = '';
        } else {
            fstate.errors.editproduct_desc_gr = false;
        }

        if (InputVal('editproduct_price').length === 0) {
            founderror = true;
            fstate.errors.price = '';
        } else {
            fstate.errors.price = false;
        }

        let OptionGroup = [];


        let i;
        for (i = 0; i < grouplist.op.length; i++) {

            //Gr Group name
            let z = i + 1;
            if (document.getElementById("edit-group_name_gr_" + z) && !document.getElementById("edit-group_name_gr_" + z).getAttribute('deleted')) {

                if (InputVal("edit-group_name_gr_" + z).length === 0) {
                    grouplist.op[i].error = '';
                    founderror = true;
                } else {
                    grouplist.op[i].error = false;

                }
            }
            //en Group name
            if (document.getElementById("edit-group_name_en_" + z) && !document.getElementById("edit-group_name_en_" + z).getAttribute('deleted')) {

                if (InputVal("edit-group_name_en_" + z).length === 0) {

                    grouplist.op[i].error_en = '';
                    founderror = true;
                } else {
                    grouplist.op[i].error_en = false;
                }
            }


            let OptionOptions = [];
            let o;
            for (o = 0; o < grouplist.op[i].ops.length; o++) {
                let za = o + 1;
                if (document.getElementById("edit-option_name_gr_" + z + '_' + za) && !document.getElementById("edit-option_name_gr_" + z + '_' + za).getAttribute('deleted')) {

                    if (InputVal("edit-option_name_gr_" + z + '_' + za).length === 0) {
                        grouplist.op[i].ops[o].error = '';
                        founderror = true;
                    } else {
                        grouplist.op[i].ops[o].error = false;
                    }
                }
                //en Group name
                if (document.getElementById("edit-option_name_en_" + z + '_' + za) && !document.getElementById("edit-option_name_en_" + z + '_' + za).getAttribute('deleted')) {

                    if (InputVal("edit-option_name_en_" + z + '_' + za).length === 0) {
                        grouplist.op[i].ops[o].error_en = '';
                        founderror = true;
                    } else {
                        grouplist.op[i].ops[o].error_en = false;
                    }
                }


                if (document.getElementById("edit-option_price_" + z + '_' + za) && !document.getElementById("edit-option_price_" + z + '_' + za).getAttribute('deleted')) {

                    if (InputVal("edit-option_price_" + z + '_' + za).length === 0) {
                        grouplist.op[i].ops[o].error_price = '';
                        founderror = true;
                    } else {
                        grouplist.op[i].ops[o].error_price = false;
                    }
                    if (!founderror) {
                        OptionOptions.push({
                            gr: InputVal("edit-option_name_gr_" + z + '_' + za),
                            en: InputVal("edit-option_name_en_" + z + '_' + za),
                            price: InputVal("edit-option_price_" + z + '_' + za),
                            srv_id: InputVal("edit-srv_id_" + z + '_' + za),
                            avail: document.getElementById("option_avail_" + z + '_' + za).checked,
                            prechecked: document.getElementById("option_prechecked_" + z + '_' + za).checked,

                        })

                    }
                }



            }
            if (document.getElementById("edit-group_name_gr_" + z) && !document.getElementById("edit-group_name_gr_" + z).getAttribute('deleted')) {
                if (!founderror) {
                    OptionGroup.push({
                        gr: InputVal("edit-group_name_gr_" + z),
                        en: InputVal("edit-group_name_en_" + z),
                        srv_id: InputVal("edit-srv_id_" + z),
                        multi: document.getElementById("multiselect_" + z).checked,
                        avail: document.getElementById("option_avail_" + z).checked,
                        options: OptionOptions,


                    })
                }
            }
        }


        if (founderror) {
            sendToast(translate('Failed to complete, make sure you edited everything right'))
        }
        if (!founderror) {
            let myObj = {
                store_id: props.edit,
                product_name_gr: InputVal('editproduct_name_gr'),
                product_name_en: InputVal('editproduct_name_en'),
                product_desc_gr: InputVal('editproduct_desc_gr'),
                product_desc_en: InputVal('editproduct_desc_en'),
                product_price: InputVal('editproduct_price'),
                product_id: selectedProduct,
                product_open: editproduct_open,
                product_close: editproduct_close,
                category: SelectedCategory.id,
                available: document.getElementById('editproduct_available').checked,
                product_options: OptionGroup
            }

            var formData = new FormData();


            formData.append("image", fileup);
            formData.append("data", JSON.stringify(myObj));
            setLoader(true);
            let la = await UseAxios(formData, 'stores/edit_product');
            if (la.status === 'ok') {
                sendToast('Changes saved');
            } else {
                sendToast('Nothing changed');
            }
        }

        setGrouplist({ ...grouplist })
        setFstate({ ...fstate });

        setLoader(false);

    }
    const fixprice = (e) => {
        if (e.key == 'Backspace') return;
        let pattern = new RegExp('[0-9.]');
        let res = pattern.test(e.key);
        if (!res) {
            e.preventDefault();
        }
    }
    const finishPrice = (e) => {
        if (e.target.value.length === 0) return;
        if (e.target.value.replace('.', '') === e.target.value) {
            e.target.value = e.target.value + '.00';
        }
    }

    const handleOnChange_file_add = (e) => {
        if (e.target.files && e.target.files[0]) {
            fileup = e.target.files[0];
            document.getElementById('edit-dice').value = e.target.files[0].name;

            var reader = new FileReader();

            reader.onload = function (e) {
                //  if (this.width !== 400 || this.height !== 400)

                document.getElementById('logo_preved').style.backgroundImage = 'url(' + e.target.result + ')';
            }
            reader.readAsDataURL(e.target.files[0]);
            document.getElementById('logo_preved').style.maxHeight = '200px';
            document.getElementById('logo_preved').style.height = '200px';

        }
    }

    const changeDayTime = (item) => {

        seletedDate = item;

        test.current.onFocus();

    }
    const handleTimepick = (e) => {
        SetTimeComp(e.hour + ':' + e.minute);
        // //console.log(timeToChange);
        if (seletedDate === 'editproduct_open') setProductOpen(e.hour + ':' + e.minute);
        if (seletedDate === 'editproduct_close') setProductClose(e.hour + ':' + e.minute);



    }
    const SelectedProd = async (e) => {

        grouplist.op = [];
        setLoader2(false);
        let la = await UseAxios({ id: e.id, store_id: props.edit, do: 'get' }, 'stores/get_products');

        if (la.status === 'ok') {

            document.getElementById('editproduct_name_gr').value = la.product.name;
            document.getElementById('editproduct_name_en').value = la.product.name_en;
            document.getElementById('editproduct_desc_gr').value = la.product.desc;
            document.getElementById('editproduct_desc_en').value = la.product.desc_en;
            document.getElementById('editproduct_price').value = la.product.price;
            setProductOpen(timeConvert(la.product.avail_from));
            setProductClose(timeConvert(la.product.avail_to));
            setavailGeneral(la.product.avail);
            let newList = [];

            catlistPro.map(item => {

                if (item.id === la.product.category) {
                    let newoblist = {
                        label: item.label,
                        id: item.id,
                        default: true,
                    }
                    SelectedCategory = newoblist;
                    newList.push(newoblist);


                } else {
                    let newoblist = {
                        label: item.label,
                        id: item.id,

                    }
                    newList.push(newoblist);


                }


            });
            selectedProduct = la.product._id.oid;
            setCatlistPro(newList);
            if (typeof la.product.options !== 'undefined') {
                let i = 1;
                for (i = 1; i < la.product.options.length + 1; i++) {
                    //edit-group_name_gr_1 , edit-option_name_gr_1_1, edit-option_price_1_1
                    let xex = [];
                    let o = 1;



                    for (o = 1; o < la.product.options[i - 1].options.length + 1; o++) {
                        let neo = la.product.options[i - 1].options[o - 1];
                        xex.push({ id: o, price: neo.price, en: neo.en, gr: neo.gr, prechecked: neo.prechecked, srv_id: neo.srv_id, avail: neo.avail });
                    }

                    grouplist.op.push({
                        id: i,
                        ops: xex,
                        en: la.product.options[i - 1].en,
                        gr: la.product.options[i - 1].gr,
                        srv_id: la.product.options[i - 1].srv_id,
                        avail: la.product.options[i - 1].avail,
                        multi: la.product.options[i - 1].multi
                    });
                }

            }
            document.getElementById('edit_product_sk').style = "display: block";
            setGrouplist({ ...grouplist });
            setTimeout(() => {
                showLang('gr', 'en');
                setLoader2(true);

            }, 700);

        }

    }
    return (




        <div id="diveditproduct" style={{ padding: '3px', margin: '3px', minWidth: '340px', width: '100%' }} className=" mdl-cell--7-col mdl-shadow--2dp">
            <div style={{ cursor: 'pointer' }} className="mdl-layout__header-row mdl-card__supporting-text">
                <h4>{translate('Edit Product')}</h4></div>
            <div className="center-align">

                <div onClick={(e) => showLang('gr', 'en')} className={"ButtonLang " + ButtonLang} >
                    <img src={greekicon} /> {translate('Greek')}
                </div>

                <div onClick={(e) => showLang('en', 'gr')} className={"ButtonLang " + ButtonLangen} >
                    <img src={enicon} /> {translate('English')}
                </div>

            </div>

            <Select style={{ width: '100%' }} onSelect={(e) => SelectedProd(e)} options={productlist} icon="category" id="editproduct_choose" label={translate("Choose product")} />

            <div id="edit_product_sk" style={{ display: 'none' }}>


                <div style={{ display: loader2 ? 'block' : 'none' }}>
                    <div className="separator">{translate('Product')}</div>

                    <Input defaultValue=" " isinvalid={fstate.errors.editproduct_name_gr} icon="fastfood" type="text" id="editproduct_name_gr" text={translate("Name")} style={{ width: '100%' }} />
                    <Input placeholder=" " defaultValue=" " isinvalid={fstate.errors.editproduct_name_en} icon="fastfood" type="text" id="editproduct_name_en" text={translate("Name (en)")} style={{ width: '100%' }} />
                    <Input defaultValue=" " isinvalid={fstate.errors.editproduct_desc_gr} icon="fastfood" type="text" id="editproduct_desc_gr" text={translate("Description")} style={{ width: '100%' }} />
                    <Input placeholder=" " defaultValue=" " isinvalid={fstate.errors.editproduct_desc_en} icon="fastfood" type="text" id="editproduct_desc_en" text={translate("Description (en)")} style={{ width: '100%' }} />
                    <Select onSelect={(e) => SelectedCategory = e} isinvalid={fstate.errors.category} options={catlistPro} icon="category" id="editproduct_category" label={translate("Category")} />
                    <Input defaultValue=" " onBlur={finishPrice} onKeyDown={fixprice} isinvalid={fstate.errors.price} icon="attach_money" type="text" id="editproduct_price" text={translate("Price")} style={{ width: '20%', minWidth: '50px' }} />


                    <TimePicker
                        theme="material"
                        onTimeChange={handleTimepick}
                        time={timeComp}
                        withoutIcon={true}
                        ref={test}
                    />

                    <div id="logo_preved" className='logo_preved' >




                    </div>

                    <Input defaultValue=" " type="text" onClick={(e) => document.getElementById('edit-dice_file').click()} style={{ width: '100%' }} defaultValue=" " text={translate("Photo (400x400 pixels)")} id="edit-dice" icon="attach_file" />
                    <input placeholder="" onChange={handleOnChange_file_add} id="edit-dice_file" type="file" style={{ display: 'none' }} />

                    <br />



                    <table style={{ marginLeft: '35px' }} className="dateTimeTable">
                        <tbody>


                            <tr>
                                <td className="tablehead">{translate("Available")}</td>
                                <td className="tablehead">{translate("From")}</td>
                                <td className="tablehead">{translate("To")}</td>  </tr>


                            < tr >
                                <td className="dateTimeTable">

                                    <Input defaultValue={availGeneral} id="editproduct_available" className="ToggleAvail" text="" type="toggle" />






                                </td>

                                <td className="dateTimeTable">
                                    <a style={{ cursor: 'pointer' }} onClick={(e) => changeDayTime('editproduct_open')}> {editproduct_open}</a>

                                </td>
                                <td className="dateTimeTable">

                                    <a style={{ cursor: 'pointer' }} onClick={(e) => changeDayTime('editproduct_close')}>
                                        {editproduct_close}
                                    </a>
                                </td>


                            </tr>



                        </tbody>
                    </table>


                    <div className="separator">{translate("Extra options")}</div>
                    <button style={{ width: '20%' }} onClick={AddGroup} className="mdl-button mdl-js-ripple-effect mdl-js-button  mdl-button--raised mdl-button--colored">
                        {translate("Add Group")}</button>
                    <div id="optGroups">
                        {grouplist.op.map(item => (

                            <div id={'edit-group_' + item.id} key={item.id}>
                                <div className="separator">{translate("Option group")} </div>
                                <label style={{ width: '160px', marginLeft: '8px' }} className="mdl-radio mdl-js-radio mdl-js-ripple-effect" htmlFor={"multiselect_" + item.id}>
                                    <input type="radio" id={"multiselect_" + item.id} className="mdl-radio__button" name={"options" + item.id} value="0" defaultChecked={item.multi} />
                                    <span className="mdl-radio__label">{translate("Multi-select")}</span>
                                </label>
                                <label style={{ marginLeft: '8px' }} className="mdl-radio mdl-js-radio mdl-js-ripple-effect" htmlFor={"singleselect_" + item.id} >
                                    <input type="radio" id={"singleselect_" + item.id} className="mdl-radio__button" name={"options" + item.id} value="1" defaultChecked={!item.multi} />
                                    <span className="mdl-radio__label">{translate("Single-Select")}  </span>
                                </label>
                                <label style={{ width: '122px', marginLeft: '15px' }} className="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" htmlFor={"option_avail_" + item.id}>
                                    <input type="checkbox" defaultChecked={item.avail} id={"option_avail_" + item.id} className="mdl-checkbox__input" />
                                    <span className="mdl-checkbox__label">{translate("Available")}</span>
                                </label>
                                <br />
                                <Input defaultValue={item.gr} isinvalid={item.error} icon="fastfood" type="text" id={"edit-group_name_gr_" + item.id} text={translate("Group name ")} style={{ width: '100%' }} />

                                <Input placeholder=" " defaultValue={item.en} isinvalid={item.error_en} icon="fastfood" type="text" id={"edit-group_name_en_" + item.id} text={translate("Group name (en)")} style={{ width: '100%' }} />
                                <input type="hidden" value={item.srv_id} id={"edit-srv_id_" + item.id} />

                                {item.ops.map(itema => (
                                    <div id={'edit-option_' + item.id + '_' + itema.id} key={item.id + itema.id}>
                                        <input type="hidden" value={itema.srv_id} id={"edit-srv_id_" + + item.id + '_' + itema.id} />
                                        <Input defaultValue={itema.gr} isinvalid={itema.error} icon="fastfood" type="text" id={"edit-option_name_gr_" + item.id + '_' + itema.id} text={translate("Option name")} style={{ width: '45%' }} />

                                        <Input placeholder=" " defaultValue={itema.en} isinvalid={itema.error_en} icon="fastfood" type="text" id={"edit-option_name_en_" + item.id + '_' + itema.id} text={translate("Option name (en)")} style={{ width: '45%' }} />

                                        <Input defaultValue={itema.price} onBlur={finishPrice} onKeyDown={fixprice} isinvalid={itema.error_price} icon="attach_money" type="text" id={"edit-option_price_" + item.id + '_' + itema.id} text={translate("Adds price")} style={{ width: '20%', minWidth: '50px' }} />
                                        <label style={{ width: '100px' }} className="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" htmlFor={"option_prechecked_" + item.id + '_' + itema.id}>
                                            <input type="checkbox" defaultChecked={itema.prechecked} id={"option_prechecked_" + item.id + '_' + itema.id} className="mdl-checkbox__input" />
                                            <span className="mdl-checkbox__label">{translate("checked")}</span>
                                        </label>


                                        <label style={{ width: '120px' }} className="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" htmlFor={"option_avail_" + item.id + '_' + itema.id}>
                                            <input type="checkbox" defaultChecked={itema.avail} id={"option_avail_" + item.id + '_' + itema.id} className="mdl-checkbox__input" />
                                            <span className="mdl-checkbox__label">{translate("Available")}</span>
                                        </label>
                                        <button style={{ marginLeft: '10px' }} onClick={(e) => AddOption(item.id)} className="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab">
                                            +</button>
                                        {itema.id > 1 && (<button style={{ marginLeft: '10px' }} onClick={(e) => DelOption('edit-option_' + item.id + '_' + itema.id)} className="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab">
                                            -</button>)}
                                    </div>

                                ))}

                                <button style={{ height: '32px', margin: '5px' }} onClick={(e) => DelOption('edit-group_' + item.id)} className="mdl-button mdl-js-ripple-effect mdl-js-button  mdl-button--raised mdl-button--colored">
                                    {translate("Delete Group")}</button>
                                <button style={{ height: '32px', margin: '5px' }} onClick={AddGroup} className="mdl-button mdl-js-ripple-effect mdl-js-button  mdl-button--raised mdl-button--colored">
                                    {translate("Add New Group")}</button>
                            </div>
                        ))}



                    </div>
                    <div className="center-align">
                        <button style={{ width: '10%' }} disabled={loader} onClick={SaveProduct} className="mdl-button mdl-js-ripple-effect mdl-js-button  mdl-button--raised mdl-button--colored">
                            {!loader && <> {translate("Save")}</>}
                            <img className="center-align" style={{ padding: '0', alignself: 'center', width: '30px', height: '30px', display: loader ? 'inline-block' : 'none' }} src={smallloader} alt={"loading..."} />

                        </button>
                    </div>

                </div>


                <div style={{ display: loader2 ? 'none' : 'block' }} className="center-align"><img src={smallloader} /></div>
            </div>
        </div>

    )
}

export default EditProduct;