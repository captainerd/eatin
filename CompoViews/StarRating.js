import React, { useState, useEffect } from 'react';

//counting stars
function StarRating(props) {
    const [starActive, setStarActive] = useState([])
    useEffect(() => {
        if (typeof props.default !== 'undefined') {
            let newset = [];
            for (let i = 1; i < 6; i++) {
                if (i <= props.default) {
                    newset[i] = 'active_star';
                } else {
                    newset[i] = 'disabled_star';
                }
            }
            setStarActive(newset);
        }

    }, [props.default]);

    const handleClick = (e) => {
        if (typeof props.default === 'undefined') {
            let newset = [];
            for (let i = 1; i < 6; i++) {
                if (i <= e) {
                    newset[i] = 'active_star';
                } else {
                    newset[i] = '';
                }
            }
            setStarActive(newset);
        }

        if (typeof props.onClick === 'function') {
            props.onClick(e);

        }



    }


    return (
        <>

            <div className="star-votes">
                <span className={starActive[5]} onClick={(e) => handleClick(5)} >	&#9733;</span>
                <span className={starActive[4]} onClick={(e) => handleClick(4)} >	&#9733;</span>
                <span className={starActive[3]} onClick={(e) => handleClick(3)}>	&#9733;</span>
                <span className={starActive[2]} onClick={(e) => handleClick(2)}>	&#9733;</span>
                <span className={starActive[1]} onClick={(e) => handleClick(1)}>	&#9733;</span>
            </div>
        </>
    )
}

export default StarRating;