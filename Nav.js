
import React, { useState, useEffect } from 'react';
import ManageStores from './stores/ManageStores';

function Nav(props) {

  const translate = props.translate

  const [user, setUserrole] = useState(0);
  function handleUserAdmin(e, v) {
    if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
    e.preventDefault();
    if (typeof props.loadPage === 'function') {
      props.loadPage(v);
    }
  }
  //ti deixnw poy. access roles, 1 registered, 2 store owner, 3 admin
  window.navreload = function () {
    if (typeof window.isonorders === 'function') window.isonorders();
    if (typeof window.getTokens === 'function') window.getTokens();
    setUserrole(window.user.role);
    if (window.user.role > 0) {
      document.getElementById('loginbtn').style = 'display: none';
    } else {
      document.getElementById('loginbtn').style = '';

    }
    if (typeof props.loadPage === 'function') {
      // props.loadPage('home_auto');

    }
  }



  useEffect(() => {
    window.navreload();




  }, []);

  return (
    <>

      <a className="mdl-navigation__link" onClick={(e) => handleUserAdmin(e, 'home')} href="#home" >  {translate('Home')} </a>
      {user === 0 && <a onClick={(e) => handleUserAdmin(e, 'login')} className="mdl-navigation__link" href=""> {translate('Sign in/Up')} </a>}

      {user >= 3 ? <a onClick={(e) => handleUserAdmin(e, 'admin')} className="mdl-navigation__link" href=""> {translate('Administration')} </a> : ''}

      {user >= 1 ? <a onClick={(e) => handleUserAdmin(e, 'usersettings')} className="mdl-navigation__link" href="">  {translate('Settings')} </a> : ''}

      {user >= 1 ? <a onClick={(e) => handleUserAdmin(e, 'orders')} className="mdl-navigation__link" href="">  {translate('My Orders')} </a> : ''}

      {user >= 1 ? <a onClick={(e) => handleUserAdmin(e, 'logout')} className="mdl-navigation__link" href="">  {translate('Sing out')} </a> : ''}

      {user >= 2 ? <span style={{ marginLeft: '40px', marginBottom: '20px', marginTop: '20px' }} className="mdl-layout-title">{translate('Store menu')}</span> : ''}


      {user >= 2 ? <ManageStores translate={translate} /> : ''}


      <a className="mdl-navigation__link" onClick={(e) => handleUserAdmin(e, 'tos')} href="tos" >  {translate('Terms of service')} </a>
      <a className="mdl-navigation__link" onClick={(e) => handleUserAdmin(e, 'privacy')} href="privacy-policy" >  {translate('Privacy policy')} </a>



    </>


  );
}

export default Nav;
