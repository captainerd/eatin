import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom';
import Input from '../CompoViews/Input'
//https://code.getmdl.io/1.3.0/material.red-deep_orange.min.css

var oldValue = null;
function Customize(props) {
    const translate = props.translate;
    const [thecolors, setColors] = useState('')
    useEffect(() => {


        window.componentHandler.upgradeAllRegistered();

    }, [])
    const handleYes = (e) => {
        if (typeof props.onDone === 'function') {
            props.onDone(thecolors);

            document.getElementById("lrdialog2").style.display = "none";
            ReactDOM.unmountComponentAtNode(document.getElementById('mdl-dialog'));
        }
    }
    const handleClick = (e) => {
        if (oldValue === null) {
            oldValue = e.target.getAttribute('name')
            setColors(oldValue + ' + ');
            return
        }
        if (oldValue !== null) {
            let la = e.target.getAttribute('name')
            setColors(oldValue + ' + ' + la);
            if ((la === 'grey' || la === 'blue_grey' || la === 'brown')) {

                setColors('Can not compine those. ');
                oldValue = null;
                return;
            }

            if ((la === 'grey' || la === 'blue_grey' || la === 'brown') &&
                (oldValue === 'grey' || oldValue === 'blue_grey' || oldValue === 'brown')) {
                oldValue = null;
                return;
            }

            let newv = 'https://code.getmdl.io/1.3.0/material.' + oldValue + '-' + la + '.min.css'
            
            oldValue = null;
            document.getElementById("html_loader").style.display = 'block';
            document.getElementById("mdl_stylesheet").setAttribute("href", newv);
            setTimeout(() => {
                document.getElementById("html_loader").style.display = 'none';

            }, 1000);


        }
    }


    return (
        <div>

        <div style={{maxWidth: '550px'}} class="mdl-grid">
            <div style={{   width: '280px' }} className=" mdl-cell--5-col mdl-shadow--2dp">
                <div className=" mdl-card__supporting-text">
                    <h5>{translate('Choose colors')}</h5></div>



                <div style={{ cursor: 'pointer' }} onClick={(e) => handleClick(e)}>

                    <div name="grey" style={{  backgroundColor: 'rgb(158, 158, 158)', }} className="colorChooserBtn">
                    </div>

                    <div name="blue_grey" style={{  backgroundColor: 'rgb(96, 125, 139)', }} className="colorChooserBtn">
                    </div>


                    <div name="brown" style={{  backgroundColor: 'rgb(121, 85, 72)' }} className="colorChooserBtn">
                    </div>

                    <div name="orange" style={{  backgroundColor: 'rgb(255, 152, 0)', }} className="colorChooserBtn">
                    </div>

                    <div name="amber" style={{   backgroundColor: 'rgb(255, 193, 7)', }} className="colorChooserBtn">
                    </div>

                    <div name="yellow" style={{  backgroundColor: 'rgb(255, 235, 59)', }} className="colorChooserBtn">
                    </div>

                    <div name="lime" style={{ backgroundColor: 'rgb(205, 220, 57)', }} className="colorChooserBtn">
                    </div>

                    <div name="light_green" style={{ backgroundColor: 'rgb(139, 195, 74)', }} className="colorChooserBtn">
                    </div>

                    <div name="green" style={{ backgroundColor: 'rgb(76, 175, 80) ', }} className="colorChooserBtn">
                    </div>

                    <div name="teal" style={{ backgroundColor: 'rgb(0, 150, 136) ', }} className="colorChooserBtn">
                    </div>

                    <div name="cyan" style={{ backgroundColor: 'rgb(0, 188, 212) ', }} className="colorChooserBtn">
                    </div>

                    <div name="light_blue" style={{ backgroundColor: 'rgb(3, 169, 244)', }} className="colorChooserBtn">
                    </div>

                    <div name="blue" style={{ backgroundColor: 'rgb(33, 150, 243)', }} className="colorChooserBtn">
                    </div>

                    <div name="indigo" style={{ backgroundColor: 'rgb(63, 81, 181)', }} className="colorChooserBtn">
                    </div>

                    <div name="deep_purple" style={{ backgroundColor: 'rgb(103, 58, 183)', }} className="colorChooserBtn">
                    </div>

                    <div name="purple" style={{ backgroundColor: 'rgb(156, 39, 176)', }} className="colorChooserBtn">
                    </div>

                    <div name="pink" style={{ backgroundColor: 'rgb(233, 30, 99)', }} className="colorChooserBtn">
                    </div>

                    <div name="red" style={{ backgroundColor: 'rgb(244, 67, 54)', }} className="colorChooserBtn">
                    </div>

                    <div name="deep_orange" style={{ backgroundColor: 'rgb(255, 87, 34)', }} className="colorChooserBtn">
                    </div>
                </div>
                <div className=" mdl-card__supporting-text">
                    {translate('Choosen:')} {thecolors} </div>

            </div>

            <div class="mdl-cell mdl-cell--4-col"  >
               
                    <div className=" mdl-card__supporting-text">
                    <h5>    {translate('Preview')}  </h5> </div>


                    <div style={{ width: '250px', height: '370px', border: '1px solid gray' }} className="">
                        <div className="mdl-layout__header is-casting-shadow">
                            <div  className="mdl-layout__header-row">
                                <i style={{ float: 'left' }} className="material-icons " data-badge="">menu</i>
                                <span className="mdl-layout-title">Logo</span>

                                <div className="mdl-layout-spacer"></div>

                                <i   className="material-icons " data-badge="">shopping_cart</i>
                            </div>
                        </div>



                 
                            <div className="page-content">

                                <Input type="text" id="demo_input" text="Demo" icon="where_to_vote" />

                                <Input type="toggle" id="demo_input_toggle" text="Demo" icon="where_to_vote" />

                                <button style={{ margin: '10px' }} className="mdl-button mdl-js-button mdl-button--raised mdl-button--accent">
                                    Order
                        </button>

                                <div className="mdl-dialog__actions">

                                    <button type="button" className="mdl-button mdl-js-button mdl-button--raised">Cancel</button>
                                    <button type="button" className=" mdl-button--colored mdl-button mdl-js-button mdl-button--raised">Yes</button>
                                </div>
                            </div>
                       
                    </div>
                    </div>
                 
                    <div  >
                    </div>
                    </div>
            <div className="mdl-dialog__actions">
                                <button type="button" onClick={e => handleYes()} className=" mdl-button--colored mdl-button mdl-js-button mdl-button--raised">Ok</button>
                            </div>
                           
                           
         
</div>
    )



}

export default Customize;