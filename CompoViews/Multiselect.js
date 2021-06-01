import React, { useRef, useState, useEffect, getDefaultProps } from 'react';
import { InputVal } from '../functions/Functions';

var menuOpen = false;
var cancelHide = false;
var ishidden = false;

var PreProps = [];
var pausea = false;
function useDidUpdate(callback, deps) {
    const hasMount = useRef(false)

    useEffect(() => {
        if (hasMount.current) {
            callback()
        } else {
            hasMount.current = true
        }
    }, deps)
}

function Multiselect(props) {


    const [selEmpty, setEmpty] = useState(props.setEmpty);
    const [options, setOptions] = useState([]);
    const [isinvalidlabel, setIsinvalidlabel] = useState('');
    const [isinvalidInput, setIsinvalidinput] = useState('');
    const [isfocused, setIsfocused] = useState('');
    const [isdirty, setIsdirty] = useState('');
    const [Selectedoptions, setSelectedOptions] = useState([]);

    const handleOption = (e) => {
        HideMenu();

        document.getElementById(props.id).focus();
        document.getElementById(props.id).value = e.target.getAttribute("data-text");

        //alert(e.target.parentElement.parentElement.className);
        let myObj = {
            id: e.target.id,
            label: e.target.getAttribute("data-text"),
        }

        setEmpty("has-placeholder");


        Selectedoptions.push(myObj)
        pausea = true;
        let newopts = [];
        options.map((item) => {

            if (item.id !== myObj.id && item.id.length > 0) {
                newopts.push(item);
            }


        });
        setOptions(newopts);
        setSelectedOptions(Selectedoptions);
        document.getElementById(props.id).value = '';
        setIsdirty(' is-dirty ');


        if (typeof props.onSelect === 'function') {
            props.onSelect(Selectedoptions);
        }
        if (newopts.length === 0) {
            setTimeout(() => {
                document.getElementById(props.id).style.display = 'none';
                ishidden = true;

            }, 750);
            return;
        }


    }
    const deleteSelected = (e) => {
        options.push(e);

        let newopts = [];
        Selectedoptions.map((item) => {

            if (item.id !== e.id) {
                newopts.push(item);
            }


        });
        setOptions(options);
        setSelectedOptions(newopts);

        if (newopts.length === 0) setIsdirty('   ');

        if (typeof props.onSelect === 'function') {
            props.onSelect(newopts);
        }
        if (newopts.length > 0) {
            ishidden = false;
            document.getElementById(props.id).style.display = 'inline-block';




        }
    }
    const handleBlur = (e) => {
        HideMenu();


    }

    const handleOnFocus = (e) => {
        cancelHide = true;
        setTimeout(() => {
            document.getElementById(props.id).focus();
            cancelHide = false;
        }, 220);

        if (!ishidden) {

            setIsfocused(' is-focused  ');
            setIsdirty(' is-dirty ');
        }

    }
    const ShowMenu = () => {

        if (typeof options === 'undefined') return;
        if (options.length === 0) {

            return;
        }
        setIsfocused(' is-focused  ');
        setIsdirty(' is-dirty ');
        if (options.length > 5) {
            document.getElementById(props.id + 'div').style.height = '200px';
            document.getElementById(props.id + 'div').style.overflowY = 'scroll';

        } else {
            document.getElementById(props.id + 'div').style.height = 'auto';
            document.getElementById(props.id + 'div').style.overflowY = 'hidden';
        }
        document.getElementById(props.id + 'div').style.opacity = '1';
        document.getElementById(props.id + 'div').style.maxHeight = '320px';
        document.getElementById(props.id + 'div').style.zIndex = "10030";
        menuOpen = true;
        //  document.getElementById(props.id).focus();
    }
    const handleFocusInput = () => {
        ShowMenu();
        setIsfocused(' is-focused  ');
        setIsdirty(' is-dirty ');
    }
    const HideMenu = () => {
        if (cancelHide) { return 0; }
        if (Selectedoptions.length === 0 && InputVal(props.id).length === 0) setIsdirty('   ');
        document.getElementById(props.id + 'div').style.maxHeight = '0px';

        setTimeout(() => {
            document.getElementById(props.id + 'div').style.zIndex = "-1";
            document.getElementById(props.id + 'div').style.opacity = '0';
            setIsfocused(' ');
        }, 200);
        menuOpen = false;
    }



    const handlekeyup = (refname) => {


        ShowMenu();
        if (refname.keyCode === 8 && document.getElementById(props.id).value.length === 0) {
            let la = Selectedoptions.slice(Selectedoptions.length - 1, Selectedoptions.length);

            if (typeof la[0] !== 'undefined') {
                let myObj = {
                    id: la[0].id,
                    label: la[0].label,
                }
                options.push(myObj);
                setOptions(options);
                la = Selectedoptions.slice(0, Selectedoptions.length - 1);
                setSelectedOptions(la);

                if (typeof props.onSelect === 'function') {
                    props.onSelect(la);
                }

            }
        }

    }
    const ToggleMenu = () => {

        if (menuOpen) {
            HideMenu();;
        } else {
            ShowMenu();
        }
    }
    const handleChange = (e) => {
        let newOpts = [...options.sort(function (v) {
            return !v.label.toLowerCase().includes(e.target.value.toLowerCase()) ? 1 : -1;

        })];

        setOptions(newOpts);



        ShowMenu();
        if (typeof props.onChange === 'function') {
            props.onChange(e);

        }
        if (e.target.value.length > 0) setIsdirty(' is-dirty ');

    }
    useEffect(() => {
        PreProps = [];
        pausea = false;
        if (props.autocomplete !== true) document.getElementById(props.id).value = '';
        setOptions(props.options);


        if (typeof props.selected !== 'undefined' && props.selected.length > 0) {

            loadSelected();








        }

    }, [props.options]);


    useDidUpdate(() => {

        if (!pausea && PreProps !== props) {

            loadSelected();
            PreProps = props;


        }

    })


    const loadSelected = () => {
        if (typeof props.selected === 'undefined') {
            return
        }
        if (props.selected.length === 0) return;
        let newSelected = [];
        let newOptions = [];


        props.selected.map((item) => {



            props.options.map((itema) => {

                if (itema.id === item.id) {


                    newSelected.push(itema);
                }


            });


        });

        props.options.map((itema) => {

            if (newSelected.indexOf(itema) === -1 && newOptions.indexOf(itema) === -1) newOptions.push(itema);

        });
        //console.log(newOptions)
        //console.log(newSelected)


        setOptions([...newOptions]);







        setIsdirty(' is-dirty ');
        setSelectedOptions([...newSelected]);


        if (typeof props.onSelect === 'function') {
          //  props.onSelect(newSelected);
        }



    }


    useEffect(() => {

        if (typeof props.defaultValue !== 'undefined') {
            document.getElementById(props.id).value = props.defaultValue;
            setEmpty("has-placeholder");
        }



    }, [props.defaultValue]);

    useEffect(() => {




    }, []);



    useEffect(() => {

        if (props.isinvalid !== false && typeof props.isinvalid !== 'undefined') {

            setIsinvalidlabel(' is-dirty invalidlabel  ');
            setIsinvalidinput(props.isinvalid);


        } else {
            setIsinvalidlabel('  ');
            setIsinvalidinput('');


        }
    }, [props.isinvalid]);
    useEffect(() => {

        if (typeof props.id === 'undefined') props.id = Math.floor(Math.random() * (50000000 - 20000000)) + 200000;

        if (Array.isArray(props.options)) props.options.map(function (item) {
            if (item.default === true) {
                document.getElementById(props.id).value = item.label;
                setEmpty("has-placeholder");

            }
            if (document.getElementById(item.id) !== null) document.getElementById(item.id).style.opacity = "1";
        });



    });
    return (

        <div className={isinvalidlabel + "mdl-select-input  mdl-multiselect-a mdl-textfield--floating-label mdl-textfield " + isdirty} style={props.style} >
            {props.icon !== 'hide' ? (<i htmlFor={props.id} className={"mdl-sel-icon mdl-color-text--primary  material-icons mdl-textfield__icon "}>{props.icon}</i>) : ('')}

            < div className={isfocused + isinvalidlabel + " mdl-textfield    getmdl-select getmdl-select__fix-height "}>

                <div onClick={handleOnFocus} className="mdl-grid mdl-multiselect-b">

                    {Array.isArray(Selectedoptions) && Selectedoptions.map(item => (

                        <span key={item.id} className="mdl-chip mdl-chip--deletable">
                            <span className="mdl-chip__text">{item.label}</span>
                            <button onClick={(e) => deleteSelected(item)} type="button" className="mdl-chip__action"><i className="material-icons">cancel</i></button>
                        </span>





                    ))}
                    <div className={" mdl-select-b    "}>
                        <input onClick={ShowMenu} onFocus={handleFocusInput} onBlur={handleBlur} onKeyDown={handlekeyup} style={{ outline: 'none' }} autoComplete='off' type="text" readOnly={props.readOnly} onChange={handleChange} className="mdl-textfield__input " id={props.id} />

                        <div style={{ marginTop: '4px' }} onClick={handleOption} id={props.id + 'div'} className="mdl-autoselect">

                            {Array.isArray(options) && options.map(item => (
                                <span data-text={item.label} key={item.id} id={item.id} className="mdl-menu__item" >
                                    {props.showGoogle && (<i data-text={item.label} className="material-icons icon_autocomplete">where_to_vote</i>)}    {item.label}
                                </span>
                            ))}
                            {props.showGoogle && (<img id="pgoogle" src="images/powered_by_google_on_white.png" />)}


                        </div>
                    </div>
                </div>




                <i onClick={ToggleMenu} className=" mdl-icon-toggle__label material-icons">keyboard_arrow_down</i>
                <label id={props.id + 'i'} htmlFor={props.id} className={"mdl-textfield__label"}>{props.label}</label>


                <span className="mdl-textfield__error">{isinvalidInput}</span>
            </div ></div >
    );
}

export default Multiselect;