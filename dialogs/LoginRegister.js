import React from 'react';
import ReactDOM from 'react-dom';

import Input from '../CompoViews/Input';

import smallloader from '../images/smallloader.gif';

import ForgotPassword from '../users/ForgotPassword';

import { sendToast, validateEmail, InputVal, UseAxios } from '../functions/Functions';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import GoogleLogin from 'react-google-login';
import { FacebookLoginButton, GoogleLoginButton, createButton, createSvgIcon } from "react-social-login-buttons";
import {ReactComponent  as appleicon} from '../images/apple-seeklogo.com.svg';
import appleicon2 from '../images/apple-seeklogo.com.svg';


const config = {
  text: "Sign in with Apple",
  icon:  createSvgIcon(appleicon),
  iconFormat: name => `fa fa-${name}`,
  style: { background: "#000000",   },
  activeStyle: { background: "#2b2b2b" }
};
 

const LoginWithApple = createButton(config);

class LoginRegister extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      isinvalid: {
        email: false,
        password: 'axa',
        remail: false,
        rpassword: false
      },
    }
  }
  translate = this.props.translate;
  closeDialog = () => {
    document.getElementById("lrdialog").style.display = "none";
    ReactDOM.unmountComponentAtNode(document.getElementById('mdl-dialog2'));
  }
  responseFacebook = async (response) => {

    let myObj = {
      social: 'facebook',
      token: response.signedRequest,
      accessToken: response.accessToken,

    }
    let la = await UseAxios(myObj, 'users/socialmedia_login');
    if (la.status === 'ok') {

      //einai logged in, pare tin AuthToken response.data.AuthToken sto redux store.
    

      let user = {
        AuthToken: la.AuthToken,
        role: la.role,
        email: la.email,
        name: la.name,
        last_name: la.last_name,
        position: la.position,
        lang: la.lang,
      }
      let oldlang = JSON.parse(localStorage.getItem('user')).lang;
    

      localStorage.setItem('user', JSON.stringify(user));
      window.user = user;
      window.navreload();

      sendToast(this.translate('Welcome ') + la.name);
      this.closeDialog();

      if (oldlang !== la.lang) document.location.reload();
    } else {
      sendToast('Facebook login error');
    }

  }

  responseGoogle = async (response) => {
    // console.log(response)
    if (typeof response.accessToken === 'undefined' || typeof response.tokenId === 'undefined') return
    let myObj = {
      social: 'google',
      token: response.tokenId,
      accessToken: response.accessToken
    }


    let la = await UseAxios(myObj, 'users/socialmedia_login');
    if (la.status === 'ok') {

      //einai logged in, pare tin AuthToken response.data.AuthToken sto redux store.

      let user = {
        AuthToken: la.AuthToken,
        role: la.role,
        email: la.email,
        name: la.name,
        last_name: la.last_name,
        position: la.position,
        lang: la.lang,
      }
      let oldlang = JSON.parse(localStorage.getItem('user')).lang;
      localStorage.setItem('user', JSON.stringify(user));
      window.user = user;
      window.navreload();

      sendToast(this.translate('Welcome ') + la.name);
      this.closeDialog();

      if (oldlang !== la.lang) document.location.reload();
    } else {
      sendToast(this.translate('Google login error'));
    }


  }

  submitclickREGISTER = async (e) => {
    e.preventDefault();
    let myobj = { ...this.state.isinvalid };

    this.setState({ isinvalid: myobj });

    (!validateEmail(InputVal("remail"))) ? myobj.remail = 'E-Mail Address is not correct' : myobj.remail = false;

    (InputVal("rpassword").length < 6) ? myobj.rpassword = 'Password too short' : myobj.rpassword = false;



    this.setState({ isinvalid: myobj });
    if (myobj.remail === false && myobj.rpassword === false) {
      //ajax calls here.

      let postObj = {
        email: InputVal('remail'),
        password: InputVal('rpassword'),

      }
      this.setState({ loader: true });

     

     let   la = await UseAxios(postObj, 'users/user_register');
     

      switch (la.error) {
        case 'email-exists':
          myobj.remail = 'E-Mail already registered';

          break;
        case 'email-error':
          myobj.remail = 'E-Mail Address is not correct';

        case 'short-password':
          myobj.rpasword = 'Password too short';

          break;
        default:
        //
      }
      this.setState({ loader: false, isinvalid: myobj });
      if (la.status === 'ok') {

        //einai logged in, pare tin AuthToken response.data.AuthToken sto redux store.
        let pos = null;
        if (typeof JSON.parse(window.localStorage.getItem('user')).position
          !== 'undefined') {
          pos = JSON.parse(window.localStorage.getItem('user')).position
        }

        let user = {
          AuthToken: la.AuthToken,
          role: la.role,
          email: InputVal('email'),
          position: pos,
          lang: JSON.parse(localStorage.getItem('user')).lang,

        }

        localStorage.setItem('user', JSON.stringify(user));
        window.user = user;
        window.navreload();


        sendToast(this.translate('You are now registered, please check your E-Mail'));
        this.closeDialog();
      }




    }







  }

  submitclickLOGIN = async (e) => {
    e.preventDefault();
    let myobj = { ...this.state.isinvalid };


    //me mia grammi func.
    (!validateEmail(InputVal("email"))) ? myobj.email = true : myobj.email = false;
    (InputVal("password").length < 6) ? myobj.password = true : myobj.password = false;
    this.setState({ isinvalid: myobj });
    if (myobj.email === false && myobj.password === false) {
      this.setState({ loader: true });
      //ajax calls here.
      //an na thimate
      let remember = false;
      if (document.getElementById('remember').checked) {
        remember = true;
        //me to remember to ssl hash na min exe hm.likseos

      }


      let postObj = {
        email: InputVal('email'),
        password: InputVal('password'),
        remember: remember,

      }

      let la = await UseAxios(postObj, 'users/user_signin')
     

      if (la.error === 'not-found') {
        myobj.email = this.translate('User not found');
      }
      if (la.error === 'wrong-password') {

        myobj.password = this.translate('Wrong password');

      }
      this.setState({ loader: false, isinvalid: myobj });


      if (la.status === 'ok') {
        //einai logged in, pare tin AuthToken response.AuthToken sto redux store.
        let user = {
          AuthToken: la.AuthToken,
          role: la.role,
          email: InputVal('email'),
          name: la.name,
          last_name: la.last_name,
          position: la.position,
          lang: la.lang,
        }
        let oldlang =  JSON.parse(localStorage.getItem('user')).lang;

        localStorage.setItem('user', JSON.stringify(user));
        window.user = user;
        window.navreload();



        sendToast(this.translate('Welcome'));
        this.closeDialog();

        if (oldlang !== la.lang) document.location.reload();

      }



    }

  }
  forgotpassword = (e) => {
    e.preventDefault();
    ReactDOM.render(

      <ForgotPassword translate={this.translate} />
      , document.getElementById('mdl-dialog2'));


  }


  componentDidMount() {
    window.dialog_c.push(this.closeDialog)
    document.getElementById("lrdialog").style.display = "block";
    if (!(typeof (window.componentHandler) == 'undefined')) {
      window.componentHandler.upgradeElements(document.getElementsByClassName("mdl-tabs"));

      //  componentHandler.upgradeAllRegistered();
    }
  }

  render() {


    return (
      <>





        <div id="innerdialog" style={{ maxWidth: '478px', padding: '3px', overflow: 'hidden' }} className="mdl-tabs mdl-js-tabs ">

          <div className="mdl-tabs__tab-bar">
            <a href="#tab1" className="mdl-tabs__tab"> {this.translate('Sign in')} </a>
            <a href="#tab2" className="mdl-tabs__tab tabregister">{this.translate('Register')}</a>

          </div>

          <div style={{ padding: '3px' }} className="mdl-tabs__panel is-active" id="tab1">

            <div className="controlforms">

              <form action="#" id="loginForm">

                <Input style={{ width: '100%' }} text={this.translate('Your E-Mail')} id="email" icon="account_circle" isinvalid={this.state.isinvalid.email} type="text" />

                <Input style={{ width: '100%' }} text={this.translate('Your password')} id="password" icon="lock_open" isinvalid={this.state.isinvalid.password} type="password" />

                <Input text={this.translate('Remember me')} id="remember" defaultValue={true} type="toggle" />






                <div className="center-align">
                  <button disabled={this.state.loader} onClick={this.submitclickLOGIN} className="mdl-button mdl-js-ripple-effect mdl-js-button  mdl-button--raised mdl-button--colored">
                    {!this.state.loader && <>{this.translate('SIGN IN')}</>}
                    {this.state.loader && <img className="center-align" style={{ padding: '0', alignself: 'center', width: '30px', height: '30px', display: this.state.loader ? 'inline-block' : 'none' }} src={smallloader} alt={"loading..."} />}

                  </button>




                </div>
              </form>
              <span style={{ paddingleft: '20px', margin: '6px', alignself: 'left' }}><a onClick={this.forgotpassword} href="#">{this.translate('Forgot password')}</a></span>
            </div>
          </div>
          <div style={{ padding: '3px' }} className="mdl-tabs__panel" id="tab2">
            <div className="controlforms">
              <form action="post" id="registerForm">

                <Input style={{ width: '100%' }} text={this.translate('Your E-Mail')} id="remail" icon="account_circle" isinvalid={this.state.isinvalid.remail} type="text" />

                <Input style={{ width: '100%' }} text={this.translate('Your password')} id="rpassword" icon="lock_open" isinvalid={this.state.isinvalid.rpassword} type="passwordWithEye" />

                <span style={{ paddingleft: '20px', alignself: 'center' }}> {this.translate('Password must be 6 chars at least')}
                </span>

                <br /><br />
                {this.translate('I have read and agree with ')} <a onClick={(e) => { e.preventDefault(); window.fireOne('privacy', true) }} href="/privacy">{this.translate('Privacy')}</a> - <a onClick={(e) => { e.preventDefault(); window.fireOne('tos', true) }} href="/tos">{this.translate('Tos')} </a>
                <br /><br />


                <div className="center-align">



                  <button disabled={this.state.loader} onClick={this.submitclickREGISTER} className="mdl-button mdl-js-ripple-effect mdl-js-button  mdl-button--raised mdl-button--colored">
                    {!this.state.loader && <>{this.translate('REGISTER')}</>}
                    {this.state.loader && <img className="center-align" style={{ padding: '0', alignself: 'center', width: '30px', height: '30px', display: this.state.loader ? 'inline-block' : 'none' }} src={smallloader} alt={"loading..."} />}
                  </button>

                </div>

              </form>

            </div> </div>
    
        

          <GoogleLogin
            clientId="196128031630-73l984lmgokfupu3nta76hudcj5k4nm1.apps.googleusercontent.com"
            render={renderProps => (
              <GoogleLoginButton onClick={renderProps.onClick} disabled={renderProps.disabled} >
                 <span>Sign in with Google</span>
                 </GoogleLoginButton>
            )}
        
            onSuccess={this.responseGoogle}
            onFailure={this.responseGoogle}
            cookiePolicy={'single_host_origin'}
           />
               

                
        </div>
        <div className="mdl-dialog__actions">
          <button id="closedialog" type="button" onClick={e => this.closeDialog(e)} className="mdl-button close">{this.translate('Close')}</button>
        </div>
 
      </>
    );

  }
}

export default LoginRegister;

    /*       <FacebookLogin
            appId="435516873796442"
            redirectUri="https://www.eatin.gr/" 

            fields="name,email,picture"
            callback={this.responseFacebook}
            render={renderProps => (
              <FacebookLoginButton onClick={renderProps.onClick} disabled={renderProps.disabled}  >
                <span>Sign in with Facebook</span>
                </FacebookLoginButton>
            )}
            />*/ 