import React, { useEffect, useState, useRef } from 'react';

import { UseAxios, sendToast } from '../functions/Functions';
import DialogConfirm from '../dialogs/DialogConfirm';
import ReactDOM from 'react-dom';



var firstload = false;


export function ProOrder(props) {
    const translate = props.translate;

    async function ConfirmDialog(text, callback) {

        ReactDOM.render(<>

            <DialogConfirm translate={translate} text={text} onYes={(e) => callback()} />

        </>, document.getElementById('mdl-dialog'));
        document.getElementById("lrdialog2").style.display = "block";

    }




    const [loadercat, setLoadercat] = useState(true);
    const [catlist, setCatlist] = useState([]);



    useEffect(() => {
        firstload = false;
        loadCats();
        showLang('gr', 'en');
    }, []);
    useEffect(() => {
        window.componentHandler.upgradeAllRegistered();
    });
    const loadCats = async () => {
        if (!firstload) setLoadercat(true);

        let la = await UseAxios({ do: 'load', id: props.edit }, 'stores/product_order');
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



            });

            if (!firstload) setLoadercat(false);



            firstload = true;

        }
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
        let la = await UseAxios(myObj, 'stores/product_order');
        if (la.status === 'ok') {
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
        let la = await UseAxios(myObj, 'stores/product_order');
        if (la.status === 'ok') {
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
                    <h4>{translate('Products')}</h4></div>




                <div style={{ width: '100%', height: '250px', overflow: 'scroll' }}>
                    {loadercat ? ('Loading..') : (

                        <table className=" dateTimeTable ">
                            <tbody>
                                <tr>
                                    <td>{translate('Product')}</td>
                                    <td>{translate('Order')}</td>
                                    <td>{translate('Delete')}</td>
                                </tr>

                                {catlist.map(item => (

                                    <tr id={item._id.oid} key={item._id.oid}>
                                        <td  >{item.name}</td>

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

export default ProOrder;