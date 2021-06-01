
import React, { Suspense, lazy, useState, useEffect } from 'react';

import ReactDOM from 'react-dom';

import DialogConfirm from './dialogs/DialogConfirm';


import { UseAxios, sendToast } from './functions/Functions';
import Select from './CompoViews/Select';


var sellAddr = {};

function ListAddress_widget(props) {
    const translate = props.translate;
    const [addresses, setAddr] = useState({
        addr: []
    });
    const [loading, setloading] = useState(false);
    //    document.getElementById('preload').style.display = 'none';

    useEffect(() => {





        if (typeof window.componentHandler !== 'undefined') window.componentHandler.upgradeAllRegistered();
    });

    useEffect(() => {
        initAddr();

        return () => {
            // //console.log("componentWillUnmount");

        };
    }, []);




    const initAddr = async () => {
        if (JSON.parse(window.localStorage.getItem('user')).position === null) return;

        if (
            typeof JSON.parse(window.localStorage.getItem('user')).position !== 'undefined'
            && typeof JSON.parse(window.localStorage.getItem('user')).position.phone === 'undefined'
            || JSON.parse(window.localStorage.getItem('user')) === null
            || JSON.parse(window.localStorage.getItem('user')).AuthToken === 0) {



            let xa = JSON.parse(window.localStorage.getItem('user')).position;

            if (typeof xa === 'undefined') return;
            xa = xa.street_name + ' ' + xa.street_number + ', ' + xa.city + ', ' + xa.district + ', ' + xa.postal_code;
            let newSel = [

                {
                    id: 479952812655,

                    label: xa,
                    default: true,


                }

            ]
            console.log(newSel)
            setAddr({ addr: newSel });
            return;

        }
        setloading(true);
        let addressezs = JSON.parse(window.localStorage.getItem('addresses'));

        if (addressezs !== null) {


            setAddr(addressezs);

        } else {
            addressezs = await UseAxios('list', 'users/list_address');
        }

        if (addressezs.status === 'ok') {
            if (typeof addressezs.addr !== 'undefined') {
                window.localStorage.setItem('addresses', JSON.stringify(addressezs));
                setAddr(addressezs);

                let myPos = JSON.parse(window.localStorage.getItem('user'));
                myPos.position = addressezs.info.info;
                window.localStorage.setItem("user", JSON.stringify(myPos)); //local sto

                addressezs.addr.map(function (item) {
                    if (item.default === true) {
                        sellAddr = {
                            id: item.id,
                            title: item.label

                        };
                    }

                });
            }

        } else {
            sendToast(translate('Error'));
        }




    }
    window.lloadpos = initAddr;

    const onNewaddr = async (e) => {
        if (JSON.parse(window.localStorage.getItem('user')).AuthToken === 0) return;

        if (e.id == sellAddr.id) { return; }
        let myobj = {
            what: 'default',
            who: e.id,
        }
        sellAddr = {
            id: e.id,
            title: e.label,

        };

        let result = await UseAxios({ do: myobj }, 'users/list_address');
        if (result.status === 'ok') {
            let myPos = JSON.parse(window.localStorage.getItem('user'));
            myPos.position = result.info;
            window.localStorage.setItem("user", JSON.stringify(myPos)); //local storage

            window.localStorage.removeItem('addresses');

            sendToast(translate('Changed default address to ') + e.label);
            if (typeof props.ChangeAddress === 'function') props.ChangeAddress();
        }
    }
    const addAddress = () => {


    }
    return (
        <>




            <Select icon='hide' menustyle={{ fontSize: '14px' }} inputstyle={{ fontSize: '14px' }} style={{ width: '99%' }} onSelect={(e) => onNewaddr(e)} readOnly={true} id="user_addr" label={translate("Your Address")} options={addresses.addr} />










        </>
    );

}


export default ListAddress_widget;