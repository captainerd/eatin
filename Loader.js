import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';

import Nav from './Nav';
import Loading from './Loading';
import Home from './Home';
import HomeVisitor from './HomeVisitor';
import CookieBanner from './dialogs/CookieBanner';
import { UseAxios } from './functions/Functions';
import DialogConfirm from './dialogs/DialogConfirm';


const LoginRegister = lazy(() => import('./dialogs/LoginRegister'));
const AdminMain = lazy(() => import('./admin/AdminMain.js'));
const UserSettings = lazy(() => import('./users/UserSettings.js'));
const Store = lazy(() => import('./Store.js'));
const Orders = lazy(() => import('./users/Orders.js'));

const DisplayText = lazy(() => import('./dialogs/DisplayText'));
const SuggestStore = lazy(() => import('./dialogs/SuggestStore'));

async function ConfirmDialog(text, callback, callbackno) {

  ReactDOM.render(<>

      <DialogConfirm translate={window.translate} text={text} onYes={(e) => callback() } onClose={(e) => callbackno() }/>

  </>, document.getElementById('mdl-dialog'));
  document.getElementById("lrdialog2").style.display = "block";

}


//render nav
function PageLoader(s) {

  ReactDOM.unmountComponentAtNode(document.getElementById('page-content'));

  ReactDOM.render(<Suspense fallback={<Loading />}>

    {s}

  </Suspense>, document.getElementById('page-content'));

}
class Loader extends React.Component {



  FiredOne = (v, not = false, extra = null) => {

    if (v === "cityhome") {

      PageLoader(<Home translate={window.translate} list={extra} />);
    }
    if (v === 'home' || v === 'home_auto') {

   



      if (window.user.role > 0 && JSON.parse(window.localStorage.getItem('user')).position !== null) {
        if (typeof window.store_url !== 'string') {
            PageLoader(<Home translate={window.translate} />);
        } else {

          PageLoader(<Store translate={window.translate} store={atob(window.store_url)} />);
        }
      } else {

     


        document.title = window.sitename + ' Online food delivery'
        if (typeof window.store_url !== 'string') {
        PageLoader(<HomeVisitor translate={window.translate} />);

        } else {
          PageLoader(<Store translate={window.translate} store={atob(window.store_url)} />);
        }

      }

      window.history.pushState({}, null, '/');
    }
    if (v === 'nopos') {
      if (typeof window.store_url !== 'string') {
      PageLoader(<HomeVisitor translate={window.translate} />);
      } else {
        PageLoader(<Store translate={window.translate} store={atob(window.store_url)} />);
      }
      not = true;
    }
    if (v === 'usersettings' && window.user.role > 0) {
      PageLoader(<UserSettings translate={window.translate} />);
      window.history.pushState({}, null, '/settings');
    }
    if (v === 'tos') {


      if (JSON.parse(window.localStorage.getItem('user')).lang === "en") DisplayTextf('tos.txt')
      if (JSON.parse(window.localStorage.getItem('user')).lang === "gr") DisplayTextf('tos_gr.txt')


    }
    if (v === 'privacy') {

      if (JSON.parse(window.localStorage.getItem('user')).lang === "en") DisplayTextf('privacy.txt')
      if (JSON.parse(window.localStorage.getItem('user')).lang === "gr") DisplayTextf('privacy_gr.txt')


    }
    if (v === 'allergies') {

      if (JSON.parse(window.localStorage.getItem('user')).lang === "en") DisplayTextf('allergies.txt', extra)
      if (JSON.parse(window.localStorage.getItem('user')).lang === "gr") DisplayTextf('allergies_gr.txt', extra)


    }
    if (v === 'suggeststore') {
      not = true;
      SuggestStoref();
      return;
    }
    if (v === 'admin') {
      PageLoader(<AdminMain translate={window.translate} />);
    }
    if (v === 'login') {
      LoginRegisterf()
    }
    if (v === 'orders') {
      PageLoader(<Orders translate={window.translate} />);
      window.history.pushState({}, null, '/orders');
    }
    if (v === 'logout') {
      if (typeof window.webConnect === 'object') window.webConnect.close()
      window.user = {
        role: 0,
        email: 'guest@' + window.sitename.toLowerCase(),
        AuthToken: 0,
        lang: 'gr',

      }
      window.localStorage.removeItem('addresses');
      ReactDOM.unmountComponentAtNode(document.getElementById('bar_menu_right'));

      window.localStorage.setItem('user', JSON.stringify(window.user));
      window.navreload();


    }
    if (v !== 'home_auto' && typeof document.getElementById('first').MaterialLayout !== 'undefined') {

      if (!not) document.getElementById('first').MaterialLayout.toggleDrawer();
    }

    if (window.localStorage.getItem('analytics') === "true") {
      window.Analytics()

    }

  }


