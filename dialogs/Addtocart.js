import React, { useEffect, useState } from 'react';
import { isNumeric } from '../functions/Functions';

import ReactDOM from 'react-dom';
var InputOptions = [];
var resultOjb = [];
var lastSelElement = '';
function replaceStr(str, find, replace) {
    for (var i = 0; i < 30; i++) {
        str = str.replace(find, replace);
    }
    return str;
}
function AddInputOptions(s) {
    InputOptions.push(s);
}
function utf8_to_b64(str) {

    let la = window.btoa(unescape(encodeURIComponent(str)));
    la = replaceStr(la, '=', '7izon7');
    la = replaceStr(la, '+', '6zin6');
    la = replaceStr(la, '/', '8plaz8');
    return la;
}

function b64_to_utf8(str) {
    str = replaceStr(str, '7izon7', '=');
    str = replaceStr(str, '6zin6', '+');
    str = replaceStr(str, '8plaz8', '/');
    return decodeURIComponent(escape(window.atob(str)));
}
function makeSession(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
function Addtocart(props) {
    const translate = props.translate;
    const [priceTotal, setPriceTotal] = useState(0);

    useEffect(() => {
        window.dialog_c.push(closeDialog)
        setPriceTotal(0);
        if (typeof window.componentHandler !== 'undefined') window.componentHandler.upgradeAllRegistered();

        createSelection(0);
    }, []);





    function createSelection(e) {

        if (e !== 0) {
            e.stopPropagation();
            if (e.target.type !== 'radio') {
                if (e.target.checked) e.target.parentNode.parentNode.style = "border-color: #00c608 !important; background-color: rgb(235, 253, 237) !important;";
                if (!e.target.checked) e.target.parentNode.parentNode.style = "";
            } else {

                var inputs = e.target.parentNode.parentNode.parentNode.getElementsByTagName('input');
                for (var i = 0; i < inputs.length; i += 1) {
                    if (inputs[i].type === 'radio' && inputs[i].id !== e.target.id) {
                        inputs[i].parentNode.parentNode.style = '';
                    }

                }
                e.target.parentNode.parentNode.style = "border-color: #00c608 !important; background-color: rgb(235, 253, 237) !important;";

            }

        }
        let totalprice = 0;
        let val = parseInt(document.getElementById('qnty').value);
        resultOjb = [];
        let obopts = [];
        for (let i = 0; i < InputOptions.length; i += 1) {
            if (document.getElementById(InputOptions[i]) !== null) {

                let str = b64_to_utf8(InputOptions[i]);
                let lo = str.split(':::');
                let name = lo[0];

                let price = parseFloat(lo[1]);
                let cat = lo[2];
                let srv_id_cat = lo[3];
                let srv_id = lo[4];
                let checked = document.getElementById(InputOptions[i]).checked;


                ////console.log(name + ' ' + price + ' ' + checked);

                if (checked) {

                    totalprice = parseFloat(totalprice) + price;


                    obopts.push({
                        cat: cat,
                        name: name,
                        price: price,
                        srv_id: srv_id,
                        srv_id_cat: srv_id_cat

                    })

                }
            }
        }

        totalprice = totalprice + parseFloat(props.text.price);
        let unitprice = totalprice;
        totalprice = parseFloat(totalprice * val).toFixed(2);
        setPriceTotal(totalprice);
        if (typeof props.text.sqnty !== 'undefined') {
            resultOjb.push({ sessionOffer: props.text.sessionOffer, offername: props.text.offername, cat: props.text.category, sqnty: props.text.sqnty, foroffer: props.text.foroffer, product: props.text.name, desc: props.text.desc, unitprice: unitprice, qnty: val, total: totalprice, price: props.text.price, id: props.text.id, options: obopts });

        } else {
            resultOjb.push({ product: props.text.name, desc: props.text.desc, unitprice: unitprice, qnty: val, total: totalprice, price: props.text.price, id: props.text.id, options: obopts });

        }



    }
    const closeDialog = () => {
        document.getElementById("lrdialog").style.display = "none";
        ReactDOM.unmountComponentAtNode(document.getElementById('mdl-dialog2'));
    }
    const handleYes = (e) => {
        if (typeof props.onAdd === 'function') {
            resultOjb[0].notes = document.getElementById('cart-notes').value;
            props.onAdd(resultOjb);


            document.getElementById("lrdialog").style.display = "none";
            ReactDOM.unmountComponentAtNode(document.getElementById('mdl-dialog2'));
        }
    }
    InputOptions = [];
    const fixnumber = (e) => {
        if (e.key == 'Backspace') return;
        let pattern = new RegExp('[0-9.]');
        let res = pattern.test(e.key);
        if (!res) {
            e.preventDefault();
        }
    }
    const handleInput = (e) => {

        let val = parseInt(document.getElementById('qnty').value);
        if (!isNumeric(val)) document.getElementById('qnty').value = 1;
        if (val > 99 || val < 1) document.getElementById('qnty').value = 1;

        createSelection(0);
    }
    const AddQnty = (e) => {

        if (e === '+') {
            if (typeof window.catsOffer[props.text.category] !== 'undefined' && parseInt(document.getElementById('qnty').value) + 1 > parseInt(window.catsOffer[props.text.category])) return;
            if (document.getElementById('qnty').value === '99') return;
            document.getElementById('qnty').value = parseFloat(document.getElementById('qnty').value) + 1;
        }
        if (e === '-') {
            if (document.getElementById('qnty').value === '1') return;
            document.getElementById('qnty').value = parseFloat(document.getElementById('qnty').value) - 1;

        }

        createSelection(0);
    }
    const handleExpnd = (e) => {
        e.stopPropagation();
        if (e.currentTarget.parentElement.style.maxHeight === '2500px') {
            e.currentTarget.parentElement.style = '';
        } else {
            e.currentTarget.parentElement.style = 'max-height: 2500px !important';
        }
        // e.currentTarget.style.height = '200px !important';
    }
    return (
        <>
            <div className="store-add-cart-spacer"></div>
            <div id="innerdialog" className=" cart-dialog">




                <div className="product-cart-container mdl-shadow--2dp">
                    <div className="store-product-1-cart">
                        <div className="store-product-1-title">
                            <div className="product-title-main">{props.text.name}</div>      <small className="price-tag-add">{priceTotal}€</small></div>
                    </div>




                    {props.text.photo && (<>

                        <div className="center-align pic-container">
                            <div style={{ backgroundImage: "url(" + window.assetsurl + props.text.photo.replace('_80x80_', '_400x400_') + ') ' }} className="product-display">

                            </div>
                        </div>


                    </>
                    )}
                    <div className="mdl-grid  store-product-2 ">
                        <div className="options-container">


                            <div className="cart-description ">

                                {props.text.desc}
                            </div>



                            {props.text.options && props.text.options.map(item =>



                                <div key={item.srv_id} className={item.avail ? "option-container option-expnd " : 'option-container disabled-options  option-expnd '}  >
                                    <div onClick={(e) => handleExpnd(e)} className="option-title">      {item.name} <i className="material-icons arrow-down">keyboard_arrow_down</i> </div>
                                    <div key={item.srv_id}>

                                        {item.options && item.options.map(itema =>
                                            <div key={itema.srv_id} className={itema.avail ? "cart-option  mdl-shadow--1dp active-selection" : "  disabled-options cart-option  mdl-shadow--1dp active-selection"}>
                                                {AddInputOptions(utf8_to_b64(itema.name + ':::' + itema.price + ':::' + item.name + ':::' + item.srv_id + ':::' + itema.srv_id))}
                                                {item.multi ? (

                                                    <label onClick={(e) => createSelection(e)} className="mdl-checkbox  mdl-js-checkbox mdl-js-ripple-effect" htmlFor={utf8_to_b64(itema.name + ':::' + itema.price + ':::' + item.name + ':::' + item.srv_id + ':::' + itema.srv_id)} >
                                                        <input type="checkbox" id={utf8_to_b64(itema.name + ':::' + itema.price + ':::' + item.name + ':::' + item.srv_id + ':::' + itema.srv_id)} className="mdl-checkbox__input" defaultChecked={itema.checked} />
                                                        <span className="mdl-checkbox__label">{itema.name} {parseFloat(itema.price).toFixed(2)}€</span>
                                                    </label>
                                                ) : (

                                                        <label onClick={(e) => createSelection(e)} className="mdl-radio   mdl-js-radio mdl-js-ripple-effect" htmlFor={utf8_to_b64(itema.name + ':::' + itema.price + ':::' + item.name + ':::' + item.srv_id + ':::' + itema.srv_id)} >
                                                            <input type="radio" id={utf8_to_b64(itema.name + ':::' + itema.price + ':::' + item.name + ':::' + item.srv_id + ':::' + itema.srv_id)} className="mdl-radio__button" defaultChecked={itema.checked} name={utf8_to_b64(item.name)} value="2" />
                                                            <span className="mdl-radio__label">{itema.name} {parseFloat(itema.price).toFixed(2)}€</span>
                                                        </label>

                                                    )}

                                            </div>

                                        )}


                                    </div>






                                </div>





                            )}

                        </div>


                    </div>
                    <div style={{ width: '100%' }} className="mdl-textfield mdl-js-textfield">
                        <textarea className="mdl-textfield__input" type="text" rows="2" id="cart-notes" ></textarea>
                        <label className="mdl-textfield__label" htmlFor="cart-notes">{translate('Write your notes')}</label>
                    </div>

                </div>


            </div>
            <div className="store-product-1-spacer"></div>
            <div className="add-cart-actions  ">
                <div className="qnty-container">
                    <button onClick={(e) => AddQnty('-')}  className="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab">
                        -</button>

                    <input onKeyDown={(e) => fixnumber(e)} id="qnty" onChange={(e) => handleInput(e)} defaultValue="1" type="text" className="cart-qnty" />
                    <button onClick={(e) => AddQnty('+')} style={{ marginLeft: '10px' }} className="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab">
                        +</button>

                </div>

                <div  style={{ float: 'right',   marginRight: '15px' }}    >
                <button type="button" style={{ marginRight: '10px' }} onClick={e => closeDialog(e)} className="mdl-button mdl-js-button   ">{translate('Close')}</button>
                &nbsp;<button type="button"  onClick={e => handleYes(e)} className=" mdl-button--colored mdl-button mdl-js-button mdl-button--raised">

                    {translate('Add')}</button>
                    </div>


            </div>



        </>
    );
}

export default Addtocart;