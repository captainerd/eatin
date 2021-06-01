import React, { lazy, Suspense, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import ButtonCart from './buttons/ButtonCart';
import StarRating from './CompoViews/StarRating';
import './css/home.css';
import AddressAskerDialog from './dialogs/AddressAskerDialog';
import Addtocart from './dialogs/Addtocart';
import DialogConfirm from './dialogs/DialogConfirm';
import Picpreview from './dialogs/Picpreview';
import ViewRatings from './dialogs/ViewRatings';
import { sendToast, UseAxios } from './functions/Functions';
import smallloader from './images/smallloader.gif';
import ListAddress_widget from './ListAddress_widget';
import Order from './Order';
import Orders from './users/Orders';
import ReconnectingWebSocket from 'reconnecting-websocket';
const LoginRegister = lazy(() => import('./dialogs/LoginRegister'));

var inCart = [];


var dontDoit = false;
var realstorecats = [];
var realstoreprods = [];
var OfferMode = false;

var catsOffer = {};
var thisOfferprice = 0;
var thisTimesOffer = 0;
var offercounter = 0;
var inCartlength = 0;
var scrollTimer = null;
function timeConvert(n) {
    var num = n;
    var hours = (num / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    if (rhours < 10) {
        rhours = '0' + rhours;
    }
    if (rminutes < 10) {
        rminutes = '0' + rminutes;
    }
    return rhours + ":" + rminutes;
}
function animate(elem, style, unit, from, to, time, prop) {
    if (!elem) {
        return;
    }
    var start = new Date().getTime(),
        timer = setInterval(function () {
            var step = Math.min(1, (new Date().getTime() - start) / time);
            if (prop) {
                elem[style] = (from + step * (to - from)) + unit;
            } else {
                elem.style[style] = (from + step * (to - from)) + unit;
            }
            if (step === 1) {
                clearInterval(timer);
            }
        }, 25);
    if (prop) {
        elem[style] = from + unit;
    } else {
        elem.style[style] = from + unit;
    }
}

window.catsOffer = {}
function makeSession(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

Object.equals = function (x, y) {
    if (x === y) return true;
    // if both x and y are null or undefined and exactly the same

    if (!(x instanceof Object) || !(y instanceof Object)) return false;
    // if they are not strictly equal, they both need to be Objects

    if (x.constructor !== y.constructor) return false;
    // they must have the exact same prototype chain, the closest we can do is
    // test there constructor.

    for (var p in x) {
        if (!x.hasOwnProperty(p)) continue;
        // other properties were tested using x.constructor === y.constructor

        if (!y.hasOwnProperty(p)) return false;
        // allows to compare x[ p ] and y[ p ] when set to undefined

        if (x[p] === y[p]) continue;
        // if they have the same strict value or identity then they are equal

        if (typeof (x[p]) !== "object") return false;
        // Numbers, Strings, Functions, Booleans must be strictly equal

        if (!Object.equals(x[p], y[p])) return false;
        // Objects and Arrays must be tested recursively
    }

    for (p in y) {
        if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) return false;
        // allows x[ p ] to be set to undefined
    }
    return true;
}


function Store(props) {

    const translate = props.translate;

    async function ConfirmDialog(text, callback) {

        ReactDOM.render(<>

            <DialogConfirm translate={translate} text={text} onYes={() => callback()} />

        </>, document.getElementById('mdl-dialog'));
        document.getElementById("lrdialog2").style.display = "block";

    }


    async function AddToCardDialog(text, callback) {


        ReactDOM.render(

            <Addtocart translate={translate} text={text} onAdd={(e) => callback(e)} />

            , document.getElementById('mdl-dialog2'));
        document.getElementById("lrdialog").style.display = "block";

    }
    const [store, setStore] = useState({
        cats: [
            { label: '⠀⠀⠀⠀⠀⠀⠀⠀', id: 0 },
            { label: '⠀⠀⠀⠀⠀⠀⠀⠀', id: 1 },

        ],
        open: true,
        store_description: '',
        phone: '',
        logo: '',
        area_service: true,
        min_order: 0,
        delivery_time: 0,
        products: [],
        schedule: {
            monday: {
                time_open: 0,
                time_close: 0,
                is_open: 0,
            },
            tuesday: {
                time_open: 0,
                time_close: 0,
                is_open: 0,
            },
            wednesday: {
                time_open: 0,
                time_close: 0,
                is_open: 0,
            },
            thursday: {
                time_open: 0,
                time_close: 0,
                is_open: 0,
            },
            friday: {
                time_open: 0,
                time_close: 0,
                is_open: 0,
            },
            saturday: {
                time_open: 0,
                time_close: 0,
                is_open: 0,
            },
            sunday: {
                time_open: 0,
                time_close: 0,
                is_open: 0,
            },
        },
        offers: [],

    });
    const [loading, setloading] = useState(' background-skeleton ')
    const [catcontent, setCatcontent] = useState([]);
    const [cartloading, setCartloading] = useState(false);
    const [cartcontent, setCartcontent] = useState([]);
    const [pricetotal, setPriceTotal] = useState(0);
    const [faved, setFaved] = useState(false);
    const [area_service, setArea_service] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const [emobile, setEmobile] = useState(' ');

    const [hidemain, setHidemain] = useState(false);

    useEffect(() => {
        if (typeof window.componentHandler !== 'undefined') window.componentHandler.upgradeAllRegistered();

    });
    useEffect(() => {

        
        if (typeof window.componentHandler !== 'undefined') window.componentHandler.upgradeAllRegistered();
 
        inCart = [];
        loadStore();
        retrieveCart();
     if (typeof window.store_url !== 'string')    window.history.pushState({}, null, '/delivery/' + props.store);


        var objTable = document.getElementById("mdl__content");
        objTable.addEventListener('scroll', handleScroll, false);





        inCart = [];



        realstorecats = [];
        realstoreprods = [];
        OfferMode = false;

        catsOffer = {};
        thisOfferprice = 0;
        thisTimesOffer = 0;
        offercounter = 0;
        inCartlength = 0;
        window.catsOffer = {}



        setCatcontent(

            [
                {
                    id: 0,
                    name: '⠀⠀⠀⠀⠀⠀⠀⠀⠀',
                    products: [
                        {
                            "name": "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
                            "desc": " ",
                            "price": "0",
                            "defprice": "0",
                            "category": "0",
                            "id": "2",
                            "photo": false,
                            "avail": false,
                            "avail_from": 0,
                            "avail_to": 0
                        }
                    ]

                },
                {
                    id: 1,
                    name: '⠀⠀⠀⠀⠀⠀⠀⠀⠀',
                    products: [
                        {
                            "name": "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
                            "desc": " ",
                            "price": "0",
                            "defprice": "0",
                            "category": "1",
                            "id": "2",
                            "photo": false,
                            "avail": false,
                            "avail_from": 0,
                            "avail_to": 0
                        }
                    ]

                }


            ])

        window.Analytics();

        setTimeout(() => {
            ReactDOM.render(<ButtonCart onClick={() => handleCartClick(1)} />, document.getElementById('bar_menu_right'));
        }, 300);



        if ( JSON.parse(window.localStorage.getItem('user')).position !== null && typeof JSON.parse(window.localStorage.getItem('user')).position !== 'undefined'   && typeof window.placeorder === 'undefined') {
            window.placeorder = new ReconnectingWebSocket(window.websockets, [], { connectionTimeout: 1000, maxRetries: Infinity, });
      
      
      
      
            window.placeorder.onclose = function (e) {
      
      
            };
        }


        return () => {
            objTable.removeEventListener('scroll', handleScroll);
            setTimeout(() => {
                ReactDOM.unmountComponentAtNode(document.getElementById('bar_menu_right'));
            }, 200);



        }
    }, []);

    function handleScroll() {
        if (scrollTimer) clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            handleScroll2();
        }, 200);
    }

    function handleScroll2() {
        if (!document.getElementById('links_store')) return
        let fromTop = document.getElementById("mdl__content").scrollTop;
        //      if (fromTop > 170) {
        //          document.getElementById('cat-m-m').style.display = 'inline-block';
        //      } else {
        //         document.getElementById('cat-m-m').style.display = 'none';
        //     }
        let mainNavLinks = document.getElementById('links_store').getElementsByTagName('a');
        Array.from(mainNavLinks).forEach(link => {
            let section = document.querySelector(link.hash);

            if (
                section.offsetTop - 100 <= fromTop &&
                section.offsetTop + section.offsetHeight - 100 > fromTop

            ) {


                link.parentNode.classList.add("active_link");
                // link.parentNode.parentNode.parentNode.scrollLeft = link.offsetLeft - 10;

                animate(link.parentNode.parentNode.parentNode, 'scrollLeft', '', link.parentNode.parentNode.parentNode.scrollLeft, link.offsetLeft - 10, 300, true)
            } else {


                link.parentNode.classList.remove("active_link");
            }
        });



    }

    //top button on fixed bar
    const handleCartClick = (e) => {
        if (e === 1) {

            setEmobile('-mobile');
            window.dialog_c.push(() => handleCartClick(0))
        }
        if (e === 0) {
            setEmobile(' ');
            window.dialog_c.pop();
        }
    }
    const loadStore = async () => {
        let hascache = false;

        if (typeof JSON.parse(window.localStorage.getItem('user')).position !== 'undefined' && JSON.parse(window.localStorage.getItem('user')).position !== null) {
            if (JSON.parse(window.localStorage.getItem('user')).position.lat === 0) {
                dontDoit = true;
            } else {
                dontDoit = false;
            }
        }
        let lang = 'en'
       
        if (typeof JSON.parse(window.localStorage.getItem('user')).position === 'undefined' || JSON.parse(window.localStorage.getItem('user')).position === null) {
            dontDoit = true;


        }
        setArea_service(false)
        let myPos = JSON.parse(window.localStorage.getItem('user'));

        if (typeof myPos.position === 'undefined' || myPos.position === null) {
            myPos.position = [];
            myPos.position.lat = 0;
            myPos.position.lng = 0;
        }
        let hascacheid = 'nocache';
        if (localStorage.getItem(btoa(props.store)) !== null) {
            hascache = true;
            hascacheid = JSON.parse(localStorage.getItem(btoa(props.store))).cache_id;
        }
        let la = await UseAxios({ lat: myPos.position.lat, lng: myPos.position.lng, store: btoa(props.store), cache: hascacheid }, 'public/load_store');
        if (la.status === 'not-found') {

            setNotFound(true);

        }
        if (la.status === 'ok') {
           
            if (myPos.position.lng > 0) setArea_service(la.store.area_service);
            //  //console.log('einai '+ la.store.area_service);
            setloading('')
            let procollection = [];
            let arr = []
       

        
                hascache = !la.store.old_cache;
         
          
            if (hascache) {
                
  
                let cachestore = JSON.parse(localStorage.getItem(btoa(props.store)))
                cachestore.open =  la.store.open;
                cachestore.favorite =  la.store.favorite;
                cachestore.zone =  la.store.zone;
                cachestore.min_order =  la.store.min_order;
                cachestore.area_service =  la.store.area_service;
                cachestore.votes =  la.store.votes;
                la.store = cachestore;
    //          alert('has cache ' + JSON.parse(localStorage.getItem(btoa(props.store))))
  
            } else {
      //          alert('setting cache')
                localStorage.setItem(btoa(props.store), JSON.stringify(la.store));
            }
            document.title = la.store.store_name + ' delivery '
            Object.keys(la.store.offers).map(item => {
                arr[item] = la.store.offers[item];
            })
            la.store.offers = arr;

            setStore(la.store);


            setFaved(la.store.favorite)

            la.store.cats.map(item => {
                let Obj = [];
                Obj.name = item.label;
                Obj.id = item.id;
                Obj.products = [];

                la.store.products.map(itema => {
                    if (itema.category === item.id)
                        Obj.products.push(itema);
                });


                procollection.push(Obj);
            });

            setCatcontent(procollection);


        }





    }
    function FixCart(zz) {
        let myArr = [];


        let added = [];
        if (typeof zz[zz.length - 1].sessionOffer !== 'undefined') myArr.sessionOffer = zz[zz.length - 1].sessionOffer

        if (OfferMode) {
            if (typeof catsOffer[zz[zz.length - 1].cat] === 'undefined') catsOffer[zz[zz.length - 1].cat] = 0;
            catsOffer[zz[zz.length - 1].cat] += zz[zz.length - 1].qnty;
            let cat = zz[zz.length - 1].cat;
            if (typeof window.catsOffer[cat] === 'undefined') window.catsOffer[cat] = 0;

            window.catsOffer[cat] -= zz[zz.length - 1].qnty;


            //     //console.log(catsOffer[zz[zz.length - 1].cat])
            //     //console.log(zz[zz.length - 1].sqnty)
            //      //console.log(zz[zz.length - 1].cat)
            zz[zz.length - 1].notes += ' [' + zz[zz.length - 1].offername + ']';
            myArr.sessionOffer = zz[zz.length - 1].sessionOffer
            zz[zz.length - 1].total = thisOfferprice;
            thisOfferprice = 0;
            if (parseInt(catsOffer[zz[zz.length - 1].cat]) === parseInt(zz[zz.length - 1].sqnty)) {
                //disable this cat. zz[zz.length - 1].category

                document.getElementById('cat_' + zz[zz.length - 1].cat).style.display = 'none';
                offercounter += 1
            }

            if (offercounter === store.cats.length) {

                cancelOffer();

            }

        }
        myArr.name = zz[zz.length - 1].qnty + ' x ' + zz[zz.length - 1].product;
        myArr.price = zz[zz.length - 1].total;
        myArr.content = '';





        if (typeof zz[zz.length - 1].options.map === 'function') {
            zz[zz.length - 1].options.map(item => {
                if (typeof item.srv_id_cat !== 'undefined') {
                    if (added.indexOf(item.srv_id_cat) === -1) {
                        added.push(item.srv_id_cat);

                        myArr.content += item.cat + ': ' + getAllMenustr(item.cat, zz[zz.length - 1].options);

                    }
                }


            })
        }


        if (zz[zz.length - 1].notes.length > 0) {


            myArr.content = '(' + zz[zz.length - 1].notes + ') ' + myArr.content;



        }
        myArr.id = zz[zz.length - 1].id
        myArr.qnty = zz[zz.length - 1].qnty



        let la = cartcontent;
        let dontpush = false;
        la.map(item => {
            if (item.id === myArr.id && item.content === myArr.content && item.sessionOffer === myArr.sessionOffer) {
                let pp = item.price / item.qnty
                item.name = item.name.replace(item.qnty + ' x ', '')
                item.qnty += myArr.qnty
                if (!item.sessionOffer) item.price = pp * item.qnty

                item.name = item.qnty + ' x ' + item.name
                dontpush = true;
            }

        })


        if (!dontpush) la.push(myArr);

        setCartcontent([...la]);



    }
    //helper function gia ta menu

    function fixPrice() {
        let total = 0;
        inCartlength = 0;
        inCart.map(item => {
            ////console.log(item[0])
            total = parseFloat(total) + parseFloat(item[0].total);
            inCartlength += item[0].qnty

        })

        if (typeof window.UpdateCart === 'function') window.UpdateCart(inCartlength)
        setPriceTotal(total);
    }
    function cancelOffer() {
        store.cats = realstorecats;


        OfferMode = false;

        let procollection = [];
        realstorecats.map(item => {
            let Obj = [];
            Obj.name = item.label;
            Obj.id = item.id;
            Obj.unty = item.unty;
            Obj.products = [];

            realstoreprods.map(itema => {
                if (itema.category === item.id)
                    Obj.products.push(itema);
            });

            procollection.push(Obj);

        });
        setCatcontent(procollection);
        setHidemain(false);

    }
    function getAllMenustr(str, a) {
        let la = '';
        a.map(item => {
            if (typeof item.cat !== 'undefined' && item.cat === str) {
                la += item.name + ', ';
            }
        })
        return la;
    }
    const showProductCart = (e, a) => {
        let myPos = JSON.parse(window.localStorage.getItem('user'));
        if (typeof myPos.position === 'undefined' || myPos.position === null) {
            ReactDOM.render(<>

                <AddressAskerDialog translate={translate} onOk={(e) => CheckSupported(e)} />

            </>, document.getElementById('mdl-dialog2'));
            document.getElementById("lrdialog").style.display = "block";
            return;
        }




        if (a.target.nodeName === 'IMG' || a.currentTarget.nodeName === 'IMG') return;
        AddToCardDialog(e, function (a) {
            let dontpush = false;
            inCartlength = 0;
            // //console.log(a)
            Object.keys(inCart).map(item => {


                if (inCart[item][0].notes === a[0].notes && inCart[item][0].id === a[0].id && Object.equals(inCart[item][0].options, a[0].options)) {
                    inCart[item][0].qnty += a[0].qnty
                    inCart[item][0].total = parseFloat(inCart[item][0].unitprice) * parseInt(inCart[item][0].qnty)

                    dontpush = true;

                }
                //  inCartlength += inCart[item][0].qnty

            })

            if (!dontpush) {

                inCart.push(a)
                //   inCartlength += a[0].qnty;
            }
            updateCart();
            FixCart(a);
            fixPrice();

        }
        );
    }
    const retrieveCart = async () => {
        if (JSON.parse(window.localStorage.getItem('user')).AuthToken === 0) return;
        setCartloading(true)
        let la = await UseAxios({ store: btoa(props.store), products: inCart }, 'public/retrieve_cart');
        if (la.status === 'ok') {
            //sendToast('Cart loaded');


            if (la.cart) {
                inCart = [];
                la.cart.map(item => {

                    inCart.push([item]);
                    FixCart([item]);

                })
                fixPrice();
            }


        } else {
            // //console.log(la)
        }
        setCartloading(false)
    }
    const updateCart = async () => {
        if (JSON.parse(window.localStorage.getItem('user')).AuthToken === 0) return;
        setCartloading(true)
        let la = await UseAxios({ store: btoa(props.store), products: inCart }, 'public/update_cart');
        if (la.status === 'ok') {

            //sendToast('Cart updated');
            setCartloading(false)
            return true;
        }
        setCartloading(false)
    }
    const showPhoto = (e) => {

        ReactDOM.render(

            <Picpreview translate={translate} text={e} />

            , document.getElementById('mdl-dialog2'));
        document.getElementById("lrdialog").style.display = "block";
    }
    const deleteItem = (e) => {
        if (cartloading) return;
        ConfirmDialog(translate('Are you sure you want to delete: ') + '<br/><hr></hr>' + cartcontent[e].name, async function () {
            //   let newprice = pricetotal - cartcontent[e].price;


            let la = cartcontent;
            let backup = [...inCart]
            let lo = [];
            let crt = [];
            if (typeof cartcontent[e].sessionOffer !== 'undefined') {

                let offr = cartcontent[e].sessionOffer;
                cartcontent.map(item => {
                    //  //console.log(cartcontent[item]['offer'])
                    if (typeof item.sessionOffer !== 'undefined' &&
                        item.sessionOffer === offr) {

                    } else {
                        lo.push(item);
                    }
                })
                inCart.map(item => {

                    if (item[0].sessionOffer === offr) {

                    } else {
                        crt.push(item);
                    }

                })
                inCart = crt;

                if (hidemain) cancelOffer();
            } else {

                la.splice(e, 1);
                lo = la;
                inCart.splice(e, 1);
            }


            //   setPriceTotal(newprice);

            if (await updateCart() === true || JSON.parse(window.localStorage.getItem('user')).AuthToken === 0) {
                fixPrice();
                setCartcontent([...lo]);
            } else {
                inCart = [...backup]
            }
        }
        );

    }
    const CheckSupported = async () => {
        dontDoit = false;
        loadStore();





    }
    const HandleOrder = () => {
        let myPos = JSON.parse(window.localStorage.getItem('user'));
        if (myPos.role === "2") {
            sendToast(translate('Store manager account can not place orders'));
            return;

        }

        if (myPos.AuthToken === 0) {
            ReactDOM.render(<Suspense fallback={<div>Loading...</div>}>

                <LoginRegister translate={translate} />

            </Suspense>, document.getElementById('mdl-dialog2'));
            document.getElementById("lrdialog").style.display = "block";

            return;
        }




        ReactDOM.render(

            <Order translate={translate} store={store} total={pricetotal} cartdisplay={cartcontent} cart={inCart} />

            , document.getElementById('page-content'));

    }
    const CatClicked = (e, id) => {
        if (document.getElementById(id) !== null) document.getElementById(id).scrollIntoView({
            behavior: 'auto'
        });
        e.preventDefault();
        //history.pushState({}, "", this.href);
    }
    const SetUpOffer = (offer) => {
        catsOffer = {};
        thisOfferprice = 0;
        thisTimesOffer = 0;
        offercounter = 0;



        setHidemain(true);
        thisOfferprice = offer.price;

        let fakeCats = [];
        let fakeproducts = [];
        let sessionOffer = makeSession(32)
        offer.grouplist.map(item => {

            let fakecat = {
                label: item.name,
                id: makeSession(32),
                unty: item.qnty,
            }
            thisTimesOffer += parseInt(item.qnty)
            fakeCats.push(fakecat);

            item.products.map(itema => {

                store.products.map(itemaa => {
                    if (itema === itemaa.id) {
                        let fakeproduct = {}
                        fakeproduct = itemaa;
                        fakeproduct.category = fakecat.id
                        fakeproduct.defprice = 0;
                        fakeproduct.sqnty = fakecat.unty;
                        fakeproduct.price = 0;
                        fakeproduct.offername = offer.name;
                        fakeproduct.sessionOffer = sessionOffer;
                        fakeproduct.foroffer = offer.id;
                        fakeproducts.push(fakeproduct)

                    }
                    window.catsOffer[fakecat.id] = fakecat.unty;

                })

            })

        })


        realstorecats = [...store.cats];
        realstoreprods = [...store.products];
        store.cats = fakeCats;
        OfferMode = true;
        //    setStore(store);

        let procollection = [];
        fakeCats.map(item => {
            let Obj = [];
            Obj.name = item.label;
            Obj.id = item.id;
            Obj.unty = item.unty;
            Obj.products = [];

            fakeproducts.map(itema => {
                if (itema.category === item.id)
                    Obj.products.push(itema);
            });

            procollection.push(Obj);

        });
        setCatcontent(procollection);






    }
    window.isonorders = () => {
        loadStore();
    }
    const handleExpnd = () => {

        //    if ( e.currentTarget.parentElement.style.maxHeight === '3500px') {
        //       e.currentTarget.parentElement.style = '';
        //     } else {
        //    e.currentTarget.parentElement.style = 'max-height: 3500px !important';
        //      }
        // e.currentTarget.style.height = '200px !important';
    }
    const AddToFav = async (e) => {
        let la = await UseAxios({ store_id: store._id.oid, add: e }, 'users/favorites')
        if (la.status === 'ok') {

            if (e === 1) sendToast(translate('Added to favorites'))
            if (e === 0) sendToast(translate('Removed from favorites'))
        }
        if (e === 1) setFaved(true)

        if (e === 0) setFaved(false)
    }
    const OpenStorevotes = () => {
        ReactDOM.render(

            <ViewRatings translate={translate} store={store} />

            , document.getElementById('mdl-dialog2'));
        document.getElementById("lrdialog").style.display = "block";
    }
    function initMap(geo) {
        // The location of Uluru

        // The map, centered at Uluru
        /*global google*/ // To disable any eslint 'google not defined' errors
        var map = new google.maps.Map(
            document.getElementById('mapa'),
            {
                zoom: 15,
                center: geo,
                streetViewControl: false,
                mapTypeControl: false
            });


        /*global google*/ // To disable any eslint 'google not defined' errors
        var marker = new google.maps.Marker({ position: geo, map: map });

    }
    const initaMap = (e) => {

        if (typeof store.store_position !== 'undefined') {
            let la = {
                lat: store.store_position.coordinates[0],
                lng: store.store_position.coordinates[1],
            }

            initMap(la);
        }
    }
    const loadMyOrders = () => {

        ReactDOM.render(
            <Orders translate={translate} store_id={store._id.oid} />,

            document.getElementById('my_Orders'));
    }

function check_item_avail(item) {

    console.log(item)

    if (item.avail === false) return false;

    let toreturn = false
    let dt = new Date(); 
    
    let hour = dt.getHours();
    if (hour === 0) hour = 24
     
    let timenow = hour * 60.0 + dt.getMinutes() * 1.0
    
        if (item.avail_from < item.avail_to) {

            if (timenow > item.avail_from && timenow < item.avail_to )  toreturn = true;
        }

        if (item.avail_from > item.avail_to) {
            if (timenow < item.avail_to || timenow > item.avail_from) {
                toreturn = true;
            } else {
                toreturn = false;
            }
    }
    
        //24oro
        if (item.avail_from === item.avail_to) toreturn = true;
    
        return toreturn;

}
    return (
        < >
            {!notFound &&
                <>

                    <div style={loading.length === 0 ? { backgroundImage: "url(" + window.assetsurl + '/' + store.cover + '?size=' + window.screen.width + ')' } : {}} className="store_cover">



                        <div className={store.open ? "mdl-grid   store_top_card" : "mdl-grid   store_top_card closed-store"}  >
                            <div className="mdl-cell mdl-cell--1-col logocell-p">


                                <div className={"store-logo " + loading} style={loading.length === 0 ? { backgroundImage: "url(" + window.assetsurl + '/' + store.logo + ')' } : {}} />


                            </div>


                            <div className={"mdl-cell mdl-cell--6-col store_title   " + loading}>

                                {store.store_name}

                                {JSON.parse(window.localStorage.getItem('user')).AuthToken !== 0 &&
                                    <>
                                        {faved ? <i onClick={() => AddToFav(0)} className="material-icons fav-icon">favorite</i> :
                                            <i onClick={() => AddToFav(1)} className="material-icons fav-icon"> favorite_border</i>
                                        }
                                    </>}
                                <div className="store_votes">


                                    <div className="stars_couple">
                                        <small style={{ float: 'left', color: '#00000' }}>{store.stars} </small>
                                        <div style={{ cursor: 'pointer' }} onClick={() => OpenStorevotes()} className="star-votes store-sub-secondary">
                                            <StarRating default={store.stars} />
                                        </div>
                                        <small className={loading}> ({store.votes})</small>
                                    </div>


                                    <small className={loading}> {store.street_name} {store.street_number}, {store.district}</small>


                                </div>
                            </div>
                            <div className="mdl-cell mdl-cell--4-col store-info-holder ">
                                <span className="mdl-chip">
                                    <span className="mdl-chip__text">{translate('Min order')} {parseFloat(store.min_order)}€</span>
                                </span>
                                <span style={{ marginLeft: '6px' }} className="mdl-chip">
                                    <span className="mdl-chip__text">{translate('Time')} {store.delivery_time + "'"}</span>
                                </span>



                            </div>
                        </div>
                    </div>
                    <div className="mdl-tabs mdl-js-tabs mdl-js-ripple-effect">

                        <div className="mdl-tabs__tab-bar store_top_bar">
                            <a style={{ whiteSpace: 'nowrap', overflow: 'visible', padding: '0 12px' }} href="#Menu" className="mdl-tabs__tab is-active">{translate('Menu')}</a>
                            <a style={{ whiteSpace: 'nowrap', overflow: 'visible', padding: '0 12px' }} onClick={(e) => initaMap(e)} href="#Information" className="mdl-tabs__tab">{translate('Information')}</a>
                            <a style={JSON.parse(window.localStorage.getItem('user')).AuthToken === 0 ? { display: 'none', whiteSpace: 'nowrap', overflow: 'visible', padding: '0 12px' } : { whiteSpace: 'nowrap', overflow: 'visible', padding: '0 12px' }} onClick={(e) => loadMyOrders(e)} href="#Myorders" className="mdl-tabs__tab">{translate('My Orders')}</a>
                        </div>

                        <div style={{ height: '100%' }} className="mdl-tabs__panel is-active" id="Menu">




                            <div className="mdl-grid mdl-j-center"  >

                                <div className="mdl-cell mdl-cell--3-col cell-menu ">

                                    <div id="cat-m-m" className=" store-categories-menu mdl-shadow--2dp  ">
                                        <div style={{ position: 'sticky', top: '0', backgroundColor: '#ffffff' }} className="mdl-card__title menut-ct-title">
                                            <h2 className="mdl-card__title-text">{translate('Menu')}</h2>
                                        </div>
                                        <div id="links_store" className="mdl-card__supporting-text">

                                            <div>


                                                {store.cats.length === 0 ? (

                                                    <div className="center-align"><img src={smallloader} /></div>
                                                ) : (<>
                                                    {store.offers.length > 0 && !hidemain &&
                                                        <li>
                                                            <a onClick={(e) => CatClicked(e, 'cat_dials')} id={'link_dials'} href={'#cat_dials'}>{translate('Deals')} </a>
                                                        </li>
                                                    }
                                                    {store.cats.map(item => (
                                                        <li key={item.id}>
                                                            <a className={loading} onClick={(e) => CatClicked(e, 'cat_' + item.id)} id={'link_' + item.id} href={'#cat_' + item.id}>{item.label} </a>
                                                        </li>



                                                    ))}
                                                </>)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mdl-cell mdl-cell--7-col-phone mdl-cell--6-col product-container ">


                                    {!store.open && !dontDoit &&
                                        <small className="store_info_txt">
                                            <i className="material-icons mdl-color-text--primary ">error</i>

                                            {translate('Store is curently closed, please try another one.')}
                                        </small>

                                    }

                                    {!area_service && loading.length === 0 && !dontDoit &&
                                        <small className="store_info_txt">
                                            <i className="material-icons mdl-color-text--primary ">error</i>

                                            {translate("This store, doesn't support your area. please try another one.")}
                                        </small>


                                    }
                                    {store.store_description.length > 2 &&
                                        <small className="store_info_txt">   {store.store_description} </small>



                                    }



                                    {hidemain &&
                                        <div className="center-align">

                                            <button onClick={() => cancelOffer()} style={{ marginBottom: '10px' }} className="mdl-button mdl-js-button mdl-button--raised mdl-button--accent">
                                                {translate("Cancel")}
                                            </button>
                                        </div>

                                    }




                                    {!hidemain && <>


                                        {store.offers.length > 0 &&
                                            <div id="cat_dials" className="product-container-2 product-linked mdl-shadow--2dp">

                                                <div onClick={(e) => handleExpnd(e)} className="store-product-1">
                                                    {translate("Deals")}
                                                </div>
                                                {store.offers.map(item => (

                                                    <div key={item.id} onClick={() => SetUpOffer(item)} className="mdl-grid  store-product-2">
                                                        <div className="mdl-cell mdl-cell--10-col mdl-cell--3-col-phone mdl-cell--7-col-tablet   ">

                                                            <div className="product-title">   {item.name} </div>
                                                            <div className="product-desc">

                                                                <small className="price-tag">{parseFloat(item.price).toFixed(2)}€</small>

                                                            </div>

                                                        </div>
                                                    </div>



                                                ))}
                                            </div>
                                        }
                                    </>}

                                    {catcontent.map(item => (

                                        <div key={item.id} id={'cat_' + item.id} className="product-container-2 product-linked mdl-shadow--2dp">

                                            <div onClick={(e) => handleExpnd(e)} className={"store-product-1" + loading}>
                                                {item.name} <div className="mobile-title-info">({item.products.length})</div>
                                            </div>

                                            {item.products.map(itema =>
                                                <div key={itema.id} onClick={(e) => check_item_avail(itema) && showProductCart(itema, e)} className={check_item_avail(itema) ? "mdl-grid  store-product-2 " : "mdl-grid  store-product-2 disabled-product"}>
                                                    {itema.photo && (<>

                                                        <div className="mdl-cell mdl-cell--1-col-phone mdl-cell--1-col logocell-p">
                                                            <a  >
                                                                <img onClick={(e) => check_item_avail(itema) && showPhoto(itema.photo, e)} className="product-logo" src={window.assetsurl + itema.photo} />
                                                            </a>
                                                        </div>


                                                    </>
                                                    )}
                                                    <div className="mdl-cell  mdl-cell--10-col mdl-cell--3-col-phone mdl-cell--7-col-tablet  ">

                                                        <div className={"product-title " + + loading}>   {itema.name} {! check_item_avail(itema) && ' '}</div>
                                                        <div className={"product-desc " + + loading}>

                                                            {itema.desc}

                                                            <small className="price-tag">{parseFloat(itema.defprice).toFixed(2)}€</small>

                                                        </div>

                                                    </div>


                                                </div>

                                            )}
                                        </div>

                                    ))}

                                    <div style={{ height: '200px' }}></div>


                                </div>
                                <div className={"store-cart-main" + emobile}>
                                    <div className={" mdl-card mdl-card--border mdl-shadow--2dp store-cart-menu" + emobile}>
                                        <div className="mdl-card__title">
                                            <h2 className="mdl-card__title-text">   <i className="material-icons cart-icon mdl-color-text--primary ">shopping_cart</i> {translate('Cart')} ({inCartlength})</h2>

                                        </div>
                                        <ListAddress_widget translate={translate} ChangeAddress={() => loadStore()} />
                                        {area_service && loading.length === 0 && !dontDoit &&

                                            <div className="options-cart-content">

                                                {cartcontent.length === 0 &&
                                                    <>

                                                        {translate("Your cart is empty, add products from the menu")}

                                                    </>

                                                }
                                                {Object.keys(cartcontent).map(item => (

                                                    <div key={cartcontent[item].name} className="incart-option  mdl-shadow--1dp">

                                                        <i onClick={() => deleteItem(item)} className="material-icons cart-delete mdl-color-text--primary ">cancel</i>
                                                        <div className="cart-option-title">{cartcontent[item].name}</div>



                                                        {cartcontent[item].content}

                                                        <small className="price-tag">{parseFloat(cartcontent[item].price).toFixed(2)}€</small>
                                                    </div>

                                                ))}
                                            </div>}

                                        <div className="center-align">
                                            {cartloading && <div id="p2" className="mdl-progress mdl-js-progress mdl-progress__indeterminate"></div>}
                                            {area_service && <small className="price-tag">{parseFloat(pricetotal).toFixed(2)}€</small>}
                                            {parseFloat(pricetotal) > 0 && parseFloat(store.min_order) > parseFloat(pricetotal) &&
                                            
                                            
                                            <small className="store_info_txt">
                                            <i className="material-icons mdl-color-text--primary ">error</i>

                                            {translate(" You need to add %price€ more to your cart").replace('%price',parseFloat(store.min_order) - parseFloat(pricetotal))}
                                        </small>
                                            
                                            
                                            }

                                            {!area_service && !dontDoit &&

                                                <small className="store_info_txt">
                                                    <i className="material-icons mdl-color-text--primary ">error</i>

                                                    {translate("This store, doesn't support your area. please try another one.")}
                                                </small>

                                            }
                                            <button disabled={!area_service ? true : !store.open ? true : hidemain ? true : inCart.length === 0 ? true : parseFloat(store.min_order) > parseFloat(pricetotal) ? true : false} onClick={() => HandleOrder()} style={{ marginBottom: '10px' }} className="mdl-button mdl-js-button mdl-button--raised mdl-button--accent">
                                                {translate("Checkout")}
                                            </button>

                                    
                                        </div>

                                        {emobile === '-mobile' &&
                                            <div className="mdl-dialog__actions">

                                                <button type="button" onClick={() => setEmobile(' ')} className="mdl-button mdl-js-button mdl-button--raised">{translate('Close')}</button>

                                            </div>}

                                    </div>


                                </div>



                            </div>
                        </div>
                        <div className="mdl-tabs__panel" id="Information">

                            <div className="mdl-grid  "  >
                                <div style={{ padding: '3px', margin: '3px', minWidth: '340px' }} className="mdl-cell--4-col  mdl-cell--4-col-phone mdl-shadow--2dp">

                                    <div className="mdl-layout__header-row mdl-card__supporting-text">
                                        <h4>{translate("Opening hours")}</h4>

                                    </div>

                                    <table className="store-schedule-d">
                                        <tbody>
                                            <tr style={!store.schedule.monday.is_open ? { opacity: '0.5', textDecoration: 'line-through' } : {}}><td> {translate("Monday")}</td><td>
                                                {timeConvert(store.schedule.monday.time_open)} - {timeConvert(store.schedule.monday.time_close)}

                                            </td></tr>

                                            <tr style={!store.schedule.tuesday.is_open ? { opacity: '0.5', textDecoration: 'line-through' } : {}}><td> {translate("Tuesday")}</td><td>
                                                {timeConvert(store.schedule.tuesday.time_open)} - {timeConvert(store.schedule.tuesday.time_close)}

                                            </td></tr>

                                            <tr style={!store.schedule.wednesday.is_open ? { opacity: '0.5', textDecoration: 'line-through' } : {}}><td> {translate("Wednesday")}</td><td>
                                                {timeConvert(store.schedule.wednesday.time_open)} - {timeConvert(store.schedule.wednesday.time_close)}

                                            </td></tr>

                                            <tr style={!store.schedule.thursday.is_open ? { opacity: '0.5', textDecoration: 'line-through' } : {}}><td> {translate("Thursday")}</td><td>
                                                {timeConvert(store.schedule.thursday.time_open)} - {timeConvert(store.schedule.thursday.time_close)}

                                            </td></tr>

                                            <tr style={!store.schedule.friday.is_open ? { opacity: '0.5', textDecoration: 'line-through' } : {}}><td> {translate("Friday")}</td><td>
                                                {timeConvert(store.schedule.friday.time_open)} - {timeConvert(store.schedule.friday.time_close)}

                                            </td></tr>

                                            <tr style={!store.schedule.saturday.is_open ? { opacity: '0.5', textDecoration: 'line-through' } : {}}><td> {translate("Saturday")}</td><td>
                                                {timeConvert(store.schedule.saturday.time_open)} - {timeConvert(store.schedule.saturday.time_close)}

                                            </td></tr>

                                            <tr style={!store.schedule.sunday.is_open ? { opacity: '0.5', textDecoration: 'line-through' } : {}}><td> {translate("Sunday")}</td><td>
                                                {timeConvert(store.schedule.sunday.time_open)} - {timeConvert(store.schedule.sunday.time_close)}

                                            </td></tr>




                                        </tbody>

                                    </table>



                                    {translate("Phone")}: {store.phone}


                                </div>

                                <div style={{ padding: '3px', margin: '3px', minWidth: '340px', minHeight: '400px' }} className="mdl-cell--4-col  mdl-cell--4-col-phone mdl-shadow--2dp">

                                    <div className="mdl-layout__header-row mdl-card__supporting-text">
                                        <h4> {translate("Location")}</h4>
                                    </div>

                                    <div style={{ height: '70%', width: '100%' }} id="mapa"></div>


                                </div>
                            </div>


                        </div>

                        <div className="mdl-tabs__panel" id="Myorders">


                            <div id="my_Orders"></div>

                        </div>
                    </div>
                </>}
            {notFound &&
                <>

                    <div className="center-align">
                        <div className="store-cointainer mdl-shadow--2dp">

                            <div className="mdl-card__title">
                                <h2 className="mdl-card__title-text"> {translate("Not found.")}</h2>
                            </div>
                            <div className="mdl-card__supporting-text">

                                {translate("The store you are looking for not found.")}
                            </div>
                        </div>
                    </div>


                </>}
        </>
    )
}

export default Store;