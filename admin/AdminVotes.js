
import React, { useState, useEffect } from 'react';



import { UseAxios, sendToast, InputVal } from '../functions/Functions';
import Input from '../CompoViews/Input';

function AdminVotes(props) {
    const [u, setUsers] = useState({ users: [] });
    const [isLoading, setIsLoading] = useState(false);
    const [topage, setpage] = useState(0);
    const [havebutton, sethavebutton] = useState(false);

    const DialwithState = (data) => {





        let test = [...data.users];

        if (test.length == 0) {
            sethavebutton(false);
        } else {
            sethavebutton(true);
        }

        if (u.users.length > 0) {
            test = [...u.users, ...data.users];
        }
        setUsers({ users: test }) //another array;



    }
    const fetchData = async () => {
        let page = topage + 1;
        sethavebutton(false);
        setpage(page);

        if (page == 1) setIsLoading(true);
        let res = await UseAxios({ page: page }, 'admin/list_votes');


        if (res.status !== 'ok') {
            sendToast('Error');
        }


        sethavebutton(true);

        DialwithState(res) //another array;

        // setUsers(response.data);


        if (page == 1) setIsLoading(false);






    };
    useEffect(() => {
        window.componentHandler.upgradeAllRegistered();
        //        document.getElementById('preload').style.display = 'none';

    });
    useEffect(() => {

        if (window.pushState) window.history.pushState({}, null, 'admin_users');
        //document.getElementById('preload').display = 'none';

        fetchData();
    }, []);

    const handleRoles = async (e) => {
        //e.target.value 
        let myObj = {
            id: e.target.id,
        }

        let res = await UseAxios(myObj, 'admin/aprove_vote');
        if (res.status === 'ok') sendToast('Vote Approved');
    }
    const searchMail = async (e) => {
        setIsLoading(true);

        let res = await UseAxios({ email: InputVal('email'), page: 1 }, 'admin/list_users');


        if (res.status !== 'ok') {
            sendToast('Error');
        }


        setIsLoading(false);
        DialwithState(res) //another array;

    }
    return (
        <div className="main-content  mdl-shadow--2dp">
            {isLoading ? (
                <div>Loading ...</div>
            ) : (
                    <>


                        <div style={{ width: '100%' }} className="mdl-grid  ">



                            <div style={{ minWidth: '100px' }} className="mdl-cell   mdl-cell--5-col"><h5>Comment</h5></div>
                            <div style={{ minWidth: '100px' }} className="mdl-cell mdl-cell--4-col"><h5>Order ID</h5></div>
                            <div style={{ minWidth: '100px' }} className="mdl-cell  mdl-cell--4-col"><h5>Votes</h5></div>


                        </div>



                        {u.users.map(item => (

                            <div key={item._id.$oid} style={{ width: '100%' }} className="mdl-grid">

                                <div style={{ minWidth: '100px' }} className="mdl-cell  mdl-cell--5-col">
                                    <a id={item._id.$oid + 'add'}>{item.comment}</a>



                                </div>
                                <div key={item._id.$oid + 'a'} style={{ minWidth: '100px' }} className="mdl-cell  mdl-cell--4-col">




                                    {item.order_id}
                                </div>
                                <div key={item._id.$oid + 'b'} style={{ minWidth: '100px' }} className="mdl-cell  mdl-cell--4-col">
                                    <br />  Service: {item.service} Speed: {item.speed} Quality: {item.quality}
                                    <br />  <input type='button' className="  getmdl-select  " value="Aprove" id={item._id.$oid} onClick={handleRoles} />





                                </div>
                            </div>
                        )

                        )
                        }


                        <div style={{ textAlign: 'center' }} className="mdl-grid">
                            <div className="mdl-cell mdl-cell--1-col-phone  mdl-cell--2-col">
                                {havebutton ? (<button style={{ alignSelf: 'center' }} className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" onClick={() => fetchData()}>Load more</button>) : ('')}
                            </div>  </div>
                    </>)}



        </div>);

}



export default AdminVotes;