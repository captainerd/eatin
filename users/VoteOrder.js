import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import StarRating from '../CompoViews/StarRating'
import { UseAxios, sendToast, InputVal } from '../functions/Functions';
var ratings = {};
function VoteOrder(props) {
    const translate = props.translate;
    const [isinvalid, setisinvalid] = useState({
        service: '',
        quality: '',
        speed: '',
    })
    useEffect(() => {

        if (typeof window.componentHandler !== 'undefined') window.componentHandler.upgradeAllRegistered();
        ratings = {};

    }, []);


    const closeDialog = () => {
        document.getElementById("lrdialog").style.display = "none";
        ReactDOM.unmountComponentAtNode(document.getElementById('mdl-dialog2'));
    }

    const setRating = (what, e) => {
        ratings[what] = e;

        ////console.log(ratings);
    }
    const saveRating = async (e) => {
        let xa = {};
        let founterror = false;
        if (typeof ratings['service'] === 'undefined') {
            founterror = true;
            xa.service = 'invalid-rating';
        } else {
            xa.service = '';
        }
        if (typeof ratings['quality'] === 'undefined') {
            founterror = true;
            xa.quality = 'invalid-rating';
        } else {
            xa.quality = '';
        }
        if (typeof ratings['speed'] === 'undefined') {
            founterror = true;
            xa.speed = 'invalid-rating';
        } else {
            xa.speed = '';
        }
        setisinvalid(xa);
        if (!founterror) {
            let la = await UseAxios({ order_id: props.orderId, votes: ratings, comment: InputVal('vote-notes') }, 'users/save_rating')
            if (la.status === 'ok') {
                sendToast(translate('Your rating saved'));
                closeDialog();
            }
        }


    }
    return (
        <>
            <div id="innerdialog" className="mdl-tabs mdl-js-tabs">

                <div style={{ padding: '3px', margin: '3px', minWidth: '340px' }} className="mdl-cell--4-col  mdl-cell--4-col-phone mdl-shadow--2dp">

                    <div className="mdl-layout__header-row mdl-card__supporting-text">
                        <h4>{translate('Vote')} {props.storename}</h4>

                    </div>



                    <table className="rating-popup">
                        <tbody>
                            <tr><td> <h4 className={isinvalid.speed}>{translate('Speed')}</h4></td>
                                <td>

                                    <div style={{ marginTop: '15px' }} className="vote-popup-stars ">
                                        <StarRating onClick={(e) => setRating('speed', e)} />
                                    </div>

                                </td>
                            </tr>

                            <tr><td> <h4 className={isinvalid.service}>{translate('Service')}</h4></td>
                                <td>

                                    <div style={{ marginTop: '15px' }} className="vote-popup-stars ">
                                        <StarRating onClick={(e) => setRating('service', e)} />
                                    </div>

                                </td>
                            </tr>

                            <tr><td> <h4 className={isinvalid.quality}>{translate('Quality')}</h4></td>
                                <td>

                                    <div style={{ marginTop: '15px' }} className="vote-popup-stars ">
                                        <StarRating onClick={(e) => setRating('quality', e)} />
                                    </div>

                                </td>
                            </tr>


                        </tbody>
                    </table>
                    <div style={{ width: '100%' }} className="mdl-textfield mdl-js-textfield">
                        <textarea className="mdl-textfield__input" type="text" rows="2" id="vote-notes" ></textarea>
                        <label className="mdl-textfield__label" htmlFor="cart-notes">{translate('Write your comment')}</label>
                    </div>

                </div>


                <div className="mdl-dialog__actions">
                    &nbsp;<button type="button" onClick={e => saveRating(e)} style={{ float: 'right' }} className=" mdl-button--colored mdl-button mdl-js-button mdl-button--raised">

                        {translate('Add')}</button>
                    <button type="button" onClick={e => closeDialog(e)} className="mdl-button mdl-js-button mdl-button--raised">{translate('Cancel')}</button>

                </div>

            </div>

        </>
    )
}

export default VoteOrder;