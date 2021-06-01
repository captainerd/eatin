import React, { useEffect, useState, Suspense, lazy } from 'react';
import Input from './CompoViews/Input'
import Select from './CompoViews/Select'
import ReactDOM from 'react-dom';
import { UseAxios, sendToast, isNumeric, InputVal } from './functions/Functions';
import SendingOrder from './dialogs/SendingOrder';
import Home from './Home.js';
import DialogSMSpin from './dialogs/DialogSMSpin'
import smallloader from './images/smallloader.gif';
import Store from './Store'
var PayWay = '';
var PickUp = '';
const LoginRegister = lazy(() => import('./dialogs/LoginRegister'));


var user_firstname = '';
var user_lastname = '';


export function Order(props) {
    const translate = props.translate

    async function sendingDialog(text, phone, callback) {

        ReactDOM.render(<>

            <SendingOrder phone={phone} translate={translate} orderId={text} onYes={(e) => callback()} />

        </>, document.getElementById('mdl-dialog2'));
        document.getElementById("lrdialog").style.display = "block";

    }
    async function SmsPinDialog(text, callback, wrongphone) {

        ReactDOM.render(<>

            <DialogSMSpin phone={text} wrong_phone={wrongphone} translate={translate} onPin={async (e) => callback(e)} />

        </>, document.getElementById('mdl-dialog'));
        document.getElementById("lrdialog2").style.display = "block";

    }

    const [address, setAddress] = useState([]);
    const [showAddress, setshowAddress] = useState(false);
    const [paymentways, setPaymentways] = useState([]);
    const [isloader, setIsloader] = useState(false);
    const [isinvalid, setIsinvalid] = useState({
        phone: false,
        first_name: false,
        last_name: false,
        floor: false,
        bell: false,



    });


    useEffect(() => {



        let la = JSON.parse(window.localStorage.getItem('user')).position.street_name + ' ' + JSON.parse(window.localStorage.getItem('user')).position.street_number
            + ', ' + JSON.parse(window.localStorage.getItem('user')).position.city
            + ', ' + JSON.parse(window.localStorage.getItem('user')).position.district;

        let obj = [{
            label: la, id: address, default:
                true
        }];
        if (props.store.take_away) {
            obj.push({ label: translate('Pick up - store'), id: 'pickup' })
        }
        setAddress(obj)
        obj = [];
        let lastpayopt = JSON.parse(window.localStorage.getItem('user')).lastpayopt;
        if (typeof (lastpayopt) === 'undefined') lastpayopt = 'cash'
        let defaultv = [];
        if (!props.store.payment_options.cash && lastpayopt === 'cash') lastpayopt = 'credit_card';
        if (!props.store.payment_options.credit_card && lastpayopt === 'credit_card') lastpayopt = 'cash';
        if (!props.store.payment_options.paypal && lastpayopt === 'paypal') lastpayopt = 'cash';
        if (!props.store.payment_options.wireless_pos && lastpayopt === 'wireless_pos') lastpayopt = 'cash';
        if (!props.store.payment_options.tickets && lastpayopt === 'tickets') lastpayopt = 'cash';


        defaultv[lastpayopt] = true;
        PayWay = lastpayopt;


        if (props.store.payment_options.cash) obj.push({ label: translate('Cash'), id: 'cash', default: defaultv['cash'] })
        if (props.store.payment_options.credit_card) obj.push({ label: translate('Credit card'), id: 'credit_card', default: defaultv['credit_card'] })

        if (props.store.payment_options.paypal) obj.push({ label: translate('Paypal'), id: 'paypal', default: defaultv['paypal'] })
        if (props.store.payment_options.tickets) obj.push({ label: translate('Ticket restaurant'), id: 'tickets', default: defaultv['tickets'] })
        if (props.store.payment_options.wireless_pos) obj.push({ label: translate('Wireless POS'), id: 'wireless_pos', default: defaultv['wireless_pos'] })

       

        setPaymentways(obj)
        document.getElementById('floor').value = JSON.parse(window.localStorage.getItem('user')).position.floor

        let testn = JSON.parse(localStorage.getItem('user')).name;
        if (typeof testn !== 'undefined' && testn !== null) {
            user_firstname = testn;
        }
        testn = JSON.parse(localStorage.getItem('user')).last_name;
        if (typeof testn !== 'undefined' && testn !== null) {
            user_lastname = testn;
        }

 


    }, []);
    useEffect(() => {
        if (typeof window.componentHandler !== 'undefined') window.componentHandler.upgradeAllRegistered();
    });
    const handleaddress = (e) => {
        PickUp = e.id;
        if (e.id === 'pickup') {
            setshowAddress(true);
        } else {
            setshowAddress(false);
            setTimeout(() => {
                document.getElementById('floor').value = JSON.parse(window.localStorage.getItem('user')).position.floor
            }, 200);

        }

    }
    const handlePayway = (e) => {
        PayWay = e.id;


    }
    const ordercompleted = () => {
        ReactDOM.render(

            <Home translate={translate} />,

            document.getElementById('page-content'));

    }
    const HandlesendOrder = async (e) => {

  

        if (window.placeorder.readyState !== 1) {
            sendToast(translate('Error, lost connection, please try again'));
            return;
        }

        setIsloader(true)
        let myPos = JSON.parse(window.localStorage.getItem('user'));

        if (myPos.AuthToken === 0) {
            ReactDOM.render(<> <Suspense fallback={<div>Loading...</div>}>

                <LoginRegister />

            </Suspense> </>, document.getElementById('mdl-dialog2'));
            document.getElementById("lrdialog").style.display = "block";

            return;
        }

        let phone = null;
        let founderror = false;

        if (InputVal('first_name').length < 3 ) {
            founderror = true;
            isinvalid.first_name = '';
        } else {
            isinvalid.first_name = false;
        }
        if (InputVal('last_name').length < 3 ) {
            founderror = true;
            isinvalid.last_name = '';
        } else {
            isinvalid.last_name = false;
        }
        if (InputVal('floor').length < 1) {
            founderror = true;
            isinvalid.floor = '';
        } else {
            isinvalid.floor = false;
        }

        if (InputVal('bell').length < 1) {
            founderror = true;
            isinvalid.bell = '';
        } else {
            isinvalid.bell = false;
        }

        if (InputVal('phone').replace('+', '00').replace('-', '').length < 10 || !isNumeric(InputVal('phone').replace('+', '00').replace('-', ''))) {
            isinvalid.phone = '';
            founderror = true;
        } else {
            isinvalid.phone = false;
            phone = InputVal('phone');
        }

        setIsinvalid(Object.assign({}, isinvalid));

        if (founderror) {

            document.getElementById("mdl__content").scrollTo(0, 0);
            setIsloader(false)
            return;
        }

        let upSert = {};
        if (typeof myPos.position.phone === 'undefined') {
            upSert = {
                lat: myPos.position.lat,
                lng: myPos.position.lng,
                street_name: myPos.position.street_name,
                street_number: myPos.position.street_number,
                postal_code: myPos.position.postal_code,
                district: myPos.position.district,
                city: myPos.position.city,
                country: myPos.position.country,
                bell: InputVal('bell'),
                floor: InputVal('floor'),
                phone: phone,
                first_name: InputVal('first_name'),
                last_name: InputVal('last_name'),
            }


        } else {

            upSert = {
                lat: myPos.position.lat,
                lng: myPos.position.lng,
                street_name: myPos.position.street_name,
                street_number: myPos.position.street_number,
                postal_code: myPos.position.postal_code,
                district: myPos.position.district,
                city: myPos.position.city,
                country: myPos.position.country,
                bell: InputVal('bell'),
                floor: InputVal('floor'),
                phone: phone,
                first_name: InputVal('first_name'),
                last_name: InputVal('last_name'),
            }

        }

        window.user.position = upSert;

        if (PickUp !== 'pickup') PickUp = 'delivery'
        //  if (PayWay === 'cash' || PayWay === 'paypal' || PayWay === 'tickets' || PayWay === 'wireless_pos') {

        let obj = {
            store_id: props.store._id.oid,
            cart: props.cart,
            total: props.total,
            delivery_time: props.store.delivery_time,
            method: PayWay,
            pickup: PickUp,
            zone: props.store.zone,
            cart_notes: InputVal('cart-notes'),
            delivery_address: upSert,
        }
        let la = await UseAxios(obj, 'users/place_order');


        proc_responses(la, obj)

        // }


    }

    function proc_responses(la, obj) {
        if (la.status === 'store-offline') {
            sendToast(translate('Store appears offline'));
        }
        if (la.status === 'ok') {
            let obj = {
                id: la.id,
                method: PayWay,
            }

        
            document.getElementById('recaptcha_cnt').innerHTML = '';
            let user = JSON.parse(window.localStorage.getItem('user'));

            user.lastpayopt = PayWay;

            localStorage.setItem('user', JSON.stringify(user));




            if (la.method === 'paypal') {


                document.getElementById('fpaypal_order_id').value = la.id;
                document.getElementById('fpaypal_amount').value = props.total;
                document.getElementById('fpaypal_name').value = props.store.store_name;
                var windowName = "paypal_window";
                var url = "";

                if (window.innerWidth > 416) {
                    var popup_window=  window.open(url, windowName, "height=500,width=416");
                } else {
                    var popup_window=  window.open(url, windowName, "height=" + (window.innerHeight - 100) + ",width=" + (window.innerWidth - 100));
                }


                try {
                    popup_window.focus();   
                } catch (e) {
                    alert(translate("We can't open paypal window because your browser blocks new windows, please add this site to your browsers exception list."));
                    setIsloader(false)
                    return;
                }


                document.getElementById('paypalForm').submit()

            }
            sendingDialog(obj, props.store.phone, ordercompleted);
        }
        if (la.status === 'get-pincode') {
            let thephone = window.user.position.phone;
            window.user.position.phone = undefined;


            window.localStorage.setItem('user', JSON.stringify(window.user))
            SmsPinDialog(thephone, async (e) => {
                obj.delivery_address.phone = thephone
                obj.delivery_address.pin_code = e;
                let la = await UseAxios(obj, 'users/place_order');
                proc_responses(la, obj)

            },
                function () {

                    isinvalid.phone = '';
                    sendToast(translate('Phone number is incorrect'))
                    setIsinvalid(Object.assign({}, isinvalid));
                }



            )
        }
        if (la.status === 'wrong-pin') {
            alert(translate('Error'));

        }
        if (typeof (la.set_phone) !== 'undefined' && la.set_phone.length > 3) {
            let user = JSON.parse(window.localStorage.getItem('user'));

            user.position.phone = la.set_phone;

            localStorage.setItem('user', JSON.stringify(user));
            //  //console.log('seeted phone')

        }

        setIsloader(false)
    }
    const goBack = (e) => {

        ReactDOM.render(

            <Store translate={translate} store={props.store.store_url} />

            , document.getElementById('page-content'));
    }
    return (
        <>
            <div style={{ justifyContent: 'center' }} className="mdl-grid">
                <div style={{ padding: '3px', margin: '3px', minWidth: '340px' }} className=" mdl-cell--4-col  mdl-cell--4-col-phone mdl-cell--8-col-tablet mdl-shadow--2dp">



                    <div className="mdl-layout__header-row mdl-card__supporting-text">
                        <h4>{translate('Your Address')}</h4>

                    </div>


                    <Select readOnly={true} style={{ width: '100%' }} showGoogle={false} autocomplete={false} onSelect={(e) => handleaddress(e)} options={address} id="address" placeholder=" " label={translate("Address")} icon="where_to_vote" type="text" />

                    {(JSON.parse(window.localStorage.getItem('user')).AuthToken === 0 || typeof JSON.parse(window.localStorage.getItem('user')).position.phone === 'undefined' || user_firstname == '' || user_lastname == '') &&
                        <>
                            <Input defaultValue={user_firstname} isinvalid={isinvalid.first_name} id="first_name" style={{ width: '50%' }} text={translate("First name")} icon="perm_identity" type="text" />

                            <Input defaultValue={user_lastname} isinvalid={isinvalid.last_name} id="last_name" style={{ width: '50%' }} text={translate("Last name")} icon="hide" type="text" />




                        </>






                    }
                    <div style={!showAddress ? { display: 'block' } : { display: 'none' }}>
                        <Input isinvalid={isinvalid.bell} id="bell" style={{ width: '70%' }} type="text" text={translate("Bell")} icon="notifications_none" defaultValue={JSON.parse(window.localStorage.getItem('user')).position.bell} />
                        <Input isinvalid={isinvalid.floor} style={{ width: '30%' }} id="floor" placeholder=" " type="text" text={translate("Floor")} icon="business" type="number" min="-5" max="200" defaultValue={parseInt(JSON.parse(window.localStorage.getItem('user')).position.floor)} />

                    </div>

                    {showAddress && (<>

                        {props.store.store_name}  {props.store.street_name}  {props.store.street_number}   {props.store.district}

                    </>
                    )}

                    <Input isinvalid={isinvalid.phone} id="phone" style={{ width: '100%' }} defaultValue={JSON.parse(window.localStorage.getItem('user')).position.phone} text={translate("Phone")} icon="phone" type="text" />




                    <div style={{ width: '100%' }} className="mdl-textfield mdl-js-textfield">
                        <textarea className="mdl-textfield__input" type="text" rows="2" id="cart-notes" ></textarea>
                        <label className="mdl-textfield__label" htmlFor="cart-notes">{translate("Write your notes")}</label>
                    </div>





                </div>

                <div style={{ padding: '3px', margin: '3px', minWidth: '340px' }} className=" mdl-cell--4-col  mdl-cell--4-col-phone mdl-cell--8-col-tablet mdl-shadow--2dp">

                    <div className="mdl-layout__header-row mdl-card__supporting-text">
                        <h4>  <i className="material-icons mdl-color-text--primary  cart-icon">shopping_cart</i> {translate("Cart")} ({props.cart.length})</h4>

                    </div>

                    <div className="options-cart-content">
                        {Object.keys(props.cartdisplay).map(item => (

                            <div key={props.cartdisplay[item].name} className="incart-option  mdl-shadow--1dp">


                                <div className="cart-option-title">{props.cartdisplay[item].name}</div>



                                {props.cartdisplay[item].content}

                                <small className="price-tag">{parseFloat(props.cartdisplay[item].price).toFixed(2)}€</small>
                            </div>

                        ))}

                    </div>
                    <div className="allergy_div">
                                                <a onClick={(e) => { e.preventDefault(); window.fireOne('allergies', true, props.store.phone) }} href="#allergy">{translate('Allergens')}</a>
                                            </div>
                    <div className="center-align">
                        <button onClick={(e) => goBack()} style={{ margin: '10px', width: '210px' }} className="mdl-button mdl-js-button mdl-button--raised mdl-button--accent">
                            {translate("Edit")}
                        </button>  </div>
                    <form target="paypal_window" name="_xclick" id="paypalForm" style={{ display: 'none' }} method="post" action="https://www.paypal.com/cgi-bin/webscr">
                        <input type="hidden" name="cmd" value="_xclick" />
                        <input type='hidden' name='cancel_return' value='http://www.eatin.gr/api/users/close_window' />
                        <input type="hidden" name="business" value="sb-zf9xx890533@business.example.com" />
                        <input type="hidden" name="item_name" id="fpaypal_name" />
                        <input type="hidden" name="notify_url" value="http://www.eatin.gr/api/users/validate_paypal" />
                        <input type="hidden" name="amount" id="fpaypal_amount" />
                        <input type="hidden" name="item_number" value='' id='fpaypal_order_id' />
                        <input type="hidden" name="currency_code" value="EUR" />
                        <input type='hidden' name='return' value="http://www.eatin.gr/api/users/close_window" />
                        <input type="submit" value="Buy Now" />
                    </form>


                </div>
                <div id='test'></div>
                <div style={{ padding: '3px', margin: '3px', minWidth: '340px' }} className=" mdl-cell--4-col  mdl-cell--4-col-phone mdl-cell--8-col-tablet mdl-shadow--2dp">



                    <div className="mdl-layout__header-row mdl-card__supporting-text">
                        <h4>{translate("Payment")}</h4>

                    </div>


                    <Select readOnly={true} style={{ width: '100%' }} showGoogle={false} autocomplete={false} onSelect={(e) => handlePayway(e)} options={paymentways} id="payment" placeholder=" " label={translate("Payment options")} icon="add_shopping_cart" type="text" />
                    <div className="center-align">
                        <div style={{ fontWeight: '800' }} className="mdl-color-text--primary body-2-force-preferred-font">{translate("Total amount:")} {parseFloat(props.total).toFixed(2)}€</div>
                        <button disabled={isloader} onClick={(e) => HandlesendOrder()} style={{ margin: '10px', width: '100%' }} className="mdl-button mdl-js-button mdl-button--raised mdl-button--accent">
                            {!isloader && <>{translate("SEND ORDER")}</>}
                            {isloader && <img className="center-align" style={{ padding: '0', alignself: 'center', width: '30px', height: '30px', display: isloader ? 'inline-block' : 'none' }} src={smallloader} alt={"loading..."} />}

                        </button>

                    </div>
                </div>

            </div>

        </>

    )
}


export default Order;


