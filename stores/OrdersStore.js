import React, { useEffect, useState } from 'react';
import Input from '../CompoViews/Input'
import { UseAxios, sendToast, InputVal, UseAxiosReal } from '../functions/Functions';
import ReconnectingWebSocket from 'reconnecting-websocket';
import ReactDOM from 'react-dom';
import ViewOrder from './ViewOrder';
 

var checktimer = null;
function OrdersStore(props) {
const translate = props.translate;

 
    async function ViewOrderDialog(text) {

        ReactDOM.render(<>
    
            <ViewOrder translate={props.translate} order={text}   />
    
        </>, document.getElementById('mdl-dialog2'));
        document.getElementById("lrdialog").style.display = "block";
    
    }
    
    const [onlinestatus, setOnline] = useState(false);
    const [loadercat, setLoadercat] = useState(true);
    const [today, setToday] = useState({
        count: 0,
        total: 0,
        canceled: 0,
    });
    const [month, setmonth] = useState({
        count: 0,
        total: 0,
        canceled: 0,
    });
    const [orders, setOrders] = useState([
        { 
            products: [],
        }
    ]);

 
 
 
    const loadOrders = async () => {
        let myobj = {
            store_id: props.edit
        }
        let la = await UseAxios(myobj,'stores/load_orders')
        if (la.status === 'ok') {
            setToday(la.totals.today)
            setmonth(la.totals.month)
            setOrders(la.orders)
            setLoadercat(false)
        
         
        
        }

    }
   

    useEffect(() => {
       
 
       window.LiveOrders = () => loadOrders();
      loadOrders()
        checkConnState() 
       // return () => ws.close();
    }, []);
    useEffect(() => {
         
 
        window.componentHandler.upgradeAllRegistered();
    });
function checkConnState() {
    if (window.webConnect.readyState === 1) {
        setOnline(true);
     } else {
        setOnline(false);
     }
     checktimer =    setTimeout(() => {
        checkConnState() 
     }, 8000);
}
const loadDates = async () => {


if (InputVal('date_from') === '' || InputVal('date_to') === '') {
    sendToast(translate('Error: No dates selected'))
} else {
    setLoadercat(true)
    let myobj = {
        store_id: props.edit,
        date_from: InputVal('date_from'),
        date_to: InputVal('date_to'),

    }

    let la = await UseAxios(myobj,'stores/load_orders')
    setOrders(la.orders)
    setLoadercat(false)
}

}

    return (
        <>

            <div className="mdl-tabs mdl-js-tabs mdl-js-ripple-effect">
                <div className="mdl-tabs__tab-bar">
                    <a href="#orders" className="mdl-tabs__tab is-active">{translate('Orders')}</a>
                    <a href="#stats" className="mdl-tabs__tab">{translate('Stats')}</a>
       

                </div>

                <div className="mdl-tabs__panel is-active" id="orders">
                    <div style={{width: '100%'}} style={{ padding: '3px', margin: '3px', minWidth: '340px' }} className="   mdl-shadow--2dp">



                        <div   className="mdl-layout__header-row mdl-card__supporting-text">
                            <h4>{translate('Connection:')}
{onlinestatus ? (
<>
<i style={{color: 'green'}} className="material-icons">power</i> Online

</>
) : (<>
    <i style={{color: 'red'}} className="material-icons">power_off</i> Offline
    
    </>)} {translate('Order history')}

                            </h4>

                        </div>
                        {translate('From date:')} <input type="date" id="date_from"/>  {translate('To date:')} <input type="date" id="date_to"/>  <input type="button" onClick={(e) => loadDates()} value="Load"/>

                        <div style={{ width: '100%', height: '250px', overflow: 'scroll' }}>
                      
                    {loadercat ? ('Loading..') : (

                        <table className=" dateTimeTable ">
                            <tbody>
                                <tr>
                                    <td><b>{translate('Client')}</b></td>
                                    <td><b>{translate('Address')}</b></td>
                                    <td><b>{translate('Date')}</b></td>
                                    <td><b>{translate('Total')}</b></td>
                                </tr>

                                {orders.map(item => (

                                    <tr onClick={(e) => ViewOrderDialog(item)} id={item._id.oid} key={item._id.oid}>
                                        <td  style={item.confirmed  !== 1 ? {color: 'red'} :  {color: 'blue'}}>
                                        
                                            
                                            {item.name} - {item.phone}</td>

                                        <td  >

                                        {item.address.street_name} {item.address.street_number} {item.address.city} 

                                        </td>
                                        <td  >

                                        {item.date} 


                                        </td>
                                        <td  >

                                {item.total} €


                                    </td>
                                    </tr>



                                ))}
                            </tbody>
                        </table>


                    )}
                </div>





</div>
                </div>
                <div className="mdl-tabs__panel " id="stats">


    <div style={{width: '100%'}} style={{ padding: '3px', margin: '3px', minWidth: '340px' }} className="   mdl-shadow--2dp">

<div   className="mdl-layout__header-row mdl-card__supporting-text">
    <h4>{translate('Today shift')}</h4>
    </div>
    <div className="mdl-grid">
    <div className="mdl-cell mdl-cell--2-col">
    <div>
     <h4 style={{ color: '#919191' }}>{translate('Total:')}</h4>
     <div>{today.total}€</div>
    </div> </div>
    <div className="mdl-cell mdl-cell--2-col"> 
    <div>
     <h4 style={{ color: '#919191' }}>{translate('Total orders:')}</h4>
     <div>{today.count}</div>
    </div>
    </div>
    <div className="mdl-cell mdl-cell--2-col"> 
    <div>
     <h4 style={{ color: '#919191' }}>{translate('Canceled:')}</h4>
     <div>{today.canceled}</div>
    </div></div>

     
    </div>
    </div>

    <div style={{width: '100%'}} style={{ padding: '3px', margin: '3px', minWidth: '340px' }} className="   mdl-shadow--2dp">

<div   className="mdl-layout__header-row mdl-card__supporting-text">
    <h4>{translate('This month')}</h4>
    </div>
    <div className="mdl-grid">
    <div className="mdl-cell mdl-cell--2-col">
    <div>
     <h4 style={{ color: '#919191' }}>{translate('Total:')}</h4>
                            <div   >{month.total}€</div>
    </div> </div>
    <div className="mdl-cell mdl-cell--2-col"> 
    <div>
     <h4 style={{ color: '#919191' }}>{translate('Total orders:')}</h4>
                            <div    >{month.count}</div>
    </div>
    </div>
    <div className="mdl-cell mdl-cell--2-col"> 
    <div>
     <h4 style={{ color: '#919191' }}>{translate('Canceled:')}</h4>
                            <div  >{month.canceled}</div>
    </div></div>

     
    </div>
    </div>







                    </div>
   

            </div>

        </>
    )
}

export default OrdersStore;