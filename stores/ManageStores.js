
import React, { Suspense, lazy, useState, useEffect } from 'react';


import ReactDOM from 'react-dom';

import DialogConfirm from '../dialogs/DialogConfirm';
import Loading from '../Loading';
import '../css/store.css';

import { UseAxios, sendToast } from '../functions/Functions';
import Select from '../CompoViews/Select';
import ReconnectingWebSocket from 'reconnecting-websocket';
import AcceptOrder from './AcceptOrder'

const NewStore = lazy(() => import('./NewStore'));
const EditaStore = lazy(() => import('./EditaStore'));
const DeliveryMap = lazy(() => import('./DeliveryMap'));
const ProductStore = lazy(() => import('./ProductStore'));
const OrdersStore = lazy(() => import('./OrdersStore'));



var audio = new Audio('./0001.wav');
var sellAddr = {};
var unConfirmed = [];
var stires_collection = [];



function ManageStores(props) {
    const translate = props.translate

    async function sendingDialog(text, callback) {
        setTimeout(() => {


            ReactDOM.render(

                <AcceptOrder translate={translate} order={text} onYes={(e) => callback(e)} />

                , document.getElementById('mdl-dialog2'));
            document.getElementById("lrdialog").style.display = "block";

        }, 300);


    }

    async function ConfirmDialog(text, callback) {

        ReactDOM.render(

            <DialogConfirm translate={translate} text={text} onYes={(e) => callback()} />

            , document.getElementById('mdl-dialog'));
        document.getElementById("lrdialog2").style.display = "block";

    }

    const [addresses, setAddr] = useState({
        stores: []
    });
    const [loading, setloading] = useState(false);
    //    document.getElementById('preload').style.display = 'none';
    const checkAndAccept = async () => {
        unConfirmed.slice(0).reverse().map(async (item) => {

            if (item.confirmed === 0) {
                sendingDialog(item, async function (e) {

                    if (e === 1) {


                        unConfirmed.splice(unConfirmed.indexOf(item), 1);

                    }

                    if (e === 0) {


                        unConfirmed.splice(unConfirmed.indexOf(item), 1);

                    }
                    if (unConfirmed.length > 0) {
                        setTimeout(() => {
                            checkAndAccept();
                        }, 700);

                    }

                })
            }


        })


    }

    useEffect(() => {





        //        window.componentHandler.upgradeAllRegistered();
    });
    window.reloadstores = () => {
        initAddr();

    }
    useEffect(() => {
        initAddr();


        window.webConnect = new ReconnectingWebSocket(window.websockets, [], { connectionTimeout: 1000, maxRetries: 100000000000000000000000000000, });

        //  ws = new WebSocket('wss://192.168.9.142/ws');

        window.webConnect.onopen = () => {
            doWatchRegister(window.webConnect)

        }
        window.webConnect.onmessage = (e) => {


            if (e.data === 'server-ok') {

            }
            if (e.data.substr(0, 11) === 'new-orders:') {
                let la = e.data;
                la = la.substr(11, la.length);
                la = JSON.parse(la);
                //console.log(la)
                unConfirmed.push(la);
                checkAndAccept();
                if (typeof window.LiveOrders === 'function') window.LiveOrders();



            }
        }


        audio.play();
        audio.currentTime = 0;
        audio.pause();

        // return () => ws.close();

        return () => {
            // //console.log("componentWillUnmount");

        };
    }, []);

    const doWatchRegister = (ws) => {

        if (typeof stires_collection !== 'undefined' && stires_collection.length > 1) {
            stires_collection.map(item => {

                
                if (item.id !== 'new_store_id' && parseInt(JSON.parse(window.localStorage.getItem('user')).role) === 2) ws.send(JSON.stringify({ for: 'order_watch', Agent: navigator.userAgent, AuthToken: JSON.parse(window.localStorage.getItem('user')).AuthToken, store_id: item.id }))
            })


        } else {
            setTimeout(() => {

                doWatchRegister(ws)
            }, 2000)
        }
    }

    const initAddr = async () => {
        setloading(true);
        let addressezs = await UseAxios('list', 'stores/list_stores');
        stires_collection = addressezs.stores;

        if (typeof addressezs !== "undefined") {

            if (addressezs.status === 'ok') {
                addressezs.stores.map((item) => {



                    if (typeof item.default !== 'undefined') {
                        sellAddr = item;
                    }
                });
                let la = [];
                la.id = 'new_store_id';
                la.label = translate('Add new store');


                addressezs.stores.push(la);
                setAddr(addressezs);


            } else {
                sendToast('Error');
            }
        }



    }


    const loadStorePage = (e, a) => {


        if (typeof e !== 'undefined') e.preventDefault();


        ReactDOM.unmountComponentAtNode(document.getElementById('page-content'));

        ReactDOM.render(<Suspense fallback={<Loading />}>

            {a}

        </Suspense>, document.getElementById('page-content'));

        document.getElementById('first').MaterialLayout.toggleDrawer();


    }


    const onNewaddr = async (e) => {
        if (e.id === 'new_store_id') {

            loadStorePage(undefined, <NewStore translate={translate} />);
            return;


        }

        sellAddr = {
            id: e.id,
            title: e.label,

        };


    }
    //                            <a onClick={(e) => loadStorePage(e, <Customize edit={sellAddr.id} />)} className="mdl-navigation__link" href=""><i className="material-icons">format_paint</i> Customize</a>
    return (
        <>






            {!loading ? ('Loading') : (

                <>
                    <div style={{ padding: '10px' }}>
                        <Select icon='store' style={{ width: '200px' }} onSelect={(e) => onNewaddr(e)} readOnly={true} id="uaddr" label={translate("Your Stores")} options={addresses.stores} />

                    </div>
                    {addresses.stores.length > 1 &&
                        <>
                            <a onClick={(e) => loadStorePage(e, <OrdersStore translate={translate} edit={sellAddr.id} />)} className="mdl-navigation__link" href=""><i className="material-icons">date_range</i> {translate("Orders")}</a>
                            <a onClick={(e) => loadStorePage(e, <EditaStore translate={translate} edit={sellAddr.id} />)} className="mdl-navigation__link" href=""><i className="material-icons">edit</i> {translate("Edit store")}</a>

                            <a onClick={(e) => loadStorePage(e, <DeliveryMap translate={translate} edit={sellAddr.id} />)} className="mdl-navigation__link" href=""><i className="material-icons">directions_bike</i> {translate("Settings")}</a>
                            <a onClick={(e) => loadStorePage(e, <ProductStore translate={translate} edit={sellAddr.id} />)} className="mdl-navigation__link" href=""><i className="material-icons">local_dining</i> {translate("Products")}</a>

                        </>
                    }
                </>
            )}












        </>
    );

}


export default ManageStores;