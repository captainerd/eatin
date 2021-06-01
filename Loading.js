import React, { useEffect } from 'react';

function Loading(props) {

    useEffect(() => {
        if (typeof window.componentHandler !== 'undefined') window.componentHandler.upgradeAllRegistered();
    });

    return (
        <div style={{ width: '100%', height: '25px' }} className="mdl-progress mdl-js-progress mdl-progress__indeterminate"></div>
    )
}

export default Loading;