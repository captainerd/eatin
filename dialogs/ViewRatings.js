import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import smallloader from '../images/smallloader.gif';
import StarRating from '../CompoViews/StarRating'
import { UseAxios, sendToast, InputVal } from '../functions/Functions';
var ratings = {};
function ViewRatings(props) {
    const translate = props.translate
    const [loading, setloading] = useState(' background-skeleton ')
    const [ratings, setRatings] = useState([

        {
            "comment": "",
            "speed": 0,
            "service": 0,
            "quality": 0,
            "date": 0,
            "avatar": null,
            "name": "       "
        },


        {
            "comment": "",
            "speed": 0,
            "service": 0,
            "quality": 0,
            "date": 0,
            "avatar": null,
            "name": "       "
        },

        {
            "comment": "",
            "speed": 0,
            "service": 0,
            "quality": 0,
            "date": 0,
            "avatar": null,
            "name": "       "
        }




    ])
    const [page, setpage] = useState(1);
    const [loader, setLoader] = useState(false);
    const [havebutton, sethavebutton] = useState(false);
    useEffect(() => {
        loadRatings(1);

        if (typeof window.componentHandler !== 'undefined') window.componentHandler.upgradeAllRegistered();


    }, []);


    const closeDialog = () => {
        document.getElementById("lrdialog").style.display = "none";
        ReactDOM.unmountComponentAtNode(document.getElementById('mdl-dialog2'));
    }

    const loadRatings = async (pp) => {
        let la = await UseAxios({ store_id: props.store._id.oid, page: pp }, 'public/get_ratings')

        if (la.status === 'ok') {
            if (loading === ' background-skeleton ') {
                setloading(' ')
                setRatings(la.votes)

            } else {
                setRatings([...ratings, ...la.votes])
            }
            if (la.votes.length < 10) {
                sethavebutton(false);
            } else {
                sethavebutton(true);
            }
        }
    }
    const loadMore = async () => {
        loadRatings(page + 1);
        setpage(page + 1);

    }
    return (
        <>
            <div id="innerdialog" className="mdl-tabs mdl-js-tabs">

                <div className="ratings_main">

                    <div className="mdl-layout__header-row mdl-card__supporting-text">
                        <h4>  {props.store.store_name}   </h4>
                        <StarRating translate={translate} default={props.store.stars} />
                    </div>

                    ({props.store.stars}) {translate('from')} ({props.store.votes}) {translate('votes')}



                    {ratings.map(item => (
                        <>
                            <div className="ratings_container">
                                <div className={"ratings_title" + loading}>
                                    <div className={"comment-picture"} style={item.avatar !== null ? { color: 'red', backgroundImage: "url(" + item.avatar + ')' } : {}} />

                                    {item.name}
                                    <div className={"ratings_stars " + loading}>
                                        {parseFloat((item.service + item.quality + item.speed) / 3).toFixed(1)}  <StarRating default={(item.service + item.quality + item.speed) / 3} />
                                    </div>
                                </div>
                                <div>


                                    <div>
                                        <div className={"ratings_comment " + + loading}>
                                            {item.comment}
                                        </div>
                                        <div className="ratings_info">
                                            {item.date}   {translate('Speed:')} {item.speed} {translate('Service:')} {item.service} {translate('Quality:')} {item.quality}
                                        </div>
                                    </div>

                                </div>


                            </div>



                        </>

                    ))}

                    {havebutton && <div style={{ width: '100%' }} className="center-align">
                        <button disabled={loader} onClick={(e) => loadMore()} className="mdl-button mdl-js-ripple-effect mdl-js-button  mdl-button--raised mdl-button--colored">
                            {!loader && <>{translate('Load more')}</>}
                            <img className="center-align" style={{ padding: '0', alignself: 'center', width: '30px', height: '30px', display: loader ? 'inline-block' : 'none' }} src={smallloader} alt={"loading..."} />

                        </button>
                    </div>}

                </div>


                <div style={{ position: 'sticky', bottom: '0', backgroundColor: '#ffffff', zIndex: '2' }} className="mdl-dialog__actions">

                    <button type="button" onClick={e => closeDialog(e)} className="mdl-button mdl-js-button mdl-button--raised">{translate('Ok')}</button>

                </div>

            </div>

        </>
    )
}

export default ViewRatings;