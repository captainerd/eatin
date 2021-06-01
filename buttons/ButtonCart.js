import React, { useState } from 'react';


function ButtonCart(props) {
    const [cartnum, setcartnum] = useState(0);

    const handleClick = (e) => {
        if (typeof props.onClick === 'function') {
            props.onClick(e);
        }
    }
    window.UpdateCart = function (e) {
        setcartnum(e)
    }

    return (


        <button onClick={(e) => handleClick(e)}
            style={{ color: 'white' }} className="mdl-button mdl-js-button  mobile-first-btn-cart">

            {cartnum > 0 ?
                <div className="material-icons mdl-badge mdl-badge--overlap" data-badge={cartnum}>shopping_cart</div>
                :
                <i className="material-icons " data-badge="">shopping_cart</i>
            }
        </button>

    )
}

export default ButtonCart;