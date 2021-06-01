
import React, { useState, useEffect } from 'react';



import { UseAxios, sendToast, InputVal } from '../functions/Functions';
import Input from '../CompoViews/Input';

function AdminUsers(props) {
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
        let res = await UseAxios({ page: page }, 'admin/list_users');


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
            role: e.target.value
        }

        let res = await UseAxios(myObj, 'admin/change_user_role');
        if (res.status === 'ok') sendToast('Changed user role');
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

                        <Input id="email" style={{ width: '150px' }} text={'E-Mail'} icon="hide" type="text" />
                        <button style={{ alignSelf: 'center' }} className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" onClick={() => searchMail()}>Search</button>
                        <hr></hr>
                        <div style={{ width: '100%' }} className="mdl-grid  ">



                            <div style={{ minWidth: '100px' }} className="mdl-cell  mdl-cell--1-col-phone mdl-cell--2-col"><h5>Addresses</h5></div>
                            <div style={{ minWidth: '100px' }} className="mdl-cell mdl-cell--1-col-phone mdl-cell--2-col"><h5>E-mail</h5></div>
                            <div style={{ minWidth: '100px' }} className="mdl-cell mdl-cell--1-col-phone mdl-cell--2-col"><h5>Role</h5></div>


                        </div>



                        {u.users.map(item => (

                            <div key={item._id.$oid} style={{ width: '100%' }} className="mdl-grid">

                                <div style={{ minWidth: '100px' }} className="mdl-cell mdl-cell--1-col-phone mdl-cell--2-col">
                                    <a id={item._id.$oid + 'add'}> Addresses.</a>
                                    <span className="mdl-tooltip" data-mdl-for={item._id.$oid + 'add'}>
                                        Last Online: {item.lastonline}
                                        <br /> Reg. Date: {item.regdate}
                                        <br /> IP: {item.ip}

                                    </span>


                                </div>
                                <div key={item._id.$oid + 'a'} style={{ minWidth: '100px' }} className="mdl-cell mdl-cell--1-col-phone mdl-cell--2-col">




                                    {item.email}
                                </div>
                                <div key={item._id.$oid + 'b'} style={{ minWidth: '100px' }} className="mdl-cell mdl-cell--1-col-phone mdl-cell--1-col">

                                    <select className="  getmdl-select  " id={item._id.$oid} defaultValue={item.role} onChange={handleRoles}>
                                        <option value="1">Registered</option>
                                        <option value="2">Store owner</option>
                                        <option value="3">Site admin</option>
                                        <option value="69">Delete</option>
                                    </select>



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



export default AdminUsers;