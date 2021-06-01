import React, { useState, useEffect, Fragment } from 'react';
import { UseAxios } from '../functions/Functions';
import smallloader from '../images/smallloader.gif';
import Store from '../Store'
import ReactDOM from 'react-dom';
import StarRating from '../CompoViews/StarRating'
import VoteOrder from './VoteOrder'
 

function Orders(props) {
    const translate = props.translate
    const [myorders, setMyorders] = useState([]);
    const [loader, setLoader] = useState(false);
    const [firstload, setfirstload] = useState(true);
    const [page, setpage] = useState(1);
    const [havebutton, sethavebutton] = useState(false);
    const [emtpypage, setempty] = useState(false);
    useEffect(() => {
        loadOrders(1);


    }, []);
    useEffect(() => {
        if (typeof window.componentHandler !== 'undefined') window.componentHandler.upgradeAllRegistered();
    });


    const loadOrders = async (page) => {
        sethavebutton(false);
        let la = await UseAxios({ page: page, store_id: props.store_id }, 'users/my_orders');
        setfirstload(false);
        if (la.status === 'ok') {
            if (la.orders.length > 0) {
                setMyorders([...myorders, ...la.orders]);
                sethavebutton(true);


            } else {
                sethavebutton(false);
            }
        }
        if (page === 1 && la.orders.length === 0) {
            setempty(true)
        }
        if (la.orders.length < 5) {
            sethavebutton(false);
        }
    }
    const reOrder = async (orderid) => {
        setLoader(true);
        let la = await UseAxios({ order_id: orderid }, 'users/reorder_old');
        if (la.status === 'ok') {

            ReactDOM.unmountComponentAtNode(document.getElementById('page-content'));

            ReactDOM.render(

                <Store translate={translate} store={la.store} />

                , document.getElementById('page-content'));

        }

        setLoader(false)

    }
    const loadMore = async () => {
        loadOrders(page + 1);
        setpage(page + 1);

    }
    const unvotedClick = (e, a, storename) => {


        ReactDOM.render(<>

            <VoteOrder translate={translate} storename={storename} orderId={e} />

        </>, document.getElementById('mdl-dialog2'));
        document.getElementById("lrdialog").style.display = "block";
        myorders[a].voted = true;

        setMyorders([...myorders])
    }
    const gotoStore = (e, a) => {
        if (typeof a.stopImmediatePropagation === 'function') a.stopImmediatePropagation();
        a.preventDefault();

    
            ReactDOM.render(<Store translate={translate} store={e} /> , document.getElementById('page-content'));
        
      
           
      
    }
    return (
        <>

            <div className="mdl-grid">

                <div style={{ width: '100%' }} className="mdl-cell mdl-cell--3-col  ">

                    {firstload &&

                        <img className="center-align" style={{ padding: '0', alignself: 'center', width: '30px', height: '30px', display: loader ? 'inline-block' : 'none' }} src={smallloader} alt={"loading..."} />
                    }
                    {emtpypage &&
                        <>
                            <div className="center-align">
                                <div className="store-cointainer mdl-shadow--2dp">

                                    <div className="mdl-card__title">
                                        <h2 className="mdl-card__title-text">{translate('No Orders')}</h2>
                                    </div>
                                    <div className="mdl-card__supporting-text">

                                        {translate("You haven't yet made an order, aren't you hungry yet?")}
                                    </div>
                                </div>
                            </div>
                        </>




                    }


                    {myorders.map((item, index) => (
                        <div key={item.fake_id} className="store-cointainer mdl-shadow--2dp">
                            <div className="mdl-grid   ">

                                <div className="mdl-cell mdl-cell--2-col  ">

                                    {item.fake_id}

                                    {(item.method === 'credit_card' || item.method === 'paypal') && (
                                        <>

                                            <i style={{ color: '#0075d4', fontSize: '16px' }} title="Paid with credit card" className="material-icons"> credit_card</i>
                                        </>
                                    )}


                                </div>
                                <div className="mdl-cell mdl-cell--2-col  ">

                                    {item.date}<br />
                                    <a href={'/stores/' + item.store_url} onClick={(e) => gotoStore(item.store_url, e)}>
                                        {item.photo && <img className="store-logo_orders" src={"http://192.168.9.142/" + item.photo} />}</a>
                                    &nbsp;&nbsp;<a href={'/stores/' + item.store_url} onClick={(e) => gotoStore(item.store_url, e)}>{item.store_name}
                                    </a>
                                    <br />
                                    {!item.voted &&
                                        <StarRating onClick={(e) => unvotedClick(item.order_id, index, item.store_name)} />




                                    }

                                </div>
                                <div className="mdl-cell mdl-cell--3-col my_orders_container ">

                                    {item.products.map((itema, index) => (
                                        <Fragment key={index}>
                                            <div className="my_orders_prods">
                                                {itema.qnty} x {itema.product}<br />
                                            </div>

                                            {itema.options && <small className="my_orders_prod_options"> ({itema.options}) </small>}


                                        </Fragment>
                                    ))}

                                </div>
                                <div className="mdl-cell mdl-cell--3-col  ">


                                    <button disabled={loader} onClick={(e) => reOrder(item.order_id)} className="mdl-button mdl-js-ripple-effect mdl-js-button  mdl-button--raised mdl-button--colored">
                                        {!loader && <>{translate("Add to cart")}</>}
                                        <img className="center-align" style={{ padding: '0', alignself: 'center', width: '30px', height: '30px', display: loader ? 'inline-block' : 'none' }} src={smallloader} alt={"loading..."} />

                                    </button>
                                </div>
                                <small className="price-tag">{item.total}€</small>
                            </div>

                        </div>
                    ))}
                </div>
                {havebutton && <div style={{ width: '100%' }} className="center-align">
                    <button disabled={loader} onClick={(e) => loadMore()} className="mdl-button mdl-js-ripple-effect mdl-js-button  mdl-button--raised mdl-button--colored">
                        {!loader && <>{translate("Load more")}</>}
                        <img className="center-align" style={{ padding: '0', alignself: 'center', width: '30px', height: '30px', display: loader ? 'inline-block' : 'none' }} src={smallloader} alt={"loading..."} />

                    </button>
                </div>}
            </div>
        </>
    )
}

export default Orders;