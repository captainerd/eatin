
import React, { useState, useEffect } from 'react';



import { UseAxios, sendToast, InputVal } from '../functions/Functions';
import Input from '../CompoViews/Input';
import Select from '../CompoViews/Select'
var forphoto = 0;
var sellCat = {};
function AdminCategories(props) {
    const [isinvalid, setIsinvalid] = useState({});
    const [listcats, setListcats] = useState({ cats: [] });
    const [isloading, setIsloading] = useState(false);
    const [catselect, setCatselect] = useState([]);


    useEffect(() => {
        window.componentHandler.upgradeAllRegistered();
        //        document.getElementById('preload').style.display = 'none';
    });
    const InitCats = async () => {
        setIsloading(true);
        let la = await UseAxios({ do: 'list' }, 'admin/categories');
        if (la.status === 'ok') {
            setListcats(la);


        }
        setIsloading(false);
        let catsel = [];

        la.cats.map(item => {
            let fob = {
                label: item.cat_name_gr,
                id: item._id.$oid
            }

            catsel.push(fob)

        })
       // console.log(catsel)
        setCatselect(catsel)
    }

    useEffect(() => {
        InitCats();

    }, []);
    const addCat = async () => {
        let founderror = false;
        if (InputVal('catadd').length === 0) {
            isinvalid.catadd = '';
            founderror = true;
        } else {
            isinvalid.catadd = false;
        }
        if (InputVal('catadden').length === 0) {
            isinvalid.catadden = '';
            founderror = true;
        } else {
            isinvalid.catadden = false;
        }
        if (!founderror) {
            let myObj = {
                do: 'newcat',
                cat_el: InputVal('catadd'),
                cat_en: InputVal('catadden'),
            }
            let la = await UseAxios(myObj, 'admin/categories');
            if (la.status === 'ok') {
                sendToast('Category added');
                InitCats();
            }
        }

        setIsinvalid({ ...isinvalid });
    }
    const onSelect = (e) => {
        sellCat = {
            id: e.id,
            title: e.title,

        };
    }
    const delCat = async (e) => {
        let myObj = {
            do: 'delete',
            id: e
        }
        let la = await UseAxios(myObj, 'admin/categories');
        if (la.status == 'ok') {
            sendToast('Deleted');
            document.getElementById(e).remove();
        }

    }
    const reorderCat = async (to, id, old) => {
        let myObj = {
            do: 'move',
            id: id,
            to: to,
            old: old
        }
        let la = await UseAxios(myObj, 'admin/categories');
        if (la.status == 'ok') {
            sendToast('Moved');
            InitCats();
        } else {
            sendToast('Nothing changed');
        }

    }
    const uploadCover = async () => {
        if (forphoto !== 0) {

            var formData = new FormData();
 
            formData.append("image", document.getElementById('photo_file').files[0]);
            formData.append("for_id", forphoto);
            
            let la = await UseAxios(formData, 'admin/add_cover');
            if (la.status === 'ok') sendToast('Uploaded')

        }


    }
    return (
        <>
            <div style={{ width: '100%' }} className="mdl-grid mdl-shadow--2dp ">
                <div style={{ width: '100%' }} className="mdl-grid ">

                    <div className="mdl-layout__header-row mdl-card__supporting-text">
                        <h4>Cuisines</h4>

                    </div>

                    <Select onSelect={(e) => forphoto = e.id} id="add_photo_cat" options={catselect} icon="photo" label="Category" />
                    <input style={{height: '30px'}} id="photo_file" type="file"/>
                        <button onClick={uploadCover} className="mdl-button mdl-js-button  mdl-button--raised">
                            Upload cover 
                        </button>
                        <hr />
                        <div className="mdl-layout__header-row mdl-card__supporting-text">











                            <Input type='text' isinvalid={isinvalid.catadd} style={{ width: '150px' }} id='catadd' text='Greek' icon='add' />
                            <Input type='text' isinvalid={isinvalid.catadden} style={{ width: '150px' }} id='catadden' text='English' icon='hide' />
                            <br />
                            <button onClick={addCat} className="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab">
                                <i className="material-icons">add</i>
                            </button>
                            &nbsp;
    
    
    
                </div>
                </div>
                    <div style={{ width: '100%' }} className="mdl-grid  ">






                        <div className="center-align  " style={{ width: '100%', padding: '3px', margin: '3px', height: '400px', overflow: 'scroll' }}>



                            {isloading ? ('Loading') : (
                                <table style={{ width: '100%', tableLayout: 'fixed' }} className="mdl-data-table mdl-js-data-table  mdl-shadow--2dp">
                                    <thead>
                                        <tr>
                                            <th>English</th>
                                            <th>Greek</th>
                                            <th>Order</th>
                                            <th>Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {listcats.cats.map(item => (
                                            <tr id={item._id.$oid} key={item._id.$oid}>
                                                <td> {item.cat_name}</td>
                                                <td> {item.cat_name_gr}</td>
                                                <td>


                                                    <i style={{ color: 'blue', cursor: 'pointer' }} onClick={(e) => reorderCat(item.order - 1, item._id.$oid, item.order)} className="material-icons" >keyboard_arrow_up</i>



                                                    <i style={{ color: 'blue', cursor: 'pointer' }} onClick={(e) => reorderCat(item.order + 1, item._id.$oid, item.order)} className="material-icons">keyboard_arrow_down</i>


                                                </td>
                                                <td>

                                                    <i style={{ color: 'blue', cursor: 'pointer' }} onClick={(e) => delCat(item._id.$oid)} className="material-icons">remove</i>


                                                </td>
                                            </tr>
                                        )


                                        )}
                                    </tbody>


                                </table>


                            )}




                        </div>

                    </div>
                </div>
        </>



            );
        }
        
        
export default AdminCategories;