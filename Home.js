import React, { useEffect, useState, Suspense, lazy } from 'react';
import ReactDOM from 'react-dom';
import Loading from './Loading';
import { UseAxios } from './functions/Functions';
import MainCats from './MainCats';
import cardsimg from './images/cards.jpg';
import wposimg from './images/wpos.jpg';
import ticketsimg from './images/tickets.jpg';
import smallloader from './images/smallloader.gif';
import StarRating from './CompoViews/StarRating'
import Select from './CompoViews/Select'
import ButtonFilterHome from './buttons/ButtonFilterHome'

const Store = lazy(() => import('./Store.js'));

var oldscrollpos = 0;
var AllStores = [];
var AllStoresCats = [];
var loadedStores = 0;
var pageNationN = 20;
var AllBackup = [];

var SelectedFilter = 'is_open';
function Home(props) {
    const translate = props.translate;
    var SortOptionsStatus = []
    if (JSON.parse(window.localStorage.getItem('user')).AuthToken === 0) {
        SortOptionsStatus = [
            { id: 'is_open', label: translate('Open'), default: true },
            { id: 'is_closed', label: translate('Closed') },



        ]
    } else {
        SortOptionsStatus = [
            { id: 'is_open', label: translate('Open'), default: true },
            { id: 'is_closed', label: translate('Closed') },
            { id: 'favorites', label: translate('Favorites') }


        ]

    }

    var SortOptions = [
        { id: 1, label: translate('Random'), default: true },
        { id: 2, label: translate('Distance') },
        { id: 3, label: translate('Min order') },
        { id: 4, label: translate('Time') },
        { id: 5, label: translate('Rating') },
        { id: 6, label: translate('Popular') },


    ]

    const [catselect, setcatselect] = useState([])
    const [foundclosed, setfoundClosed] = useState(false)
    const [loading, setloading] = useState(' background-skeleton ')
    const [stores, setStores] = useState([

        {
            "logo": 'uploads/trans.png',
            "id": '1143',
            "store_name": '⠀⠀⠀⠀',
            "store_distance": ' ',
            "min_order": ' ',
            "delivery_time": 0,
            "district": '⠀⠀⠀⠀             ',
            "is_open": true,
            "payment_options": {
                "cash": true
            },
            "store_url": "",
            "votes": 0,
            "stars": 0,
            "cats": "",
            "catnums": []
        },
        {
            "logo": 'uploads/trans.png',
            "id": '4422',
            "store_name": '⠀⠀⠀⠀',
            "store_distance": 0,
            "min_order": 0,
            "delivery_time": 0,
            "district": '⠀⠀⠀⠀             ',
            "is_open": true,
            "payment_options": {
                "cash": true
            },
            "store_url": "",
            "votes": 0,
            "stars": 0,
            "cats": "",
            "catnums": []
        },
        {
            "logo": 'uploads/trans.png',
            "id": '26568',
            "store_name": '⠀⠀⠀⠀',
            "store_distance": 0,
            "min_order": 0,
            "delivery_time": 0,
            "district": '⠀⠀⠀⠀             ',
            "is_open": true,
            "payment_options": {
                "cash": true
            },
            "store_url": "",
            "votes": 0,
            "stars": 0,
            "cats": "",
            "catnums": []
        },



    ]);
    const [noresults, setNoresults] = useState(false);

    const [emobile, setEmobile] = useState(' ');

    useEffect(() => {


        if (typeof window.componentHandler !== 'undefined') window.componentHandler.upgradeAllRegistered();
   
  
   
   
    });
    useEffect(() => {
 
        if (typeof window.componentHandler === 'undefined') {
setTimeout(() => {
    if (typeof window.componentHandler !== 'undefined')  window.componentHandler.upgradeAllRegistered();
}, 600);

        }
        //    window.dialog_c.push(() => window.homeEnableMobile(0))

        let listed = false;
        if (typeof props.list !== 'undefined') {

            document.title = window.sitename + ' Delivery ' + props.list;
            window.history.pushState({}, null, '/delivery/' + props.list);
            loadStores({ one_area: props.list });
            listed = true;


        }

        if (typeof props.list === 'undefined') document.title = window.sitename + 'Delivery'


        let myPos = JSON.parse(window.localStorage.getItem('user'));
        if (myPos === null) {


        } else {
            if (typeof myPos.position === 'undefined' && myPos.role > 0) {
                if (!listed) loadPosition();
            } else {
                if (myPos.position === null) {
                    window.fireOne('nopos')

                }

                //    myPos.position.one_area = props.list
                if (!listed) loadStores(myPos.position);

            }
        }

        var objTable = document.getElementById("mdl__content");
        objTable.addEventListener('scroll', handleScroll, false);



        window.Analytics();
        // document.getElementById('bar_menu_right').innerHTML = '';
        setTimeout(() => {
            ReactDOM.render(
                <ButtonFilterHome />,

                document.getElementById('bar_menu_right'));



        }, 300);

        return () => {
            objTable.removeEventListener('scroll', handleScroll);

            setTimeout(() => {
                ReactDOM.unmountComponentAtNode(document.getElementById('bar_menu_right'));
            }, 200);
        }

    }, []);
    const loadStores = async (e) => {

        let la = await UseAxios(e, 'public/list_stores');
        if (la.status === 'ok') {
            if (la.stores.length === 0) setNoresults(true);
            setloading('')

            AllStores = la.stores;
            if (AllStores.length === 0) {
                setNoresults(true);
                return;
            }
            AllStoresCats = la.stores;
            //  //console.log(AllStores)
            AllStores = shuffle(AllStores);

            AllStores = AllStores.sort(order_store_favorites)
            AllBackup = [...AllStores];
            AllStores = AllStores.filter(order_store_close)
            AllStoresCats = AllStores;
            if (la.stores.length === 0) setNoresults(true);
            if (AllStores.length === 0 && AllBackup.length > 0) {
                setfoundClosed(true);
                AllStores = AllBackup;

            }


            setStores(AllStores.slice(0, pageNationN));




            loadedStores = pageNationN;
        }


    }
    function handleScroll() {
        let scrollPos = (document.getElementById("mdl__content").scrollTop + document.getElementById("mdl__content").offsetHeight + 450);
        if (oldscrollpos > scrollPos) return;
        oldscrollpos = scrollPos;

        if (document.getElementById("mdl__content").scrollHeight > scrollPos) return;

        if (stores.length < AllStores.length) {

            loadedStores = loadedStores + pageNationN;
            setStores(AllStores.slice(0, loadedStores));
        }

    }

    const loadPosition = async () => {

        let la = await UseAxios('', 'users/get_pos');

        if (la.status === 'ok') {
            let myPos = JSON.parse(window.localStorage.getItem('user'));
            myPos.position = la.info;
            localStorage.setItem("user", JSON.stringify(myPos)); //local storage
            loadStores(la.info);
        } else {
            loadStores({ one_area: props.list });
            //  setNoresults(true);
        }


    }
    const ShowToolTip = (a, e) => {
        let rect = a.currentTarget.getBoundingClientRect();

        document.getElementById(e).style = "z-index: 1000; position: fixed; opacity: 1; top: " + (rect.top + 15)
            + "px; left: " + (rect.left - 150) + 'px; right: ' + rect.right + 'px;';



    }
    const HideToolTip = (a, e) => {
        document.getElementById(e).style.zIndex = '-100';
        document.getElementById(e).style.opacity = '0';
    }
    const catChanged = (e) => {
        oldscrollpos = 0;


        if (e.length === 0) {
            AllStores = AllStoresCats;

            loadedStores = pageNationN;



            let sclided = [...AllStores.slice(0, loadedStores)];
            if (sclided.length === 0) {
                setNoresults(true);
            } else {
                setNoresults(false);
            }

            setStores(sclided);

        } else {
            AllStores = [];

            AllStoresCats.map(item => {

                if (CheckIfCats(item.catnums, e)) {
                    AllStores.push(item);
                }


            });
            loadedStores = pageNationN;
            let sclided = [...AllStores.slice(0, loadedStores)];
            if (sclided.length === 0) {
                setNoresults(true);
            } else {
                setNoresults(false);
            }

            setStores(sclided);





        }
        //  //console.log(catValues);

    }
    const CheckIfCats = (e, catValues) => {
        let toreturn = false;
        //if (catValues.length === 0) return true;

        e.map(item => {
            if (catValues.indexOf(item) !== -1) {
                toreturn = true;

            }
        });

        return toreturn;

    }
    const loadmore = (e) => {
        if (stores.length < AllStores.length) {
            loadedStores = loadedStores + pageNationN;
            setStores(AllStores.slice(0, loadedStores));
        }
    }
    const loadStore = (e, a) => {
        if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
        e.preventDefault();
        ReactDOM.unmountComponentAtNode(document.getElementById('page-content'));

        ReactDOM.render(<> <Suspense fallback={<Loading />}>

            <Store translate={translate} store={a} />

        </Suspense> </>, document.getElementById('page-content'));


    }
    const handleSort = (e) => {
        reOrder(e.id)
    }
    const reOrder = (e) => {
        oldscrollpos = 0;
        ////console.log(AllStores.sort(order_store_distance))

        switch (parseInt(e)) {
            case 1:
                AllStores = shuffle(AllStores);
                break;
            case 2:
                AllStores = AllStores.sort(order_store_distance)

                break;
            case 3:
                AllStores = AllStores.sort(order_store_min_order)
                break;
            case 4:
                AllStores = AllStores.sort(order_store_time)

                break;
            case 5:
                AllStores = AllStores.sort(order_store_stars)
                break;
            case 6:
                AllStores = AllStores.sort(order_store_popularity)
                break;
            case 7:
                AllStores = AllBackup;
                AllStores = AllStores.filter(order_store_close)
                break;
            case 8:
                AllStores = AllBackup;
                AllStores = AllStores.filter(order_store_open)
                break;
            case 9:
                AllStores = AllBackup;
                AllStores = AllStores.filter(filter_store_favorites)
                break;

            default:
            // code block
        }
        if (e < 7) AllStores = AllStores.sort(order_store_favorites)
        AllStoresCats = AllStores;
        let slicded = [...AllStores.slice(0, loadedStores)];
        if (slicded.length === 0) {
            setNoresults(true);
        } else {
            setNoresults(false);
        }
        setStores(slicded)








    }
    function shuffle(arra1) {
        var ctr = arra1.length, temp, index;

        // While there are elements in the array
        while (ctr > 0) {
            // Pick a random index
            index = Math.floor(Math.random() * ctr);
            // Decrease ctr by 1
            ctr--;
            // And swap the last element with it
            temp = arra1[ctr];
            arra1[ctr] = arra1[index];
            arra1[index] = temp;
        }
        return arra1;
    }
    function order_store_close(a, b) {
        return a.is_open;
    }
    function order_store_open(a, b) {


        return !a.is_open;
    }
    function filter_store_favorites(a, b) {

        return a.favorite;
    }
    function order_store_favorites(a, b) {
        const bandA = a.favorite;
        const bandB = b.favorite;

        let comparison = 0;
        if (bandA < bandB) {
            comparison = 1;
        } else if (bandA > bandB) {
            comparison = -1;
        }
        return comparison;
    }
    function order_store_distance(a, b) {
        const bandA = a.store_distance;
        const bandB = b.store_distance;

        let comparison = 0;
        if (bandA > bandB) {
            comparison = 1;
        } else if (bandA < bandB) {
            comparison = -1;
        }
        return comparison;
    }
    function order_store_min_order(a, b) {
        const bandA = parseFloat(a.min_order);
        const bandB = parseFloat(b.min_order);

        let comparison = 0;
        if (bandA < bandB) {
            comparison = 1;
        } else if (bandA > bandB) {
            comparison = -1;
        }
        return comparison;
    }
    function order_store_time(a, b) {
        const bandA = parseInt(a.delivery_time);
        const bandB = parseInt(b.delivery_time);

        let comparison = 0;
        if (bandA > bandB) {
            comparison = 1;
        } else if (bandA < bandB) {
            comparison = -1;
        }
        return comparison;
    }
    function order_store_stars(a, b) {
        const bandA = parseFloat(a.stars);
        const bandB = parseFloat(b.stars);

        let comparison = 0;
        if (bandA < bandB) {
            comparison = 1;
        } else if (bandA > bandB) {
            comparison = -1;
        }
        return comparison;
    }
    function order_store_popularity(a, b) {
        const bandA = parseFloat(a.votes);
        const bandB = parseFloat(b.votes);

        let comparison = 0;
        if (bandA < bandB) {
            comparison = 1;
        } else if (bandA > bandB) {
            comparison = -1;
        }
        return comparison;
    }
    const handleSortStatus = (e) => {
        SelectedFilter = e.id

        if (e.id === 'is_open') reOrder(7)
        if (e.id === 'is_closed') reOrder(8)
        if (e.id === 'favorites') reOrder(9)
    }

    window.homeEnableMobile = function (e) {

        if (e === 1) {
            window.dialog_c.push(() => window.homeEnableMobile(0))
            setEmobile('-mobile');
        }
        if (e === 0) {
            setEmobile(' ');
            window.dialog_c.pop();
        }

    }
    return (
        <>

            <div className="mdl-grid mdl-j-center">
                <div className={"home-categories" + emobile}>
                    <div id="CatComponent" className={"  store-categories-menu" + emobile}>
                        <div className={"mdl-card mdl-card--border mdl-shadow--2dp store-categories-scnd" + emobile}>
                            <Select readOnly={true} onSelect={(e) => handleSort(e)} style={{ width: '100%' }} id="top_home" options={SortOptions} label={translate("Sort by")} icon="sort" />
                            <Select readOnly={true} onSelect={(e) => handleSortStatus(e)} style={{ width: '100%' }} id="sort_open_close" options={SortOptionsStatus} label={translate("Filter")} icon="sort" />

                            <MainCats translate={translate} catChange={(e) => catChanged(e)} />
                            {emobile === '-mobile' &&
                                <div className="mdl-dialog__actions">

                                    <button type="button" onClick={(e) => window.homeEnableMobile(0)} className="mdl-button mdl-js-button mdl-button--raised">{translate('Close')}</button>

                                </div>}
                        </div>
                    </div>


                </div>
                <div className="mdl-cell mdl-cell--8-col main-container-str">
                    {noresults ? (
                        <div className="center-align">
                            <div className="store-cointainer mdl-shadow--2dp">

                                <div className="mdl-card__title">
                                    <h2 className="mdl-card__title-text">{translate('No stores found')}</h2>
                                </div>
                                <div className="mdl-card__supporting-text">

                                    {translate("We couldn't find stores that serve your area with that criteria.")}
                                    <br /><a onClick={(e) => { e.preventDefault(); window.fireOne('suggeststore') }} href="#suggest">{translate("Suggest a store you would like to see here.")}</a>
                                </div>
                            </div>
                        </div>


                    ) : (<>



                        {foundclosed && (
                            <div className="center-align">
                                <div className="store-cointainer mdl-shadow--2dp">

                                    <div className="mdl-card__title">
                                        <h2 className="mdl-card__title-text">{translate("All stores are closed")}</h2>
                                    </div>
                                    <div className="mdl-card__supporting-text">

                                        {translate("All stores for your area are closed right now.")}
                                    </div>
                                </div>
                            </div>


                        )
                        }

                        {stores.map(item => (


                            <div key={item.id} className={item.is_open ? "store-cointainer mdl-shadow--2dp " : "store-cointainer mdl-shadow--2dp closed-store "}>
                                
                                <div className="mdl-grid   ">
                                    <div className="mdl-cell mdl-cell--1-col logocell">
                                        <a onClick={(e) => loadStore(e, item.store_url)} href={"delivery/" + item.store_url}>
                                            <div className={"store-logo " + loading} style={loading.length === 0 ? {  backgroundImage: "url(" + window.assetsurl + item.logo + ")" } : {}} />

                                        </a>
                                        
                                    </div>
                                    <div className={"mdl-cell mdl-cell--2-col store-title-1-pre "}>
                                        <div className={"store-title-1 " + loading}>
                                            <a onClick={(e) => loadStore(e, item.store_url)} href={"delivery/" + item.store_url}>{item.store_name}</a>
                                        </div>

                                        <div className="store-title-sub">
                                            <small className={"store-district " + loading}>{item.district}</small> <small className="store-district">   {item.store_distance > 999 ? (<>{(item.store_distance / 1000).toFixed(2)} {translate("khms")} </>) : (<>{Math.round(item.store_distance)} {translate("Metre")}</>)}</small>
                                        </div>
                                        <div className={"star-votes store-sub-secondary " + loading}>
                                            {loading === '' && < StarRating default={item.stars} />}
                                        </div>
                                        <small>({item.votes})</small>
                                    </div>
                                    <div className="mdl-cell mdl-cell--1-col">
                                        <div className="store-title-2 ">
                                            {translate("Time")}
                                        </div>

                                        <div className={"store-title-sub " + loading}>
                                            <i className="material-icons store-mobile-icons mdl-color-text--primary ">alarm</i>        {loading.length === 0 && <> {item.delivery_time}'</>}
                                        </div>

                                    </div>
                                    <div className="mdl-cell mdl-cell--1-col">
                                        <div className={"store-title-2 "}>
                                            {translate("Minimum")}
                                        </div>

                                        <div className={"store-title-sub " + loading}>
                                            <i className="material-icons store-mobile-icons mdl-color-text--primary ">add_shopping_cart</i>   {loading.length === 0 && (item.min_order * 1).toFixed(1)} €
                                </div>
                                        <small className={"store-descats " + loading}>{item.cats}</small>
                                    </div>
                                    <div className="mdl-cell mdl-cell--2-col mdl-cell--1-col-phone mdl-cell--1-col-tablet">
                                        <div className="store-title-2 ">

                                        </div>
                                        <div className="store-title-sub">
                                            <div className=" store-sub-secondary">
                                                {(item.payment_options.credit_card || item.payment_options.paypal) && (
                                                    <>

                                                        <i id="card_icon" onMouseOver={(e) => ShowToolTip(e, 'tooltip_card')} onMouseOut={(e) => HideToolTip(e, 'tooltip_card')} className="mdl-color-text--primary material-icons">credit_card</i>
                                                    </>
                                                )}
                                                {item.payment_options.wireless_pos && (
                                                    <>

                                                        <i id="wpos_icon" onMouseOver={(e) => ShowToolTip(e, 'tooltip_wpos')} onMouseOut={(e) => HideToolTip(e, 'tooltip_wpos')} className="mdl-color-text--primary material-icons">phone_android</i>

                                                    </>
                                                )}

                                                {item.payment_options.tickets && (
                                                    <>

                                                        <i id="wpos_icon" onMouseOver={(e) => ShowToolTip(e, 'tooltip_tickets')} onMouseOut={(e) => HideToolTip(e, 'tooltip_tickets')} className="mdl-color-text--primary  material-icons">turned_in</i>

                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mdl-cell  mdl-cell--2-col  mdl-cell--1-col-tablet mdl-cell--1-col-phone">
                                        <div className={"store-title-2 " + loading}>

                                        </div>
                                        {loading.length === 0 &&
                                            <button onClick={(e) => loadStore(e, item.store_url)} style={{ marginBottom: '10px' }} className="mdl-button mdl-js-button mdl-button--raised mdl-button--accent">
                                                {translate('Enter')}
                                            </button>}
                                    </div>
                                </div>

                            </div>


                        ))}

                        {stores.length < AllStores.length &&

                            <div className="center-align">

                                {loading.length === 0 && <button onClick={loadmore} style={{ marginBottom: '10px' }} className="mdl-button mdl-js-button mdl-button--raised mdl-button--accent">
                                    {translate("Load more")}
                                </button>}
                            </div>}
                    </>)}


                </div>
                <div id="tooltip_wpos" className="mdl-tooltip-cust"  >
                    <center><b>{translate("Wireless POS")}</b></center>

                    <p />{translate("This store accept credit card On site via wireless POS")}
                    <p />   <center> <img src={wposimg} /></center>
                </div>
                <div id="tooltip_card" className="mdl-tooltip-cust"  >
                    <center>   <b>{translate("Credit card")}</b></center>
                    <p /> {translate("This store accept credit cards Visa and Mastercard")}
                    <p />  <center> <img src={cardsimg} /></center>
                </div>

                <div id="tooltip_tickets" className="mdl-tooltip-cust"  >
                    <center>   <b>{translate("Ticket restaurant")}</b></center>
                    <p /> {translate("This store accepts ticket restaurant coupons")}
                    <p />  <center> <img src={ticketsimg} /></center>


                </div>


            </div >



        </>
    )
}

export default Home;