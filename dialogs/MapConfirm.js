import React, { useEffect } from 'react';

import ReactDOM from 'react-dom';
function MapConfirm(props) {
    const translate = props.translate
    useEffect(() => {
        window.dialog_c.push(closeDialog)
        initMap(props.geo)
        document.getElementById('innerdialog').parentElement.style.minWidth = '340px'
    }, [])

    const closeDialog = () => {
        document.getElementById("lrdialog2").style.display = "none";
        ReactDOM.unmountComponentAtNode(document.getElementById('mdl-dialog'));
    }
    const handleYes = (e) => {
        if (typeof props.onYes === 'function') {
            props.onYes();
            window.localStorage.setItem('map', true);
            document.getElementById("lrdialog2").style.display = "none";
            ReactDOM.unmountComponentAtNode(document.getElementById('mdl-dialog'));
        }
    }
    function initMap(geo) {
        // The location of Uluru

        // The map, centered at Uluru
        /*global google*/ // To disable any eslint 'google not defined' errors
        var map = new google.maps.Map(
            document.getElementById('mapavv'),
            {
                zoom: 15,
                center: geo,
                streetViewControl: false,
                mapTypeControl: false
            });


        /*global google*/ // To disable any eslint 'google not defined' errors
        var marker = new google.maps.Marker({ position: geo, map: map });

    }
    return (
        <>
            <div id="innerdialog"  >

                <div style={{ width: 'auto', padding: '4px' }} className=" mdl-card__supporting-text">
                    <h4>{translate('Confirm')} </h4>

                </div>
                <div style={{ width: 'auto', padding: '4px' }} className=" mdl-card__supporting-text">

                    {translate('Please confirm you address.')}
                </div>

                <div style={{ width: '100%', maxHeight: '350px', minHeight: '250px' }} id="mapavv"></div>

                <div className="mdl-dialog__actions">

                    <button type="button" onClick={e => closeDialog(e)} className="mdl-button mdl-js-button mdl-button--raised">{translate('Cancel')}</button>
                    <button type="button" onClick={e => handleYes(e)} className=" mdl-button--colored mdl-button mdl-js-button mdl-button--raised">Ok</button>
                </div>

            </div>
        </>
    );
}

export default MapConfirm;