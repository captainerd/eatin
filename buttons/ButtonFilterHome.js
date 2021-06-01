import React from 'react';


function ButtonFilterHome(props) {





    return (


        <button onClick={(e) => window.homeEnableMobile(1)}
            className="mdl-button mdl-js-button  mobile-first-btn">
            <i style={{ color: 'white' }} className="material-icons ">settings_input_component</i>

        </button>

    )
}

export default ButtonFilterHome;