  //xeirokinito router.
  GoToPage = () => {

 

    if (window.localStorage.getItem('analytics') === "true") {


      window.Analytics()
    }




    let la = new URL(window.location.href);



    let lo = la.pathname.split('/')

    

    
    if (lo[1] === 'delivery') {
       
      if (typeof lo[3] === 'undefined' || lo[3] === '') {

        PageLoader(<Home translate={window.translate} list={lo[2]} />);

      } else {
        PageLoader(<Store translate={window.translate} store={lo[2] + '/' + lo[3]} />);
      }
    }
    if (lo[1] === 'tos') {


      if (JSON.parse(window.localStorage.getItem('user')).lang === "en") DisplayTextf('tos.txt')
      if (JSON.parse(window.localStorage.getItem('user')).lang === "gr") DisplayTextf('tos_gr.txt')


    }
    if (lo[1] === 'privacy') {

      if (JSON.parse(window.localStorage.getItem('user')).lang === "en") DisplayTextf('privacy.txt')
      if (JSON.parse(window.localStorage.getItem('user')).lang === "gr") DisplayTextf('privacy_gr.txt')


    }
    if (lo[1] === 'orders') {
      this.FiredOne('orders');
    }
    if (lo[1] === 'settings') {
      this.FiredOne('usersettings');
    }
    if (lo[1] === '') {
      let myPos = JSON.parse(window.localStorage.getItem('user'));
      if (myPos === null) {

      } else {
        if (typeof myPos.position === 'undefined'

          || myPos.role === 0
          || myPos.position === null

        ) {
          document.title = window.sitename + ' Online delivery'
         
          if (typeof window.store_url !== 'string') {
            PageLoader(<HomeVisitor translate={window.translate} />);
    
            } else {
              PageLoader(<Store translate={window.translate} store={atob(window.store_url)} />);
            }
        } else {
          if (typeof window.store_url !== 'string') {
          PageLoader(<Home translate={window.translate} />);
          }else {
            PageLoader(<Store translate={window.translate} store={atob(window.store_url)} />);
          }
        }
      }
    }
  }

  componentDidMount() {
    if (window.localStorage.getItem('cbanner') !== 'true') {

      ReactDOM.render(<CookieBanner translate={window.translate} />, document.getElementById('p_notice'));


    }

    // initUser();
    window.launchError = () => {
      document.getElementById('html_loader').style.display = "block";

      ConfirmDialog(window.translate('Network Error: Connection failed, Do you wanna try again?'), function(){
        window.location.reload();

      },
      function () {
        
        window.close();
     
      }
      
      );
    
    //  alert(window.translate('Network Error: Connection failed'))
    
    
      //  window.location.reload();


    }





    //if (localStorage.getItem('app') !== null) {
     // document.getElementById('logo_srv22').innerText = localStorage.getItem('app').split('/')[1]
    //}
    document.getElementById('menu_gr_btn').addEventListener('click', (e) => {
      let user = JSON.parse(window.localStorage.getItem('user'));
      user.lang = 'gr'
      window.localStorage.setItem('user', JSON.stringify(user));
      window.location.reload();
    })
    document.getElementById('menu_en_btn').addEventListener('click', (e) => {
      let user = JSON.parse(window.localStorage.getItem('user'));
      user.lang = 'en'
      window.localStorage.setItem('user', JSON.stringify(user));
      window.location.reload();
    })


    window.fireOne = (e, a, o) => this.FiredOne(e, a, o);




    window.addEventListener('popstate', (event) => {

      if (window.dialog_c.length > 0) {

        window.dialog_c.map(item => {
          item();
        })
        window.dialog_c.length = 0;

      } else {

        this.GoToPage()
      }
    });




    // //console.log('exei token');
    handleURL();
    this.GoToPage()

  







  }

  render() {

  


    fireBase_init()
    document.getElementById('login-register').onclick = () => {


      LoginRegisterf();

    }

    //https://maps.googleapis.com/maps/api/geocode/json?address=10431,gr&key=AIzaSyDv435y1gVk_ABXHuyEbcZLLFAprlb6_CA


    return (

      <>

        {ReactDOM.createPortal(<Nav translate={window.translate} loadPage={(v) => this.FiredOne(v)} />, document.getElementById('nav1'))
        }


      </>
    );

  }
}

function LoginRegisterf() {
  ReactDOM.render(<Suspense fallback={<Loading />}>

    <LoginRegister translate={window.translate} />

  </Suspense>, document.getElementById('mdl-dialog2'));
}
function DisplayTextf(e, extra = null) {

  ReactDOM.render(<Suspense fallback={<Loading />}>

    <DisplayText translate={window.translate} text={e} extra={extra} />

  </Suspense>, document.getElementById('mdl-dialog'));
}
function SuggestStoref(e) {
  ReactDOM.render(<Suspense fallback={<Loading />}>

    <SuggestStore translate={window.translate} />

  </Suspense>, document.getElementById('mdl-dialog2'));
}
//google analytics
window.Analytics = function () {
  if (window.localStorage.getItem('analytics') === "true") {
    ReactGA.initialize('G-Y781STZ3GT');

    ReactGA.pageview(window.location.pathname + window.location.search);


  }
}

async function handleURL() {
  let la = new URL(window.location.href);

  
  if (la.searchParams.get("genpass") !== null) {

    la = await UseAxios({ email: la.searchParams.get("genpass") }, 'users/forgot_password2')

    if (la.status === 'ok') {
      alert(window.translate('A new password has been emailed'))

    }

  }
  if (la.searchParams.get("validate_email") !== null && la.searchParams.get("email") !== null) {
    if (la.searchParams.get("validate_email").length === 32) {
      //axios send

      la = await UseAxios({ email: la.searchParams.get("email"), hash: la.searchParams.get("validate_email") }, 'users/validate_email')

      if (la.status === 'ok') {
        window.fireOne('usersettings', true, null);
      }


    }


  }
}


async function fireBase_init() {
  //firebase k tokens k minimata
//console.log('ok?')

  let auth = JSON.parse(window.localStorage.getItem('user')).AuthToken;

  if (auth !== 0) {
    let obj = {}
    if (window.localStorage.getItem('firebase') !== null) {
      obj = {
        platform: 'desktop',
        token: window.localStorage.getItem('firebase')
      }
      let la = await UseAxios(obj, 'users/add_platform')

    }
  }
}
window.getTokens = () => fireBase_init();
export default Loader;
