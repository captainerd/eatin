import React, { useEffect, useState, useRef } from 'react';
import Input from '../CompoViews/Input'
import DialogConfirm from '../dialogs/DialogConfirm';
import ReactDOM from 'react-dom';
import { InputVal, UseAxios, sendToast } from '../functions/Functions';

import 'react-times/css/material/default.css';
import smallloader from '../images/smallloader.gif';
import '../css/store.css';



var firstload = false;
var oldButton = '';

export function Categories(props) {
    const translate = props.translate

    async function ConfirmDialog(text, callback) {

        ReactDOM.render(<>

            <DialogConfirm translate={translate} text={text} onYes={(e) => callback()} />

        </>, document.getElementById('mdl-dialog'));
        document.getElementById("lrdialog2").style.display = "block";

    }


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


    useEffect(() => {
        firstload = false;
        loadCats();
        showLang('gr', 'en');
        window.componentHandler.upgradeAllRegistered();
    }, []);

    const loadCats = async () => {
        if (!firstload) setLoadercat(true);

        let la = await UseAxios({ do: 'load', id: props.edit }, 'stores/private_categories');
        window.cats = la;
        if (la.status === 'ok') {

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

            if (!firstload) setLoadercat(false);



            firstload = true;

        }
    }
    const AddCat = async () => {
        setLoader(true);
        let founderror = false;
        if (InputVal('category_gr').length === 0) {
            fstate.errors.cat_gr = '';
            founderror = true;
        } else {
            fstate.errors.cat_gr = false;
        }
        if (InputVal('category_en').length === 0) {
            fstate.errors.cat_en = '';
            founderror = true;
        } else {
            fstate.errors.cat_en = false;
        }

        if (!founderror) {
            let myObj = {
                do: 'add',
                cat_en: InputVal('category_en'),
                cat_gr: InputVal('category_gr'),
                id: props.edit
            }

            let la = await UseAxios(myObj, 'stores/private_categories');
            if (la.status === 'ok') {
                document.getElementById('category_en').value = '';
                document.getElementById('category_gr').value = '';
                loadCats();
                window.addProductloadCats();
                window.editPrudctreload();
            }
        }

        setFstate({ ...fstate });
        setLoader(false);

    }
    const delCat = (e) => {
        ConfirmDialog(translate('Are you sure you want to delete this item?'), function () {
            delCat2(e);
        }
        );
    }
    const delCat2 = async (e) => {
        let myObj = {
            do: 'delete',
            catid: e,
            id: props.edit

        }
        let la = await UseAxios(myObj, 'stores/private_categories');
        if (la.status == 'ok') {
            sendToast(translate('Deleted'));
            document.getElementById(e).remove();
        }

    }
    const reorderCat = async (to, id, old) => {
        let myObj = {
            do: 'move',
            catid: id,
            to: to,
            old: old,
            id: props.edit
        }
        let la = await UseAxios(myObj, 'stores/private_categories');
        if (la.status == 'ok') {
            sendToast(translate('Moved'));
            loadCats();;
        } else {
            sendToast(translate('Nothing changed'));
        }

    }


    const showLang = (e, a) => {
        /*
        
                var inputs = document.getElementsByTagName('input');
                for (var i = 0; i < inputs.length; i += 1) {
                    let str = inputs[i].id;
                    if (str !== str.replace('_' + e, '')) {
                        inputs[i].parentElement.style.display = 'inline-block';
                    }
                    if (str !== str.replace('_' + a, '')) {
                        inputs[i].parentElement.style.display = 'none';
                    }
                }
        */


    }


    return (
        <>
            <div style={{ padding: '3px', margin: '3px', minWidth: '340px', overflow: 'hidden', width: '100%' }} className=" mdl-cell--7-col mdl-shadow--2dp">
                <div style={{ cursor: 'pointer' }} className="mdl-layout__header-row mdl-card__supporting-text">
                    <h4>{translate('Categories')}</h4></div>


                <Input isinvalid={fstate.errors.cat_gr} icon="category" type="text" id="category_gr" text="Greek" style={{ width: '40%' }} />
                <Input isinvalid={fstate.errors.cat_en} icon="category" type="text" id="category_en" text="English" style={{ width: '40%' }} />
                <button style={{ width: '10%' }} disabled={loader} onClick={AddCat} className="mdl-button mdl-js-ripple-effect mdl-js-button  mdl-button--raised mdl-button--colored">
                    {!loader && <>{translate('Add')}</>}
                    <img className="center-align" style={{ padding: '0', alignself: 'center', width: '30px', height: '30px', display: loader ? 'inline-block' : 'none' }} src={smallloader} alt={"loading..."} />

                </button>

                <div style={{ width: '100%', height: '250px', overflow: 'scroll' }}>
                    {loadercat ? ('Loading..') : (

                        <table className=" dateTimeTable ">
                            <tbody>
                                <tr>
                                    <td>{translate('English')}</td>
                                    <td>{translate('Greek')}</td>
                                    <td>{translate('Order')}</td>
                                    <td>{translate('Delete')}</td>
                                </tr>

                                {catlist.map(item => (

                                    <tr id={item._id.oid} key={item.cat_en}>
                                        <td >{item.cat_en}</td>
                                        <td  >{item.cat_gr}</td>

                                        <td  >


                                            <i style={{ color: 'blue', cursor: 'pointer' }} onClick={(e) => reorderCat(item.order - 1, item._id.oid, item.order)} className="material-icons" >keyboard_arrow_up</i>



                                            <i style={{ color: 'blue', cursor: 'pointer' }} onClick={(e) => reorderCat(item.order + 1, item._id.oid, item.order)} className="material-icons">keyboard_arrow_down</i>


                                        </td>
                                        <td  >

                                            <i style={{ color: 'blue', cursor: 'pointer' }} onClick={(e) => delCat(item._id.oid)} className="material-icons">remove</i>


                                        </td>
                                    </tr>



                                ))}
                            </tbody>
                        </table>


                    )}
                </div>
            </div>



        </>
    )
}

export default Categories;