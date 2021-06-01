import React, { useState, useEffect } from 'react';
import AdminUsers from './AdminUsers';
import AdminCategories from './AdminCategories';
import AdminVotes from './AdminVotes';
import Reports from './Reports';
import ReactDOM from 'react-dom';


//render nav
function PageLoader(s) {

    ReactDOM.unmountComponentAtNode(document.getElementById('adminContent'));
    //document.getElementById('preload').style.display = 'block';
    ReactDOM.render(

        s

        , document.getElementById('adminContent'));

}

function AdminMain(props) {



    useEffect(() => {
        window.componentHandler.upgradeAllRegistered();
        //        document.getElementById('preload').style.display = 'none';
    });
    const loadcomp = (e, a) => {
        e.preventDefault();

        if (a === 'users') {
            PageLoader(<AdminUsers />);
        }

        if (a === 'categories') {
            PageLoader(<AdminCategories />);
        }

        if (a === 'votes') {
            PageLoader(<AdminVotes />);
        }
        if (a === 'reports') {
            PageLoader(<Reports />);
        }



    }
    return (
        <div style={{ width: '100%', height: '100%', padding: '0px' }} className="mdl-grid">
            <div style={{ width: '226px', height: '100%', margin: '0px' }} className="mdl-cell mdl-cell--4-col">
                <div style={{ width: '226px', height: '100%', margin: '0px' }} className="mdl-color--blue-grey-800 admin-navigation">
                    <div className="mdl-admin-label">Admin</div>

                    <div> <a className="mdl-navigation__link" onClick={(e) => loadcomp(e, 'users')} href="">Users</a></div>
                    <div><a className="mdl-navigation__link" onClick={(e) => loadcomp(e, 'categories')} href="">Categories</a></div>
                    <div><a className="mdl-navigation__link" onClick={(e) => loadcomp(e, 'votes')} href="">Review votes</a></div>
                    <div><a className="mdl-navigation__link" onClick={(e) => loadcomp(e, 'reports')} href="">Sale reports</a></div>
                </div>
            </div >
            <div id="adminContent" className="mdl-cell mdl-cell--9-col">

            </div>
        </div>

    )
}


export default AdminMain;