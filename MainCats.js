import React, { useEffect, useState } from 'react';
import { UseAxios } from './functions/Functions';

import smallloader from './images/smallloader.gif';

var catValues = [];
var oldCats = [];

function MainCats(props) {
    const translate = props.translate;
    const [loading, setloading] = useState(' background-skeleton ')
    const [catlist, setCatlist] = useState([
        {
            label: '  ',
            id: '01414',
        },
        {
            label: '  ',
            id: '04455',
        },
        {
            label: '  ',
            id: '01133',
        },
        {
            label: '  ',
            id: '01177',
        },
        {
            label: '  ',
            id: '02525',
        },
        {
            label: '  ',
            id: '044174',
        },
        {
            label: '  ',
            id: '099997',
        },


    ]);


    useEffect(() => {

        loadCats();

        if (typeof window.componentHandler !== 'undefined') window.componentHandler.upgradeAllRegistered();

    }, []);

    useEffect(() => {

      
        if (typeof window.componentHandler !== 'undefined') window.componentHandler.upgradeAllRegistered();

    });

    const loadCats = async () => {

        let la = await UseAxios({ do: 'list' }, 'public/list_cats');
        if (la.status == 'ok') {
            setloading('  ')
            setCatlist(la.cats);

            if (typeof props.catLoaded === 'function') {
                props.catLoaded(la.cats);
            }

        }


    }
    const CheckCat = (e) => {
        let category = e.target.id.replace('cat-', '');
        if (category === 'all-cuisines') {
            if (e.target.checked) {
                oldCats = catValues;
                catValues = [];
                catlist.map(item => {
                    document.getElementById('labelcat-' + item.id).MaterialCheckbox.uncheck();

                });
            }
            if (!e.target.checked) {


                catValues = oldCats;
                oldCats = [];
                catValues.map(item => {
                    document.getElementById('labelcat-' + item).MaterialCheckbox.check();

                });

            }
        } else {

            category = parseInt(category);
            if (!e.target.checked) {
                if (catValues.indexOf(category) !== -1) catValues.splice(catValues.indexOf(category), 1);
            }

            if (e.target.checked) {
                catValues.push(category);
            }


        }
        if (typeof props.catChange === 'function') {
            props.catChange(catValues);
        }
        if (catValues.length > 0) document.getElementById('all-cuisinl').MaterialCheckbox.uncheck();
        if (catValues.length === 0) document.getElementById('all-cuisinl').MaterialCheckbox.check();
    }
    return (
        <>
            <div className="home-cuisines-title">
                <i style={{ fontSize: '20px', margin: '3px' }} className=" material-icons  	mdl-color-text--primary">restaurant</i> {translate('Cuisines')}
            </div>
            <div className="mdl-card__supporting-text store-menu-cat-mobile">
                <label id="all-cuisinl" className={"mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect category-checkbox"} htmlFor="all-cuisines">
                    <input defaultChecked={true} onChange={(e) => CheckCat(e)} type="checkbox" id='all-cuisines' className="mdl-checkbox__input" />
                    <span className="mdl-checkbox__label">{translate('All cuisines')}</span>
                </label>
                {catlist.length === 0 ? (

                    <div className="center-align"><img src={smallloader} /></div>
                ) : (<>
                    {catlist.map(item => (

                        <label key={item.id} id={'labelcat-' + item.id} className={"mdl-checkbox  mdl-js-checkbox mdl-js-ripple-effect category-checkbox" + loading} htmlFor={'cat-' + item.id}>
                            <input onChange={(e) => CheckCat(e)} type="checkbox" id={'cat-' + item.id} className="mdl-checkbox__input checkbox-opac" />
                            <span className="mdl-checkbox__label">{item.label}</span>
                        </label>



                    ))}
                </>)}
            </div>
        </>
    )

}


export default MainCats;