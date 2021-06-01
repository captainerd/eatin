import React, { useEffect, useState } from 'react';
import Categories from './Categories'
import AddProduct from './AddProduct'
import EditProduct from './EditProduct'
import Loading from '../Loading';
import Efoodport from './Efoodport';
import ProOrder from './ProOrder';
import EditOffer from './EditOffer';


function ProductStore(props) {
    const translate = props.translate;
    const [loading, setLoading] = useState(true);


    useEffect(() => {

        if (!(typeof (window.componentHandler) == 'undefined')) {
            window.componentHandler.upgradeElements(document.getElementById("maintabs"));

            window.componentHandler.upgradeAllRegistered();
        }
        setTimeout(() => {
            setLoading(false);
        }, 300);
    }, []);


    return (
        <>
            {loading && <Loading />}
            <div style={loading ? { display: 'none' } : {}} id="maintabs" className="mdl-tabs mdl-js-tabs mdl-js-ripple-effect">
                <div className="mdl-tabs__tab-bar">
                    <a href="#categories" className="mdl-tabs__tab is-active"> <i className="material-icons">category</i>{translate('General')}</a>
                    <a href="#Add_Product" className="mdl-tabs__tab"><i className="material-icons">library_add</i>{translate('Add Product')}</a>
                    <a href="#Edit_Product" className="mdl-tabs__tab"><i className="material-icons">edit</i>{translate('Edit Product')}</a>
                    <a href="#Edit_offers" className="mdl-tabs__tab"><i className="material-icons">edit</i>{translate('Edit Offers')}</a>
                </div>

                <div className="mdl-tabs__panel is-active" id="categories">



                    <Efoodport translate={translate} edit={props.edit} />
                    <Categories translate={translate} edit={props.edit} />
                    <ProOrder translate={translate} edit={props.edit} />
                </div>

                <div className="mdl-tabs__panel  " id="Add_Product">
                    <AddProduct translate={translate} edit={props.edit} />

                </div>



                <div className="mdl-tabs__panel " id="Edit_Product">
                    <EditProduct translate={translate} edit={props.edit} />
                </div>

                <div className="mdl-tabs__panel " id="Edit_offers">
                    <EditOffer translate={translate} edit={props.edit} />
                </div>
            </div>

        </>


    )
}
export default ProductStore;