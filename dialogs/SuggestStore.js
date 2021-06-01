import React, { useEffect, useState } from 'react';
import { UseAxios, InputVal, sendToast } from '../functions/Functions';
import ReactDOM from 'react-dom';
import Input from '../CompoViews/Input'
function SuggestStore(props) {
    const translate = props.translate
    const [isinvalid, setIsinvalid] = useState({
        phone: false,
        name: false,
    })

    const [loading, setloading] = useState(false);
    useEffect(() => {
        document.getElementById("lrdialog").style.display = "block";

        if (typeof window.componentHandler !== 'undefined') window.componentHandler.upgradeAllRegistered();




    }, [])


    const closeDialog = () => {
        document.getElementById("lrdialog").style.display = "none";
        ReactDOM.unmountComponentAtNode(document.getElementById('mdl-dialog2'));
    }
    const handleSend = async () => {
        let founderror = false;
        let isinvalidto = {
            name: false,
            phone: false,
        }
        if (InputVal('store_name').length === 0) {
            isinvalidto.name = ''
            founderror = true;
        }
        if (InputVal('phone').length === 0) {
            isinvalidto.phone = ''
            founderror = true;
        }
        setIsinvalid(isinvalidto)

        if (!founderror) {
            setloading(true)
            let la = await UseAxios({ store_name: InputVal('store_name'), phone: InputVal('phone') }, 'public/suggest_store')

            if (la.status === 'ok') {
                sendToast(translate('Thank you. We recieved your request.'))
                closeDialog()
            }
        }



    }

    const checkExtra= (e) => {


   if (e.target.checked === true) document.getElementById('extradiv').style.height = 'auto';
   if (e.target.checked === false) document.getElementById('extradiv').style.height = '0px';

    }
    return (
        <>
            <div className="center-align">

                <div className=" mdl-color-text--grey-600">
                    <h4>{translate('Suggest store')}</h4>

                </div>

                <div className="mdl-color-text--grey-600">

                    {translate('Please type some information about the store you would like to suggest')}

                </div>

                <Input isinvalid={isinvalid.name} style={{ width: '100%' }} type="text" icon="storefront" text={translate("Store name")} id="store_name" />
                <Input isinvalid={isinvalid.phone} style={{ width: '100%' }} type="text" icon="phone" text={translate("Phone")} id="phone" />
            
            {/*   
                <Input type="toggle" id="i_store" defalutValue="off" onChange={(e) => checkExtra(e)} text={translate("I am a representative of the store")} />

<div id="extradiv" style={{overflow: 'hidden', height: '0px'}}>

<Input isinvalid={isinvalid.name} style={{ width: '100%' }} type="text" icon="account_box" text={translate("Name")} id="store_repname" />

<Input isinvalid={isinvalid.name} style={{ width: '100%' }} type="text" icon="email" text={translate("E-Mail")} id="store_email" />

<Input isinvalid={isinvalid.name} style={{ width: '100%' }} type="text" icon="storefront" text={translate("Store Address")} id="store_address" />
</div>
*/ }


            </div>
            <div className="add-cart-actions">
                <button type="button" onClick={e => closeDialog(e)} className="mdl-button mdl-js-button mdl-button--raised">{translate("Cancel")}</button>
                <button disabled={loading} style={{ marginLeft: '10px' }} onClick={e => handleSend(e)} className="mdl-button mdl-js-button mdl-button--raised mdl-button--accent">
                    {translate('Send')}
                </button>
            </div>
        </>
    );
}

export default SuggestStore;