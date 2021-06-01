import React, { useState, useEffect } from 'react'
import { UseAxios, sendToast, InputVal } from '../functions/Functions';
import Loading from '../Loading'
import '../css/admin.css'
var paypalCount = 0;
var cashfee = 0;
var paypalfee = 0;
var creditfee = 0;
var totalize = 0;
var finalize = 0;
function Reports(props) {
    const [orders, setOrders] = useState([])
    const [storeorders, setstoreOrders] = useState([])
    const [totals, setTotals] = useState({
        cash: 0,
        paypal: 0,
        credit: 0,

    })

    const [topage, setpage] = useState(0);
    const [dateinfo, setdateinfo] = useState({

        from_day: {
            date: '',
            timezone: '',
        },
        to_day: {
            date: '',
            timezone: '',
        }


    });
    const [loading, setloading] = useState(false);
    const [havebutton, sethavebutton] = useState(false);

    useEffect(() => {

        loadOrders()


    }, [])

    const loadOrders = async () => {
        setloading(true);
        let pap = topage + 1;
        setpage(topage + 1)


        let la = await UseAxios({ page: pap }, 'admin/reports')
        if (la.orders.length === 0) sethavebutton(false)
        if (la.orders.length > 4) sethavebutton(true)

        setOrders([...orders, ...la.orders]);
        setloading(false);
        setdateinfo(la.date)
        //console.log(la.date)

    }
    const loadOrders_date = async () => {
        setloading(true);
        let pap = topage + 1;
        setpage(topage + 1)


        let la = await UseAxios({ date_from: InputVal('date_from'), date_to: InputVal('date_to') }, 'admin/reports')
        setdateinfo(la.date)
        setOrders(la.orders);
        setloading(false);
    }


    const getReport = async (rid) => {
        let la = await UseAxios({ store_id: rid, date_from: InputVal('date_from'), date_to: InputVal('date_to') }, 'admin/store_report')

        setstoreOrders([...la.orders.cash, ...la.orders.paypal, ...la.orders.credit_card]);
        document.getElementById('diagdmin').style.display = 'block';
        paypalCount = la.orders.paypal.length;

        let obj = {
            cash: la.orders.cash_total,
            paypal: la.orders.paypal_total,
            credit: la.orders.credit_total,
        }
        cashfee = parseFloat(6 / 100 * parseFloat(la.orders.cash_total)).toFixed(2)
        paypalfee = parseFloat(8.9 / 100 * la.orders.paypal_total + (0.35 * paypalCount)).toFixed(2);

        creditfee = parseFloat(6 / 100 * parseFloat(la.orders.credit_total)).toFixed(2)

        totalize = parseFloat(parseFloat(creditfee) + parseFloat(paypalfee) + parseFloat(cashfee)).toFixed(2)

        finalize = parseFloat(24 / 100 * totalize).toFixed(2)
        setTotals(obj);


    }
    const CloseDiag = () => {
        document.getElementById('diagdmin').style.display = 'none';
    }
    return (
        <>
            <div style={{ width: '100%' }} style={{ padding: '3px', margin: '3px', minWidth: '340px' }} className="   mdl-shadow--2dp">



                <div className="mdl-layout__header-row mdl-card__supporting-text">
                    <h4>Reports

    </h4>

                </div>
                From date: <input type="date" id="date_from" />  To date: <input type="date" id="date_to" />  <input onClick={loadOrders_date} disabled={loading} type="button" value="Load" />
                <hr />
                Date: {dateinfo.from_day.date} to:  {dateinfo.to_day.date} {dateinfo.to_day.timezone}
                <div style={{ width: '100%', maxHeight: '100vh', overflow: 'scroll' }}>

                    {loading ? <Loading /> : (
                        <>

                            <table className=" dateTimeTable ">
                                <tbody>
                                    <tr>
                                        <td><b>Store</b></td>
                                        <td><b>Cash</b></td>
                                        <td><b>Credit</b></td>
                                        <td><b>Paypal</b></td>
                                        <td><b>Canceled</b></td>
                                    </tr>

                                    {orders.map(item => (

                                        <tr onClick={(e) => getReport(item.id)} id={item.id} key={item.id}>
                                            <td >


                                                {item.url} </td>

                                            <td  >

                                                {item.cash}

                                            </td>
                                            <td  >

                                                {item.credit_card}


                                            </td>
                                            <td  >

                                                {item.paypal}


                                            </td>
                                            <td  >

                                                {item.canceled}


                                            </td>
                                        </tr>



                                    ))}
                                </tbody>
                            </table>

                            {havebutton ? (<button style={{ alignSelf: 'center' }} className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" onClick={() => loadOrders()}>Load more</button>) : ('')}
                        </>

                    )}

                </div>





            </div>

            <div id="diagdmin" className="dialog_admin">

                <div className="dialog_admin_content">


                    <>

                        <table className=" dateTimeTable ">
                            <tbody>
                                <tr>
                                    <td><b>Order ID</b></td>
                                    <td><b>Date</b></td>
                                    <td><b>Client</b></td>
                                    <td><b>Method</b></td>
                                    <td><b>Total</b></td>
                                </tr>

                                {storeorders.map(item => (

                                    <tr  >
                                        <td >


                                            {item.id} </td>

                                        <td  >

                                            {item.date}

                                        </td>
                                        <td  >

                                            {item.client} -  {item.phone}


                                        </td>
                                        <td  >

                                            {item.method}


                                        </td>
                                        <td  >

                                            {item.total}


                                        </td>
                                    </tr>



                                ))}
                            </tbody>
                        </table>
                        <br />
                        <hr />
                        <br />
                        <table className=" dateTimeTable ">
                            <tbody>
                                <tr>
                                    <td><b>Method</b></td>
                                    <td><b>Total</b></td>
                                    <td><b>Fee Rate</b></td>
                                    <td><b>Fee</b></td>

                                </tr>


                                <tr>
                                    <td>Cash</td>
                                    <td>{parseFloat(totals.cash).toFixed(2)} </td>
                                    <td>6%</td>
                                    <td>{cashfee}</td>

                                </tr>

                                <tr>
                                    <td>Paypal</td>
                                    <td>{parseFloat(totals.paypal).toFixed(2)}</td>
                                    <td>2.9% + 6% + <br />(0.35 x Order) </td>
                                    <td>{paypalfee} </td>


                                </tr>

                                <tr>
                                    <td>Credit card</td>
                                    <td>{parseFloat(totals.credit).toFixed(2)}</td>
                                    <td>6%</td>
                                    <td>{creditfee}</td>
                                </tr>


                            </tbody>
                        </table>






                        <hr />
                        <br />
                        <table className=" dateTimeTable ">
                            <tbody>
                                <tr>
                                    <td><b>Total fees</b></td>
                                    <td><b>Tax</b></td>
                                    <td><b>Final</b></td>
                                </tr>

                                <tr>
                                    <td>{totalize}</td>
                                    <td>24% {finalize}</td>
                                    <td>{parseFloat(parseFloat(totalize) + parseFloat(finalize)).toFixed(2)}</td>
                                </tr>

                            </tbody>
                        </table>























                    </>



                    <button style={{ alignSelf: 'center' }} className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" onClick={() => CloseDiag()}>Close</button>
                </div>
            </div>
        </>
    )
}

export default Reports;