import React, { lazy, Suspense, useEffect, useState, Fragment } from 'react';
import { InputVal, UseAxios, sendToast } from './functions/Functions';
import ReactDOM from 'react-dom';
import Loading from './Loading';
const Home = lazy(() => import('./Home.js'));
function CityList(props) {
    const [cities, setcyties] = useState([]);


    useEffect(() => {
        loadCityList();
        if (typeof window.componentHandler !== 'undefined') window.componentHandler.upgradeAllRegistered();


    }, [])

    const loadCityList = async () => {
        let la = await UseAxios({}, 'public/city_list')
        if (la.status === 'ok') setcyties(la.places)

    }

    const gotourl = (e, a) => {
        if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
        e.preventDefault();


        ReactDOM.unmountComponentAtNode(document.getElementById('page-content'));

        window.fireOne('cityhome', true, a)


    }
    //      <a    onClick={(e) => gotourl(e, cities[index].city_url)} href={"delivery/" + cities[index].city_url}>{cities[index].city}</a> -  

    return (
        <>
            <ul className="city_list">
                <li >
                    {Object.keys(cities).map((item) => (
                        <Fragment key={cities[item].city_url}>


                            [   <a onClick={(e) => gotourl(e, cities[item].city_url)} href={"delivery/" + cities[item].city_url}>  {cities[item].city_name}</a> :


                         {Object.keys(cities[item].area).map((itema) => (
                                <Fragment key={cities[item].area[itema]} >


                                    <a onClick={(e) => gotourl(e, itema)} href={"delivery/" + itema}>  {cities[item].area[itema]}</a> -





                                </Fragment>

                            ))}









                            ]
                        </Fragment>

                    ))}
                </li>
            </ul>
        </>
    )
}

export default CityList;