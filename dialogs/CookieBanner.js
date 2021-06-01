import React, { useEffect } from 'react';
import Input from '../CompoViews/Input'
import ReactDOM from 'react-dom';
function CookieBanner(props) {
    const translate = props.translate

    useEffect(() => {

        document.getElementById("p_notice").style.display = "block";

    }, [])
    const handleYes = (e) => {

        window.localStorage.setItem('cbanner', true);
        if (document.getElementById('cookiebanner2').checked) window.localStorage.setItem('analytics', true);


        document.getElementById("p_notice").style.display = "none";
        ReactDOM.unmountComponentAtNode(document.getElementById('p_notice'));

    }

    return (
        <>
            {translate('Welcome, This app is using nessesary cookies needed to function and cookies for usage analysis to improve the service. you can disable the later. for more information visit')}

            <a onClick={(e) => { e.preventDefault(); window.fireOne('privacy', true) }} href="/privacy">{translate('Privacy policy')}</a>
            <br />
            <div  >
                <Input type="checkbox" defaultChecked={true} id="cookiebanner" disabled={true} text={translate('Necessary')} />
            </div>

            <div >
                <Input type="checkbox" defaultChecked={true} id="cookiebanner2" text={translate('Statistics')} />
            </div>  <div  >
                <button onClick={handleYes} className=" mdl-button--colored mdl-button mdl-js-button mdl-button--raised">{translate('Accept')}</button>
            </div>
        </>
    );
}

export default CookieBanner;