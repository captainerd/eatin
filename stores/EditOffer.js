import React, { useEffect, useState, useRef } from 'react';
import Input from '../CompoViews/Input'
import Select from '../CompoViews/Select'
import { InputVal, UseAxios, sendToast, UseAxiosReal } from '../functions/Functions';
import Multiselect from '../CompoViews/Multiselect'
import TimePicker from 'react-times';
import 'react-times/css/material/default.css';
import smallloader from '../images/smallloader.gif';

var faketimer = '';
var selectedProd = '';
var seletedDate = '';
var thisDealId = '';
var groupselindex = null;
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
function EditOffer(props) {
    const translate = props.translate
    const [productlist, setProductlist] = useState([]);
    const [hideall, sethideall] = useState(true);
    const [offerlist, setofferlist] = useState([]);
    const [isinvalid, setisinvalid] = useState({
        offer_group_en: false,
        offer_name_gr: false,
        offer_price: false,
        offer_group_gr: false,
        offer_group_en: false,
        offer_group_qnty: false,
        product_select: false,
    });
    const test = useRef(null);
    const [product_open, setProductOpen] = useState('00:00');
    const [product_close, setProductClose] = useState('00:00');
    const [loader, setLoader] = useState(false);
    const [timeComp, SetTimeComp] = useState('00:00');
    const [grouplist, setGrouplist] = useState([]);
    useEffect(() => {
        faketimer = '';
        selectedProd = '';
        seletedDate = '';
        thisDealId = '';
        groupselindex = null;

        selectedProd = '';
        loadProductlist();
        loadDeals();

    }, []);
    useEffect(() => {
        window.componentHandler.upgradeAllRegistered();
    });
    const loadDeals = async () => {

        let la = await UseAxios({ store_id: props.edit }, 'stores/load_deals');
        if (la.status === 'ok') {

            la.offers.push({ label: translate('Add new deal'), id: 'new_deal' })
            setofferlist(la.offers);
        }

    }
    const loadProductlist = () => {
        if (typeof window.ProductList === 'undefined') {
            faketimer = setTimeout(() => {
                loadProductlist();
            }, 200);
        } else {
            setProductlist(window.ProductList)
        }



    }
    const selectProd = (e) => {
        selectedProd = e;

    }
    const AddProduct = (item) => {
        let fgroupselindex = grouplist.length - 1;

        if (groupselindex !== null) fgroupselindex = groupselindex
        if (selectedProd === '') {
            isinvalid.product_select = '';
            setisinvalid({ ...isinvalid })
            return

        } else {
            isinvalid.product_select = false;
            setisinvalid({ ...isinvalid })
            grouplist[fgroupselindex].products.push(selectedProd)
            setGrouplist([...grouplist]);
        }


    }
    const AddGroup = () => {
        groupselindex = null;
        let founderror = false;
        if (InputVal('offer_group_en') === '') {
            isinvalid.offer_group_en = '';
            founderror = true;
        } else {

            isinvalid.offer_group_en = false;
        }
        if (InputVal('offer_group_gr') === '') {
            isinvalid.offer_group_gr = '';
            founderror = true;

        } else {
            isinvalid.offer_group_gr = false;
        }
        if (InputVal('offer_group_qnty') === '' || InputVal('offer_group_qnty') === 0) {
            isinvalid.offer_group_qnty = '';
            founderror = true;

        } else {
            isinvalid.offer_group_qnty = false;
        }

        if (grouplist.length > 0 && grouplist[grouplist.length - 1].products.length === 0) {
            founderror = true;
            sendToast(translate('Error: Please add products to the group first'))
        }
        if (!founderror) {
            let obj = {
                group_name: InputVal('offer_group_en'),
                group_name_gr: InputVal('offer_group_gr'),
                products: [],
                qnty: InputVal('offer_group_qnty'),
            }
            let la = grouplist;
            la.push(obj)
            setGrouplist([...la])
            document.getElementById('offer_group_en').value = '';
            document.getElementById('offer_group_gr').value = '';
            document.getElementById('offer_group_qnty').value = '0';
            document.getElementById('offer_group_qnty').parentElement.MaterialTextfield.checkDirty();
        }
        setisinvalid({ ...isinvalid })
    }
    const SaveOffer = async () => {
        let founderror = false;
        setLoader(true)


        if (InputVal('offer_name_gr') === '') {
            isinvalid.offer_name_gr = '';
            founderror = true;
        } else {

            isinvalid.offer_name_gr = false;
        }
        if (InputVal('offer_name_en') === '') {
            isinvalid.offer_name_en = '';
            founderror = true;

        } else {
            isinvalid.offer_name_en = false;
        }
        if (InputVal('offer_price') === '') {
            isinvalid.offer_price = '';
            founderror = true;

        } else {
            isinvalid.offer_price = false;
        }
        setisinvalid({ ...isinvalid })
        if (!founderror) {
            let schedule = {
                monday: document.getElementById('offer-monday').checked,
                tuesday: document.getElementById('offer-tuesday').checked,
                wednesday: document.getElementById('offer-wednesday').checked,
                thursday: document.getElementById('offer-thursday').checked,
                friday: document.getElementById('offer-friday').checked,
                saturday: document.getElementById('offer-saturday').checked,
                sunday: document.getElementById('offer-sunday').checked,

            }
            let obj = {
                name_gr: InputVal('offer_name_gr'),
                name_en: InputVal('offer_name_en'),
                price: InputVal('offer_price'),
                grouplist: grouplist,
                schedule: schedule,
                store_id: props.edit,
                open: product_open,
                close: product_close,
                edit: thisDealId,
            }
            let la = await UseAxios(obj, 'stores/add_offer');

            if (la.status === 'ok') {
                sethideall(true);
                loadDeals();
                sendToast(translate('Changes saved'))
            }
        }

        setLoader(false)
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
    const selectDeal = async (e) => {
        sethideall(true);
        if (e.id === 'new_deal') {

            sethideall(false);
            thisDealId = 'new';
            groupselindex = null;
            setGrouplist([]);
            setTimeout(() => {


                document.getElementById('offer-monday').checked = true
                document.getElementById('offer-tuesday').checked = true
                document.getElementById('offer-wednesday').checked = true
                document.getElementById('offer-thursday').checked = true
                document.getElementById('offer-friday').checked = true
                document.getElementById('offer-saturday').checked = true
                document.getElementById('offer-sunday').checked = true
                document.getElementById('offer_name_gr').value = ''
                document.getElementById('offer_name_en').value = ''
                document.getElementById('offer_name_gr').value = ''
                document.getElementById('offer_name_en').value = ''
                document.getElementById('offer_price').value = ''
                document.getElementById('offer_group_gr').value = ' '
                document.getElementById('offer_group_en').value = ' '
                document.getElementById('offer_group_qnty').value = 0
                document.getElementById('offer_group_qnty').parentElement.MaterialTextfield.checkDirty();
            }, 300);
            setProductClose('00:00');

            setProductOpen('00:00');

        } else {

            setLoader(true);
            let la = await UseAxios({ deal: e.id, store_id: props.edit }, 'stores/get_deal');

            if (la.status === 'ok') {
                sethideall(false);
                thisDealId = la.deal._id.oid;
                //  //console.log(la.deal)
                setTimeout(() => {
                    document.getElementById('offer-monday').checked = la.deal.schedule['monday']
                    if (!la.deal.schedule['monday']) {
                        document.getElementById('offer-monday').parentElement.MaterialCheckbox.uncheck();
                    }


                    document.getElementById('offer-tuesday').checked = la.deal.schedule['tuesday']

                    if (!la.deal.schedule['tuesday']) {
                        document.getElementById('offer-tuesday').parentElement.MaterialCheckbox.uncheck();
                    }


                    document.getElementById('offer-wednesday').checked = la.deal.schedule['wednesday']


                    if (!la.deal.schedule['wednesday']) {
                        document.getElementById('offer-wednesday').parentElement.MaterialCheckbox.uncheck();
                    }

                    document.getElementById('offer-thursday').checked = la.deal.schedule['thursday']

                    if (!la.deal.schedule['thursday']) {
                        document.getElementById('offer-thursday').parentElement.MaterialCheckbox.uncheck();
                    }

                    document.getElementById('offer-friday').checked = la.deal.schedule['friday']

                    if (!la.deal.schedule['friday']) {
                        document.getElementById('offer-friday').parentElement.MaterialCheckbox.uncheck();
                    }

                    document.getElementById('offer-saturday').checked = la.deal.schedule['saturday']

                    if (!la.deal.schedule['saturday']) {
                        document.getElementById('offer-saturday').parentElement.MaterialCheckbox.uncheck();
                    }

                    document.getElementById('offer-sunday').checked = la.deal.schedule['sunday']

                    if (!la.deal.schedule['sunday']) {
                        document.getElementById('offer-sunday').parentElement.MaterialCheckbox.uncheck();
                    }
                    document.getElementById('offer_name_gr').value = la.deal.name_gr
                    document.getElementById('offer_name_en').value = la.deal.name_en
                    document.getElementById('offer_price').value = parseFloat(la.deal.price).toFixed(2)
                    document.getElementById('offer_group_gr').value = ''
                    document.getElementById('offer_group_en').value = ''
                    document.getElementById('offer_group_qnty').value = '0'
                    document.getElementById('offer_group_qnty').parentElement.MaterialTextfield.checkDirty();

                }, 300);
                setProductClose(timeConvert(la.deal.close));

                setProductOpen(timeConvert(la.deal.open));
                let newlist = [];

                la.deal.grouplist.map(item => {
                    let fobj = {}
                    fobj.group_name = item.name_en
                    fobj.group_name_gr = item.name_gr
                    fobj.qnty = item.qnty
                    fobj.products = [];
                    item.products.map(itema => {

                        window.ProductList.map(itemaaa => {
                            if (itemaaa.id === itema) {
                                fobj.products.push(itemaaa);

                            }

                        })


                    })
                    newlist.push(fobj);

                })

                setGrouplist(newlist);
                setLoader(false);
            }


        }
    }
    const newGroupIndex = (e) => {
        groupselindex = e;
        document.getElementById('offer_group_gr').value = grouplist[e].group_name_gr
        document.getElementById('offer_group_en').value = grouplist[e].group_name
        document.getElementById('offer_group_qnty').value = grouplist[e].qnty

    }
    const changegQnty = (e) => {
        if (groupselindex === null || typeof grouplist[groupselindex] === 'undefined') return;
        grouplist[groupselindex].qnty = e.target.value;
        setGrouplist([...grouplist]);
    }
    const changegNameen = (e) => {
        if (groupselindex === null || typeof grouplist[groupselindex] === 'undefined') return;
        grouplist[groupselindex].group_name = e.target.value;
        setGrouplist([...grouplist]);
    }
    const changegNamegr = (e) => {
        if (groupselindex === null || typeof grouplist[groupselindex] === 'undefined') return;
        grouplist[groupselindex].group_name_gr = e.target.value;
        setGrouplist([...grouplist]);
    }
    const deleteGroup = (e) => {
        groupselindex = null
        let la = [...grouplist];
        la.splice(e, 1);
        setGrouplist(la);
    }
    const deleteProd = (ind, index) => {
        let la = [...grouplist];
        la[ind].products.splice(index, 1);
        setGrouplist(la);

    }
    const DeleteDeal = async (e) => {
        let la = await UseAxios({ store_id: props.edit, offer_id: thisDealId }, 'stores/del_offer');

        if (la.status === 'ok') {
            sethideall(true);
            loadDeals();
            sendToast(translate('Offer deleted'))
        }
    }
    return (
        <div id="diveditproduct" style={{ padding: '3px', margin: '3px', minWidth: '340px', width: '100%' }} className=" mdl-cell--7-col mdl-shadow--2dp">
            <div style={{ cursor: 'pointer' }} className="mdl-layout__header-row mdl-card__supporting-text">
                <h4>{translate("Add offer")}  </h4></div>
            <Select onSelect={(e) => selectDeal(e)} style={{ width: '100%' }} id="edit_offer" options={offerlist} label={translate("Edit Offers")} icon="local_offer" />


            {loader &&
                <div className="center-align">
                    <img className="center-align" style={{ padding: '0', alignself: 'center', width: '30px', height: '30px', display: loader ? 'inline-block' : 'none' }} src={smallloader} alt={"loading..."} />
                </div>
            }

            {!hideall && <>
                <Input defaultValue=" " id="offer_name_gr" isinvalid={isinvalid.offer_name_gr} style={{ width: '30%' }} type="text" icon="category" text={translate("Offer name")} />
                <Input defaultValue=" " id="offer_name_en" isinvalid={isinvalid.offer_name_en} style={{ width: '30%' }} type="text" icon="category" text={translate("Offer name (en)")} />
                <Input defaultValue=" " id="offer_price" isinvalid={isinvalid.offer_price} style={{ width: '20%' }} type="text" icon="category" text={translate("Offer price")} />
                <Input defaultValue=" " onChange={(e) => changegNamegr(e)} id="offer_group_gr" isinvalid={isinvalid.offer_group_gr} style={{ width: '30%' }} type="text" icon="category" text={translate("Group name")} />
                <Input defaultValue=" " onChange={(e) => changegNameen(e)} id="offer_group_en" isinvalid={isinvalid.offer_group_en} style={{ width: '30%' }} type="text" icon="category" text={translate("Group name (en)")} />
                <Input defaultValue="0" onChange={(e) => changegQnty(e)} id="offer_group_qnty" isinvalid={isinvalid.offer_group_qnty} style={{ width: '20%' }} type="number" icon="category" text={translate("Quantity")} />
                <div >
                    <TimePicker
                        theme="material"
                        onTimeChange={handleTimepick}
                        time={timeComp}
                        withoutIcon={true}
                        ref={test}
                    />

                    <table style={{ marginLeft: '35px' }} className="dateTimeTable">
                        <tbody>


                            <tr>
                                <td className="tablehead">{translate("From")}</td>
                                <td className="tablehead">{translate("To")}</td>  </tr>


                            < tr >

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
                    <Input defaultChecked={true} style={{ width: '160px' }} type="checkbox" text={translate("Monday")} id="offer-monday" />
                    <Input defaultChecked={true} style={{ width: '160px' }} type="checkbox" text={translate("Tuesday")} id="offer-tuesday" />
                    <Input defaultChecked={true} style={{ width: '160px' }} type="checkbox" text={translate("Wednesday")} id="offer-wednesday" />
                    <Input defaultChecked={true} style={{ width: '160px' }} type="checkbox" text={translate("Thursday")} id="offer-thursday" />
                    <Input defaultChecked={true} style={{ width: '160px' }} type="checkbox" text={translate("Friday")} id="offer-friday" />
                    <Input defaultChecked={true} style={{ width: '160px' }} type="checkbox" text={translate("Saturday")} id="offer-saturday" />
                    <Input defaultChecked={true} style={{ width: '160px' }} type="checkbox" text={translate("Sunday")} id="offer-sunday" />


                </div>

                <button style={{ width: '100px', margin: '5px' }} onClick={AddGroup} className="mdl-button mdl-js-ripple-effect mdl-js-button  mdl-button--raised mdl-button--colored">
                    {translate("Add Group")} </button>
                {grouplist.length !== 0 &&
                    <><br />
                        <Select style={{ width: '70%' }} isinvalid={isinvalid.product_select} onSelect={(e) => selectProd(e)} options={productlist} icon="category" id="offer_product_choose" label={translate("Choose product")} />
                        <button style={{ width: '100px', margin: '5px' }} onClick={AddProduct} className="mdl-button mdl-js-ripple-effect mdl-js-button  mdl-button--raised mdl-button--colored">
                            {translate("Add")}  </button></>} <br />
                {grouplist.map((item, index) => (
                    <>

                        <div tabIndex={index} onClick={(e) => newGroupIndex(index)} className="incart-option  mdl-shadow--1dp">
                            <b>{item.qnty} x {item.group_name_gr} </b>                                             <i style={{ cursor: 'pointer', fontSize: '16px', margin: '0px', padding: '0pxs' }} onClick={(e) => deleteGroup(index)} className="material-icons ">cancel</i>
                            <hr />
                            {item.products.map((itema, indexa) => (
                                <>
                                    {itema.label}                                       <i style={{ cursor: 'pointer', fontSize: '16px', margin: '0px', padding: '0pxs' }} onClick={(e) => deleteProd(index, indexa)} className="material-icons ">cancel</i>
                                    <br />
                                </>


                            ))}
                        </div>
                    </>))}
                {grouplist.length !== 0 && grouplist[0].products.length !== 0 &&
                    <div className="center-align">

                        {thisDealId !== 'new' &&
                            <button style={{ margin: '15px' }} onClick={DeleteDeal} className="mdl-button mdl-js-button mdl-button--raised mdl-button--accent">
                                {translate("Delete")}
                            </button>}


                        <button style={{ width: '10%' }} disabled={loader} onClick={SaveOffer} className="mdl-button mdl-js-ripple-effect mdl-js-button  mdl-button--raised mdl-button--colored">
                            {!loader && <>{translate("Save")}</>}
                            {loader && <img className="center-align" style={{ padding: '0', alignself: 'center', width: '30px', height: '30px', display: loader ? 'inline-block' : 'none' }} src={smallloader} alt={"loading..."} />}

                        </button>
                    </div>}
            </>}
        </div>
    )
}


export default EditOffer;