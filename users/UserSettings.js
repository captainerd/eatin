
import React, { Suspense, lazy, useState, useEffect } from 'react';
import smallloader from '../images/smallloader.gif';

import axios from 'axios';
import ReactDOM from 'react-dom';
import Input from '../CompoViews/Input';
import YourAddresses from './YourAddresses';
import YourInformation from './YourInformation';
import ChangePassword from './ChangePassword';






function UserSettings(props) {
    const translate = props.translate;
    const [isinvalid, setIsinvalid] = useState({
        password: false,
        email: false,
    });
    const [loader, setLoader] = useState(false);

    // document.getElementById('preload').style.display = 'none';

    useEffect(() => {




        window.componentHandler.upgradeAllRegistered();
    });
    const saveChanges = () => {

    }



    return (
        <>


            <div style={{ justifyContent: 'center' }} className="mdl-grid">




                <YourAddresses translate={translate} />
                <YourInformation translate={translate} />
                <ChangePassword translate={translate} />
            </div>


        </>


    );
}



export default UserSettings;