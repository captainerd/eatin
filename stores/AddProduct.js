import React, { useEffect, useState, useRef } from 'react';
import Input from '../CompoViews/Input'
import Select from '../CompoViews/Select'
import { InputVal, UseAxios, sendToast } from '../functions/Functions';
import TimePicker from 'react-times';
import 'react-times/css/material/default.css';
import smallloader from '../images/smallloader.gif';
import '../css/store.css';
import greekicon from '../images/greece.png';
import enicon from '../images/united-kingdom.png';

var catsdivc = false;
var firstload = false;
var transClick = false;
var fileup = '';
var seletedDate = '';
var SelectedCategory = [];
const flagOps = [
    { id: 'greek', label: '', img: greekicon, default: true },
    { id: 'english', label: '', img: enicon }
]

export function AddProduct(props) {
    const test = useRef(null);
    const [loader, setLoader] = useState(false);
    const [loadercat, setLoadercat] = useState(true);
    const [catlist, setCatlist] = useState([]);
    const [catlistPro, setCatlistPro] = useState([]);

    const [fstate, setFstate] = useState({

        errors: {
            cat_en: false,
            cat_gr: false,
            price: false,
            product_desc_en: false,
            product_desc_gr: false,
            category: false,
            product_name_en: false,
            product_name_gr: false,

        },
    });
    const translate = props.translate
    const [grouplist, setGrouplist] = useState({ op: [] });
    const [product_open, setProductOpen] = useState('00:00');
    const [product_close, setProductClose] = useState('00:00');
    const [timeComp, SetTimeComp] = useState('00:00');

    const [ButtonLang, SetButtonLang] = useState(' ButtonLangAct ');

    const [ButtonLangen, SetButtonLangen] = useState('   ');

    useEffect(() => {
        firstload = false;
        loadCats();
        showLang('gr', 'en');
    }, []);
    useEffect(() => {
        window.componentHandler.upgradeAllRegistered();
    });
    window.addProductloadCats = () => {
        loadCats();
    }
    const loadCats = async () => {
        if (!firstload) setLoadercat(true);

        let la = await UseAxios({ do: 'load', id: props.edit }, 'stores/private_categories');
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
                //console.log(error.message);
            }
            if (!firstload) setLoadercat(false);



            firstload = true;

        }
    }

    const AddGroup = () => {
    //    grouplista = grouplist;
        let posa = grouplist.op.length + 1;
        let grouplista =
        {
            error: false,
            error_en: false,
            error_price: false,
            id: posa,
            ops: [
                {
                    id: 1,
                    error: false,
                    error_en: false,
                    error_price: false,
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

        var inputs = document.getElementById("divnewproduct").getElementsByTagName('input');
        for (var i = 0; i < inputs.length; i += 1) {
            let str = inputs[i].id;
            if (str !== str.replace('_' + e, '')) {
                inputs[i].parentElement.style.display = 'inline-block';
                let str5 = inputs[i].id;
                str5 = str5.replace('en', 'gr');
                inputs[i].placeholder = InputVal(str5);

            }
            if (str !== str.replace('_' + a, '')) {
                inputs[i].parentElement.style.display = 'none';
            }
        }



    }
    const DelOption = (e) => {
        document.getElementById(e).remove();
    }
    const SaveProduct = async (e) => {
        setLoader(true);
        let founderror = false;

        let greekError = false;

        if (SelectedCategory.length === 0) {
            founderror = true;
            greekError = true;
            fstate.errors.category = '';
        } else {
            fstate.errors.category = false;
        }
        if (InputVal('product_name_gr').length === 0) {
            founderror = true;
            greekError = true;
            fstate.errors.product_name_gr = '';
        } else {
            fstate.errors.product_name_gr = false;
        }
        if (InputVal('product_name_en').length === 0) {
           founderror = true;
            fstate.errors.product_name_en = '';
         //  document.getElementById('product_name_en').value =  InputVal('product_name_gr')
          
        } else {
            fstate.errors.product_name_en = false;
        }
        if (InputVal('product_desc_en').length === 0) {
          founderror = true;
           fstate.errors.product_desc_en = '';
       
        } else {
            fstate.errors.product_desc_en = false;
        }
        if (InputVal('product_desc_gr').length === 0) {
            founderror = true;
            greekError = true;
            fstate.errors.product_desc_gr = '';
        } else {
            fstate.errors.product_desc_gr = false;
        }

        if (InputVal('product_price').length === 0) {
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
            if (document.getElementById("group_name_gr_" + z)) {

                if (InputVal("group_name_gr_" + z).length === 0) {
                    grouplist.op[i].error = '';
                    founderror = true;
                    greekError = true;
                } else {
                    grouplist.op[i].error = false;

                }
            }
            //en Group name
            if (document.getElementById("group_name_en_" + z)) {

                if (InputVal("group_name_en_" + z).length === 0) {

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
                if (document.getElementById("option_name_gr_" + z + '_' + za)) {

                    if (InputVal("option_name_gr_" + z + '_' + za).length === 0) {
                        grouplist.op[i].ops[o].error = '';
                        founderror = true;
                        greekError = true;
                    } else {
                        grouplist.op[i].ops[o].error = false;
                    }
                }
                //en Group name
                if (document.getElementById("option_name_en_" + z + '_' + za)) {

                    if (InputVal("option_name_en_" + z + '_' + za).length === 0) {
                        grouplist.op[i].ops[o].error_en = '';
                        founderror = true;
                    } else {
                        grouplist.op[i].ops[o].error_en = false;
                    }
                }


                if (document.getElementById("option_price_" + z + '_' + za)) {

                    if (InputVal("option_price_" + z + '_' + za).length === 0) {
                        grouplist.op[i].ops[o].error_price = '';
                        founderror = true;
                    } else {
                        grouplist.op[i].ops[o].error_price = false;
                    }
                    if (!founderror) {
                        OptionOptions.push({
                            gr: InputVal("option_name_gr_" + z + '_' + za),
                            en: InputVal("option_name_en_" + z + '_' + za),
                            price: InputVal("option_price_" + z + '_' + za),
                            prechecked: document.getElementById("option_prechecked_" + z + '_' + za).checked,

                        })

                    }
                }



            }
            if (document.getElementById("group_name_gr_" + z)) {
                if (!founderror) {
                    OptionGroup.push({
                        gr: InputVal("group_name_gr_" + z),
                        en: InputVal("group_name_en_" + z),
                        multi: document.getElementById("multiselect_" + z).checked,
                        options: OptionOptions,


                    })
                }
            }
        }

        if (founderror && !greekError) showLang('en', 'gr')
        //showLang('en', 'gr')

        if (founderror) {
            sendToast(translate('Failed to complete, make sure you edited everything right'))
        }

        if (!founderror) {
            let myObj = {
                store_id: props.edit,
                product_name_gr: InputVal('product_name_gr'),
                product_name_en: InputVal('product_name_en'),
                product_desc_gr: InputVal('product_desc_gr'),
                product_desc_en: InputVal('product_desc_en'),
                product_price: InputVal('product_price'),
                product_open: product_open,
                product_close: product_close,
                category: SelectedCategory.id,
                available: document.getElementById('product_available').checked,
                product_options: OptionGroup
            }
            //console.log(myObj);
            var formData = new FormData();


            formData.append("image", fileup);
            formData.append("data", JSON.stringify(myObj));
            setLoader(true);
            let la = await UseAxios(formData, 'stores/new_product');
            if (la.status === 'ok') {
                sendToast(translate('New product added'));
                window.editPrudctreload();
            } else {
                sendToast(translate('Error'));
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
            document.getElementById('dice').value = e.target.files[0].name;

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

    const changeDayTime = (item) => {

        seletedDate = item;

        test.current.onFocus();

    }
    const handleTimepick = (e) => {
        SetTimeComp(e.hour + ':' + e.minute);
        // //console.log(timeToChange);
        if (seletedDate === 'product_open') setProductOpen(e.hour + ':' + e.minute);
        if (seletedDate === 'product_close') setProductClose(e.hour + ':' + e.minute);



    }
    return (
        <>



            <div id="divnewproduct" style={{ padding: '3px', margin: '3px', minWidth: '340px', width: '100%' }} className=" mdl-cell--7-col mdl-shadow--2dp">
                <div style={{ cursor: 'pointer' }} className="mdl-layout__header-row mdl-card__supporting-text">
                    <h4>{translate('Add Product')}</h4></div>
                <div className="center-align">

                    <div onClick={(e) => showLang('gr', 'en')} className={"ButtonLang " + ButtonLang} >
                        <img src={greekicon} /> {translate('Greek')}
                    </div>

                    <div onClick={(e) => showLang('en', 'gr')} className={"ButtonLang " + ButtonLangen} >
                        <img src={enicon} /> {translate('English')}
                    </div>

                </div>


                <Input isinvalid={fstate.errors.product_name_gr} icon="fastfood" type="text" id="product_name_gr" text={translate("Name")} style={{ width: '100%' }} />
                <Input isinvalid={fstate.errors.product_name_en} placeholder=" " icon="fastfood" type="text" id="product_name_en" text="Name (en)" style={{ width: '100%' }} />
                <Input isinvalid={fstate.errors.product_desc_gr} icon="fastfood" type="text" id="product_desc_gr" text={translate("Description")} style={{ width: '100%' }} />
                <Input isinvalid={fstate.errors.product_desc_en} placeholder=" " icon="fastfood" type="text" id="product_desc_en" text={translate("Description (en)")} style={{ width: '100%' }} />
                <Select onSelect={(e) => SelectedCategory = e} isinvalid={fstate.errors.category} options={catlistPro} icon="category" id="product_category" label={translate("Category")} />
                <Input onBlur={finishPrice} onKeyDown={fixprice} isinvalid={fstate.errors.price} icon="attach_money" type="text" id="product_price" text={translate("Price")} style={{ width: '20%', minWidth: '50px' }} />

                <TimePicker
                    theme="material"
                    onTimeChange={handleTimepick}
                    time={timeComp}
                    withoutIcon={true}
                    ref={test}
                />

                <div id="logo_prev" className='logo_prev' >




                </div>

                <Input defaultValue=" " type="text" onClick={(e) => document.getElementById('dice_file').click()} style={{ width: '100%' }} defaultValue=" " text={translate("Photo (400x400 pixels)")} id="dice" icon="attach_file" />
                <input placeholder="" onChange={handleOnChange_file_add} id="dice_file" type="file" style={{ display: 'none' }} />

                <br />



                <table style={{ marginLeft: '35px' }} className="dateTimeTable">
                    <tbody>


                        <tr>
                            <td className="tablehead">{translate("Available")}</td>
                            <td className="tablehead">{translate("From")}</td>
                            <td className="tablehead">{translate("To")}</td>  </tr>


                        < tr >
                            <td className="dateTimeTable">

                                <Input defaultValue={true} id="product_available" className="ToggleAvail" text="" type="toggle" />






                            </td>

                            <td className="dateTimeTable">
                                <a style={{ cursor: 'pointer' }} onClick={(e) => changeDayTime('product_open')}> {product_open}</a>

                            </td>
                            <td className="dateTimeTable">

                                <a style={{ cursor: 'pointer' }} onClick={(e) => changeDayTime('product_close')}>
                                    {product_close}
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

                        <div id={'group_' + item.id} key={item.id}>
                            <div className="separator"> {translate("Option group")} </div>
                            <label style={{ width: '160px', marginLeft: '8px' }} className="mdl-radio mdl-js-radio mdl-js-ripple-effect" htmlFor={"multiselect_" + item.id}>
                                <input type="radio" id={"multiselect_" + item.id} className="mdl-radio__button" name={"options" + item.id} value="0" defaultChecked />
                                <span className="mdl-radio__label">{translate("Multi-select")}</span>
                            </label>
                            <label style={{ marginLeft: '8px' }} className="mdl-radio mdl-js-radio mdl-js-ripple-effect" htmlFor={"singleselect_" + item.id} >
                                <input type="radio" id={"singleselect_" + item.id} className="mdl-radio__button" name={"options" + item.id} value="1" />
                                <span className="mdl-radio__label">{translate("Single-Select")}  </span>
                            </label><br />

                            <Input isinvalid={item.error} icon="fastfood" type="text" id={"group_name_gr_" + item.id} text={translate("Group name")} style={{ width: '100%' }} />

                            <Input isinvalid={item.error_en} placeholder=" " icon="fastfood" type="text" id={"group_name_en_" + item.id} placeholder=" " text={translate("Group name (en)")} style={{ width: '100%' }} />

                            {item.ops.map(itema => (
                                <div id={'option_' + item.id + '_' + itema.id} key={itema.id}>

                                    <Input isinvalid={itema.error} icon="fastfood" type="text" id={"option_name_gr_" + item.id + '_' + itema.id} text={translate("Option name")} style={{ width: '45%' }} />

                                    <Input isinvalid={itema.error_en} placeholder=" " icon="fastfood" type="text" placeholder=" " id={"option_name_en_" + item.id + '_' + itema.id} text={translate("Option name (en)")} style={{ width: '45%' }} />

                                    <Input onBlur={finishPrice} onKeyDown={fixprice} isinvalid={itema.error_price} icon="attach_money" type="text" id={"option_price_" + item.id + '_' + itema.id} text={translate("Adds price")} style={{ width: '20%', minWidth: '50px' }} />

                                    <label style={{ width: '100px' }} className="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" htmlFor={"option_prechecked_" + item.id + '_' + itema.id}>
                                        <input type="checkbox" id={"option_prechecked_" + item.id + '_' + itema.id} className="mdl-checkbox__input" />
                                        <span className="mdl-checkbox__label">{translate("checked")}</span>
                                    </label>
                                    <button style={{ marginLeft: '10px' }} onClick={(e) => AddOption(item.id)} className="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab">
                                        +</button>
                                    {itema.id > 1 && (<button style={{ marginLeft: '10px' }} onClick={(e) => DelOption('option_' + item.id + '_' + itema.id)} className="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab">
                                        -</button>)}
                                </div>

                            ))}

                            <button style={{ height: '32px', margin: '5px' }} onClick={(e) => DelOption('group_' + item.id)} className="mdl-button mdl-js-ripple-effect mdl-js-button  mdl-button--raised mdl-button--colored">
                                {translate("Delete Group")}</button>
                            <button style={{ height: '32px', margin: '5px' }} onClick={AddGroup} className="mdl-button mdl-js-ripple-effect mdl-js-button  mdl-button--raised mdl-button--colored">
                                {translate("Add New Group")}</button>
                        </div>
                    ))}



                </div>
                <div className="center-align">
                    <button style={{ width: '10%' }} disabled={loader} onClick={SaveProduct} className="mdl-button mdl-js-ripple-effect mdl-js-button  mdl-button--raised mdl-button--colored">
                        {!loader && <>{translate("Save")}</>}
                        <img className="center-align" style={{ padding: '0', alignself: 'center', width: '30px', height: '30px', display: loader ? 'inline-block' : 'none' }} src={smallloader} alt={"loading..."} />

                    </button>
                </div>
            </div>
        </>
    )
}

export default AddProduct;