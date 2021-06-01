
import React, { Suspense, lazy, useState, useEffect } from 'react';

import ReactDOM from 'react-dom';

import DialogConfirm from '../dialogs/DialogConfirm';


import { UseAxios, sendToast } from '../functions/Functions';
import Select from '../CompoViews/Select';
const AddAddress = lazy(() => import('./AddAddress'));


var sellAddr = {};

function YourAddresses(props) {
    const translate = props.translate
    async function ConfirmDialog(text, callback) {

        ReactDOM.render(<>

            <DialogConfirm translate={translate} text={text} onYes={(e) => callback()} />

        </>, document.getElementById('mdl-dialog'));
        document.getElementById("lrdialog2").style.display = "block";

    }

    const [addresses, setAddr] = useState({
        addr: []
    });
    const [loading, setloading] = useState(false);
    //    document.getElementById('preload').style.display = 'none';

    useEffect(() => {





        window.componentHandler.upgradeAllRegistered();
    });

    useEffect(() => {
        initAddr();

        return () => {
            // //console.log("componentWillUnmount");

        };
    }, []);



    const initAddr = async () => {
        setloading(true);
        let addressezs = await UseAxios('list', 'users/list_address');


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

    const deleteAddr2 = async (a) => {

        let myobj = {
            what: 'delete',
            who: sellAddr.id,
        }
        let result = await UseAxios({ do: myobj }, 'users/list_address');

        if (result.status === 'ok') {

            initAddr();

        }
    }
    const deleteAddr = async () => {

        ConfirmDialog(translate('Are you sure you want to delete: ') + '<br/><hr></hr>' + sellAddr.title, function () {
            deleteAddr2('eee');
        }
        );


    }
    const onNewaddr = async (e) => {

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
            localStorage.setItem("user", JSON.stringify(myPos)); //local storage

            sendToast(translate('Changed default address to ') + e.label);
        }
    }
    const addAddress = () => {

        ReactDOM.render(<Suspense fallback={<div>Loading...</div>}>

            <AddAddress translate={translate} onClose={(e) => initAddr()} />

        </Suspense>, document.getElementById('mdl-dialog2'));
        document.getElementById("lrdialog").style.display = "block";
    }
    return (
        <>



            <div style={{ padding: '3px', margin: '3px', minWidth: '340px' }} className="mdl-cell--4-col  mdl-cell--4-col-phone  mdl-cell--7-col-tablet mdl-shadow--2dp">

                <div className="mdl-layout__header-row mdl-card__supporting-text">
                    <h4>{translate('Your Adresses')}</h4>

                </div>



                {!loading ? ('Loading') : (


                    <div style={{ padding: '10px' }}>
                        <Select icon='where_to_vote' style={{ width: '100%' }} onSelect={(e) => onNewaddr(e)} readOnly={true} id="user_addr" label={translate("Your Address")} options={addresses.addr} />

                    </div>


                )}




                <div className="center-align">

                    <button onClick={addAddress} className="mdl-button mdl-js-ripple-effect mdl-js-button  mdl-button--raised mdl-button--colored">
                        <i className="material-icons">add</i>
                    </button>
                    &nbsp;
                    <button onClick={deleteAddr} className="mdl-button mdl-js-ripple-effect mdl-js-button  mdl-button--raised mdl-button--colored">
                        <i className="material-icons">remove</i>
                    </button>
                </div>




            </div>









        </>
    );

}


export default YourAddresses;