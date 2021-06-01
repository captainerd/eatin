import React from 'react';
import AddressAsker from './AddressAsker';
import CityList from './CityList';
import './css/home.css'
import usePWA from 'react-pwa-install-prompt'
 
//
function HomeVisitor(props) {
    const { isStandalone, isInstallPromptSupported, promptInstall } = usePWA()
    const onClickInstall = async () => {
        const didInstall = await promptInstall()
        if (didInstall) {
          // User accepted PWA install
        }
      }
  
      const renderInstallButton = () => {
        if (isInstallPromptSupported )
    
          return (
            <button  className="mdl-button mdl-js-ripple-effect mdl-js-button  mdl-button--raised mdl-button--colored addappbutton" onClick={onClickInstall}>
             {translate("Install App")}
                
                </button>
          )
        return ''
      }
 
    const translate = props.translate
    const handleLang = (e) => {
        
        let user = JSON.parse(window.localStorage.getItem('user'));
        if (e === 0) {
            user.lang = 'gr'
        }
        if (e === 1) {
            user.lang = 'en'
        }
        window.localStorage.setItem('user', JSON.stringify(user));

        window.location.reload();
    }
 


    return (
        <>
  
            <div className="home_visitor_div "  >
 
                <div className="homeText1" style={{ padding: '20px' }}>
                    {(new Date()).getHours() > 6 && (new Date()).getHours() < 11 ?
                        <>
                            {props.translate('Its coffee time!')}
                        </>


                        :
                        <>
                            {props.translate('Are you hungry?')}
                        </>


                    }

                </div>
                <div className="home_exp_info">
                    {props.translate('Type your address and discover the best places to order food delivery in your area!')}
                </div>


                <div    >
                    <div className="AddressHome">
                        <AddressAsker translate={props.translate} />
                    </div>
           
<div class="homeSpacer"></div> 
</div>
     <div class="home_exp_info2"> 
                {translate("Download the apps for a better experience!")}  
                </div>
<a className="appBg" href="https://play.google.com/store/apps/details?id=gr.eatin.delivery" rel="external" target="_blank">

</a>

<a className="appBg2" href="http://appstore.com/EatIn-Delivery" rel="external" target="_blank">
 
</a>
<br/>
{renderInstallButton()} 
<div class="graph_ex">
 
 
</div>
 


            </div>
            <div className="mdl-mini-footer">

<div style={{ width: '100%' }}>
    <CityList translate={props.translate} />
</div>

<ul className="city_list">
    <li><a onClick={(e) => handleLang(1)} href="#">English</a></li>
    <li><a onClick={(e) => handleLang(0)} href="#">Ελληνικά</a></li>

</ul>
<ul className="city_list">
    <li>
        {JSON.parse(window.localStorage.getItem('user')).lang === 'gr' ?
        
        
             <a   href="intro/greek.html">{translate("Are you a store owner? Join now the EatIn Network!")} </a>
             :
             <a   href="intro/english.html">{translate("Are you a store owner? Join now the EatIn Network!")} </a>}
             
             </li>  - | - 
             <li>
        
             <a   href="https://t.me/eatingr">Telegram channel</a>
             </li>
</ul>


</div>

 

        </>
    )
}

export default HomeVisitor;